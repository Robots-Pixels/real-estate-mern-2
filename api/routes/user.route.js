import express from "express";
import { test } from "../controllers/user.controller.js";

export const userRouter = express.Router();

userRouter.get("/test", test);

