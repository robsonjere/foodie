import { useState, useEffect } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';
import { foodAPI } from '@/lib/api';

export default function EditMealModal({ meal, onSave, onClose }) {
  const [foods, setFoods] = useState(meal.foods || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Search foods when query changes
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      searchFoods();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchFoods = async () => {
    try {
      setSearching(true);
      const response = await foodAPI.searchFoods(searchQuery);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Error searching foods:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleAddFood = () => {
    if (!selectedFood) return;

    const newFood = {
      foodId: selectedFood,
      quantity: parseFloat(quantity),
    };

    setFoods([...foods, newFood]);
    setSelectedFood(null);
    setQuantity(1);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRemoveFood = (index) => {
    setFoods(foods.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (foods.length === 0) {
      alert('Please add at least one food to the meal');
      return;
    }

    onSave({
      mealId: meal._id,
      foods: foods.map((food) => ({
        foodId: food.foodId._id || food.foodId,
        quantity: food.quantity,
      })),
    });
  };

  const getTotalCalories = () => {
    return foods.reduce((sum, food) => {
      const foodData = food.foodId;
      return sum + (foodData.calories * food.quantity || 0);
    }, 0).toFixed(0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Edit {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)} Meal</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Current Foods */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Foods in this meal</h3>
            <div className="space-y-2 mb-4">
              {foods.map((food, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{food.foodId.name}</p>
                    <p className="text-sm text-gray-600">
                      {food.quantity} x {food.foodId.calories} cal = {(food.foodId.calories * food.quantity).toFixed(0)} cal
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveFood(index)}
                    className="ml-2 p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Total Calories */}
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-gray-600">Total Calories</p>
              <p className="text-2xl font-bold text-blue-600">{getTotalCalories()}</p>
            </div>
          </div>

          {/* Add Food Section */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-800 mb-3">Add more food</h3>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            />

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mb-3 max-h-40 overflow-y-auto border border-gray-300 rounded-lg">
                {searchResults.map((food) => (
                  <button
                    key={food._id}
                    onClick={() => setSelectedFood(food)}
                    className={`w-full text-left p-3 border-b hover:bg-blue-50 transition-colors ${
                      selectedFood?._id === food._id ? 'bg-blue-100' : ''
                    }`}
                  >
                    <p className="font-medium text-gray-800">{food.name}</p>
                    <p className="text-xs text-gray-600">{food.calories} cal per {food.servingSize}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Selected Food and Quantity */}
            {selectedFood && (
              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <p className="font-medium text-gray-800 mb-2">{selectedFood.name}</p>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 flex-1">Quantity:</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">{selectedFood.servingSize}</span>
                </div>
              </div>
            )}

            {/* Add Button */}
            <button
              onClick={handleAddFood}
              disabled={!selectedFood}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              <FiPlus size={18} />
              Add Food
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex gap-2">
          <button
            onClick={onClose}
            className="btn btn-outline flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary flex-1"
          >
            Save Meal
          </button>
        </div>
      </div>
    </div>
  );
}
