<<<<<<< HEAD
# Foodie - Food & Health Tracking Application

A comprehensive web application for tracking daily food intake, exercise, and health metrics. Built with modern development frameworks and designed with a clean, intuitive interface similar to Uber/Airbnb.

## Features

### 🍽️ Meal Tracking
- Add individual food items or create multi-food meals
- Classify meals as breakfast, lunch, dinner, snack, or dessert
- Search for food items with autocomplete functionality
- View detailed nutrition information (calories, protein, carbs, fat)
- Browse food items by category
- Edit or delete meal records

### 📅 Calendar & Daily Tracking
- Interactive calendar to select any day/month/year
- View daily calorie intake and burn summary
- Review previous days and make amendments
- Track daily calorie budget vs actual consumption
- Water intake logging
- Daily nutrition breakdown (macros)

### 💪 Exercise Tracking
- Log various exercise types (running, cycling, swimming, gym, yoga, HIIT, etc.)
- Track duration and intensity levels
- Calculate calories burned based on exercise and intensity
- Edit or delete exercise records
- View total daily calories burned

### 👤 User Profile
- Set personal health goals and daily calorie targets
- Configure activity level (sedentary to extremely active)
- Track physical metrics (height, weight, age, gender)
- Streamlined login with demo account for testing

### 📊 Analytics & Summaries
- Daily calorie balance (consumed vs burned)
- Nutrition macros breakdown
- Calorie budget tracking with visual progress
- Summary statistics for date ranges

## Tech Stack

### Frontend
- **Next.js** - React framework with server-side rendering
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **Axios** - HTTP client
- **React Icons** - Icon library
- **Date-fns** - Date manipulation

### Backend
- **Node.js & Express** - RESTful API server
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Project Structure

```
Foodie/
├── frontend/                 # Next.js web application
│   ├── pages/               # Next.js pages
│   │   ├── _app.js         # App wrapper
│   │   ├── index.js        # Home/redirect page
│   │   ├── login.js        # Login page
│   │   ├── dashboard.js    # Dashboard with daily summary
│   │   ├── tracker.js      # Meal tracking page
│   │   ├── exercises.js    # Exercise logging page
│   │   └── profile.js      # User profile page
│   ├── components/          # React components
│   │   ├── Navigation.js   # Top navigation bar
│   │   ├── DateSelector.js # Date navigation
│   │   ├── FoodSelector.js # Food search and selection
│   │   ├── MealCard.js     # Meal display card
│   │   ├── ExerciseCard.js # Exercise display card
│   │   ├── StatsCard.js    # Stats display card
│   │   └── ProtectedRoute.js # Authentication guard
│   ├── lib/
│   │   ├── api.js          # API client functions
│   │   ├── store.js        # Zustand stores
│   │   └── utils.js        # Utility functions
│   ├── styles/
│   │   └── globals.css     # Global styles
│   ├── public/             # Static assets
│   └── package.json
│
├── backend/                 # Express.js API server
│   ├── config/
│   │   ├── database.js     # MongoDB connection
│   │   └── defaultFoods.json # Default food database
│   ├── models/             # Mongoose schemas
│   │   ├── User.js
│   │   ├── Food.js
│   │   ├── Meal.js
│   │   ├── Exercise.js
│   │   └── DailyLog.js
│   ├── controllers/        # Business logic
│   │   ├── authController.js
│   │   ├── foodController.js
│   │   ├── mealController.js
│   │   ├── exerciseController.js
│   │   └── dailyLogController.js
│   ├── routes/            # API endpoints
│   │   ├── auth.js
│   │   ├── foods.js
│   │   ├── meals.js
│   │   ├── exercises.js
│   │   └── dailyLogs.js
│   ├── middleware/        # Express middleware
│   │   └── auth.js        # JWT authentication
│   ├── server.js          # Express app setup
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   ```

4. **Start MongoDB**
   ```bash
   # On Windows
   mongod
   
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Linux
   sudo systemctl start mongod
   ```

5. **Run backend server**
   ```bash
   npm run dev
   # Backend will run on http://localhost:5000
   ```

### Frontend Setup

1. **Navigate to frontend directory** (in a new terminal)
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   The `.env.local` file is already configured to use `http://localhost:5000/api`

4. **Start development server**
   ```bash
   npm run dev
   # Frontend will run on http://localhost:3000
   ```

## API Endpoints

### Authentication
- `POST /api/auth/demo-login` - Demo login (streamless for testing)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Foods
- `GET /api/foods` - Get all foods with pagination
- `GET /api/foods/search?q=apple` - Search foods
- `GET /api/foods/category/:category` - Foods by category
- `GET /api/foods/:id` - Get food details
- `POST /api/foods` - Add food (admin)

### Meals
- `POST /api/meals` - Create meal (protected)
- `GET /api/meals/by-date?date=2024-01-22` - Get meals by date (protected)
- `GET /api/meals/date-range` - Get meals by date range (protected)
- `PUT /api/meals/:id` - Update meal (protected)
- `DELETE /api/meals/:id` - Delete meal (protected)

