export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatShortDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const calculateCaloriesBurnt = (exerciseType, duration, weight) => {
  // MET (Metabolic Equivalent) values for different activities
  const metValues = {
    running: 9.8,
    walking: 3.5,
    cycling: 7.5,
    swimming: 8,
    gym: 6,
    yoga: 2.5,
    sports: 8,
    hiit: 12,
    other: 5,
  };

  const met = metValues[exerciseType] || 5;
  // Formula: Calories = MET * weight (kg) * duration (hours)
  return Math.round(met * (weight || 70) * (duration / 60));
};

export const getMealTypeIcon = (mealType) => {
  const icons = {
    breakfast: '🌅',
    lunch: '🍽️',
    dinner: '🌙',
    snack: '🍎',
    dessert: '🍰',
  };
  return icons[mealType] || '🍽️';
};

export const getExerciseIcon = (exerciseType) => {
  const icons = {
    running: '🏃',
    walking: '🚶',
    cycling: '🚴',
    swimming: '🏊',
    gym: '💪',
    yoga: '🧘',
    sports: '⚽',
    hiit: '🔥',
    other: '💪',
  };
  return icons[exerciseType] || '💪';
};

export const getCategoryIcon = (category) => {
  const icons = {
    fruit: '🍎',
    vegetable: '🥗',
    meat: '🥩',
    seafood: '🐟',
    dairy: '🥛',
    grain: '🌾',
    snack: '🍿',
    beverage: '🥤',
    dessert: '🍰',
    other: '🍽️',
  };
  return icons[category] || '🍽️';
};

export const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isSameDay = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};
