import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token; // Note à moi-meme : C'est ici que j'ai cookieParser en fait, sinon ce serait impossible
    if(!token) return next(errorHandler(401, "Non Autorisé: Vous devez etre connecté pour cette action."));

    jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {

        if (err) return next(errorHandler(403, "Forbidden"));

        req.user = user;
        next();
    })
}
