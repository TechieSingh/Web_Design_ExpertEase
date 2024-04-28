import express from "express";

import * as experteaseController from "./../controllers/expertease-controller.js";

const interestsRouter = express.Router();

interestsRouter
  .route("/")
  .get(experteaseController.fetchallInterests) // fetchall // done
  .post(experteaseController.createInterest); // createInterest // done
interestsRouter
  .route("/:id")
  .delete(experteaseController.deleteInterest) // deleteInterest // done
  .put(experteaseController.updateInterest); // updateInterest // done

export default interestsRouter;
