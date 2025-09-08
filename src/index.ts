import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import  connectDatabase  from './config/database';
import { redisClient } from './config/redis';
import ifscRoutes from './routes/ifsc.route';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'IFSC API Service is running!',
    version: '1.0.0',
    endpoints: {
      getIFSC: 'GET /api/ifsc/:ifscCode'
    }
  });
});

app.use('/api/ifsc', ifscRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to databases
    await connectDatabase();
    await redisClient.connectRedis();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 API endpoint: http://localhost:${PORT}/api/ifsc/:ifscCode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

startServer();