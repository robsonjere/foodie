import { FiX, FiEdit2 } from 'react-icons/fi';
import { getMealTypeIcon } from '@/lib/utils';

export default function MealCard({ meal, onDelete, onEdit }) {
  const getMealTypeColor = (type) => {
    const colors = {
      breakfast: 'bg-yellow-100 text-yellow-800',
      lunch: 'bg-green-100 text-green-800',
      dinner: 'bg-purple-100 text-purple-800',
      snack: 'bg-blue-100 text-blue-800',
      dessert: 'bg-pink-100 text-pink-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="card p-4 border-neutral-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{getMealTypeIcon(meal.mealType)}</span>
          <div>
            <p className="font-bold text-neutral-900 capitalize">{meal.mealType}</p>
            <p className={`badge badge-primary text-xs capitalize`}>
              {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(meal)}
            className="btn btn-ghost btn-sm text-primary-600 hover:bg-primary-50"
          >
            <FiEdit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(meal._id)}
            className="btn btn-ghost btn-sm text-danger-600 hover:bg-danger-50"
          >
            <FiX size={18} />
          </button>
        </div>
      </div>

      {/* Foods in meal */}
      <div className="space-y-2 mb-4 border-t border-neutral-200 pt-3">
        {meal.foods?.map((food, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="text-neutral-700 font-medium">{food.foodId?.name || 'Unknown'}</span>
            <span className="badge badge-success text-xs">
              {(food.foodId?.calories * food.quantity).toFixed(0)} cal
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-neutral-200 pt-3 bg-gradient-primary bg-opacity-5 p-3 rounded-lg">
        <div className="flex justify-between items-center font-bold text-neutral-900 mb-2">
          <span>Total</span>
          <span className="text-primary-600">{meal.totalCalories} cal</span>
        </div>
        {meal.totalProtein > 0 && (
          <div className="text-xs text-neutral-600 space-y-1">
            <div className="flex justify-between">
              <span>Protein: <strong>{meal.totalProtein.toFixed(1)}g</strong></span>
              <span>Carbs: <strong>{meal.totalCarbs.toFixed(1)}g</strong></span>
              <span>Fat: <strong>{meal.totalFat.toFixed(1)}g</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
