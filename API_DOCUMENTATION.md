# Sideye API Documentation

Complete reference for the Sideye backend REST API.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Currently, no authentication is required. All endpoints are public.

---

## Foods Endpoints

### Get All Foods

```
GET /foods
```

Returns all foods in the database.

**Response:**

```json
[
  {
    "id": 1,
    "name": "Dal (Lentil Curry)",
    "calories": 206,
    "carbs": 36,
    "protein": 18,
    "fats": 1,
    "vata": -2,
    "pitta": -1,
    "kapha": 2,
    "thermicQuality": "neutral",
    "bestTime": "lunch",
    "description": "Traditional lentil curry, protein-rich and grounding",
    "recommendations": "Excellent for all body types. Pair with warm rice for better digestion."
  },
  ...
]
```

---

### Get Single Food

```
GET /foods/:id
```

Returns a specific food by ID.

**Parameters:**

- `id` (integer, required) - Food ID

**Response:**

```json
{
  "id": 1,
  "name": "Dal (Lentil Curry)",
  ...
}
```

**Error Responses:**

- `404 Not Found` - Food not found

---

### Search Foods

```
GET /foods/search/:query
```

Search foods by name or description.

**Parameters:**

- `query` (string, required) - Search term (URL encoded)

**Example:**

```
GET /foods/search/dal
```

**Response:** Array of matching foods

---

### Get Foods by Dosha

```
GET /foods/dosha/:dosha
```

Get all foods ranked by compatibility with a specific dosha.

**Parameters:**

- `dosha` (string, required) - One of: `Vata`, `Pitta`, `Kapha`

**Example:**

```
GET /foods/dosha/Vata
```

**Response:** Foods sorted by dosha score (highest to lowest)

---

### Get Recommendations

```
GET /recommendations/:dosha
```

Get top 10 recommended foods for a specific dosha.

**Parameters:**

- `dosha` (string, required) - One of: `Vata`, `Pitta`, `Kapha`

**Example:**

```
GET /recommendations/Pitta
```

**Response:**

```json
[
  {
    "food": { /* food object */ },
    "compatibility": "good",
    "message": "✓ Excellent for your Pitta type! ..."
  },
  ...
]
```

---

## Analysis Endpoints

### Analyze Food Compatibility

```
POST /analyze
```

Analyze how compatible a specific food is for a dosha.

**Request Body:**

```json
{
  "foodId": 1,
  "dosha": "Vata"
}
```

**Response:**

```json
{
  "food": {
    /* food object */
  },
  "compatibility": "good",
  "message": "✓ Excellent for your Vata type! Excellent for all body types. Pair with warm rice for better digestion."
}
```

**Compatibility Levels:**

- `good` - Recommended for this dosha
- `neutral` - Safe for this dosha
- `avoid` - Should limit for this dosha

---

## User Profile Endpoints

### Get User Profile

```
GET /profile/:userId
```

Retrieve a user's saved profile.

**Parameters:**

- `userId` (string, required) - Unique user identifier

**Response:**

```json
{
  "id": 1,
  "userId": "user123",
  "dosha": "Vata",
  "createdAt": "2024-12-07T10:30:00.000Z",
  "updatedAt": "2024-12-07T10:30:00.000Z"
}
```

**Error Responses:**

- `404 Not Found` - Profile not found

---

### Create/Update User Profile

```
POST /profile
```

Create a new user profile or update an existing one.

**Request Body:**

```json
{
  "userId": "user123",
  "dosha": "Pitta"
}
```

**Response:**

```json
{
  "id": 1,
  "userId": "user123",
  "dosha": "Pitta",
  "createdAt": "2024-12-07T10:30:00.000Z",
  "updatedAt": "2024-12-07T11:45:00.000Z"
}
```

**Parameters:**

- `userId` (string, required) - Unique user identifier
- `dosha` (string, optional) - One of: `Vata`, `Pitta`, `Kapha`, or `null`

---

## Health Endpoint

### Server Health Check

```
GET /health
```

Check if the server is running.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-12-07T10:30:00.000Z"
}
```

---

## Data Models

### FoodItem

```typescript
interface FoodItem {
  id: number;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  vata: number; // Score for Vata (lower is better)
  pitta: number; // Score for Pitta (lower is better)
  kapha: number; // Score for Kapha (lower is better)
  thermicQuality: "heating" | "cooling" | "neutral";
  bestTime: string; // "breakfast", "lunch", "dinner", "snack"
  description: string;
  recommendations: string;
}
```

### FoodReport

```typescript
interface FoodReport {
  food: FoodItem;
  compatibility: "good" | "neutral" | "avoid";
  message: string;
}
```

### UserProfile

```typescript
interface UserProfile {
  id?: number;
  userId: string;
  dosha: "Vata" | "Pitta" | "Kapha" | null;
  createdAt?: string;
  updatedAt?: string;
}
```

---

## Error Handling

All errors return JSON with an error message:

```json
{
  "error": "Description of what went wrong"
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `400 Bad Request` - Missing or invalid parameters
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Example Usage

### Using Fetch API (JavaScript/TypeScript)

```typescript
// Get all foods
const foods = await fetch("http://localhost:5000/api/foods").then((r) =>
  r.json()
);

// Search foods
const results = await fetch("http://localhost:5000/api/foods/search/rice").then(
  (r) => r.json()
);

// Analyze food compatibility
const analysis = await fetch("http://localhost:5000/api/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ foodId: 1, dosha: "Vata" }),
}).then((r) => r.json());

// Get recommendations
const recommendations = await fetch(
  "http://localhost:5000/api/recommendations/Pitta"
).then((r) => r.json());

// Save user profile
const profile = await fetch("http://localhost:5000/api/profile", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ userId: "user123", dosha: "Kapha" }),
}).then((r) => r.json());
```

---

## CORS

The API includes CORS middleware. Requests from any origin are allowed.

Headers:

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

---

## Database

- **Type:** SQLite3
- **Location:** `backend/database.db`
- **Auto-initialization:** Yes (creates tables and seeds data on first run)

---

## Rate Limiting

Currently, no rate limiting is implemented. This should be added before production deployment.

---

## Versioning

Current API Version: `1.0.0`

Future versions will maintain backward compatibility or use versioned endpoints (e.g., `/api/v2/`).

---

## Support

For issues or questions, refer to the main README.md in the project root.
