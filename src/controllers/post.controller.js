import Joi from "joi";
import {
  checkUserPostExistsQuery,
  createPostQuery,
  createPostTagQuery,
  deletePostQuery,
  deletePostTagsQuery,
  getAllPostsQuery,
  getPostByIdQuery,
  getTagsByIdQuery,
  updatePostQuery,
} from "../services/post.service.js";
import { runWithTransaction } from "../utils/db.utils.js";

const postSchema = {
  title: Joi.string().min(3).max(60).required(),
  content: Joi.string().min(3).max(250).required(),
  tagIds: Joi.array().items(Joi.number()).required(),
};

const validateCreatePostSchema = Joi.object(postSchema);

const validatePostPayload = (schema, body) => {
  const { value, error } = schema.validate(body);
  if (error) {
    throw { status: 400, message: error.details[0].message };
  }
  return value;
};

const checkTagsExist = async (tagIds) => {
  const tags = await getTagsByIdQuery(tagIds);
  if (tags.length !== tagIds.length) {
    throw { status: 400, message: "Tags mismatch, Please check tags" };
  }
};

const assertUserOwnsPost = async (postId, userId) => {
  const [post] = await checkUserPostExistsQuery(postId, userId);
  if (!post) {
    throw {
      status: 404,
      message: "Post not found or you do not have permission",
    };
  }
};

export const createPost = async (req, res) => {
  try {
    // Validate request body
    const { title, content, tagIds } = validatePostPayload(
      validateCreatePostSchema,
      req.body
    );
    const userId = req.user.id;

    // Check if Tags exists
    await checkTagsExist(tagIds);

    let postId;
    // Start transaction
    await runWithTransaction(async (connection) => {
      // Create post
      const result = await createPostQuery(
        { title, content, userId },
        connection
      );
      if (result.affectedRows === 0)
        throw { status: 500, message: "Failed to create post" };

      postId = result.insertId;
      // Create post tags
      const tagPromises = tagIds.map((tagId) =>
        createPostTagQuery(postId, tagId, connection)
      );
      await Promise.all(tagPromises);
    });
    // success response
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: { postId, title, content, tagIds },
    });
  } catch (error) {
    console.error("Error create Post:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal Server Error in Create Post",
    });
  }
};

export const getAllPost = async (req, res) => {
  try {
    // Validate page and limit
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    // get all posts
    const getPosts = await getAllPostsQuery(page, limit);
    //success response
    res.status(200).json({
      success: true,
      message: "Successfully fetched Posts",
      data: getPosts,
    });
  } catch (error) {
    console.error("Error get All Post:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error in Get All Post",
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    // Validate postId
    const getPost = await getPostByIdQuery(postId);
    if (!getPost) {
      throw { status: 404, message: "Post not found" };
    }
    // success response
    res.status(200).json({
      success: true,
      message: "Successfully fetched Post",
      data: getPost,
    });
  } catch (error) {
    console.error("Error get Post By Id:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal Server Error in Get Post By Id",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // Check if post exists and user owns it
    await assertUserOwnsPost(postId, userId);

    // Start transaction
    await runWithTransaction(async (connection) => {
      // Delete post tags
      const tagsDeleteResponse = await deletePostTagsQuery(postId, connection);
      if (tagsDeleteResponse.affectedRows === 0) {
        throw { status: 500, message: "Failed to delete post tags" };
      }

      // Delete post
      const deletePostResponse = await deletePostQuery(postId, connection);
      if (deletePostResponse.affectedRows === 0) {
        throw { status: 500, message: "Failed to delete post" };
      }
    });

    // success response
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting Post:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal Server Error in Delete Post",
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { title, content, tagIds } = validatePostPayload(
      validateCreatePostSchema,
      req.body
    );

    // Check if post exists and user owns it and tags exist
    await assertUserOwnsPost(postId, userId);
    await checkTagsExist(tagIds);

    // Start transaction
    await runWithTransaction(async (connection) => {
      // Update post
      const updatedPost = { title, content, userId };
      const result = await updatePostQuery(postId, updatedPost, connection);
      if (result.affectedRows === 0) {
        throw { status: 500, message: "Failed to update post" };
      }

      // Delete old post tags and create new ones
      await deletePostTagsQuery(postId, connection);
      const tagPromises = tagIds.map((tagId) =>
        createPostTagQuery(postId, tagId, connection)
      );
      await Promise.all(tagPromises);
    });

    // success response
    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: { postId, title, content, tagIds },
    });
  } catch (error) {
    console.error("Error updating Post:", error);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal Server Error in Update Post",
    });
  }
};
