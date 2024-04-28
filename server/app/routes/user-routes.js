import express from "express";
import * as userController from "../controllers/user-controller.js";

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

router.route('/:userId/profile')
    .get(userController.fetchProfile)
    .patch(userController.editProfile)
export default router;
