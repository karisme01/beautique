import express from "express";
import {isAdmin, isBrand, requireSignIn} from './../middlewares/authMiddleware.js'
import { brandController, brandPhotoController, createBrandController, createRequestController, deleteBrandController, findBrandsAndProductsByUserId, getBrandDetailsController, getProductTrendsController, uploadVideoController, searchUserBrandController, singleBrandController, updateBrandController, getProductsbyBrandController, getVideosByBrandController, updateFollowingController, getPostsController, postPhotoController } from "../controllers/brandController.js";
import formidable from 'express-formidable'
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

//get-brand-details
router.get('/get-brand-details/:userId', requireSignIn, isBrand, getBrandDetailsController)

//get-product-trends
router.get('/get-product-trends/', requireSignIn, isBrand, getProductTrendsController)

//upload brand product baby
router.put('/upload-video/:id', upload.single('file'), uploadVideoController);

//get products by brands
// router.get('/get-brand-products/:id', isBrand, getProductsbyBrandController)

//get-brand-videos
router.get('/get-brand-videos/:id', requireSignIn, isBrand, getVideosByBrandController)

//update follower status
router.post('/update-following/:id', requireSignIn, updateFollowingController)

//get-posts
router.get('/get-posts', getPostsController)

//get-post-image
router.get('/get-post-image/:pid', postPhotoController)

