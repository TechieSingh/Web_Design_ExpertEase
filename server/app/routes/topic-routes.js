import express from "express";

import * as experteaseController from "./../controllers/expertease-controller.js";

const topicsRouter = express.Router();

topicsRouter.route("/")
  .get(experteaseController.fetchAllTopics) // fetch all topics // done
  .post(experteaseController.createTopic); // create topic // done


topicsRouter
  .route("/:id")
  .delete(experteaseController.deleteTopic) // delete topic // done

topicsRouter.route('/filter')
    .get(experteaseController.filterTopicsByName) // search topic // done

topicsRouter.route("/:id/followers")
    .get(experteaseController.getFollowersCount)

topicsRouter.route("/topTopics")
    .get(experteaseController.getTopTopics)

export default topicsRouter;