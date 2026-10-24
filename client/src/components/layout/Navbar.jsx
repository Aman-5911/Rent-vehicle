import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Car, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur transition-shadow duration-300 ${
        scrolled ? 'shadow-md shadow-slate-900/5' : 'shadow-sm shadow-slate-900/[0.02]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 transition-colors group-hover:bg-blue-700">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Rent<span className="text-blue-600">Wheels</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {[
              { label: 'Home', href: '/' },
              { label: 'Browse Vehicles', href: '/vehicles' },
              { label: 'How It Works', href: '/#how-it-works' },
              { label: 'List Your Vehicle', href: '/list-vehicle' },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-50 hover:text-blue-700"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors duration-200 hover:bg-slate-50 hover:text-blue-700"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-700 lg:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 border-t border-slate-200' : 'max-h-0'
        }`}
      >
        <div className="space-y-1 bg-white px-4 py-4">
          {[
            { label: 'Home', href: '/' },
            { label: 'Browse Vehicles', href: '/vehicles' },
            { label: 'How It Works', href: '/#how-it-works' },
            { label: 'List Your Vehicle', href: '/list-vehicle' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-blue-700"
            >
              {item.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 border-t border-slate-200 pt-3">
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block rounded-xl px-4 py-3 text-center text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Log in
            </Link>
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
