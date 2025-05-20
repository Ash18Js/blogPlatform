import db from "../config/db.config.js";

export const getUserQuery = async (userId) => {
  const [rows] = await db.query("SELECT * FROM users WHERE ID = ?", [userId]);
  return rows[0];
};

export const getUserByEmailQuery = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

export const createUserQuery = async (user) => {
  const [result] = await db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [user.username, user.email, user.password]
  );
  return result;
};
