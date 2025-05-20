import express from "express";
const router = express.Router();
import userRoutes from "./user.routes.js";
import userAuthenticationRoutes from "./userAuthentication.routes.js";
import postRoutes from "./post.routes.js";
import tagRoutes from "./tag.routes.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

router.use("/users", userRoutes);
router.use("/userAuthentication", userAuthenticationRoutes);
router.use("/posts", authenticateToken, postRoutes);
router.use("/tags", authenticateToken, tagRoutes);

export default router;
