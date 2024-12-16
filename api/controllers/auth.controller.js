const User = require("../models/user.model.js")
const bcrypt = require("bcryptjs");
const { errorHandler } = require("../utils/error.js");
const jwt = require("jsonwebtoken")



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

const signin = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const validUser = await User.findOne({email});
        if (!validUser){
            next(errorHandler(404, "User not found"));
            return;
        }

        const validPassword = bcrypt.compareSync(password, validUser.password)

        if(!validPassword){
            next(errorHandler(401, "Wrong Credentials"));
            return;
        }

        const {password: pass, ...rest} = validUser._doc;

        const token = jwt.sign({id: validUser._id}, process.env.JWT_TOKEN)
        res
        .cookie("access_token", token, {httpOnly:true})
        .status(200)
        .json({rest});

    } catch (error) {
        next(error)
    }
}

module.exports = {signup, signin};
