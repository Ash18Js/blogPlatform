import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 3000,

  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    name: process.env.DB_NAME || "test",
  },

  jwt: {
    secret: process.env.JWT_SECRET || "your_jwt_secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },
};

export default config;
