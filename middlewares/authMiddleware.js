import JWT from "jsonwebtoken"
import userModel from "../models/userModel.js";

//Protected Routes token base
// export const requireSignIn = async (req, res, next) => {
//     try {
//         const decode = JWT.verify(
//             req.headers.authorization, 
//             process.env.JWT_SECRET
//         );
//         req.user = decode;
//         next();
//     } catch (error) {
//         console.log(error)
         
//     }
// }

export const requireSignIn = (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
            const decoded = JWT.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            console.log(error);
            res.status(401).send({ error: "Unauthorized: Invalid token" });
        }
    } else {
        try {
            const decode = JWT.verify(
            req.headers.authorization, 
            process.env.JWT_SECRET
            );
            req.user = decode;
            next();
        } catch (error) {
            console.log(error)
                
        }
    }
};

//ADMIN ACCESS
export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id)
        if (user.role != 1) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized Access"
            })
        } else {
            next()
        }
    } catch (error) {
        console.log(error)
        res.status(401).send({
            success: false,
            message: "error in admin middleware",
            error
        })
    }
}

export const isBrand = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id)
        if (user.role != 2) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized Access"
            })
        } else {
            next()
        }
    } catch (error) {
        console.log(error)
        res.status(401).send({
            success: false,
            message: "error in admin middleware",
            error
        })
    }
}

export const isUser = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id)
        if (user.role != 0) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized Access"
            })
        } else {
            next()
        }
    } catch (error) {
        console.log(error)
        res.status(401).send({
            success: false,
            message: "error in admin middleware",
            error
        })
    }
}