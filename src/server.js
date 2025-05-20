import app from './app.js';
import config from './config/env.config.js';
import pool from './config/db.config.js';

const startServer = async () => {
  try {
    await pool.getConnection();
    console.log('✅ Connected to MySQL');
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('❌ DB connection failed:', error);
    process.exit(1);
  }
};

startServer();