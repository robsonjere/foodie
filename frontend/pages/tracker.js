import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import DateSelector from '@/components/DateSelector';
import FoodSelector from '@/components/FoodSelector';
import EditMealModal from '@/components/EditMealModal';
import MealCard from '@/components/MealCard';
import { FiPlus, FiChevronDown } from 'react-icons/fi';
import { mealAPI, dailyLogAPI } from '@/lib/api';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack', 'dessert'];

export default function TrackerPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meals, setMeals] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [showFoodSelector, setShowFoodSelector] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [showSummaryDetails, setShowSummaryDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMeals();
  }, [currentDate]);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const dateStr = currentDate.toISOString().split('T')[0];
      const response = await mealAPI.getMealsByDate(dateStr);
      setMeals(response.data || []);
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = async (foods) => {
    try {
      const mealData = {
        date: currentDate.toISOString(),
        mealType: selectedMealType,
        foods: foods.map((food) => ({
          foodId: food._id,
          quantity: food.quantity,
        })),
      };

      const response = await mealAPI.createMeal(mealData);
      setMeals([...meals, response.data]);
      setShowFoodSelector(false);

      // Refresh daily log
      const dateStr = currentDate.toISOString().split('T')[0];
      await dailyLogAPI.getDailyLog(dateStr);
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      await mealAPI.deleteMeal(mealId);
      setMeals(meals.filter((m) => m._id !== mealId));

      // Refresh daily log
      const dateStr = currentDate.toISOString().split('T')[0];
      await dailyLogAPI.getDailyLog(dateStr);
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
  };

  const handleSaveEditMeal = async ({ mealId, foods }) => {
    try {
      const mealData = {
        foods: foods,
      };

      const response = await mealAPI.updateMeal(mealId, mealData);
      setMeals(meals.map((m) => (m._id === mealId ? response.data : m)));
      setEditingMeal(null);

      // Refresh daily log
      const dateStr = currentDate.toISOString().split('T')[0];
      await dailyLogAPI.getDailyLog(dateStr);
    } catch (error) {
      console.error('Error updating meal:', error);
      alert('Failed to update meal. Please try again.');
    }
  };

  const getTotalCalories = () => {
    return meals.reduce((sum, meal) => sum + (meal.totalCalories || 0), 0);
  };

  const getMealsByType = (type) => {
    return meals.filter((meal) => meal.mealType === type);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Date Selector */}
          <DateSelector currentDate={currentDate} onDateChange={setCurrentDate} />

          {/* Total Calories Summary - Collapsible */}
          <div className="card mb-6 bg-gradient-to-r from-blue-50 to-purple-50">
            <button
              onClick={() => setShowSummaryDetails(!showSummaryDetails)}
              className="w-full p-6 flex flex-col items-center hover:bg-opacity-80 transition-opacity"
            >
              <div className="flex justify-between items-start w-full mb-6">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Calories Today</p>
                  <p className="text-4xl font-bold text-gray-800">{getTotalCalories()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Meals logged</p>
                  <p className="text-3xl font-bold text-blue-600">{meals.length}</p>
                </div>
              </div>
              <FiChevronDown
                size={24}
                className={`text-gray-600 transition-transform ${showSummaryDetails ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Expanded Details */}
            {showSummaryDetails && meals.length > 0 && (
              <div className="border-t border-blue-200 p-6 bg-white bg-opacity-50">
                <div className="space-y-4">
                  {MEAL_TYPES.map((mealType) => {
                    const mealsOfType = getMealsByType(mealType);
                    if (mealsOfType.length === 0) return null;

                    return (
                      <div key={mealType} className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-800 capitalize mb-3">{mealType}</h4>
                        <div className="space-y-3">
                          {mealsOfType.map((meal) => (
                            <div key={meal._id} className="bg-gray-50 rounded p-3">
                              <div className="space-y-2">
                                {meal.foods?.map((food, index) => (
                                  <div key={index} className="flex justify-between text-sm">
                                    <span className="text-gray-700">
                                      {food.foodId?.name || 'Unknown'} ({food.quantity}x)
                                    </span>
                                    <span className="font-medium text-gray-800">
                                      {(food.foodId?.calories * food.quantity).toFixed(0)} cal
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-semibold text-gray-800">
                                <span>Meal Total</span>
                                <span>{meal.totalCalories} cal</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 flex justify-between font-bold text-blue-600 border-t border-gray-200 pt-3">
                          <span>{mealType.charAt(0).toUpperCase() + mealType.slice(1)} Total</span>
                          <span>{mealsOfType.reduce((sum, meal) => sum + meal.totalCalories, 0)} cal</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Meal Type Selection */}
          <div className="card p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Meal Type</h3>
            <div className="flex flex-wrap gap-2">
              {MEAL_TYPES.map((type) => {
                const count = getMealsByType(type).length;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedMealType(type)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                      selectedMealType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type} {count > 0 && <span className="ml-2 bg-gray-400 px-2 py-1 rounded-full text-xs text-white">{count}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Food Selector */}
          {showFoodSelector && (
            <FoodSelector onFoodSelect={handleAddMeal} />
          )}

          {/* Edit Meal Modal */}
          {editingMeal && (
            <EditMealModal
              meal={editingMeal}
              onSave={handleSaveEditMeal}
              onClose={() => setEditingMeal(null)}
            />
          )}

          {/* Meals List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Loading meals...</div>
            ) : selectedMealType && meals.length > 0 ? (
              getMealsByType(selectedMealType).length > 0 ? (
                getMealsByType(selectedMealType).map((meal) => (
                  <MealCard
                    key={meal._id}
                    meal={meal}
                    onDelete={handleDeleteMeal}
                    onEdit={handleEditMeal}
                  />
                ))
              ) : (
                <div className="card p-8 text-center">
                  <p className="text-gray-600 mb-4">No {selectedMealType} meals logged yet</p>
                  <button
                    onClick={() => setShowFoodSelector(true)}
                    className="btn btn-primary inline-flex items-center gap-2"
                  >
                    <FiPlus size={20} />
                    <span>Add {selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)} Meal</span>
                  </button>
                </div>
              )
            ) : (
              <div className="card p-8 text-center">
                <p className="text-gray-600 mb-4">No meals logged yet for this day</p>
                <button
                  onClick={() => setShowFoodSelector(true)}
                  disabled={!selectedMealType}
                  className="btn btn-primary inline-flex items-center gap-2"
                >
                  <FiPlus size={20} />
                  <span>Add {selectedMealType && selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1)} Meal</span>
                </button>
                {!selectedMealType && (
                  <p className="text-sm text-gray-500 mt-3">Please select a meal type above first</p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
