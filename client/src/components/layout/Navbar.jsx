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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-navy/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric to-electric-dark flex items-center justify-center shadow-lg group-hover:shadow-glow transition-shadow duration-300">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Rent<span className="text-electric">Wheels</span>
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
                className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 text-sm font-semibold text-white/90 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-electric to-electric-dark rounded-xl hover:shadow-glow transition-all duration-300 hover:-translate-y-0.5"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 border-t border-white/10' : 'max-h-0'
        }`}
      >
        <div className="px-4 py-4 bg-navy-dark/95 backdrop-blur-md space-y-1">
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
              className="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-sm font-semibold text-white/90 text-center rounded-xl hover:bg-white/10 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-sm font-semibold text-white text-center bg-gradient-to-r from-electric to-electric-dark rounded-xl"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
