const express = require("express");
const {signup, signin} = require("../controllers/auth.controller.js");

const authRouter = express.Router();

authRouter.post("/sign-up", signup);
authRouter.post("/sign-in", signin);

module.exports = authRouter;