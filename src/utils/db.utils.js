import db from "../config/db.config.js";
export const runWithTransaction = async (callback) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    await callback(connection);
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};
