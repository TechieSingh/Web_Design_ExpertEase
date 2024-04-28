import express from "express";
import * as experteaseController from "./../controllers/expertease-controller.js";

const userTopicRoutes = express.Router();

userTopicRoutes.route("/").get(experteaseController.fetchAllTopicsForUser);

userTopicRoutes.route("/follow").post(experteaseController.followTopic);

userTopicRoutes.route("/unfollow").post(experteaseController.unfollowTopic);

userTopicRoutes
  .route("/recommendTopics")
  .get(experteaseController.recommendTopicsForUser);

export default userTopicRoutes;
