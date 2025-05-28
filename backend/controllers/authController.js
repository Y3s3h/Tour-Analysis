// import User from "../models/User.js";
// import jwt from "jsonwebtoken";
// import { config } from "../config.js";

// const generateToken = (id) => {
//   return jwt.sign({ id }, config.jwtSecret, { expiresIn: "7d" });
// };

// export const register = async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const exists = await User.findOne({ username });
//     if (exists) return res.status(400).json({ msg: "User already exists" });

//     const user = await User.create({ username, password });
//     const token = generateToken(user._id);
//     console.log("Token Generated:", token);
//     res.status(201).json({ token, userId: user._id });
//   } catch (err) {
//     res.status(500).json({ msg: "Register failed", error: err.message });
//   }
// };

// // filepath: c:\Users\Yash Yadav\Desktop\Arcade\backend\controllers\authController.js
// export const login = async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(400).json({ msg: "User not found" });
//     }
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: "Invalid credentials" });
//     }
//     const token = generateToken(user._id);
//     res.json({ token, userId: user._id });
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({ msg: "Login failed", error: err.message });
//   }
// };

import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, config.jwtSecret, { expiresIn: "7d" });
};

export const register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    const user = await User.create({ username, password, role });
    const token = generateToken(user._id, user.role);
    console.log("Token Generated:", token);
    res.status(201).json({
      token,
      userId: user._id,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ msg: "Register failed", error: err.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = generateToken(user._id, user.role);
    res.json({
      token,
      userId: user._id,
      role: user.role,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
};
