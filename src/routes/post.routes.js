import express from "express";
const router = express.Router();
import {
  createPost,
  getAllPost,
  getPostById,
  deletePost,
  updatePost,
} from "../controllers/post.controller.js";

router.post("/", createPost);
router.get("/", getAllPost);
router.get("/:id", getPostById);
router.delete("/:id", deletePost);
router.put("/:id", updatePost);

export default router;
