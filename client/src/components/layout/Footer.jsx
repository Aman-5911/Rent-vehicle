import { Link } from 'react-router-dom';
import {
  Car, Mail, Phone, MapPin,
  Globe, Share2, MessageCircle, Send,
  ChevronRight
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Blog', href: '/blog' },
    ],
    Support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Safety', href: '/safety' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
    ],
    Legal: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Refund Policy', href: '/refund-policy' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
    'For Owners': [
      { label: 'List Your Vehicle', href: '/list-vehicle' },
      { label: 'Owner Guidelines', href: '/owner-guidelines' },
      { label: 'Insurance Info', href: '/insurance' },
      { label: 'Earnings Calculator', href: '/calculator' },
    ],
  };

  const socialLinks = [
    { icon: Globe, href: '#', label: 'Website' },
    { icon: Share2, href: '#', label: 'Share' },
    { icon: MessageCircle, href: '#', label: 'Chat' },
    { icon: Send, href: '#', label: 'Telegram' },
  ];

  return (
    <footer className="bg-navy-dark text-white/70">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric to-electric-dark flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Rent<span className="text-electric">Wheels</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              India's trusted self-drive car rental marketplace. Find your perfect ride from verified owners in your city.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-electric" />
                <span>support@rentwheels.test</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-electric" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-electric" />
                <span>Delhi, Mumbai, Bengaluru, Jaipur, Pune</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm hover:text-electric transition-colors duration-200 flex items-center gap-1 group"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            © {currentYear} RentWheels. All rights reserved. 
            <span className="text-electric/60 ml-1">TEST APPLICATION</span>
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-electric/20 hover:text-electric transition-all duration-200"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
