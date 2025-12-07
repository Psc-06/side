import { MongoClient } from 'mongodb';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = 'ayurveda_scanner';
let client;
let db;
let foodsCollection;
let usersCollection;
let userProfilesCollection;
export const initializeDatabase = async () => {
    try {
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        console.log('✓ Connected to MongoDB');
        db = client.db(DATABASE_NAME);
        // Create collections
        foodsCollection = db.collection('foods');
        usersCollection = db.collection('users');
        userProfilesCollection = db.collection('user_profiles');
        // Create unique indexes
        await foodsCollection.createIndex({ name: 1 }, { unique: true });
        await usersCollection.createIndex({ email: 1 }, { unique: true });
        await userProfilesCollection.createIndex({ userId: 1 }, { unique: true });
        // Seed foods if empty
        const count = await foodsCollection.countDocuments();
        if (count === 0) {
            await seedFoods();
        }
        console.log('✓ Database initialized successfully');
    }
    catch (err) {
        console.error('Failed to initialize database:', err);
        throw err;
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
    try {
        await foodsCollection.insertMany(foods);
        console.log(`✓ Seeded ${foods.length} foods into MongoDB`);
    }
    catch (err) {
        console.error('Error seeding foods:', err);
    }
};
export const getDatabase = () => {
    return db;
};
export const runQuery = (collectionName, query = {}) => {
    const collection = db.collection(collectionName);
    return collection.find(query).toArray();
};
export const runQuery1 = (collectionName, query = {}) => {
    const collection = db.collection(collectionName);
    return collection.findOne(query);
};
export const runUpdate = async (collectionName, filter, update, upsert = false) => {
    const collection = db.collection(collectionName);
    if (upsert) {
        return collection.updateOne(filter, { $set: update }, { upsert: true });
    }
    else {
        return collection.updateOne(filter, { $set: update });
    }
};
export const insertOne = async (collectionName, document) => {
    const collection = db.collection(collectionName);
    return collection.insertOne(document);
};
export const closeDatabase = async () => {
    if (client) {
        await client.close();
        console.log('✓ Database connection closed');
    }
};
// Export collections for direct access when needed
export const getCollections = () => ({
    foods: foodsCollection,
    users: usersCollection,
    userProfiles: userProfilesCollection
});
