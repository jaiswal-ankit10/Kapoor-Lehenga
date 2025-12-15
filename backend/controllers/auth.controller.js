import User from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";

export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, mobile, password, adminSecret } = req.body;
  if (!fullName || !mobile || !email || !password) {
    throw new ApiError(400, "All the fields are required");
  }
  const existingUser = await User.findOne({
    $or: [{ email }, { mobile }],
  });
  if (existingUser) {
    console.log("BODY =>", req.body);

    throw new ApiError(
      409,
      "User with email or phoneNumber already exists",
      []
    );
  }
  const role = adminSecret === process.env.ADMIN_SECRET ? "admin" : "customer";
  const hashedPassword = await bcrypt.hash(password, 10);

  // Assign role — only allow admin creation via backend logic
  // let finalRole = "customer";
  // if (role && role.toLowerCase() === "admin") {
  //   throw new ApiError(400, "Admin creation not allowed through public API");
  // }

  const user = await User.create({
    fullName,
    email,
    mobile,
    password: hashedPassword,
    role: role,
  });

  return res.status(200).json(
    new ApiResponse(
      200,

      {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
        },
      },
      "User registered successfully "
    )
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, mobile, password } = req.body;

  if ((!email && !mobile) || !password) {
    throw new ApiError(400, "All the fields are required");
  }

  // Find user by email or mobile
  const user = await User.findOne({
    $or: [{ email }, { mobile }],
  }).select("+password");

  if (!user) {
    throw new ApiError(400, "User doesn't exist with this email or mobile");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(400, "Password Incorrect");
  }

  // Generate Token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  return res.json(new ApiResponse(200, {}, "Logged out successfully"));
});

export const sendOtp = asyncHandler(async (req, res) => {
  const { mobile } = req.body;
  const { purpose } = req.query; // "signup" OR "login"

  if (!mobile) {
    throw new ApiError(400, "Mobile number is required");
  }

  if (!purpose || !["login", "signup"].includes(purpose)) {
    throw new ApiError(400, "Purpose must be login or signup");
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log("OTP =>", otp);

  let user = await User.findOne({ mobile });

  // -------- LOGIN OTP -------- //
  if (purpose === "login") {
    if (!user) {
      throw new ApiError(404, "User not registered with this number");
    }
  }

  // -------- SIGNUP OTP -------- //
  if (purpose === "signup") {
    if (user) {
      throw new ApiError(409, "User already exists, please login");
    }

    // Create OTP temp user (NO fullName yet)
    user = new User({ mobile });
  }

  user.otp = otp;
  user.otpExpireTime = Date.now() + 2 * 60 * 1000; // 2 Min

  await user.save({ validateBeforeSave: false }); // IMPORTANT

  return res.status(200).json({
    success: true,
    message: "OTP sent successfully",
  });
});

export const verfiyOtp = asyncHandler(async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp)
      return res
        .status(400)
        .json({ success: false, message: "Mobile & OTP required" });

    let user = await User.findOne({ mobile });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.otp !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    if (user.otpExpireTime < Date.now())
      return res.status(400).json({ success: false, message: "OTP expired" });

    // Success => Clear OTP
    user.otp = undefined;
    user.otpExpireTime = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "OTP verified",
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export const googleAuthController = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Authorization code is required",
      });
    }

    // 🔹 1. Exchange Google Auth Code → Access Token + ID Token
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "postmessage",
        grant_type: "authorization_code",
      }
    );

    const { access_token, id_token } = tokenResponse.data;

    // 🔹 2. Get Google user info
    const googleUser = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
    );

    const { id, name, email, picture } = googleUser.data;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google account does not have an email",
      });
    }

    // 🔹 3. Find existing user (match by email)
    let user = await User.findOne({ email });

    // 🔹 4. Create new user if not found
    if (!user) {
      user = await User.create({
        fullName: name,
        email,
        profileImage: picture,
        googleId: id,
        authProvider: "google",
        mobile: null, // Google does NOT provide mobile
        password: null,
      });
    }

    // 🔹 5. If user exists but provider is different
    if (user.authProvider === "local" && !user.googleId) {
      // Allow linking the Google account
      user.googleId = id;
      user.authProvider = "google";
      await user.save();
    }

    // 🔹 6. Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Google login successful",
      data: {
        user,
        token,
      },
    });
  } catch (err) {
    console.error("Google OAuth Error:", err.response?.data || err.message);

    return res.status(500).json({
      success: false,
      message: "Google authentication failed",
      error: err.message,
    });
  }
};
