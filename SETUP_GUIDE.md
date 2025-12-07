# Sideye - Ayurveda Food Scanner

Full-stack application with React frontend and Node.js/Express backend.

## 📁 Project Structure

```
Sideye-main/
├── src/                    # Frontend (React + TypeScript)
│   ├── components/        # React components
│   ├── utils/
│   │   ├── apiClient.ts   # Backend API client (NEW)
│   │   └── ayurvedaCalculations.ts
│   ├── data/              # Food data
│   └── ...
├── backend/               # Backend server (NEW)
│   ├── src/
│   │   ├── index.ts       # Express server
│   │   ├── db.ts          # SQLite database
│   │   ├── routes.ts      # API routes
│   │   ├── types.ts       # TypeScript types
│   │   └── calculations.ts
│   ├── package.json
│   └── README.md
├── package.json           # Frontend dependencies
└── ...
```

## 🚀 Quick Start

### 1. Setup Backend

```powershell
cd backend
npm install
npm run dev
```

The backend will start on `http://localhost:5000`

### 2. Setup Frontend (New Terminal)

```powershell
# From root directory
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` (or similar)

## 📋 Features

### Frontend

- ✅ Dosha selection (Vata, Pitta, Kapha)
- ✅ Food browsing with filters
- ✅ Food compatibility analysis
- ✅ Personalized recommendations
- ✅ Meal scanner

### Backend

- ✅ REST API for food data
- ✅ SQLite database with food items
- ✅ User profile management
- ✅ Food compatibility calculations
- ✅ Recommendation engine
- ✅ CORS support for frontend

## 📡 API Endpoints

### Foods

- `GET /api/foods` - All foods
- `GET /api/foods/:id` - Single food
- `GET /api/foods/search/:query` - Search foods
- `GET /api/foods/dosha/:dosha` - Foods by dosha
- `GET /api/recommendations/:dosha` - Top recommendations

### Analysis

- `POST /api/analyze` - Analyze food compatibility

### Users

- `GET /api/profile/:userId` - Get user profile
- `POST /api/profile` - Create/update profile

### Health

- `GET /health` - Server status

## 🔧 Environment Variables

### Frontend (.env.local)

```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)

```
PORT=5000
NODE_ENV=development
DATABASE_PATH=./database.db
```

## 🛠️ Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- CSS3

### Backend

- Node.js
- Express.js
- SQLite3
- CORS middleware

## 📦 Build & Deploy

### Frontend Build

```powershell
npm run build
npm run preview
```

### Backend Build

```powershell
cd backend
npm run build
npm start
```

## 🐛 Troubleshooting

### Backend won't start

- Check port 5000 is not in use
- Verify Node.js is installed: `node --version`
- Check database path permissions

### Frontend can't connect to API

- Ensure backend is running on port 5000
- Check `VITE_API_URL` in `.env.local`
- Open browser console for error details

### Database issues

- Delete `backend/database.db` to reset
- Check write permissions in backend directory

## 📝 Development Notes

- Frontend uses localStorage for client-side user preferences
- Backend auto-initializes SQLite database on first run
- Food data is seeded automatically if database is empty
- API responses include comprehensive food nutrition data

## 🎯 Next Steps

1. Start both servers (backend first, then frontend)
2. Access app at `http://localhost:5173`
3. Select your dosha type
4. Browse foods and get recommendations
5. Analyze food compatibility for your body type

Enjoy exploring Ayurvedic nutrition with Sideye! 🍛
