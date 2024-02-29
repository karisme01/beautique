import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { createProductController, deleteProductController, getProductController, getSingleProductController, productBrandController, productCategoryController, productCountController, productFiltersBrandController, productFiltersCategoryController, productFiltersController, productListController, productPhotoController, relatedProductController, searchProductController, updateProductController } from "../controllers/productController.js";
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

//get photo
router.get('/product-photo/:pid', productPhotoController)

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

export default router;