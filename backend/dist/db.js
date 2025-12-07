import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../database.db');
let db;
export const initializeDatabase = async () => {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                reject(err);
            }
            else {
                createTables().then(resolve).catch(reject);
            }
        });
    });
};
const createTables = async () => {
    const run = promisify(db.run.bind(db));
    await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      dosha TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
    await run(`
    CREATE TABLE IF NOT EXISTS foods (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      calories INTEGER NOT NULL,
      carbs REAL NOT NULL,
      protein REAL NOT NULL,
      fats REAL NOT NULL,
      vata INTEGER NOT NULL,
      pitta INTEGER NOT NULL,
      kapha INTEGER NOT NULL,
      thermicQuality TEXT NOT NULL,
      bestTime TEXT NOT NULL,
      description TEXT NOT NULL,
      recommendations TEXT NOT NULL
    )
  `);
    await run(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      id INTEGER PRIMARY KEY,
      userId TEXT UNIQUE NOT NULL,
      dosha TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
    // Check if foods table is empty and seed it
    const count = await new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM foods', (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row.count);
        });
    });
    if (count === 0) {
        await seedFoods();
    }
};
export const seedFoods = async () => {
    const foods = [
        {
            id: 1,
            name: "Dal (Lentil Curry)",
            calories: 206,
            carbs: 36,
            protein: 18,
            fats: 1,
            vata: -2,
            pitta: -1,
            kapha: 2,
            thermicQuality: "neutral",
            bestTime: "lunch",
            description: "Traditional lentil curry, protein-rich and grounding",
            recommendations: "Excellent for all body types. Pair with warm rice for better digestion."
        },
        {
            id: 2,
            name: "Roti (Wheat Bread)",
            calories: 70,
            carbs: 14,
            protein: 2.7,
            fats: 0.5,
            vata: -1,
            pitta: 0,
            kapha: 1,
            thermicQuality: "neutral",
            bestTime: "lunch, dinner",
            description: "Whole wheat flatbread, staple of Indian cuisine",
            recommendations: "Best with cooked vegetables and ghee for Vata balance."
        },
        {
            id: 3,
            name: "Samosa",
            calories: 262,
            carbs: 32,
            protein: 4,
            fats: 13,
            vata: 2,
            pitta: 2,
            kapha: 2,
            thermicQuality: "heating",
            bestTime: "snack",
            description: "Fried pastry with spiced filling",
            recommendations: "Avoid for Pitta. Enjoy occasionally with cooling yogurt."
        },
        {
            id: 4,
            name: "Idli (Steamed Cake)",
            calories: 40,
            carbs: 8,
            protein: 1.5,
            fats: 0.3,
            vata: 0,
            pitta: -1,
            kapha: 0,
            thermicQuality: "cooling",
            bestTime: "breakfast",
            description: "Steamed rice and lentil cake, light and easy to digest",
            recommendations: "Perfect for Pitta. Serve with cooling coconut chutney."
        },
        {
            id: 5,
            name: "Dosa (Crepe)",
            calories: 168,
            carbs: 24,
            protein: 4.5,
            fats: 6,
            vata: 0,
            pitta: -1,
            kapha: 1,
            thermicQuality: "neutral",
            bestTime: "breakfast, snack",
            description: "Crispy fermented rice and lentil crepe",
            recommendations: "Good for all doshas. Add ghee for Vata support."
        }
    ];
    const run = promisify(db.run.bind(db));
    for (const food of foods) {
        try {
            await run(`INSERT INTO foods (id, name, calories, carbs, protein, fats, vata, pitta, kapha, thermicQuality, bestTime, description, recommendations)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                food.id,
                food.name,
                food.calories,
                food.carbs,
                food.protein,
                food.fats,
                food.vata,
                food.pitta,
                food.kapha,
                food.thermicQuality,
                food.bestTime,
                food.description,
                food.recommendations
            ]);
        }
        catch (err) {
            // Food already exists, skip
        }
    }
};
export const getDatabase = () => {
    return db;
};
export const runQuery = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err)
                reject(err);
            else
                resolve((rows || []));
        });
    });
};
export const runQuery1 = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
};
export const runUpdate = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
};
