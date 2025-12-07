import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase, closeDatabase } from './db-mongodb.js';
import routes from './routes.js';
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());
// Serve static files from the frontend dist folder
const frontendPath = path.join(__dirname, '../../dist');
app.use(express.static(frontendPath));
// API Routes
app.use('/api', routes);
// Default route
app.get('/api', (_req, res) => {
    res.json({ message: 'Sideye API Server', version: '1.0.0' });
});
// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Serve React app for all other routes (SPA routing)
app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});
// Error handling
app.use((err, _req, res) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});
// Start server
const startServer = async () => {
    try {
        await initializeDatabase();
        const server = app.listen(PORT, () => {
            console.log(`✓ Server running on http://localhost:${PORT}`);
            console.log(`✓ Frontend: http://localhost:${PORT}`);
            console.log(`✓ API: http://localhost:${PORT}/api`);
        });
        // Graceful shutdown
        process.on('SIGINT', async () => {
            console.log('\n✓ Shutting down gracefully...');
            server.close(async () => {
                await closeDatabase();
                process.exit(0);
            });
        });
    }
    catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};
startServer();
export default app;
