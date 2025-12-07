# Sideye Backend

Node.js/Express backend server for the Ayurveda Food Scanner application.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file from `.env.example`:

```bash
copy .env.example .env
```

3. Start the development server:

```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Foods

- `GET /api/foods` - Get all foods
- `GET /api/foods/:id` - Get food by ID
- `GET /api/foods/search/:query` - Search foods by name or description
- `GET /api/foods/dosha/:dosha` - Get foods ranked by dosha compatibility
- `GET /api/recommendations/:dosha` - Get top 10 recommended foods for a dosha

### Analysis

- `POST /api/analyze` - Analyze food compatibility
  ```json
  {
    "foodId": 1,
    "dosha": "Vata"
  }
  ```

### User Profiles

- `GET /api/profile/:userId` - Get user profile
- `POST /api/profile` - Create or update user profile
  ```json
  {
    "userId": "user123",
    "dosha": "Vata"
  }
  ```

### Health

- `GET /health` - Server health check

## Database

Uses SQLite3 with automatic initialization. Database file is created at `database.db`.

## Building

```bash
npm run build
npm start
```

## Development

TypeScript with ESM support. All source files are in `src/` directory.
