# Foodie Development Guide

## Quick Start

### Terminal 1: Start Backend
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:5000
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:3000
```

### Browser
1. Open http://localhost:3000
2. Click "Continue with Demo Account"
3. Start tracking!

## Key Technologies

- **Next.js** - Modern React framework
- **Express** - Lightweight Node.js server
- **MongoDB** - NoSQL database
- **Tailwind CSS** - Utility CSS framework
- **Zustand** - Simple state management
- **JWT** - Secure authentication

## Database Auto-Setup

On first backend run:
- MongoDB connects automatically
- Default food items are loaded from `backend/config/defaultFoods.json`
- Demo user is created on first login

## File Structure Overview

**Backend:**
- `routes/` - API endpoints
- `models/` - Database schemas
- `controllers/` - Business logic
- `config/` - Database and configuration
- `server.js` - Entry point

**Frontend:**
- `pages/` - Next.js pages (routes)
- `components/` - Reusable React components
- `lib/` - API client and utilities
- `styles/` - CSS files

## Common Tasks

### Add New Food Item
Edit `backend/config/defaultFoods.json` and restart server, or:
```javascript
// Use API: POST /api/foods
{
  "name": "Chicken",
  "category": "meat",
  "servingSize": { "amount": 100, "unit": "g" },
  "calories": 165,
  ...
}
```

### Change Daily Calorie Goal
User Profile page → Edit Profile → Set Daily Calorie Goal

### Modify Calorie Calculation
Edit `backend/controllers/exerciseController.js` in `calculateAndUpdateCalories()` function

### Change Design Colors
Edit `frontend/tailwind.config.js` or `frontend/styles/globals.css`

## API Response Format

### Success Response
```json
{
  "data": { ... }
}
```

### Error Response
```json
{
  "message": "Error description"
}
```

## Testing Checklist

- [ ] Demo login works
- [ ] Can add meals
- [ ] Can search foods
- [ ] Can add exercises
- [ ] Can navigate dates
- [ ] Can edit/delete meals
- [ ] Can view dashboard
- [ ] Can update profile
- [ ] Calorie calculations are correct
- [ ] Water intake tracking works

## Helpful Commands

```bash
# Backend
npm start          # Start production server
npm run dev        # Start with hot reload
npm install        # Install dependencies

# Frontend
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Check code quality

# MongoDB (if using local)
mongod             # Start MongoDB service
```

## Debugging Tips

1. **Check Backend Logs** - Look for errors in backend terminal
2. **Check Console** - Open DevTools (F12) in browser
3. **Network Tab** - Check API responses in Network tab
4. **Storage** - Check LocalStorage for token
5. **Database** - Use MongoDB Compass to view data

## Next Steps for Enhancement

1. Add edit meal/exercise modals
2. Add more food items to database
3. Implement push notifications
4. Add data export (PDF/CSV)
5. Create admin panel
6. Add social features
7. Mobile app version
8. Performance optimizations
9. Better error handling
10. Unit tests

---

Happy coding! 🚀
