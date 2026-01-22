import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import DateSelector from '@/components/DateSelector';
import ExerciseCard from '@/components/ExerciseCard';
import { FiPlus } from 'react-icons/fi';
import { exerciseAPI, dailyLogAPI } from '@/lib/api';
import { calculateCaloriesBurnt } from '@/lib/utils';

const EXERCISE_TYPES = ['running', 'walking', 'cycling', 'swimming', 'gym', 'yoga', 'sports', 'hiit'];

export default function ExercisesPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [exercises, setExercises] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    exerciseType: 'gym',
    duration: 30,
    intensity: 'moderate',
    caloriesBurnt: 0,
    notes: '',
  });

  useEffect(() => {
    fetchExercises();
  }, [currentDate]);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const dateStr = currentDate.toISOString().split('T')[0];
      const response = await exerciseAPI.getExercisesByDate(dateStr);
      setExercises(response.data || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value,
    }));
  };

  const calculateAndUpdateCalories = (duration, exerciseType, intensity = 'moderate') => {
    // Simple calorie calculation based on activity and weight (assuming 70kg)
    const caloriesPerMinute = {
      running: { low: 8, moderate: 12, high: 15 },
      walking: { low: 3, moderate: 4, high: 6 },
      cycling: { low: 6, moderate: 8, high: 12 },
      swimming: { low: 6, moderate: 10, high: 14 },
      gym: { low: 4, moderate: 6, high: 10 },
      yoga: { low: 2, moderate: 3, high: 4 },
      sports: { low: 6, moderate: 9, high: 12 },
      hiit: { low: 10, moderate: 14, high: 18 },
    };

    const mets = caloriesPerMinute[exerciseType]?.[intensity] || 5;
    const calories = Math.round(mets * duration);

    setFormData((prev) => ({
      ...prev,
      caloriesBurnt: calories,
    }));
  };

  const handleAddExercise = async (e) => {
    e.preventDefault();
    try {
      const exerciseData = {
        date: currentDate.toISOString(),
        ...formData,
      };

      const response = await exerciseAPI.createExercise(exerciseData);
      setExercises([...exercises, response.data]);
      setShowForm(false);
      setFormData({
        exerciseType: 'gym',
        duration: 30,
        intensity: 'moderate',
        caloriesBurnt: 0,
        notes: '',
      });

      // Refresh daily log
      const dateStr = currentDate.toISOString().split('T')[0];
      await dailyLogAPI.getDailyLog(dateStr);
    } catch (error) {
      console.error('Error adding exercise:', error);
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    try {
      await exerciseAPI.deleteExercise(exerciseId);
      setExercises(exercises.filter((e) => e._id !== exerciseId));

      // Refresh daily log
      const dateStr = currentDate.toISOString().split('T')[0];
      await dailyLogAPI.getDailyLog(dateStr);
    } catch (error) {
      console.error('Error deleting exercise:', error);
    }
  };

  const handleEditExercise = (exercise) => {
    // TODO: Implement edit exercise modal
    console.log('Edit exercise:', exercise);
  };

  const getTotalCaloriesBurnt = () => {
    return exercises.reduce((sum, ex) => sum + (ex.caloriesBurnt || 0), 0);
  };

  const getTotalDuration = () => {
    return exercises.reduce((sum, ex) => sum + (ex.duration || 0), 0);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Date Selector */}
          <DateSelector currentDate={currentDate} onDateChange={setCurrentDate} />

          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="card p-6">
              <p className="text-gray-600 text-sm mb-1">Calories Burned</p>
              <p className="text-3xl font-bold text-green-600">{getTotalCaloriesBurnt()}</p>
              <p className="text-xs text-gray-500 mt-1">kcal today</p>
            </div>
            <div className="card p-6">
              <p className="text-gray-600 text-sm mb-1">Total Duration</p>
              <p className="text-3xl font-bold text-blue-600">{getTotalDuration()}</p>
              <p className="text-xs text-gray-500 mt-1">minutes today</p>
            </div>
          </div>

          {/* Add Exercise Form */}
          {showForm ? (
            <div className="card p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Log Exercise</h3>
              <form onSubmit={handleAddExercise} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exercise Type
                    </label>
                    <select
                      name="exerciseType"
                      value={formData.exerciseType}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      {EXERCISE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      min="1"
                      value={formData.duration}
                      onChange={(e) => {
                        handleInputChange(e);
                        calculateAndUpdateCalories(
                          parseInt(e.target.value),
                          formData.exerciseType,
                          formData.intensity
                        );
                      }}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Intensity
                    </label>
                    <select
                      name="intensity"
                      value={formData.intensity}
                      onChange={(e) => {
                        handleInputChange(e);
                        calculateAndUpdateCalories(
                          formData.duration,
                          formData.exerciseType,
                          e.target.value
                        );
                      }}
                      className="input-field"
                    >
                      <option value="low">Low</option>
                      <option value="moderate">Moderate</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calories Burned
                    </label>
                    <input
                      type="number"
                      name="caloriesBurnt"
                      value={formData.caloriesBurnt}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="input-field"
                    rows="3"
                    placeholder="How did it feel? Any notes?"
                  ></textarea>
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="btn btn-primary flex-1">
                    Save Exercise
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary w-full mb-6"
            >
              <FiPlus size={20} />
              <span>Add Exercise</span>
            </button>
          )}

          {/* Exercises List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Loading exercises...</div>
            ) : exercises.length > 0 ? (
              exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise._id}
                  exercise={exercise}
                  onDelete={handleDeleteExercise}
                  onEdit={handleEditExercise}
                />
              ))
            ) : (
              <div className="card p-8 text-center">
                <p className="text-gray-600 mb-4">No exercises logged yet for this day</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
