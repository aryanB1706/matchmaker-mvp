import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import customerRoutes from './routes/customerRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Mount Modular Routes
app.use('/api/customers', customerRoutes);

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Matchmaking backend is healthy' });
});

// Setup paths for ES Module static assets serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../../frontend/dist');
  
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
  }

  // Fallback route to serve index.html for SPA routing
  app.get(/.*/, (req, res) => {
    const indexPath = path.resolve(__dirname, '../../frontend', 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(200).json({ 
        success: true, 
        message: 'Milan Matchmaking Backend API is running' 
      });
    }
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
