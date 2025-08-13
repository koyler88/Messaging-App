const { Router } = require("express");
const passport = require("passport");
const messageController = require('../controllers/messageController')

const messageRouter = Router();

// Send a message
messageRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  messageController.sendMessage
);

// Get conversation with another user
messageRouter.get(
  "/:withUserId",
  passport.authenticate("jwt", { session: false }),
  messageController.getConversation
);

module.exports = messageRouter;
