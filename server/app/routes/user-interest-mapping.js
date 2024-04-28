import express from "express";
import * as experteaseController from "./../controllers/expertease-controller.js";

const userInterestRoutes = express.Router();

userInterestRoutes
  .route("/allinterests")
  .get(experteaseController.fetchAllUserInterestMappings);

userInterestRoutes
  .route("/")
  .get(experteaseController.fetchAllInterestsForUser)
  .post(experteaseController.addInterestsForUser);

userInterestRoutes
  .route("/:interestId")
  .delete(experteaseController.deleteUserInterestMapping);

export default userInterestRoutes;
