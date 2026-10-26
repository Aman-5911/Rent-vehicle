import { randomUUID } from 'node:crypto';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
import multer from 'multer';
import { fileTypeFromBuffer } from 'file-type';
import { CITIES, FUEL_TYPES, TRANSMISSIONS, VEHICLE_CATEGORIES } from '../../shared/index.js';
import { Booking, Review, User, Vehicle } from './models.js';
import { ApiError, asyncRoute, requireAuth, requireRole } from './middleware.js';
import { calculatePrice, toUtcDate } from './pricing.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 10, fileSize: 5 * 1024 * 1024 },
});
const uploadsDir = fileURLToPath(new URL('../uploads/', import.meta.url));
const photoTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
]);

function escapedRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function vehicleDto(vehicle, owner = vehicle.owner) {
  const source = vehicle.toObject ? vehicle.toObject() : vehicle;
  const ownerSource = owner?.toObject ? owner.toObject() : owner;
  const { reservations, blockedDates, __v, ...publicData } = source;
  return {
    ...publicData,
    id: String(source._id),
    name: `${source.make} ${source.model}`,
    type: source.category,
    image: source.photos?.[0] || '',
    price: Math.floor(source.pricePerDayPaise / 100),
    rating: source.averageRating || 0,
    reviews: source.reviewCount || 0,
    fuel: source.fuelType,
    owner: ownerSource ? {
      id: String(ownerSource._id),
      fullName: ownerSource.fullName,
      memberSince: ownerSource.createdAt,
      totalTrips: source.totalTrips || 0,
    } : null,
  };
}

function dateRangeFromQuery(query) {
  if (!query.startDate && !query.endDate) return null;
  const startDate = toUtcDate(query.startDate || '');
  const endDate = toUtcDate(query.endDate || '');
  if (!startDate || !endDate || endDate <= startDate) {
    throw new ApiError(400, 'INVALID_DATES', 'Choose a valid return date after pick-up.');
  }
  return { startDate, endDate };
}

async function validateAndSavePhotos(files) {
  if (!files || files.length < 3) {
    throw new ApiError(400, 'TOO_FEW_PHOTOS', 'Upload at least 3 vehicle photos.');
  }

  const validated = [];
  for (const file of files) {
    const detected = await fileTypeFromBuffer(file.buffer);
    const extension = detected && photoTypes.get(detected.mime);
    if (!extension) throw new ApiError(400, 'INVALID_PHOTO', 'Photos must be valid JPEG, PNG, or WebP images.');
    validated.push({ buffer: file.buffer, extension });
  }

  await mkdir(uploadsDir, { recursive: true });
  const paths = [];
  try {
    for (const photo of validated) {
      const fileName = `${randomUUID()}.${photo.extension}`;
      await writeFile(path.join(uploadsDir, fileName), photo.buffer, { flag: 'wx' });
      paths.push(`/api/v1/uploads/${fileName}`);
    }
  } catch (error) {
    await Promise.all(paths.map((photoPath) => unlink(path.join(uploadsDir, path.basename(photoPath))).catch(() => {})));
    throw error;
  }
  return paths;
}

router.get('/', asyncRoute(async (req, res) => {
  const filter = { status: 'listed' };
  const { city, category, maxPrice, minSeats, fuel, transmission, q, sort = 'rating' } = req.query;
  const dateRange = dateRangeFromQuery(req.query);

  if (city) filter.city = new RegExp(`^${escapedRegex(String(city).trim())}$`, 'i');
  if (category && VEHICLE_CATEGORIES.includes(String(category).toLowerCase())) filter.category = String(category).toLowerCase();
  if (fuel && FUEL_TYPES.includes(String(fuel).toLowerCase())) filter.fuelType = String(fuel).toLowerCase();
  if (transmission && TRANSMISSIONS.includes(String(transmission).toLowerCase())) filter.transmission = String(transmission).toLowerCase();
  if (minSeats && Number.isFinite(Number(minSeats))) filter.seats = { $gte: Number(minSeats) };
  if (maxPrice && Number.isFinite(Number(maxPrice))) filter.pricePerDayPaise = { $lte: Math.round(Number(maxPrice) * 100) };
  if (q) {
    const pattern = new RegExp(escapedRegex(String(q).trim()), 'i');
    filter.$or = [{ make: pattern }, { model: pattern }, { description: pattern }];
  }
  if (dateRange) {
    filter.reservations = { $not: { $elemMatch: {
      startDate: { $lt: dateRange.endDate },
      endDate: { $gt: dateRange.startDate },
      status: { $ne: 'cancelled' },
    } } };
    filter.blockedDates = { $not: { $elemMatch: { $gte: dateRange.startDate, $lt: dateRange.endDate } } };
  }

  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(30, Math.max(1, Number.parseInt(req.query.limit, 10) || 12));
  const sortBy = sort === 'price-low' ? { pricePerDayPaise: 1 } : sort === 'price-high' ? { pricePerDayPaise: -1 } : { averageRating: -1, reviewCount: -1 };
  const [vehicles, total] = await Promise.all([
    Vehicle.find(filter).populate('owner', 'fullName createdAt').sort(sortBy).skip((page - 1) * limit).limit(limit).lean(),
    Vehicle.countDocuments(filter),
  ]);

  res.json({ success: true, data: {
    vehicles: vehicles.map((vehicle) => vehicleDto(vehicle, vehicle.owner)),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  } });
}));

