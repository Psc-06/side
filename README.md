# 🍛 Sideye - Ayurveda Food Scanner

A full-stack web application that helps users discover their perfect diet based on Ayurvedic principles. Select your dosha (body type) and get personalized food recommendations, nutritional analysis, and meal planning tips.

## ✨ Features

- **Dosha Selection**: Identify your body type (Vata, Pitta, or Kapha)
- **Food Database**: Browse 50+ Indian foods with detailed nutritional information
- **Compatibility Analysis**: See how each food affects your specific dosha
- **Smart Recommendations**: Get personalized food suggestions based on your body type
- **Search & Filter**: Find foods by name, thermic quality, or meal time
- **Meal Planning**: Daily meal plans tailored to your dosha
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Architecture

**Frontend**: React 19 + TypeScript + Vite  
**Backend**: Node.js + Express.js + SQLite3  
**Communication**: RESTful API with CORS

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ ([Download](https://nodejs.org/))
- npm or yarn

### Installation & Running

#### Option 1: Using Startup Script (Easiest)

**Windows (PowerShell):**

```powershell
.\start.ps1
```

**Windows (Command Prompt):**

```cmd
start.bat
```

This will automatically start both servers in separate windows.

#### Option 2: Manual Setup

**Terminal 1 - Backend:**

```powershell
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**

```powershell
npm install
npm run dev
```

Then open your browser to `http://localhost:5173`

## 📋 Project Structure

```
Sideye/
├── src/                          # Frontend (React)
│   ├── components/
│   │   ├── Home.tsx             # Home page & dosha selection
│   │   ├── Browse.tsx           # Food browsing with filters
│   │   ├── Recommendations.tsx  # Personalized recommendations
│   │   ├── Report.tsx           # Food analysis report
│   │   └── Scanner.tsx          # Meal scanner
│   ├── utils/
│   │   ├── apiClient.ts         # Backend API client (NEW)
│   │   └── ayurvedaCalculations.ts
│   ├── types/index.ts           # TypeScript interfaces
│   ├── data/indianFoods.json    # Food database
│   └── styles/                  # CSS stylesheets
├── backend/                      # Backend (Node.js/Express) [NEW]
│   ├── src/
│   │   ├── index.ts             # Express server
│   │   ├── db.ts                # SQLite initialization & queries
│   │   ├── routes.ts            # API endpoint definitions
│   │   ├── types.ts             # TypeScript interfaces
│   │   └── calculations.ts      # Ayurveda calculation logic
│   ├── package.json
│   └── README.md
├── SETUP_GUIDE.md               # Detailed setup instructions
├── API_DOCUMENTATION.md         # Complete API reference
├── start.bat                    # Windows batch startup script
├── start.ps1                    # PowerShell startup script
└── package.json
```

## 🌐 API Endpoints

### Foods

- `GET /api/foods` - Get all foods
- `GET /api/foods/:id` - Get single food
- `GET /api/foods/search/:query` - Search foods
- `GET /api/foods/dosha/:dosha` - Foods by dosha
- `GET /api/recommendations/:dosha` - Top 10 recommendations

### Analysis

- `POST /api/analyze` - Analyze food compatibility

### Profiles

- `GET /api/profile/:userId` - Get user profile
- `POST /api/profile` - Create/update profile

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete details.

## 🛠️ Technology Stack

### Frontend

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool with HMR
- **CSS3** - Styling

### Backend

- **Node.js** - Runtime
- **Express.js** - Web framework
- **SQLite3** - Database
- **CORS** - Cross-origin requests
- **TypeScript** - Type safety

## 📖 Available Scripts

### Frontend (Root)

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Backend

```bash
npm run dev      # Start with hot reload
npm run build    # Compile TypeScript
npm run start    # Run compiled JavaScript
npm run lint     # Run ESLint
```

## 🔧 Configuration

### Frontend Environment

Create `.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Backend Environment

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
DATABASE_PATH=./database.db
```

## 📱 Features Explained

### Dosha Selection (Home Page)

Learn about the three doshas and select yours:

- **Vata** 🌬️ - Air element, light and creative
- **Pitta** 🔥 - Fire element, hot and transformative
- **Kapha** 💧 - Water element, heavy and stable

### Food Analysis

Each food includes:

- Nutritional data (calories, carbs, protein, fats)
- Dosha impact scores
- Thermic quality (heating/cooling/neutral)
- Best time to eat
- Recommendations

### Compatibility System

Foods are rated as:

- ✅ **Good** - Balances your dosha
- ⚪ **Neutral** - Safe for your dosha
- ❌ **Avoid** - May aggravate your dosha

## 🐛 Troubleshooting

### Backend won't start

- Ensure port 5000 is available
- Check Node.js version: `node --version` (needs 16+)
- Delete `backend/database.db` and restart

### Frontend can't connect to backend

- Verify backend is running on port 5000
- Check `VITE_API_URL` in `.env.local`
- Clear browser cache

### Port already in use

- Windows: `netstat -ano | findstr :5000`
- Mac/Linux: `lsof -i :5000`
- Kill the process or change PORT in `.env`

## 📚 Learn More

- [Setup Guide](./SETUP_GUIDE.md) - Detailed setup instructions
- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [Ayurveda Info](https://en.wikipedia.org/wiki/Ayurveda)

## 🎯 Roadmap

- [ ] User authentication
- [ ] Save favorite foods
- [ ] Weekly meal plans
- [ ] Calorie tracking
- [ ] Mobile app (Capacitor)
- [ ] Recipe suggestions
- [ ] Community features

## 📝 Notes

- Frontend uses localStorage for client-side user preferences
- Backend automatically initializes database on first run
- All food data is seeded automatically
- No authentication required (for now)
- CORS is enabled for frontend development

## ⚖️ License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with React and Express.js
- Ayurvedic principles from traditional Indian medicine
- Food data sourced from Ayurvedic nutrition guidelines

---

**Version**: 1.0.0  
**Last Updated**: December 2024

Enjoy exploring Ayurvedic nutrition with Sideye! 🍛✨

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
