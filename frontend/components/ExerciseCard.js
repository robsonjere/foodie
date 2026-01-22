import { FiX, FiEdit2 } from 'react-icons/fi';
import { getExerciseIcon } from '@/lib/utils';

export default function ExerciseCard({ exercise, onDelete, onEdit }) {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getIntensityColor = (intensity) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800',
      moderate: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };
    return colors[intensity] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getExerciseIcon(exercise.exerciseType)}</span>
          <div>
            <p className="font-semibold text-gray-800 capitalize">
              {exercise.exerciseType.replace('_', ' ')}
            </p>
            <p className="text-sm text-gray-600">{formatTime(exercise.date)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(exercise)}
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
          >
            <FiEdit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(exercise._id)}
            className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
          >
            <FiX size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-2 border-t pt-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-700">Duration</span>
          <span className="font-medium text-gray-800">{exercise.duration} minutes</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-700">Intensity</span>
          <span className={`text-xs px-2 py-1 rounded capitalize ${getIntensityColor(exercise.intensity)}`}>
            {exercise.intensity}
          </span>
        </div>
        <div className="flex justify-between text-sm font-semibold text-green-600">
          <span>Calories Burnt</span>
          <span>{exercise.caloriesBurnt} calories</span>
        </div>
      </div>

      {exercise.notes && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-gray-600">{exercise.notes}</p>
        </div>
      )}
    </div>
  );
}
