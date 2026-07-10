import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-card mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Restaurant Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent">🐉</span> Dragon Palace
            </h3>
            <p className="text-sm opacity-90 mb-4">
              Serving authentic Chinese cuisine since 2015. Premium quality ingredients and exceptional service.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a href="tel:+1-555-0123" className="hover:text-accent transition-colors">
                  +1 (555) 0123
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <a href="mailto:info@dragonpalace.com" className="hover:text-accent transition-colors">
                  info@dragonpalace.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>123 Main Street, City, State 12345</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold mb-4">Hours</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Mon - Thu: 11 AM - 10 PM</span>
              </div>
              <div className="ml-6">Fri - Sat: 11 AM - 11 PM</div>
              <div className="ml-6">Sunday: 12 PM - 10 PM</div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/menu" className="hover:text-accent transition-colors">
                  View Menu
                </a>
              </li>
              <li>
                <a href="/orders" className="hover:text-accent transition-colors">
                  Track Order
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-accent transition-colors">
                  Special Offers
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-accent transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-card opacity-20 py-6"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm opacity-80 mb-4 md:mb-0">
            &copy; {currentYear} Dragon Palace. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-accent transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
