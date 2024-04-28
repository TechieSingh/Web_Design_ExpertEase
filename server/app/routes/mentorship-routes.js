import express from "express";

import * as experteaseController from "./../controllers/expertease-controller.js";

const mentorshipRoutes= express.Router();

mentorshipRoutes
  .route("/")
  .get(experteaseController.fetchallMentorshipSlots) // fetchall 


mentorshipRoutes.route("/mentorshipslots")
    .post(experteaseController.createMentorshipSlot)
    .get(experteaseController.getMentorshipSlotsForUser)

mentorshipRoutes.route("/mentorshipslots/:meetingId")
    .patch(experteaseController.editMentorshipSlot)
    .delete(experteaseController.deleteMentorshipSlot)

export default mentorshipRoutes