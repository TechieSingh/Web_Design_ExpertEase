import mongoose, { Schema } from "mongoose";
import { Interest, Topic } from "./expertease-schema.js";
import { hashPassword } from "../helper/auth.js";

// User Table Schema
// const userSchema = new Schema({
//   user_ID: { type: Number },
//   first_Name: { type: String },
//   last_Name: { type: String },
//   email: { type: String, unique: true, required: true },
//   password: { type: String, required: true },
//   photo: { type: String },
//   interests: [Interest],
//   topic: [Topic],
//   bio: { type: String },
//   slots: [{ type: String }],
//   isFirstLogin: { type: Boolean, default: true },
// });
// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     try {
//       this.password = await hashPassword(this.password);
//     } catch (error) {
//       console.error("Error hashing password:", error);
//     }
//   }
//   if (!this.user_ID) {
//     try {
//       const lastUser = await this.constructor.findOne(
//         {},
//         {},
//         { sort: { user_ID: -1 } }
//       );
//       this.user_ID = lastUser ? lastUser.user_ID + 1 : 1;
//     } catch (error) {
//       console.error("Error auto-incrementing user_ID:", error);
//       throw error;
//     }
//   }
//   next();
// });
// const User = mongoose.model("User", userSchema);

// export default User;
