import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/lib/store';
import { authAPI } from '@/lib/api';
import { FiSave, FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/router';

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser, clearAuth } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    age: user?.age || '',
    gender: user?.gender || '',
    height: user?.height || '',
    weight: user?.weight || '',
    dailyCalorieGoal: user?.dailyCalorieGoal || 2000,
    activityLevel: user?.activityLevel || 'moderately_active',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'dailyCalorieGoal' || name === 'age' || name === 'height' || name === 'weight' ? parseInt(value) || '' : value,
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await authAPI.updateProfile(formData);
      updateUser(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="card p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-gray-600 mt-1">{user?.email}</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isEditing
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                {/* Physical Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Physical Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                {/* Health Goals */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Health Goals</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Daily Calorie Goal (kcal)
                      </label>
                      <input
                        type="number"
                        name="dailyCalorieGoal"
                        value={formData.dailyCalorieGoal}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Activity Level
                      </label>
                      <select
                        name="activityLevel"
                        value={formData.activityLevel}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        <option value="sedentary">Sedentary (little exercise)</option>
                        <option value="lightly_active">Lightly Active (1-3 days/week)</option>
                        <option value="moderately_active">Moderately Active (3-5 days/week)</option>
                        <option value="very_active">Very Active (6-7 days/week)</option>
                        <option value="extremely_active">Extremely Active (2x per day)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex gap-4 pt-4 border-t">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <FiSave size={20} />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Display Mode */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Physical Information</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Age</p>
                      <p className="text-lg font-semibold text-gray-800">{user?.age || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Gender</p>
                      <p className="text-lg font-semibold text-gray-800 capitalize">
                        {user?.gender || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Height</p>
                      <p className="text-lg font-semibold text-gray-800">{user?.height || '-'} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Weight</p>
                      <p className="text-lg font-semibold text-gray-800">{user?.weight || '-'} kg</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Health Goals</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Daily Calorie Goal</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {user?.dailyCalorieGoal || 2000} kcal
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Activity Level</p>
                      <p className="text-lg font-semibold text-gray-800 capitalize">
                        {user?.activityLevel?.replace('_', ' ') || 'Moderately Active'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </main>
      </div>
    </ProtectedRoute>
  );
}
