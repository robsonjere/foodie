import { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { foodAPI } from '@/lib/api';
import { getCategoryIcon } from '@/lib/utils';

export default function FoodSelector({ onFoodSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (value) => {
    setSearchQuery(value);
    if (value.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    setShowResults(true);
    try {
      const response = await foodAPI.searchFoods(value);
      setResults(response.data || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFood = (food) => {
    setSelectedFoods([...selectedFoods, { ...food, quantity: 1 }]);
    setSearchQuery('');
    setResults([]);
    setShowResults(false);
  };

  const handleRemoveFood = (index) => {
    setSelectedFoods(selectedFoods.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index, quantity) => {
    const updated = [...selectedFoods];
    updated[index].quantity = Math.max(0.5, parseFloat(quantity) || 1);
    setSelectedFoods(updated);
  };

  const handleAddMeal = () => {
    if (selectedFoods.length > 0) {
      onFoodSelect(selectedFoods);
      setSelectedFoods([]);
    }
  };

  return (
    <div className="card p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Add Foods to Meal</h3>

      {/* Search Input */}
      <div className="relative mb-4">
        <div className="flex items-center input-field">
          <FiSearch className="text-gray-400 mr-3" size={20} />
          <input
            type="text"
            placeholder="Search foods (type at least 2 characters)..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 outline-none"
          />
        </div>

        {/* Search Results */}
        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Searching...</div>
            ) : results.length > 0 ? (
              results.map((food) => (
                <button
                  key={food._id}
                  onClick={() => handleSelectFood(food)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">
                        {getCategoryIcon(food.category)} {food.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {food.calories} cal per {food.servingSize.amount}
                        {food.servingSize.unit}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No foods found</div>
            )}
          </div>
        )}
      </div>

      {/* Selected Foods */}
      {selectedFoods.length > 0 && (
        <div className="mb-4 space-y-3">
          <h4 className="font-semibold text-gray-700">Selected Foods:</h4>
          {selectedFoods.map((food, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-800">{food.name}</p>
                <p className="text-sm text-gray-500">
                  {(food.calories * food.quantity).toFixed(0)} cal
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={food.quantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                />
                <span className="text-sm text-gray-500 w-8">x</span>
                <button
                  onClick={() => handleRemoveFood(index)}
                  className="p-1 hover:bg-red-100 rounded transition-colors"
                >
                  <FiX className="text-red-600" size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Button */}
      <button
        onClick={handleAddMeal}
        disabled={selectedFoods.length === 0}
        className="btn btn-primary w-full"
      >
        Add Meal ({selectedFoods.length} items)
      </button>
    </div>
  );
}
