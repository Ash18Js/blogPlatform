import db from "../config/db.config.js";

export const getTagsByIdQuery = async (tagIds) => {
  const [rows] = await db.query("SELECT * FROM tags WHERE Id IN (?)", [tagIds]);
  return rows;
};

export const createPostQuery = async (post, connection = null) => {
  const executor = connection ? connection : db;
  const [result] = await executor.query(
    "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)",
    [post.title, post.content, post.userId]
  );
  return result;
};

export const createPostTagQuery = async (postId, tagId, connection = null) => {
  const executor = connection ? connection : db;
  const [result] = await executor.query(
    "INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)",
    [postId, tagId]
  );
  return result;
};

export const getAllPostsQuery = async (page, limit) => {
  const offset = (page - 1) * limit;
  const [rows] = await db.query(
    `SELECT p.*, u.username, JSON_ARRAYAGG(t.name) AS tags
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      GROUP BY p.id
      ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  return rows;
};

export const getPostByIdQuery = async (postId) => {
  const [rows] = await db.query(
    `SELECT p.*, u.username, JSON_ARRAYAGG(t.name) AS tags
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.id = ?
      GROUP BY p.id`,
    [postId]
  );
  return rows[0];
};

export const checkUserPostExistsQuery = async (postId, userId) => {
  const [rows] = await db.query(
    "SELECT * FROM posts WHERE id = ? AND user_id = ?",
    [postId, userId]
  );
  return rows;
};

export const deletePostQuery = async (postId, connection = null) => {
  const executor = connection ? connection : db;
  const [result] = await executor.query("DELETE FROM posts WHERE id = ?", [
    postId,
  ]);
  return result;
};

export const deletePostTagsQuery = async (postId, connection = null) => {
  const executor = connection ? connection : db;
  const [result] = await executor.query(
    "DELETE FROM post_tags WHERE post_id = ?",
    [postId]
  );
  return result;
};

export const updatePostQuery = async (postId, post, connection = null) => {
  const executor = connection ? connection : db;
  const [result] = await executor.query(
    "UPDATE posts SET title = ?, content = ? WHERE id = ?",
    [post.title, post.content, postId]
  );
  return result;
};
