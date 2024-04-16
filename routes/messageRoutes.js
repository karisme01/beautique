import express from "express";
import { isAdmin, isBrand, requireSignIn } from "../middlewares/authMiddleware.js";
import { createMessageController } from "../controllers/messageController.js";
// import formidable from 'express-formidable'

const router = express.Router()

//create-send-message
router.post('/create-send-message', requireSignIn, createMessageController)



export default router;