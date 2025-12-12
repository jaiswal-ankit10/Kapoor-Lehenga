import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";

export const verifyJWT = (req, res, next) => {
  const token =
    req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next(new ApiError(401, "Unauthorized request"));
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
    // console.log("verifyJWT -> typeof next:", typeof next);
  } catch (error) {
    return next(new ApiError(401, "Invalid access token"));
  }
};
export const verifyRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    next();
  };
};
