// Article routes
import express from "express";
import {
  createNewArticle,
  getArticlesForTopic,
  getAllArticlesForUser,
  getCommentsCount,
} from "../controllers/expertease-controller.js";
const articleRoutes = express.Router();

articleRoutes
  .route("/topics/:topicId")
  .post(createNewArticle) // Done
  .get(getArticlesForTopic); // Done

articleRoutes.route("/users").get(getAllArticlesForUser);

articleRoutes
  .route("/:articleId/commentscount") // Done
  .get(getCommentsCount);

export default articleRoutes;
