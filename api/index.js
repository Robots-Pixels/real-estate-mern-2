const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config()
const app = express();

mongoose.connect(
    process.env.MONGO
).then(
    () => {
        console.log("Connecté à MongoDB")
        app.listen(4000, () => {
            console.log("Server running on port 4000...")
        })
    }
)
.catch(
    (error) => {
        console.error(error);
    }
)

app.get("/", (req, res) => {
    console.log("Connecté")
})
