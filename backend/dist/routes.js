import { getFoodCompatibility } from './calculations.js';
import { runQuery, runQuery1, runUpdate, insertOne } from './db-mongodb.js';
import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
// Auth Routes
router.post('/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Check if user already exists
        const existingUser = await runQuery1('users', { email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        // Hash password
        const password_hash = await bcrypt.hash(password, 10);
        // Insert new user
        const result = await insertOne('users', {
            email,
            name,
            password_hash,
            dosha: null,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        // Get the created user
        const user = await runQuery1('users', { _id: result.insertedId });
        // Generate JWT token
        const token = jwt.sign({ id: user._id.toString(), email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                dosha: user.dosha
            }
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Missing email or password' });
        }
        // Get user
        const user = await runQuery1('users', { email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        // Generate JWT token
        const token = jwt.sign({ id: user._id.toString(), email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                dosha: user.dosha
            }
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Get all foods
router.get('/foods', async (_req, res) => {
    try {
        const foods = await runQuery('foods', {});
        const sorted = (foods || []).sort((a, b) => a.name.localeCompare(b.name));
        res.json(sorted);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Get single food by ID
router.get('/foods/:id', async (req, res) => {
    try {
        const foodId = parseInt(req.params.id);
        const food = await runQuery1('foods', { id: foodId });
        if (!food) {
            return res.status(404).json({ error: 'Food not found' });
        }
        res.json(food);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Get foods by search
router.get('/foods/search/:query', async (req, res) => {
    try {
        const searchTerm = req.params.query.toLowerCase();
        const foods = await runQuery('foods', {
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ]
        });
        const sorted = (foods || []).sort((a, b) => a.name.localeCompare(b.name));
        res.json(sorted);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Get foods for specific dosha
router.get('/foods/dosha/:dosha', async (req, res) => {
    try {
        const dosha = req.params.dosha;
        const foods = await runQuery('foods', {});
        const compatibleFoods = (foods || [])
            .map((food) => ({
            ...food,
            doshaScore: food[dosha.toLowerCase()],
        }))
            .sort((a, b) => b.doshaScore - a.doshaScore);
        res.json(compatibleFoods);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Analyze food compatibility
router.post('/analyze', async (req, res) => {
    try {
        const { foodId, dosha } = req.body;
        if (!foodId || !dosha) {
            return res.status(400).json({ error: 'Missing foodId or dosha' });
        }
        const food = await runQuery1('foods', { id: foodId });
        if (!food) {
            return res.status(404).json({ error: 'Food not found' });
        }
        const report = getFoodCompatibility(food, dosha);
        res.json(report);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Get user profile
router.get('/profile/:userId', async (req, res) => {
    try {
        const profile = await runQuery1('user_profiles', { userId: req.params.userId });
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        res.json(profile);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Create or update user profile
router.post('/profile', async (req, res) => {
    try {
        const { userId, dosha } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }
        const existing = await runQuery1('user_profiles', { userId });
        if (existing) {
            await runUpdate('user_profiles', { userId }, { dosha: dosha || null, updatedAt: new Date() });
        }
        else {
            await insertOne('user_profiles', {
                userId,
                dosha: dosha || null,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        const updated = await runQuery1('user_profiles', { userId });
        res.json(updated);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Get food recommendations for a dosha
router.get('/recommendations/:dosha', async (req, res) => {
    try {
        const dosha = req.params.dosha;
        const foods = await runQuery('foods', {});
        const recommendations = (foods || [])
            .map((food) => {
            const doshaKey = dosha.toLowerCase();
            const score = food[doshaKey];
            return { food, score, report: getFoodCompatibility(food, dosha) };
        })
            .filter((item) => item.report.compatibility === 'good')
            .sort((a, b) => a.score - b.score)
            .slice(0, 10);
        res.json(recommendations.map((item) => item.report));
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
export default router;
