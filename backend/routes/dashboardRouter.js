const { Router } = require("express");
const dashboardRouter = Router();
const dashboardController = require("../controllers/dashboardController");
const passport = require("passport");

dashboardRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  dashboardController.getDashboard
);

dashboardRouter.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  dashboardController.getAllUsers
);

module.exports = dashboardRouter;
