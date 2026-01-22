import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  demoLogin: () => apiClient.post('/auth/demo-login'),
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
};

export const foodAPI = {
  getAllFoods: (page = 1, limit = 20) => apiClient.get(`/foods?page=${page}&limit=${limit}`),
  searchFoods: (query) => apiClient.get(`/foods/search?q=${query}`),
  getFoodsByCategory: (category) => apiClient.get(`/foods/category/${category}`),
  getFoodById: (id) => apiClient.get(`/foods/${id}`),
  addFood: (data) => apiClient.post('/foods', data),
};

export const mealAPI = {
  createMeal: (data) => apiClient.post('/meals', data),
  getMealsByDate: (date) => apiClient.get(`/meals/by-date?date=${date}`),
  getMealsByDateRange: (startDate, endDate) =>
    apiClient.get(`/meals/date-range?startDate=${startDate}&endDate=${endDate}`),
  updateMeal: (id, data) => apiClient.put(`/meals/${id}`, data),
  deleteMeal: (id) => apiClient.delete(`/meals/${id}`),
};

export const exerciseAPI = {
  createExercise: (data) => apiClient.post('/exercises', data),
  getExercisesByDate: (date) => apiClient.get(`/exercises/by-date?date=${date}`),
  getExercisesByDateRange: (startDate, endDate) =>
    apiClient.get(`/exercises/date-range?startDate=${startDate}&endDate=${endDate}`),
  updateExercise: (id, data) => apiClient.put(`/exercises/${id}`, data),
  deleteExercise: (id) => apiClient.delete(`/exercises/${id}`),
};

export const dailyLogAPI = {
  getDailyLog: (date) => apiClient.get(`/daily-logs/single?date=${date}`),
  getDailyLogs: (startDate, endDate) =>
    apiClient.get(`/daily-logs/range?startDate=${startDate}&endDate=${endDate}`),
  updateWaterIntake: (date, waterIntake) =>
    apiClient.put('/daily-logs/water', { date, waterIntake }),
  getSummaryStats: (startDate, endDate) =>
    apiClient.get(`/daily-logs/stats?startDate=${startDate}&endDate=${endDate}`),
};

export default apiClient;
