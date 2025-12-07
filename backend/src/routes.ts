import type { FoodItem, Dosha } from "./types.js";
import { getFoodCompatibility } from "./calculations.js";
import { runQuery, runQuery1, runUpdate, insertOne } from "./db-mongodb.js";
import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any;
}

const router = Router();
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// =====================================
// JWT auth middleware
// =====================================
function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: "Invalid token" });
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: "No token provided" });
  }
}

// =====================================
// Reports (already existing)
// =====================================

router.post(
  "/reports",
  authenticateJWT,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const { report } = req.body;

      console.log("[REPORT] POST /api/reports", { userId, report });

      if (!report) {
        return res.status(400).json({ error: "Missing report data" });
      }

      const doc = {
        userId,
        report,
        createdAt: new Date(),
      };

      const result = await insertOne("reports", doc);
      console.log("[REPORT] Insert result:", result?.insertedId);

      res.json({ success: true });
    } catch (err) {
      console.error("[REPORT] Error saving report:", err);
      res.status(500).json({ error: (err as Error).message });
    }
  }
);

router.get(
  "/reports",
  authenticateJWT,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const reports = await runQuery("reports", { userId });
      res.json(reports);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }
);

// =====================================
// NEW: Scan History
// =====================================

// Save one scan (barcode / photo / manual)
router.post(
  "/scan-history",
  authenticateJWT,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id as string;
      const { foodId, method, barcode } = req.body;

      if (!foodId || !method) {
        return res.status(400).json({ error: "Missing foodId or method" });
      }

      const food = await runQuery1("foods", { id: Number(foodId) });
      if (!food) {
        return res.status(404).json({ error: "Food not found" });
      }

      const doc = {
        userId,
        foodId: food.id,
        method, // 'barcode' | 'photo' | 'manual'
        barcode: barcode || null,
        foodName: food.name,
        calories: food.calories,
        thermicQuality: food.thermicQuality,
        createdAt: new Date(),
      };

      const result = await insertOne("scan_history", doc);

      res.json({ success: true, id: result.insertedId });
    } catch (err) {
      console.error("[SCAN] Error saving scan history:", err);
      res.status(500).json({ error: (err as Error).message });
    }
  }
);

// Get all scans for logged-in user
router.get(
  "/scan-history",
  authenticateJWT,
  async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id as string;
      const history = await runQuery("scan_history", { userId });
      res.json(history || []);
    } catch (err) {
      console.error("[SCAN] Error fetching scan history:", err);
      res.status(500).json({ error: (err as Error).message });
    }
  }
);

// =====================================
// Auth Routes
// =====================================

router.post("/auth/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await runQuery1("users", { email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await insertOne("users", {
      email,
      name,
      password_hash,
      dosha: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Get the created user
    const user = await runQuery1("users", { _id: result.insertedId });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        dosha: user.dosha,
      },
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    // Get user
    const user = await runQuery1("users", { email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        dosha: user.dosha,
      },
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// =====================================
// Foods
// =====================================

router.get("/foods", async (_req: Request, res: Response) => {
  try {
    const foods = await runQuery("foods", {});
    const sorted = (foods || []).sort((a, b) => a.name.localeCompare(b.name));
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get("/foods/:id", async (req: Request, res: Response) => {
  try {
    const foodId = parseInt(req.params.id);
    const food = await runQuery1("foods", { id: foodId });

    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }

    res.json(food);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get("/foods/search/:query", async (req: Request, res: Response) => {
  try {
    const searchTerm = req.params.query.toLowerCase();

    const foods = await runQuery("foods", {
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ],
    });

    const sorted = (foods || []).sort((a, b) => a.name.localeCompare(b.name));
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.get(
  "/foods/dosha/:dosha",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const dosha = req.params.dosha as Dosha;
      const foods = await runQuery("foods", {});

      const compatibleFoods = (foods || [])
        .map((food: any) => ({
          ...food,
          doshaScore: food[dosha.toLowerCase() as keyof FoodItem],
        }))
        .sort((a, b) => (b.doshaScore as number) - (a.doshaScore as number));

      res.json(compatibleFoods);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }
);

// =====================================
// Analysis
// =====================================

router.post("/analyze", async (req: Request, res: Response) => {
  try {
    const { foodId, dosha } = req.body;

    if (!foodId || !dosha) {
      return res.status(400).json({ error: "Missing foodId or dosha" });
    }

    const food = await runQuery1("foods", { id: foodId });
    if (!food) {
      return res.status(404).json({ error: "Food not found" });
    }

    const report = getFoodCompatibility(food, dosha);
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// =====================================
// Profile
// =====================================

router.get("/profile/:userId", async (req: Request, res: Response) => {
  try {
    const profile = await runQuery1("user_profiles", {
      userId: req.params.userId,
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.post("/profile", async (req: Request, res: Response) => {
  try {
    const { userId, dosha } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const existing = await runQuery1("user_profiles", { userId });

    if (existing) {
      await runUpdate(
        "user_profiles",
        { userId },
        {
          dosha: dosha || null,
          updatedAt: new Date(),
        }
      );
    } else {
      await insertOne("user_profiles", {
        userId,
        dosha: dosha || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const updated = await runQuery1("user_profiles", { userId });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// =====================================
// Recommendations
// =====================================

router.get(
  "/recommendations/:dosha",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const dosha = req.params.dosha as Dosha;
      const foods = await runQuery("foods", {});

      const recommendations = (foods || [])
        .map((food: any) => {
          const doshaKey = dosha.toLowerCase() as keyof FoodItem;
          const score = food[doshaKey] as number;

          return {
            food,
            score,
            report: getFoodCompatibility(food, dosha),
          };
        })
        .filter((item) => item.report.compatibility === "good")
        .sort((a, b) => a.score - b.score)
        .slice(0, 10);

      res.json(recommendations);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }
);

export default router;
