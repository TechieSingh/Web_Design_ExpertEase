import { User } from "../models/expertease-schema.js";
import { comparePassword } from "../helper/auth.js";
import jwt from "jsonwebtoken";

// Service to handle user registration
export const createUser = async (data) => {
  const {
    email,
    password,
    first_Name,
    last_Name,
    bio,
    photo,
    interests,
    slots,
  } = data;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already exists");
  }
  const user = new User({
    email,
    password,
    first_Name,
    last_Name,
    bio,
    photo,
    interests,
    slots,
  });
  await user.save();
  return user;
};

// Service to authenticate a user

export const authenticateUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // Check if it's the user's first login
  const isFirstLogin = user.isFirstLogin;

  // Update isFirstLogin status if true
  if (isFirstLogin) {
    user.isFirstLogin = false; // Set isFirstLogin to false
    await user.save(); // Save the user with updated isFirstLogin
  }

  // Payload data to include in the JWT
  const payload = {
    id: user.user_ID,
    email: user.email,
    first_Name: user.first_Name ? user.first_Name : "",
    last_Name: user.last_Name ? user.last_Name : "",
  };

  // Token generation
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour

  // Return the JWT token and the isFirstLogin status
  return { token, isFirstLogin };
};

export const fetchProfile = async (userId) => {
  try {
    const user = await User.findOne({ user_ID: userId });
    return user;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (userId, updateData) => {
  try {
    const options = { new: true, runValidators: true };
    const user = await User.findOneAndUpdate(
      { user_ID: userId },
      updateData,
      options
    );
    return user;
  } catch (error) {
    throw error;
  }
};
