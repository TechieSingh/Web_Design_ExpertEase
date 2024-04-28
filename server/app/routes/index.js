import userInterestRoutes from "./user-interest-mapping.js";
import userRoutes from "./user-routes.js";
import topicsRouter from "./topic-routes.js";
import userTopicRoutes from "./user-topic-mapping.js";
import authenticateToken from "../middleware/requireAuth.js";
import interestsRouter from "./interest-routes.js";
import articleRoutes from "./article-routes.js";
import mentorshipRoutes from "./mentorship-routes.js";
import replykeRoutes from "./replyke-routes.js";
// import zoomRoutes from "./zoom-api.js";

const initializeRoutes = (app) => {
  app.use("/api/users", userRoutes);
  app.use("/api/interests", authenticateToken, interestsRouter);
  app.use("/api/users/interests", authenticateToken, userInterestRoutes);
  app.use("/api/topics", authenticateToken, topicsRouter);
  app.use("/api/users/topics", authenticateToken, userTopicRoutes);
  app.use("/api/articles", authenticateToken, articleRoutes);
  app.use("/api", replykeRoutes);
  app.use("/api/mentorship", authenticateToken, mentorshipRoutes);
  // app.use("/api/zoom", authenticateToken, zoomRoutes)
};

export default initializeRoutes;
