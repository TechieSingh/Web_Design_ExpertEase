import * as userServices from "../services/user-services.js";
import {setResponse, setError} from './response-handler.js'

export  const registerUser = async(req, res) => {
  try {
    const user = await userServices.createUser(req.body);
    res
      .status(201)
      .json({ message: "User registered successfully", userId: user.user_ID });
  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ error: error.message });
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, isFirstLogin } = await userServices.authenticateUser(email, password);
    res.json({ message: "Logged in successfully", token, isFirstLogin });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(401).json({ error: error.message });
  }
}


export const fetchProfile = async(req, res) => {
  try{
    const userId = req.params.userId;
    const user_profile = await userServices.fetchProfile(userId);
    setResponse(user_profile, res);
  }catch (error){
    setError(error, res);
  }
}


export const editProfile = async (req, res) => {
  const userId = req.params.userId;
  const updateData = req.body;

  try {
    const updatedUser = await userServices.updateUserProfile(userId, updateData);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ message: "Profile updated successfully.", data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user profile", error: error.message });
  }
}

