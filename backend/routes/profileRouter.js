const { Router } = require("express");
const passport = require("passport");
const profileController = require("../controllers/profileController");

const profileRouter = Router();

profileRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  profileController.getProfile
);

profileRouter.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  profileController.updateProfile
);

module.exports = profileRouter;
