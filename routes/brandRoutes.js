import express from "express";
import {isAdmin, requireSignIn} from './../middlewares/authMiddleware.js'
import { brandController, brandPhotoController, createBrandController, deleteBrandController, singleBrandController, updateBrandController } from "../controllers/brandController.js";
import formidable from 'express-formidable'
import { productBrandController } from "../controllers/productController.js";


const router = express.Router()

//routes
//create route
router.post(
    '/create-brand', 
    requireSignIn, 
    isAdmin, 
    formidable(),
    createBrandController
    );


//update route
router.put('/update-brand/:id', requireSignIn, isAdmin, updateBrandController)
export default router

//getAll categories
router.get('/get-brand', brandController)

//single Brand get
router.get('/single-brand/:slug', singleBrandController)

//delete Brand
router.delete('/delete-brand/:id', requireSignIn, isAdmin, deleteBrandController)

//get brand photo
router.get('/brand-photo/:bid', brandPhotoController)