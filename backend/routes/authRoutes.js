import express from "express";
import { register, login } from "../controllers/authController.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// /me route to get current user info
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(401).json({ msg: "Token invalid" });
  }
});

export default router;
