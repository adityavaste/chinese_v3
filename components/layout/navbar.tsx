'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useRestaurant } from '@/lib/context/restaurant-context';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useRestaurant();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const links = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/cart', label: 'Cart' },
    { href: '/orders', label: 'Orders' },
    { href: '/admin/orders', label: 'Admin' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <div className="flex items-center gap-2 transition-all duration-300">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-card font-bold text-lg">
                🐉
              </div>
              <span className="hidden md:inline text-xl font-bold text-primary">Dragon Palace</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.slice(0, 5).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary font-medium transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Cart Icon and Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative text-foreground hover:text-primary transition-colors duration-300"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-card text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-300"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-foreground hover:bg-muted hover:text-primary font-medium rounded-lg transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
