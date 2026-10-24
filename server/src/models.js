import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const refreshSessionSchema = new Schema({
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
}, { _id: false });

const userSchema = new Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  phone: { type: String, required: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['customer', 'owner'], default: 'customer', required: true },
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Vehicle' }],
  refreshSessions: [refreshSessionSchema],
}, { timestamps: true });

const reservationSchema = new Schema({
  bookingId: { type: Schema.Types.ObjectId, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, default: 'confirmed' },
}, { _id: false });

const vehicleSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  make: { type: String, required: true, trim: true, maxlength: 60 },
  model: { type: String, required: true, trim: true, maxlength: 60 },
  year: { type: Number, required: true, min: 1990, max: new Date().getFullYear() + 1 },
  variant: { type: String, trim: true, maxlength: 80, default: '' },
  category: { type: String, enum: ['hatchback', 'sedan', 'suv', 'muv', 'luxury', 'bike', 'scooter'], required: true, index: true },
  fuelType: { type: String, enum: ['petrol', 'diesel', 'electric', 'cng', 'hybrid'], required: true },
  transmission: { type: String, enum: ['manual', 'automatic'], required: true },
  seats: { type: Number, required: true, min: 1, max: 12 },
  mileage: { type: Number, required: true, min: 0 },
  color: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true, index: true },
  address: { type: String, trim: true, maxlength: 250, default: '' },
  description: { type: String, trim: true, maxlength: 2000, default: '' },
  features: [{ type: String, trim: true }],
  photos: [{ type: String, required: true }],
  pricePerDayPaise: { type: Number, required: true, min: 1, index: true },
  weeklyDiscountPercent: { type: Number, min: 0, max: 50, default: 0 },
  monthlyDiscountPercent: { type: Number, min: 0, max: 50, default: 0 },
  blockedDates: [{ type: Date }],
  reservations: [reservationSchema],
  status: { type: String, enum: ['draft', 'pending_approval', 'approved', 'rejected', 'listed', 'unlisted', 'suspended', 'deleted'], default: 'listed', index: true },
  averageRating: { type: Number, min: 0, max: 5, default: 0 },
  reviewCount: { type: Number, min: 0, default: 0 },
  totalTrips: { type: Number, min: 0, default: 0 },
}, { timestamps: true });

vehicleSchema.index({ make: 'text', model: 'text', city: 'text', description: 'text' });
vehicleSchema.index({ status: 1, city: 1, category: 1, pricePerDayPaise: 1 });

const priceBreakdownSchema = new Schema({
  days: { type: Number, required: true },
  basePaise: { type: Number, required: true },
  discountPaise: { type: Number, required: true, default: 0 },
  platformFeePaise: { type: Number, required: true },
  taxPaise: { type: Number, required: true },
  totalPaise: { type: Number, required: true },
  depositPaise: { type: Number, required: true },
}, { _id: false });

const bookingSchema = new Schema({
  renter: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true, index: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['confirmed', 'cancelled_by_customer', 'cancelled_by_owner', 'completed'], default: 'confirmed', index: true },
  priceBreakdown: { type: priceBreakdownSchema, required: true },
  transitions: [{
    from: { type: String, default: null },
    to: { type: String, required: true },
    actor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    at: { type: Date, default: Date.now },
  }],
}, { timestamps: true, optimisticConcurrency: true });

bookingSchema.index({ vehicle: 1, startDate: 1, endDate: 1, status: 1 });

const reviewSchema = new Schema({
  booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
  vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true, index: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  body: { type: String, trim: true, maxlength: 1000, default: '' },
}, { timestamps: true });

export const User = models.User || model('User', userSchema);
export const Vehicle = models.Vehicle || model('Vehicle', vehicleSchema);
export const Booking = models.Booking || model('Booking', bookingSchema);
export const Review = models.Review || model('Review', reviewSchema);