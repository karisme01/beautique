import express from "express"
import { registerController, loginController, testController, forgotPasswordController, updateProfileController} from "../controllers/authController.js"
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js"


// router Object
const router = express.Router()

//routing
//REGISTER || METHOD POST
router.post('/register', registerController)

//LOGIN || POST
router.post('/login', loginController)

//FORGOT PASSWORD
router.post('/forgot-password', forgotPasswordController)

//TEST
router.get('/test', requireSignIn, isAdmin, testController)

//PROTECTED USER AUTH ROUTE
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ok: true})
})

//PROTECTED ADMIN AUTH ROUTE
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ok: true})
})

//UPDATE PROFILE
router.put('/profile', requireSignIn, updateProfileController)


export default router