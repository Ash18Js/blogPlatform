import Joi from "joi";
import {
  getUserByEmailQuery,
  createUserQuery,
} from "../services/user.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/env.config.js";

const userSchema = {
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
};

const validateRegisterUser = Joi.object(userSchema);
const validateLoginUser = Joi.object({
  email: userSchema.email,
  password: userSchema.password,
});

export const registerUser = async (req, res) => {
  try {
    // Validate request body
    const { value, error } = validateRegisterUser.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    let { username, email, password } = value;

    // Check if user already exists
    const checkUser = await getUserByEmailQuery(email);
    console.log("checkUser-->", checkUser);
    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    password = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      username,
      email,
      password,
    };
    const result = await createUserQuery(newUser);
    if (result.affectedRows === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to register user",
      });
    }

    // Send success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { username, email },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in Register User",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    // validate request body
    const { value, error } = validateLoginUser.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        message: error.details[0].message,
      });
    }

    //  check email and password
    const { email, password } = value;
    const checkUser = await getUserByEmailQuery(email);
    if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const currentUser = {
      id: checkUser.id,
      email: checkUser.email,
      username: checkUser.username,
    };

    // Genrate JWT token for user
    const token = jwt.sign(currentUser, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    return res.status(200).json({
      success: true,
      message: "Login Success",
      data: {
        token,
        user: currentUser,
      },
    });
  } catch (error) {
    console.error("Error Login User:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in Login User",
    });
  }
};
