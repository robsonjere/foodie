import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/lib/store';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import StatsCard from '@/components/StatsCard';
import DateSelector from '@/components/DateSelector';
import { FiTrendingUp, FiTrendingDown, FiActivity, FiDroplet } from 'react-icons/fi';
import { dailyLogAPI, authAPI } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dailyLog, setDailyLog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchDailyLog();
  }, [currentDate, isAuthenticated]);

  const fetchDailyLog = async () => {
    try {
      setLoading(true);
      const dateStr = currentDate.toISOString().split('T')[0];
      const response = await dailyLogAPI.getDailyLog(dateStr);
      setDailyLog(response.data);
    } catch (error) {
      console.error('Error fetching daily log:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCalorieStatus = () => {
    if (!dailyLog || !user) return { percentage: 0, remaining: user?.dailyCalorieGoal || 2000 };
    const remaining = (user.dailyCalorieGoal || 2000) - dailyLog.totalCaloriesConsumed;
    const percentage = Math.min(100, (dailyLog.totalCaloriesConsumed / (user.dailyCalorieGoal || 2000)) * 100);
    return { percentage, remaining };
  };

  const calorieStatus = getCalorieStatus();
  const isUnderBudget = calorieStatus.remaining > 0;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Date Selector */}
          <DateSelector currentDate={currentDate} onDateChange={setCurrentDate} />

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Calories Consumed"
              value={dailyLog?.totalCaloriesConsumed || 0}
              unit="kcal"
              icon={FiTrendingUp}
              color="blue"
            />
            <StatsCard
              title="Calories Burned"
              value={dailyLog?.totalCaloriesBurnt || 0}
              unit="kcal"
              icon={FiActivity}
              color="green"
            />
            <StatsCard
              title="Net Calories"
              value={dailyLog?.netCalories || 0}
              unit="kcal"
              icon={FiTrendingDown}
              color="purple"
            />
            <StatsCard
              title="Water Intake"
              value={dailyLog?.waterIntake || 0}
              unit="L"
              icon={FiDroplet}
              color="orange"
            />
          </div>

          {/* Calorie Budget */}
          <div className="card p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Daily Calorie Budget</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">
                    {dailyLog?.totalCaloriesConsumed || 0} / {user?.dailyCalorieGoal || 2000} kcal
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      isUnderBudget ? 'text-green-600' : 'text-orange-600'
                    }`}
                  >
                    {calorieStatus.remaining > 0 ? '+' : ''}
                    {calorieStatus.remaining.toFixed(0)} remaining
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      isUnderBudget ? 'bg-blue-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${calorieStatus.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/tracker')}
              className="btn-card"
            >
              <div className="btn-card-icon">🍽️</div>
              <div className="btn-card-content">
                <p className="btn-card-title">Log Meals</p>
                <p className="btn-card-subtitle">Track what you eat and drink</p>
              </div>
            </button>
            <button
              onClick={() => router.push('/exercises')}
              className="btn-card"
            >
              <div className="btn-card-icon">💪</div>
              <div className="btn-card-content">
                <p className="btn-card-title">Log Exercise</p>
                <p className="btn-card-subtitle">Track your physical activities</p>
              </div>
            </button>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
