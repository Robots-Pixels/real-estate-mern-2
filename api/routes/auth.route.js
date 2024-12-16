const express = require("express");
const signup = require("../controllers/auth.controller.js");

const authRouter = express.Router();

authRouter.post("/sign-up", signup);

module.exports = authRouter;