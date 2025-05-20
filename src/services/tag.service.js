import db from "../config/db.config.js";

export const getAllTagsQuery = async () => {
  const [rows] = await db.query("SELECT * FROM tags");
  return rows;
};