### Exercises
- `POST /api/exercises` - Create exercise (protected)
- `GET /api/exercises/by-date?date=2024-01-22` - Get exercises by date (protected)
- `GET /api/exercises/date-range` - Get exercises by date range (protected)
- `PUT /api/exercises/:id` - Update exercise (protected)
- `DELETE /api/exercises/:id` - Delete exercise (protected)

### Daily Logs
- `GET /api/daily-logs/single?date=2024-01-22` - Get daily log (protected)
- `GET /api/daily-logs/range` - Get logs by date range (protected)
- `PUT /api/daily-logs/water` - Update water intake (protected)
- `GET /api/daily-logs/stats` - Get summary statistics (protected)

## Database Schema

### Users
```javascript
{
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  age: Number,
  gender: String,
  height: Number (cm),
  weight: Number (kg),
  dailyCalorieGoal: Number (default: 2000),
  activityLevel: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Foods
```javascript
{
  name: String (unique),
  category: String,
  servingSize: { amount: Number, unit: String },
  calories: Number,
  protein: Number (g),
  carbohydrates: Number (g),
  fat: Number (g),
  fiber: Number (g),
  imageUrl: String,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Meals
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  mealType: String (breakfast, lunch, dinner, snack, dessert),
  foods: [{ foodId: ObjectId, quantity: Number }],
  totalCalories: Number,
  totalProtein: Number,
  totalCarbs: Number,
  totalFat: Number,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Exercises
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  exerciseType: String,
  duration: Number (minutes),
  intensity: String (low, moderate, high),
  caloriesBurnt: Number,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### DailyLogs
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  meals: [ObjectId],
  exercises: [ObjectId],
  totalCaloriesConsumed: Number,
  totalCaloriesBurnt: Number,
  netCalories: Number,
  waterIntake: Number (liters),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Usage Guide

### 1. **Streamless Login**
- Open http://localhost:3000
- Click "Continue with Demo Account"
- You're instantly logged in with a demo account

### 2. **Log a Meal**
- Go to Tracker page
- Select meal type (breakfast, lunch, etc.)
- Search for foods by name or category
- Add quantities and create meal
- View daily total calories

### 3. **Log Exercise**
- Go to Exercises page
- Click "Add Exercise"
- Select exercise type and duration
- System auto-calculates calories burned
- Adjust if needed and save

### 4. **View Daily Summary**
- Dashboard shows real-time calorie balance
- See consumed vs burned calories
- Visual progress bar for daily budget
- Click meal/exercise cards to edit or delete

### 5. **Navigate Days**
- Use arrow buttons to go to previous/next day
- Click "Today" to return to current day
- View history for any past date
- Amend entries as needed

## UI/UX Design Principles

- **Clean & Minimal**: Similar to Uber/Airbnb design language
- **Fast & Responsive**: Mobile-first design
- **Intuitive Navigation**: Easy access to all features
- **Visual Feedback**: Color-coded meal types and stats
- **Stock Images**: Food images from Unsplash for visual appeal
- **Accessibility**: Semantic HTML and keyboard navigation

## Additional Features & Enhancements

### Potential Future Additions
1. **Barcode Scanner** - Scan product barcodes to auto-add foods
2. **Social Features** - Share progress with friends
3. **Recipe Builder** - Save custom meal combinations
4. **Nutrition Goals** - Set macro targets (protein, carbs, fat)
5. **Mobile App** - React Native version
6. **Notifications** - Reminders to log meals/exercise
7. **Export Data** - PDF reports and CSV export
8. **Integration** - Fitbit, Apple Health, Google Fit
9. **AI Recommendations** - Personalized meal and exercise suggestions
10. **Progress Charts** - Weight and calorie trend graphs
11. **Community** - Share recipes and meal ideas
12. **Restaurants** - Quick add from restaurant menus

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in backend .env file
- Verify connection string format: `mongodb://localhost:27017/foodie`

### Frontend Can't Connect to API
- Check backend server is running on port 5000
- Verify `NEXT_PUBLIC_API_URL` in frontend .env.local
- Check CORS is enabled in backend

### Demo Login Not Working
- Ensure backend server is running
- Check MongoDB is connected
- Clear browser cache and try again

## Development Workflow

### Making Changes
1. Backend changes auto-reload with nodemon
2. Frontend changes auto-refresh with Next.js hot reload
3. Use browser DevTools for debugging
4. Check server logs for API errors

### Testing
- Demo account has all features enabled
- Test all CRUD operations (Create, Read, Update, Delete)
- Verify date navigation works correctly
- Check calorie calculations are accurate

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

### Backend (Heroku/Railway)
1. Set production MongoDB URI
2. Change JWT_SECRET to secure value
3. Deploy to hosting platform
4. Update frontend API URL

## License

This project is created for personal use.

## Support

For issues or questions, contact the development team.

---

**Last Updated**: January 22, 2026
**Version**: 1.0.0
=======
# foodie
>>>>>>> 9087e121d8a1c46a93bf79d4d54ed38b4b4e630d
