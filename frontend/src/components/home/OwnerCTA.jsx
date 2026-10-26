import { ArrowRight, DollarSign, Shield, CalendarCheck, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OwnerCTA() {
  const perks = [
    'Earn up to ₹45,000/month on idle four-wheelers',
    'Comprehensive insurance cover & renter background checks',
    'Full control over pricing, blocked dates & trip approvals',
    'Guaranteed weekly payouts straight to your bank account',
  ];

  return (
    <section className="owner-cta py-20 lg:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="section-kicker inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-normal mb-5">
              <DollarSign className="w-4 h-4" />
              <span>For Vehicle Hosts</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5 text-slate-900">
              Turn your idle car into <span className="text-blue-700">extra income.</span>
            </h2>
            <p className="text-slate-600 text-base sm:text-lg mb-7 leading-relaxed">
              Join thousands of vehicle owners across Delhi, Mumbai, Bengaluru, Jaipur, and Pune who offset EMIs and earn handsomely with total peace of mind.
            </p>

            <div className="space-y-3.5 mb-10">
              {perks.map((perk) => (
                <div key={perk} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-sm sm:text-base">{perk}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/list-vehicle"
                className="px-7 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 text-center"
              >
                <span>List Your Vehicle Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/calculator"
                className="px-7 py-3.5 border border-slate-300 bg-white text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors duration-200 text-center"
              >
                Estimate Earnings
              </Link>
            </div>
          </div>

          {/* Stat Cards / Graphic */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            <div className="owner-stat-card p-6 rounded-xl border border-slate-200 bg-white flex flex-col justify-between shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="text-3xl lg:text-4xl font-bold text-slate-900">₹4.2 Cr+</span>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">Paid out to hosts across India</p>
              </div>
            </div>

            <div className="owner-stat-card p-6 rounded-xl border border-slate-200 bg-white flex flex-col justify-between shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="text-3xl lg:text-4xl font-bold text-slate-900">100%</span>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">Verified renters with valid DL</p>
              </div>
            </div>

            <div className="owner-stat-card col-span-2 flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">You Stay in Control</h4>
                  <p className="text-slate-500 text-xs">Set your daily rent, minimum booking duration, and rules</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
