import express from "express";
import {isAdmin, isBrand, requireSignIn} from './../middlewares/authMiddleware.js'
import { brandController, brandPhotoController, createBrandController, createRequestController, deleteBrandController, findBrandsAndProductsByUserId, searchUserBrandController, singleBrandController, updateBrandController } from "../controllers/brandController.js";
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

//get-user
router.get('/search-user', requireSignIn, isBrand, searchUserBrandController)

//create-request
router.post('/create-ad-request', requireSignIn, isBrand, createRequestController)

//get-brand-products
router.get('/get-brand-products/:userId', requireSignIn, isBrand, findBrandsAndProductsByUserId)