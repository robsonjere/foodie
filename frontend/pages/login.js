import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/lib/store';
import { authAPI } from '@/lib/api';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleDemoLogin = async () => {
    try {
      const response = await authAPI.demoLogin();
      const { token, user } = response.data;

      // Save to local storage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update auth store
      setAuth(user, token);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Demo login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-2">Foodie</h1>
          <p className="text-blue-100 text-lg">Track Your Meals & Exercise</p>
          <p className="text-blue-100 text-sm mt-2">
            Monitor your daily calorie intake and exercise to achieve your health goals
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome</h2>
            <p className="text-gray-600 mt-1">Start your health journey today</p>
          </div>

          <button
            onClick={handleDemoLogin}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <span>Continue with Demo Account</span>
            <FiArrowRight size={20} />
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="input-field"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Coming soon - Full authentication</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-field"
                disabled
              />
            </div>

            <button
              disabled
              className="w-full bg-gray-300 text-gray-600 px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
            >
              Sign In
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            New user?{' '}
            <button
              disabled
              className="text-blue-600 hover:text-blue-700 font-medium cursor-not-allowed"
            >
              Create account
            </button>{' '}
            (Coming soon)
          </p>
        </div>

        {/* Features */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-semibold">Features:</h3>
          <ul className="text-white/90 text-sm space-y-2">
            <li>✓ Log meals and track calories</li>
            <li>✓ Add exercises and calculate burned calories</li>
            <li>✓ View daily nutrition breakdown</li>
            <li>✓ Review past records and amend as needed</li>
            <li>✓ Search and autocomplete food items</li>
            <li>✓ Set daily calorie goals</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
