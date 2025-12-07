# Sideye - Full Integration Complete

Your backend server now serves the complete frontend application!

## 🚀 Quick Start

### Production Mode (Single Server)

Build everything and run the backend server:

```powershell
# Build frontend (creates dist folder)
npm run build

# Build backend
cd backend
npm run build

# Start the server
npm start
```

Then access the app at: **http://localhost:5000**

### Development Mode (Separate Servers)

Run frontend and backend separately for faster development:

**Terminal 1 - Backend:**

```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```powershell
npm run dev
```

Frontend will be at: **http://localhost:5173**  
Backend API: **http://localhost:5000/api** (configure in apiClient.ts if needed)

## 📁 How It Works

1. **Frontend Build**: `npm run build` creates a `dist` folder with the compiled React app
2. **Backend Serving**: The backend server (`/backend/src/index.ts`) serves these static files
3. **API Routes**: All `/api/*` routes go to the backend API
4. **SPA Routing**: All other routes serve `index.html` so React Router works correctly

## 🎯 What You Can Do Now

### Option 1: Run Single Combined Server (Production)

- One server runs everything
- Backend serves the frontend
- All features work together
- Perfect for deployment

### Option 2: Run Separate Servers (Development)

- Frontend: `npm run dev` (port 5173)
- Backend: `cd backend && npm run dev` (port 5000)
- Faster reloads during development
- But you need both terminals running

## 📊 File Structure

```
Sideye/
├── dist/                    # Frontend build output (created by npm run build)
│   ├── index.html
│   ├── assets/
│   └── ...
├── src/                     # Frontend React source
├── backend/
│   ├── dist/               # Backend build output (created by npm run build)
│   ├── src/
│   │   └── index.ts        # Serves dist/ folder as static files
│   └── database.db         # SQLite database
└── package.json
```

## 🔧 Commands

### Frontend

```bash
npm run dev       # Start development server on port 5173
npm run build     # Build for production (creates dist/)
npm run preview   # Preview production build
npm run lint      # Check for errors
```

### Backend

```bash
cd backend
npm run dev       # Start with hot reload on port 5000
npm run build     # Compile TypeScript to JavaScript
npm start         # Run compiled JavaScript
npm run lint      # Check for errors
```

## ✨ Features Working

✅ Backend API at `/api/*`  
✅ Frontend served from root `/`  
✅ All pages and navigation working  
✅ Database initialization  
✅ Food data synchronization  
✅ User profiles  
✅ All filters and searches

## 🌐 Access Points

When running **single combined server**:

- Home page: `http://localhost:5000`
- API: `http://localhost:5000/api`
- Any page: `http://localhost:5000` (React handles routing)

When running **separate servers**:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

## 📝 Next Steps

1. **For Development:**

   ```powershell
   npm run dev           # Terminal 1: Frontend
   cd backend; npm run dev  # Terminal 2: Backend
   ```

2. **For Testing/Deployment:**

   ```powershell
   npm run build        # Build frontend
   cd backend
   npm run build       # Build backend
   npm start           # Run production server
   ```

3. **Access:** `http://localhost:5000`

## 🎓 How to Deploy

When deploying to a server:

1. Build both frontend and backend: `npm run build && cd backend && npm run build`
2. Upload the `dist/` and `backend/dist/` folders
3. Run the backend: `node backend/dist/index.js`
4. Access on your domain: `https://yourdomain.com`

---

Everything is now integrated! You have a full-stack app with a single Node.js backend server serving the React frontend. 🎉
