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
    <section className="py-20 lg:py-28 bg-gradient-to-br from-navy-dark via-navy to-navy-light text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-electric/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric/15 border border-electric/30 text-electric text-xs font-semibold uppercase tracking-wider mb-6">
              <DollarSign className="w-4 h-4" />
              <span>For Vehicle Hosts</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
              Turn Your Idle Car Into a <span className="gradient-text">Passive Income Machine</span>
            </h2>
            <p className="text-white/70 text-base sm:text-lg mb-8 leading-relaxed">
              Join thousands of vehicle owners across Delhi, Mumbai, Bengaluru, Jaipur, and Pune who offset EMIs and earn handsomely with total peace of mind.
            </p>

            <div className="space-y-3.5 mb-10">
              {perks.map((perk) => (
                <div key={perk} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-electric shrink-0 mt-0.5" />
                  <span className="text-white/85 text-sm sm:text-base">{perk}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/list-vehicle"
                className="px-8 py-4 bg-gradient-to-r from-electric to-electric-dark text-white font-bold rounded-xl hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-center"
              >
                <span>List Your Vehicle Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/calculator"
                className="px-8 py-4 glass text-white/90 hover:text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 text-center"
              >
                Estimate Earnings
              </Link>
            </div>
          </div>

          {/* Stat Cards / Graphic */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div className="w-12 h-12 rounded-xl bg-electric/20 text-electric flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="text-3xl lg:text-4xl font-extrabold text-white">₹4.2 Cr+</span>
                <p className="text-white/60 text-xs sm:text-sm mt-1">Paid out to hosts across India</p>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="text-3xl lg:text-4xl font-extrabold text-white">100%</span>
                <p className="text-white/60 text-xs sm:text-sm mt-1">Verified renters with valid DL</p>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col justify-between col-span-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5 text-electric" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">You Stay in Control</h4>
                  <p className="text-white/60 text-xs">Set your daily rent, minimum booking duration, and rules</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
