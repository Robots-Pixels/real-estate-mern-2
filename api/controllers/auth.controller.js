const User = require("../models/user.model.js")
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const signup = async (req, res, next) => {
    const {username, email, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({username, email, password: hashedPassword});

    try {
        await newUser.save();
        res.status(201).json({message: "User created successfully!"});
    } catch (error) {
        next(error);
    }
}

module.exports = signup;
