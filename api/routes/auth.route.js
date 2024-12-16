import express from "express";
import { signup, signin } from "../controllers/auth.controller.js";

export const authRouter = express.Router();

authRouter.post("/sign-up", signup);
authRouter.post("/sign-in", signin);
