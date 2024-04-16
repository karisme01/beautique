import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from 'express-formidable'
import { searchOrderController, searchUserController, getUserAddressController, UpdateUserAddressController } from "../controllers/adminController.js";

const router = express.Router()

//get-user
router.get('/search-user', requireSignIn, isAdmin, searchUserController)

//get-order
router.get('/search-order', requireSignIn, isAdmin, searchOrderController)

//get-user-address
router.get('/get-user-address/:userId', requireSignIn, getUserAddressController)

//update-user-address
router.post('/update-user-address/:userId', requireSignIn, UpdateUserAddressController)


export default router; 