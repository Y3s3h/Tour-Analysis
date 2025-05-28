// import jwt from "jsonwebtoken";
// import { config } from "../config.js";

// export const protect = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer "))
//     return res.status(401).json({ msg: "Unauthorized" });

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, config.jwtSecret);
//     req.user = { id: decoded.id };
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: "Invalid token" });
//   }
// };
import jwt from "jsonwebtoken";
import { config } from "../config.js";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = {
      id: decoded.id,
      role: decoded.role, // include role for access control
    };
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
