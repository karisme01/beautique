import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { createProductController, deleteProductController, getCuratedProductsController, getOpenAISearchController, getProductController, getProductVideoController, getSingleProductController, getSingleProductIdController, getVideosController, productBrandController, productCategoryController, productCountController, 
productFiltersBrandController, productFiltersCategoryController, productFiltersController, productListController, productPhotoController, relatedProductController, searchProductController, updateProductController } from "../controllers/productController.js";
import formidable from 'express-formidable'

const router = express.Router()

//routes
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController)

//update product
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController)

//get products
router.get('/get-product', getProductController)

//single get product
router.get('/get-product/:slug', getSingleProductController)

//single get product id
router.get('/get-product-id/:id', getSingleProductIdController)

//get photo
router.get('/product-photo/:pid', productPhotoController)

//get video
router.get('/product-video/:pid', getProductVideoController)

//delete product
router.delete('/delete-product/:pid', deleteProductController)

//filter product
router.post('/product-filters', productFiltersController)

//filter product in category
router.post('/product-category-filters', productFiltersCategoryController)

//filter product in brand
router.post('/product-brand-filters', productFiltersBrandController)

//product count
router.get('/product-count', productCountController)

//product per page
router.get('/product-list/:page', productListController)

//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get('/related-products/:pid/:cid', relatedProductController)

//category wise product
router.get('/product-category/:slug/:page', productCategoryController)

//brand wise product
router.get('/product-brand/:slug/:page', productBrandController)

//brand wise product
router.get('/for-you-products', requireSignIn, getCuratedProductsController)

//recommend products (openai)
router.post('/recommend-products', requireSignIn, getOpenAISearchController)

//product videos
router.get('/get-videos', getVideosController)


export default router;