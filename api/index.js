import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { userRouter } from "./routes/user.route.js";
import { authRouter } from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import listingRouter from "./routes/listing.route.js";

dotenv.config()
const app = express();

mongoose.connect(
    process.env.MONGO
).then(
    () => {
        console.log("Connecté à MongoDB")
        app.listen(3500, () => {
            console.log("Server running on port 3500...")
        })
    }
)
.catch(
    (error) => {
        console.error(error);
    }
)

app.use(express.json());
app.use(cookieParser());
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing",listingRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
});
