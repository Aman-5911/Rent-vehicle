import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ImagePlus } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { api } from '../api';

const fieldClass = 'mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

export default function ListVehicle() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    const formData = new FormData(event.currentTarget);
    if (photos.length < 3) {
      setError('Upload at least 3 vehicle photos.');
      return;
    }
    photos.forEach((photo) => formData.append('photos', photo));
    setSubmitting(true);
    try {
      const result = await api('/vehicles', { method: 'POST', body: formData });
      navigate(`/vehicles/${result.vehicle.id}`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 pb-16 pt-28 sm:px-6">
        <Link to="/dashboard" className="text-sm font-semibold text-blue-700">← Dashboard</Link>
        <div className="mt-5"><p className="text-sm font-semibold text-blue-700">For vehicle owners</p><h1 className="mt-1 text-3xl font-bold">List your vehicle</h1><p className="mt-2 text-sm text-slate-600">Add accurate details and at least three clear photos. Your listing appears in Browse Vehicles.</p></div>
        <form onSubmit={submit} className="mt-7 space-y-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <section><h2 className="text-lg font-bold">Vehicle details</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">Make<input className={fieldClass} name="make" placeholder="Hyundai" required maxLength={60} /></label>
            <label className="text-sm font-medium text-slate-700">Model<input className={fieldClass} name="model" placeholder="Creta" required maxLength={60} /></label>
            <label className="text-sm font-medium text-slate-700">Year<input className={fieldClass} name="year" type="number" min="1990" max={new Date().getFullYear() + 1} required /></label>
            <label className="text-sm font-medium text-slate-700">Variant<input className={fieldClass} name="variant" placeholder="SX (O)" /></label>
            <label className="text-sm font-medium text-slate-700">Category<select className={fieldClass} name="category" required defaultValue="suv"><option value="hatchback">Hatchback</option><option value="sedan">Sedan</option><option value="suv">SUV</option><option value="muv">MUV</option><option value="luxury">Luxury</option><option value="bike">Bike</option><option value="scooter">Scooter</option></select></label>
            <label className="text-sm font-medium text-slate-700">City<select className={fieldClass} name="city" required defaultValue="Delhi">{['Delhi', 'Mumbai', 'Bengaluru', 'Jaipur', 'Pune'].map((city) => <option key={city}>{city}</option>)}</select></label>
            <label className="text-sm font-medium text-slate-700">Fuel type<select className={fieldClass} name="fuelType" required defaultValue="petrol">{['petrol', 'diesel', 'electric', 'cng', 'hybrid'].map((fuel) => <option key={fuel} value={fuel}>{fuel[0].toUpperCase() + fuel.slice(1)}</option>)}</select></label>
            <label className="text-sm font-medium text-slate-700">Transmission<select className={fieldClass} name="transmission" required defaultValue="automatic"><option value="manual">Manual</option><option value="automatic">Automatic</option></select></label>
            <label className="text-sm font-medium text-slate-700">Seats<input className={fieldClass} name="seats" type="number" min="1" max="12" required defaultValue="5" /></label>
            <label className="text-sm font-medium text-slate-700">Mileage (km/l or km/kWh)<input className={fieldClass} name="mileage" type="number" min="0" step="0.1" required /></label>
            <label className="text-sm font-medium text-slate-700">Color<input className={fieldClass} name="color" required /></label>
            <label className="text-sm font-medium text-slate-700">Daily price (₹)<input className={fieldClass} name="pricePerDay" type="number" min="1" max="100000" required /></label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">Pickup area/address<input className={fieldClass} name="address" placeholder="Neighborhood or landmark" maxLength={250} /></label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">Description<textarea className={fieldClass} name="description" rows="4" maxLength={2000} placeholder="Describe the vehicle and pickup arrangements." /></label>
            <label className="text-sm font-medium text-slate-700 sm:col-span-2">Features<input className={fieldClass} name="features" placeholder="Air conditioning, Bluetooth, GPS" /></label>
          </div></section>

          <section className="border-t border-slate-200 pt-6"><h2 className="text-lg font-bold">Vehicle photos</h2><p className="mt-1 text-sm text-slate-600">Upload 3–10 JPEG, PNG, or WebP photos. Maximum 5 MB each.</p><label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition-colors hover:border-blue-400 hover:bg-blue-50"><ImagePlus className="h-7 w-7 text-blue-600" /><span className="mt-2 text-sm font-semibold text-slate-800">Choose photos</span><span className="mt-1 text-xs text-slate-500">{photos.length} selected</span><input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => setPhotos(Array.from(event.target.files || []).slice(0, 10))} /></label></section>

          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button disabled={submitting} className="w-full rounded-lg bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60 sm:w-auto">{submitting ? 'Publishing listing…' : 'Publish vehicle listing'}</button>
        </form>
      </main>
      <Footer />
    </div>
  );
}