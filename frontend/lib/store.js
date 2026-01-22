import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: true,
    }),

  clearAuth: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    }),

  updateUser: (user) => set({ user }),

  initFromLocalStorage: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        set({
          token,
          user: JSON.parse(user),
          isAuthenticated: true,
        });
      }
    }
  },
}));

export const useMealStore = create((set) => ({
  meals: [],
  selectedDate: new Date(),

  setMeals: (meals) => set({ meals }),
  addMeal: (meal) => set((state) => ({ meals: [...state.meals, meal] })),
  updateMeal: (id, meal) =>
    set((state) => ({
      meals: state.meals.map((m) => (m._id === id ? meal : m)),
    })),
  removeMeal: (id) =>
    set((state) => ({
      meals: state.meals.filter((m) => m._id !== id),
    })),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));

export const useExerciseStore = create((set) => ({
  exercises: [],
  selectedDate: new Date(),

  setExercises: (exercises) => set({ exercises }),
  addExercise: (exercise) => set((state) => ({ exercises: [...state.exercises, exercise] })),
  updateExercise: (id, exercise) =>
    set((state) => ({
      exercises: state.exercises.map((e) => (e._id === id ? exercise : e)),
    })),
  removeExercise: (id) =>
    set((state) => ({
      exercises: state.exercises.filter((e) => e._id !== id),
    })),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
