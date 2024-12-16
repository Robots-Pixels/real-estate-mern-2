const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter  = require("./routes/user.route.js");
const authRouter = require("./routes/auth.route.js");

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
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
