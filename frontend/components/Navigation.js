import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/lib/store';
import { FiHome, FiCalendar, FiActivity, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

export default function Navigation() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: FiHome },
    { href: '/tracker', label: 'Tracker', icon: FiCalendar },
    { href: '/exercises', label: 'Exercises', icon: FiActivity },
    { href: '/profile', label: 'Profile', icon: FiUser },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Foodie
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 font-medium ${
                  router.pathname === href
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{label}</span>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm font-medium text-neutral-700">Hi, {user?.firstName || 'User'}</span>
            <button
              onClick={handleLogout}
              className="btn btn-danger text-lg"
            >
              <FiLogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  router.pathname === href
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={20} />
                <span>{label}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiLogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