router.get('/mine', requireAuth, requireRole('owner'), asyncRoute(async (req, res) => {
  const vehicles = await Vehicle.find({ owner: req.auth.id, status: { $ne: 'deleted' } }).sort({ createdAt: -1 });
  res.json({ success: true, data: { vehicles: vehicles.map((vehicle) => vehicleDto(vehicle)) } });
}));

router.post('/', requireAuth, requireRole('owner'), upload.array('photos', 10), asyncRoute(async (req, res) => {
  const required = ['make', 'model', 'year', 'category', 'fuelType', 'transmission', 'seats', 'mileage', 'color', 'city', 'pricePerDay'];
  for (const field of required) {
    if (req.body?.[field] === undefined || req.body[field] === '') {
      throw new ApiError(400, 'MISSING_FIELD', `The ${field} field is required.`);
    }
  }
  const category = String(req.body.category).toLowerCase();
  const fuelType = String(req.body.fuelType).toLowerCase();
  const transmission = String(req.body.transmission).toLowerCase();
  const city = CITIES.find((entry) => entry.name.toLowerCase() === String(req.body.city).trim().toLowerCase())?.name;
  const price = Number(req.body.pricePerDay);
  if (!VEHICLE_CATEGORIES.includes(category) || !FUEL_TYPES.includes(fuelType) || !TRANSMISSIONS.includes(transmission) || !city) {
    throw new ApiError(400, 'INVALID_VEHICLE', 'Choose a supported category, fuel type, transmission, and city.');
  }
  if (!Number.isFinite(price) || price <= 0 || price > 100000) {
    throw new ApiError(400, 'INVALID_PRICE', 'Enter a valid daily price in rupees.');
  }

  let photos = [];
  try {
    photos = await validateAndSavePhotos(req.files);
    let features = [];
    if (req.body.features) {
      try {
        features = Array.isArray(JSON.parse(req.body.features)) ? JSON.parse(req.body.features) : [];
      } catch {
        features = String(req.body.features).split(',').map((feature) => feature.trim()).filter(Boolean);
      }
    }

    const vehicle = await Vehicle.create({
      owner: req.auth.id,
      make: String(req.body.make).trim(),
      model: String(req.body.model).trim(),
      year: Number(req.body.year),
      variant: req.body.variant || '',
      category,
      fuelType,
      transmission,
      seats: Number(req.body.seats),
      mileage: Number(req.body.mileage),
      color: String(req.body.color).trim(),
      city,
      address: req.body.address || '',
      description: req.body.description || '',
      features: features.slice(0, 30),
      photos,
      pricePerDayPaise: Math.round(price * 100),
      weeklyDiscountPercent: Number(req.body.weeklyDiscountPercent) || 0,
      monthlyDiscountPercent: Number(req.body.monthlyDiscountPercent) || 0,
      status: 'listed',
    });
    const populated = await vehicle.populate('owner', 'fullName createdAt');
    res.status(201).json({ success: true, data: { vehicle: vehicleDto(populated) } });
  } catch (error) {
    await Promise.all(photos.map((photoPath) => unlink(path.join(uploadsDir, path.basename(photoPath))).catch(() => {})));
    throw error;
  }
}));

router.get('/:id/availability', asyncRoute(async (req, res) => {
  const vehicle = await Vehicle.findOne({ _id: req.params.id, status: 'listed' }).select('blockedDates reservations');
  if (!vehicle) throw new ApiError(404, 'VEHICLE_NOT_FOUND', 'Vehicle not found.');
  const range = dateRangeFromQuery(req.query);
  if (!range) throw new ApiError(400, 'DATES_REQUIRED', 'Choose pick-up and return dates.');
  const overlapsReservation = vehicle.reservations.some((reservation) => reservation.status !== 'cancelled'
    && reservation.startDate < range.endDate && reservation.endDate > range.startDate);
  const overlapsBlockedDate = vehicle.blockedDates.some((blockedDate) => blockedDate >= range.startDate && blockedDate < range.endDate);
  res.json({ success: true, data: { available: !overlapsReservation && !overlapsBlockedDate } });
}));

