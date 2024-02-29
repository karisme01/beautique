import express from "express";
import {isAdmin, requireSignIn} from './../middlewares/authMiddleware.js'
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from "../controllers/categoryController.js";

const router = express.Router()

//routes
//create route
router.post(
    '/create-category', 
    requireSignIn, 
    isAdmin, 
    createCategoryController
    );


//update route
router.put('/update-category/:id', requireSignIn, isAdmin, updateCategoryController)
export default router

//getAll categories
router.get('/get-category', categoryController)

//single category get
router.get('/single-category/:slug', singleCategoryController)

//delete category
router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController)
