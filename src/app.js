import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api', apiRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;