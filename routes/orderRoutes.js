import express from "express";
import { isAdmin, isBrand, requireSignIn } from "../middlewares/authMiddleware.js";
// import formidable from 'express-formidable'
import { createOrderBrandController, createOrderController, getOrderItembyBrandController, getOrderItemsByStatusController, getOrderItemsController, getOrdersByUserController, getOrdersController, updateOrderItemExtension, updateOrderItemStatus, updateReturnItemUserController } from "../controllers/orderController.js";

const router = express.Router()

//create-order
router.post('/create-order', requireSignIn, createOrderController)

//create-order
router.post('/create-order-brand', requireSignIn, isBrand, createOrderBrandController)

//get-user-orders
router.get('/get-user-orders/:userId', requireSignIn, getOrdersByUserController)

//get-orders
router.get('/get-orders', requireSignIn, isAdmin, getOrdersController)

//get-orderItem
router.get('/get-orders-brand/:userId', requireSignIn, isBrand, getOrderItembyBrandController)

//get-orderItem by status
router.get('/get-order-items-status/:status', requireSignIn, isAdmin, getOrderItemsByStatusController)

// Update an order status
router.patch('/update-order-item-status/', updateOrderItemStatus);

// Update an order extension
router.patch('/update-order-item-extension/', updateOrderItemExtension);

// Update an order return
router.post('/update-order-item-return/', updateReturnItemUserController);

//get-order-items
router.get('/get-order-items', requireSignIn, isAdmin, getOrderItemsController)




export default router;