import { User } from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import Listing from "../models/listing.model.js"

export const test = (req, res) => {
    res.json({
        message: "API routes is working !"
    })
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "Vous ne pouvez modifier que vos propres informations"));
    }

    try {
        // Si un mot de passe est fourni, le hacher
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        // Construire dynamiquement l'objet `$set`
        const updateFields = {};
        if (req.body.username) updateFields.username = req.body.username;
        if (req.body.email) updateFields.email = req.body.email;
        if (req.body.password) updateFields.password = req.body.password;
        if (req.body.avatar) updateFields.avatar = req.body.avatar;

        // Effectuer la mise à jour
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true }
        );

        if (!updatedUser) {
            return next(errorHandler(404, "Utilisateur introuvable"));
        }

        const { password, ...rest } = updatedUser._doc;
        res.status(200).send(rest);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) {
        return next(errorHandler(401, "You You can only delete your own account!"));
    }

    try {
        await User.findByIdAndDelete(req.user.id);
        res.
        clearCookie("access_token")
        .status(200)
        .json({message: "User deleted successfully"});
    } catch (error) {
        next(error)
    }

}

export const getUserListing = async (req, res, next) => {
    if (req.user.id === req.params.id){
        try {
            const listings = await Listing.find({userRef: req.params.id});
            res.status(200).json(listings);
        } catch (error) {
            next(error);
        }
    }
    else{
        return next(errorHandler(401, "You can only view your own listings!"));
    }

}