router.get('/:id/quote', asyncRoute(async (req, res) => {
  const vehicle = await Vehicle.findOne({ _id: req.params.id, status: 'listed' });
  if (!vehicle) throw new ApiError(404, 'VEHICLE_NOT_FOUND', 'Vehicle not found.');
  const range = dateRangeFromQuery(req.query);
  if (!range) throw new ApiError(400, 'DATES_REQUIRED', 'Choose pick-up and return dates.');
  const overlapsReservation = vehicle.reservations.some((reservation) => reservation.status !== 'cancelled'
    && reservation.startDate < range.endDate && reservation.endDate > range.startDate);
  const overlapsBlockedDate = vehicle.blockedDates.some((blockedDate) => blockedDate >= range.startDate && blockedDate < range.endDate);
  res.json({ success: true, data: {
    priceBreakdown: calculatePrice(vehicle, req.query.startDate, req.query.endDate),
    available: !overlapsReservation && !overlapsBlockedDate,
  } });
}));

router.get('/:id', asyncRoute(async (req, res) => {
  if (!/^[a-f\d]{24}$/i.test(req.params.id)) throw new ApiError(404, 'VEHICLE_NOT_FOUND', 'Vehicle not found.');
  const vehicle = await Vehicle.findOne({ _id: req.params.id, status: 'listed' }).populate('owner', 'fullName createdAt');
  if (!vehicle) throw new ApiError(404, 'VEHICLE_NOT_FOUND', 'Vehicle not found.');
  const reviews = await Review.find({ vehicle: vehicle._id }).populate('author', 'fullName').sort({ createdAt: -1 }).limit(20).lean();
  res.json({ success: true, data: { vehicle: vehicleDto(vehicle), reviews } });
}));

router.patch('/:id', requireAuth, requireRole('owner'), asyncRoute(async (req, res) => {
  const allowed = ['description', 'pricePerDayPaise', 'weeklyDiscountPercent', 'monthlyDiscountPercent', 'features', 'blockedDates', 'status'];
  const updates = Object.fromEntries(Object.entries(req.body || {}).filter(([key]) => allowed.includes(key)));
  if ('status' in updates && !['listed', 'unlisted'].includes(updates.status)) {
    throw new ApiError(400, 'INVALID_LISTING_STATUS', 'Owners may only list or unlist their own approved vehicle.');
  }
  if ('pricePerDayPaise' in updates && (!Number.isInteger(updates.pricePerDayPaise) || updates.pricePerDayPaise < 1)) {
    throw new ApiError(400, 'INVALID_PRICE', 'Daily price must be a positive integer number of paise.');
  }
  const vehicle = await Vehicle.findOneAndUpdate(
    { _id: req.params.id, owner: req.auth.id, status: { $ne: 'deleted' } },
    { $set: updates },
    { new: true, runValidators: true },
  ).populate('owner', 'fullName createdAt');
  if (!vehicle) throw new ApiError(404, 'VEHICLE_NOT_FOUND', 'Vehicle not found.');
  res.json({ success: true, data: { vehicle: vehicleDto(vehicle) } });
}));

export const favoritesRouter = Router();

favoritesRouter.get('/', requireAuth, asyncRoute(async (req, res) => {
  const user = await User.findById(req.auth.id).populate({
    path: 'favorites',
    match: { status: 'listed' },
    populate: { path: 'owner', select: 'fullName createdAt' },
  });
  res.json({ success: true, data: { vehicles: (user?.favorites || []).map((vehicle) => vehicleDto(vehicle)) } });
}));

favoritesRouter.put('/:vehicleId', requireAuth, asyncRoute(async (req, res) => {
  const vehicle = await Vehicle.findOne({ _id: req.params.vehicleId, status: 'listed' });
  if (!vehicle) throw new ApiError(404, 'VEHICLE_NOT_FOUND', 'Vehicle not found.');
  await User.updateOne({ _id: req.auth.id }, { $addToSet: { favorites: vehicle._id } });
  res.json({ success: true, data: { saved: true } });
}));

favoritesRouter.delete('/:vehicleId', requireAuth, asyncRoute(async (req, res) => {
  await User.updateOne({ _id: req.auth.id }, { $pull: { favorites: req.params.vehicleId } });
  res.json({ success: true, data: { saved: false } });
}));

export default router;