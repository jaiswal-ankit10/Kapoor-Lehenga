import prisma from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";

/* ================= REGISTER ================= */
export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, mobile, password, adminSecret } = req.body;

  if (!fullName || !email || !mobile || !password) {
    throw new ApiError(400, "All the fields are required");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { mobile }],
    },
  });

  if (existingUser) {
    throw new ApiError(409, "User with email or phoneNumber already exists");
  }

  const role = adminSecret === process.env.ADMIN_SECRET ? "ADMIN" : "CUSTOMER";

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      mobile,
      password: hashedPassword,
      role,
      authProvider: "LOCAL",
    },
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
        },
      },
      "User registered successfully"
    )
  );
});

/* ================= LOGIN ================= */
export const login = asyncHandler(async (req, res) => {
  const { email, mobile, password } = req.body;

  if ((!email && !mobile) || !password) {
    throw new ApiError(400, "All the fields are required");
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { mobile }],
    },
  });

  if (!user || !user.password) {
    throw new ApiError(400, "User doesn't exist with this email or mobile");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(400, "Password Incorrect");
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
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
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
});

/* ================= LOGOUT ================= */
export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  return res.json(new ApiResponse(200, {}, "Logged out successfully"));
});

/* ================= SEND OTP ================= */
export const sendOtp = asyncHandler(async (req, res) => {
  const { mobile } = req.body;
  const { purpose } = req.query;

  if (!mobile) throw new ApiError(400, "Mobile number is required");
  if (!purpose || !["login", "signup"].includes(purpose)) {
    throw new ApiError(400, "Purpose must be login or signup");
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  let user = await prisma.user.findUnique({
    where: { mobile },
  });

  if (purpose === "login" && !user) {
    throw new ApiError(404, "User not registered with this number");
  }

  if (purpose === "signup" && user) {
    throw new ApiError(409, "User already exists, please login");
  }

  if (!user) {
    user = await prisma.user.create({
      data: {
        mobile,
        authProvider: "LOCAL",
      },
    });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      otp: String(otp),
      otpExpireTime: new Date(Date.now() + 2 * 60 * 1000),
    },
  });

  return res.status(200).json({
    success: true,
    message: "OTP sent successfully",
  });
});

/* ================= VERIFY OTP ================= */
export const verifyOtp = asyncHandler(async (req, res) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    throw new ApiError(400, "Mobile & OTP required");
  }

  const user = await prisma.user.findUnique({
    where: { mobile },
  });

  if (!user) throw new ApiError(404, "User not found");

  if (user.otp !== otp) throw new ApiError(400, "Invalid OTP");
  if (!user.otpExpireTime || user.otpExpireTime < new Date()) {
    throw new ApiError(400, "OTP expired");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      otp: null,
      otpExpireTime: null,
    },
  });

  return res.status(200).json({
    success: true,
    message: "OTP verified",
    user,
  });
});

/* ================= GOOGLE AUTH ================= */
export const googleAuthController = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Authorization code is required",
      });
    }

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

    const { access_token } = tokenResponse.data;

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

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          fullName: name,
          email,
          profileImage: picture,
          googleId: id,
          authProvider: "GOOGLE",
        },
      });
    }

    if (user.authProvider === "LOCAL" && !user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: id,
          authProvider: "GOOGLE",
        },
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Google login successful",
      data: { user, token },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Google authentication failed",
      error: err.message,
    });
  }
};
