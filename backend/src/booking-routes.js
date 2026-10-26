import mongoose from 'mongoose';
import { Router } from 'express';
import { Booking, Vehicle } from './models.js';
import { ApiError, asyncRoute, requireAuth, requireRole } from './middleware.js';
import { calculatePrice, toUtcDate } from './pricing.js';

const router = Router();

function bookingDto(booking) {
  const source = booking.toObject ? booking.toObject() : booking;
  return {
    ...source,
    id: String(source._id),
    totalRupees: source.priceBreakdown.totalPaise / 100,
    depositRupees: source.priceBreakdown.depositPaise / 100,
  };
}

router.post('/', requireAuth, requireRole('customer'), asyncRoute(async (req, res) => {
  const { vehicleId, startDate: startDateValue, endDate: endDateValue } = req.body || {};
  if (!mongoose.isValidObjectId(vehicleId)) throw new ApiError(400, 'INVALID_VEHICLE', 'Choose a valid vehicle.');
  const startDate = toUtcDate(startDateValue || '');
  const endDate = toUtcDate(endDateValue || '');
  if (!startDate || !endDate || endDate <= startDate) {
    throw new ApiError(400, 'INVALID_DATES', 'Choose a valid return date after pick-up.');
  }

  const vehicle = await Vehicle.findOne({ _id: vehicleId, status: 'listed' });
  if (!vehicle) throw new ApiError(404, 'VEHICLE_NOT_FOUND', 'This vehicle is no longer available.');
  if (String(vehicle.owner) === req.auth.id) {
    throw new ApiError(403, 'CANNOT_BOOK_OWN_VEHICLE', 'You cannot book your own vehicle.');
  }

  const priceBreakdown = calculatePrice(vehicle, startDateValue, endDateValue);
  const bookingId = new mongoose.Types.ObjectId();
  const reservedVehicle = await Vehicle.findOneAndUpdate({
    _id: vehicle._id,
    status: 'listed',
    reservations: { $not: { $elemMatch: {
      startDate: { $lt: endDate },
      endDate: { $gt: startDate },
      status: { $ne: 'cancelled' },
    } } },
    blockedDates: { $not: { $elemMatch: { $gte: startDate, $lt: endDate } } },
  }, {
    $push: { reservations: { bookingId, startDate, endDate, status: 'confirmed' } },
  }, { new: true });

  if (!reservedVehicle) throw new ApiError(409, 'DATES_UNAVAILABLE', 'Those dates were just booked. Please choose another range.');

  try {
    const booking = await Booking.create({
      _id: bookingId,
      renter: req.auth.id,
      owner: vehicle.owner,
      vehicle: vehicle._id,
      startDate,
      endDate,
      status: 'confirmed',
      priceBreakdown,
      transitions: [{ from: null, to: 'confirmed', actor: req.auth.id }],
    });
    await Vehicle.updateOne({ _id: vehicle._id }, { $inc: { totalTrips: 1 } });
    const populated = await booking.populate([
      { path: 'vehicle', select: 'make model photos city category' },
      { path: 'owner', select: 'fullName' },
    ]);
    res.status(201).json({ success: true, data: { booking: bookingDto(populated) } });
  } catch (error) {
    await Vehicle.updateOne({ _id: vehicle._id }, { $pull: { reservations: { bookingId } } });
    throw error;
  }
}));

router.get('/mine', requireAuth, asyncRoute(async (req, res) => {
  const bookings = await Booking.find({ $or: [{ renter: req.auth.id }, { owner: req.auth.id }] })
    .populate('vehicle', 'make model photos city category')
    .populate('renter', 'fullName email')
    .populate('owner', 'fullName')
    .sort({ startDate: -1 });
  res.json({ success: true, data: { bookings: bookings.map(bookingDto) } });
}));

router.get('/:id', requireAuth, asyncRoute(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('vehicle', 'make model photos city category fuelType transmission seats mileage pricePerDayPaise')
    .populate('renter', 'fullName email phone')
    .populate('owner', 'fullName email phone');
  if (!booking) throw new ApiError(404, 'BOOKING_NOT_FOUND', 'Booking not found.');
  if (![String(booking.renter._id), String(booking.owner._id)].includes(req.auth.id)) {
    throw new ApiError(403, 'FORBIDDEN', 'You cannot view this booking.');
  }
  res.json({ success: true, data: { booking: bookingDto(booking) } });
}));

router.patch('/:id/cancel', requireAuth, asyncRoute(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'BOOKING_NOT_FOUND', 'Booking not found.');
  const isRenter = String(booking.renter) === req.auth.id;
  const isOwner = String(booking.owner) === req.auth.id;
  if (!isRenter && !isOwner) throw new ApiError(403, 'FORBIDDEN', 'You cannot cancel this booking.');
  if (booking.status !== 'confirmed') throw new ApiError(409, 'INVALID_BOOKING_STATE', 'Only confirmed bookings can be cancelled.');

  const nextStatus = isOwner ? 'cancelled_by_owner' : 'cancelled_by_customer';
  booking.status = nextStatus;
  booking.transitions.push({ from: 'confirmed', to: nextStatus, actor: req.auth.id });
  await booking.save();
  await Vehicle.updateOne(
    { _id: booking.vehicle },
    { $pull: { reservations: { bookingId: booking._id } } },
  );
  res.json({ success: true, data: { booking: bookingDto(booking) } });
}));

export default router;