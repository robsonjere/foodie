# Foodie Application Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USER'S BROWSER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Next.js React App                       │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Pages:                                        │  │  │
│  │  │  - Login          (Streamless auth)            │  │  │
│  │  │  - Dashboard      (Daily summary)              │  │  │
│  │  │  - Tracker        (Meal logging)               │  │  │
│  │  │  - Exercises      (Workout logging)            │  │  │
│  │  │  - Profile        (Settings)                   │  │  │
│  │  │                                                │  │  │
│  │  │  Components:                                   │  │  │
│  │  │  - Navigation     (Top bar)                    │  │  │
│  │  │  - DateSelector   (Calendar navigation)        │  │  │
│  │  │  - FoodSelector   (Search & select)            │  │  │
│  │  │  - Cards          (Display data)               │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  State Management:                             │  │  │
│  │  │  - Auth Store     (User session)               │  │  │
│  │  │  - Meal Store     (Meal data)                  │  │  │
│  │  │  - Exercise Store (Workout data)               │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Styling:                                      │  │  │
│  │  │  - Tailwind CSS  (Utility classes)             │  │  │
│  │  │  - Global CSS    (Custom styles)               │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS (Axios)
                            │
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS API SERVER                    │
│                    (http://localhost:5000)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Routes:                                             │  │
│  │  ├─ /api/auth      (Login, profile, register)        │  │
│  │  ├─ /api/foods     (Search, list, manage)            │  │
│  │  ├─ /api/meals     (Create, read, update, delete)    │  │
│  │  ├─ /api/exercises (Create, read, update, delete)    │  │
│  │  └─ /api/daily-logs (Summary, stats, water)          │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Controllers:                                        │  │
│  │  ├─ authController      (Authentication)            │  │
│  │  ├─ foodController      (Food operations)           │  │
│  │  ├─ mealController      (Meal operations)           │  │
│  │  ├─ exerciseController  (Exercise operations)       │  │
│  │  └─ dailyLogController  (Daily operations)          │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Middleware:                                         │  │
│  │  ├─ auth.js        (JWT verification)               │  │
│  │  └─ CORS           (Cross-origin support)           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ MongoDB Driver
                            │
┌─────────────────────────────────────────────────────────────┐
│                      MONGODB DATABASE                       │
│                                                             │
│  Collections:                                              │
│  ├─ users          (User accounts, auth, settings)         │
│  ├─ foods          (Food items, nutrition info)            │
│  ├─ meals          (Meal logs, food combinations)          │
│  ├─ exercises      (Exercise logs, workouts)               │
│  └─ dailylogs      (Daily summaries, totals)               │
│                                                             │
│  Indexes:                                                  │
│  ├─ foods: text index (for fast search)                    │
│  └─ dailylogs: userId + date index (for queries)           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📡 Data Flow Examples

### Example 1: User Logs a Meal

```
User clicks "Add Meal"
         ↓
FoodSelector component opens
         ↓
User types "apple" in search
         ↓
Frontend: GET /api/foods/search?q=apple
         ↓
Backend: Query MongoDB foods collection (text index)
         ↓
Return matching foods with images
         ↓
User selects apple + yogurt
         ↓
Frontend: POST /api/meals
  {
    date: "2024-01-22",
    mealType: "breakfast",
    foods: [
      { foodId: "apple_id", quantity: 1 },
      { foodId: "yogurt_id", quantity: 1 }
    ]
  }
         ↓
Backend: Calculates totals
  - totalCalories = 52 + 59 = 111
  - totalProtein = 0.3 + 10 = 10.3
  - (etc)
         ↓
Saves to MongoDB meals collection
         ↓
Updates DailyLog with new totals
         ↓
Returns saved meal to frontend
         ↓
Frontend: Updates UI with new meal
         ↓
User sees meal in Tracker page
```

### Example 2: User Logs Exercise

```
User goes to Exercises page
         ↓
Clicks "Add Exercise"
         ↓
Selects: Running, 30 minutes, Moderate intensity
         ↓
Frontend calculates: 30 min × 12 cal/min = 360 calories
         ↓
User clicks "Save Exercise"
         ↓
Frontend: POST /api/exercises
  {
    date: "2024-01-22",
    exerciseType: "running",
    duration: 30,
    intensity: "moderate",
    caloriesBurnt: 360
  }
         ↓
Backend: Saves to MongoDB exercises collection
         ↓
Backend: Updates DailyLog
  - totalCaloriesBurnt += 360
  - netCalories = consumed - burned
         ↓
Frontend: Refreshes daily summary
         ↓
User sees "360 cal burned" in dashboard
```

### Example 3: User Views Daily Summary

```
User opens Dashboard
         ↓
Frontend: GET /api/daily-logs/single?date=2024-01-22
         ↓
Backend: Queries DailyLog collection for this date
         ↓
If exists: Return populated daily log
If not: Create new one with zero values
         ↓
Populate with referenced meals and exercises
         ↓
Return:
  {
    totalCaloriesConsumed: 2100,
    totalCaloriesBurnt: 500,
    netCalories: 1600,
    meals: [...],
    exercises: [...]
  }
         ↓
Frontend: Displays stats cards
         ↓
Shows progress bar: 2100/2000 = 105%
         ↓
Shows "Exceeded by 100 calories"
```

---

## 🔐 Authentication Flow

```
User opens app
         ↓
Check localStorage for token
         ↓
Token exists?
  │
  ├─ YES → Store in memory, show dashboard
  │
  └─ NO → Redirect to login page
         ↓
User clicks "Continue with Demo Account"
         ↓
Frontend: POST /api/auth/demo-login
         ↓
Backend: 
  1. Check if demo@foodie.app exists
  2. If not, create demo user
  3. Generate JWT token
  4. Return token + user data
         ↓
Frontend: Store token in localStorage
         ↓
Frontend: Store user in auth store
         ↓
Redirect to dashboard
         ↓
All future API calls include token in header:
Authorization: Bearer <token>
         ↓
Backend: middleware validates token
         ↓
Valid? → Process request
Invalid? → Return 403 error
```

---

## 📊 Database Schema Relationships

```
┌─────────────┐
│    Users    │
│  ┌─────────┤
│  │ _id     │
│  │ email   │
│  │ name    │
│  │ goals   │
│  └─────────┤
└──────┬──────┘
       │ 1-to-many
       │
    ┌──┴────────────┬──────────────┐
    │               │              │
┌───▼────┐  ┌──────▼────┐  ┌───────▼──┐
│ Meals  │  │ Exercises │  │ DailyLog │
│ ┌────┐ │  │ ┌───────┐ │  │ ┌──────┐ │
│ │ uid│◄┼──┼─│ uid   │ │  │ │ uid  │◄┼─┐
│ │date│ │  │ │ date  │ │  │ │ date │ │ │
│ │type│ │  │ │ type  │ │  │ │meals │◄┼─┴─ many references
│ │food│ │  │ │ mins  │ │  │ │excs  │◄┼─┐
│ │cals│ │  │ │ cals  │ │  │ │ cals │ │ │
│ └────┘ │  │ │ burned│ │  │ │consumed
│        │  │ │       │ │  │ │netcals
└────┬───┘  │ └───────┘ │  │ │water
     │      │           │  │ └──────┘
     │      │           │  │
     │      └───────────┴──┘
     │ many-to-many
     │
┌────▼───┐
│ Foods  │
│ ┌────┐ │
│ │name│ │
│ │cat │ │
│ │cals│ │
│ │img │ │
│ │nutr│ │
│ └────┘ │
└────────┘
```

---

## 🔄 State Management Flow

```
User Action (e.g., add meal)
         ↓
React Component (e.g., FoodSelector)
         ↓
Call API function from lib/api.js
         ↓
API makes HTTP request to backend
         ↓
Backend processes, updates MongoDB
         ↓
Returns response to frontend
         ↓
Component updates Zustand store
         ↓
Store notifies all subscribed components
         ↓
Components re-render with new data
         ↓
UI updates (meal appears in list)
```

---

## 🎯 Component Hierarchy

```
App (_app.js)
├── Auth Store (Zustand)
├── Login Page
│   └── Auth Form
└── Protected Routes
    ├── Navigation
    ├── Dashboard
    │   ├── DateSelector
    │   ├── StatsCard (x4)
    │   └── Quick Action Buttons
    ├── Tracker
    │   ├── DateSelector
    │   ├── FoodSelector
    │   └── MealCard (x many)
    ├── Exercises
    │   ├── DateSelector
    │   ├── Exercise Form
    │   └── ExerciseCard (x many)
    └── Profile
        └── Profile Form
```

---

## ⚡ Performance Optimizations

```
Request Optimization:
├─ MongoDB Text Index
│  └─ Fast food search
├─ Pagination
│  └─ Load foods in batches
├─ Compound Index (userId + date)
│  └─ Fast daily log queries
└─ Token Caching
   └─ Reduce auth calls

Frontend Optimization:
├─ Next.js Code Splitting
│  └─ Load only needed JS
├─ Image Optimization
│  └─ Unsplash remote images
├─ CSS Purging
│  └─ Tailwind minification
└─ State Caching
   └─ Zustand memoization
```

---

## 🔌 API Request/Response Pattern

### Request Format
```javascript
// Frontend sends
{
  method: 'POST',
  url: 'http://localhost:5000/api/meals',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGc...'
  },
  data: {
    date: '2024-01-22',
    mealType: 'breakfast',
    foods: [...]
  }
}
```

### Response Format
```javascript
// Backend returns
{
  _id: '507f1f77bcf86cd799439011',
  userId: '507f1f77bcf86cd799439010',
  date: '2024-01-22T00:00:00Z',
  mealType: 'breakfast',
  foods: [
    {
      foodId: '507f1f77bcf86cd799439012',
      quantity: 1
    }
  ],
  totalCalories: 111,
  totalProtein: 10.3,
  totalCarbs: 37,
  totalFat: 0.6,
  createdAt: '2024-01-22T10:30:00Z',
  updatedAt: '2024-01-22T10:30:00Z'
}
```

---

## 🗄️ Database Query Examples

### Find user's meals for today
```javascript
db.meals.find({
  userId: ObjectId("..."),
  date: {
    $gte: ISODate("2024-01-22T00:00:00Z"),
    $lte: ISODate("2024-01-22T23:59:59Z")
  }
})
```

### Search foods (text index)
```javascript
db.foods.find(
  { $text: { $search: "apple" } },
  { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } })
```

### Get daily totals
```javascript
db.dailylogs.findOne({
  userId: ObjectId("..."),
  date: ISODate("2024-01-22")
})
```

---

## 📈 Scaling Considerations

```
Current Setup (Development):
├─ Local MongoDB
├─ Express on port 5000
├─ Next.js dev server
└─ No external services

Production Setup:
├─ MongoDB Atlas (cloud)
├─ Heroku/Railway (backend)
├─ Vercel (frontend)
├─ AWS S3 (image storage)
├─ CDN (asset delivery)
└─ Analytics tracking
```

---

This architecture supports:
- ✅ Multi-user concurrent access
- ✅ Real-time data updates
- ✅ Easy scaling horizontally
- ✅ Clear separation of concerns
- ✅ RESTful API design
- ✅ Secure authentication
- ✅ Efficient data queries

**Everything is ready to grow! 🚀**
