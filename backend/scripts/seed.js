import 'dotenv/config';
import argon2 from 'argon2';
import mongoose from 'mongoose';
import { User, Vehicle } from '../src/models.js';

const sampleVehicles = [
  { make: 'Hyundai', model: 'Creta', year: 2023, category: 'suv', fuelType: 'petrol', transmission: 'automatic', seats: 5, mileage: 17, color: 'White', city: 'Delhi', price: 2500, rating: 4.8, reviewCount: 124, photos: ['photo-1619767886558-efdc259cde1a', 'photo-1492144534655-ae79c964c9d7', 'photo-1503376780353-7e6692767b70'] },
  { make: 'Maruti Suzuki', model: 'Swift', year: 2022, category: 'hatchback', fuelType: 'petrol', transmission: 'manual', seats: 5, mileage: 22, color: 'Red', city: 'Mumbai', price: 1200, rating: 4.6, reviewCount: 89, photos: ['photo-1494976388531-d1058494cdd8', 'photo-1492144534655-ae79c964c9d7', 'photo-1503376780353-7e6692767b70'] },
  { make: 'Honda', model: 'City', year: 2021, category: 'sedan', fuelType: 'diesel', transmission: 'manual', seats: 5, mileage: 24, color: 'Silver', city: 'Bengaluru', price: 1800, rating: 4.7, reviewCount: 156, photos: ['photo-1605559424843-9e4c228bf1c2', 'photo-1494976388531-d1058494cdd8', 'photo-1492144534655-ae79c964c9d7'] },
  { make: 'Toyota', model: 'Fortuner', year: 2022, category: 'suv', fuelType: 'diesel', transmission: 'automatic', seats: 7, mileage: 14, color: 'Black', city: 'Jaipur', price: 4500, rating: 4.9, reviewCount: 67, photos: ['photo-1533473359331-0135ef1b58bf', 'photo-1503376780353-7e6692767b70', 'photo-1494976388531-d1058494cdd8'] },
  { make: 'BMW', model: '3 Series', year: 2023, category: 'luxury', fuelType: 'petrol', transmission: 'automatic', seats: 5, mileage: 16, color: 'Blue', city: 'Mumbai', price: 7500, rating: 4.9, reviewCount: 42, photos: ['photo-1555215695-3004980ad54e', 'photo-1492144534655-ae79c964c9d7', 'photo-1503376780353-7e6692767b70'] },
  { make: 'Tata', model: 'Nexon EV', year: 2024, category: 'suv', fuelType: 'electric', transmission: 'automatic', seats: 5, mileage: 312, color: 'Blue', city: 'Pune', price: 2200, rating: 4.5, reviewCount: 34, photos: ['photo-1619976215249-0bca8484acb3', 'photo-1494976388531-d1058494cdd8', 'photo-1492144534655-ae79c964c9d7'] },
];

async function upsertDemoUser({ fullName, email, phone, role }) {
  const passwordHash = await argon2.hash(process.env.DEMO_PASSWORD || 'RentWheels!Demo2026', { type: argon2.argon2id });
  return User.findOneAndUpdate(
    { email },
    { $setOnInsert: { fullName, email, phone, role, passwordHash } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}

try {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rentwheels');
  const owner = await upsertDemoUser({ fullName: 'RentWheels Demo Owner', email: 'owner@rentwheels.test', phone: '+919876543210', role: 'owner' });
  await upsertDemoUser({ fullName: 'RentWheels Demo Customer', email: 'customer@rentwheels.test', phone: '+919876543211', role: 'customer' });

  let created = 0;
  for (const vehicle of sampleVehicles) {
    const exists = await Vehicle.exists({ owner: owner._id, make: vehicle.make, model: vehicle.model });
    if (exists) continue;
    await Vehicle.create({
      ...vehicle,
      owner: owner._id,
      pricePerDayPaise: vehicle.price * 100,
      photos: vehicle.photos.map((photo) => `https://images.unsplash.com/${photo}?w=900&h=600&fit=crop&auto=format`),
      status: 'listed',
      description: `Well-maintained ${vehicle.year} ${vehicle.make} ${vehicle.model}, available for pickup in ${vehicle.city}.`,
      features: ['Air conditioning', 'Bluetooth', 'Phone charging'],
      averageRating: vehicle.rating,
    });
    created += 1;
  }

  console.log(`Seed complete. Added ${created} vehicles.`);
  console.log('Demo owner: owner@rentwheels.test');
  console.log('Demo customer: customer@rentwheels.test');
  console.log(`Demo password: ${process.env.DEMO_PASSWORD || 'RentWheels!Demo2026'}`);
} catch (error) {
  console.error('Seed failed:', error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}