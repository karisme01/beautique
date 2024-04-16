import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

export const searchUserController = async (req, res) => {
    try {
        const searchQuery = req.query.search;
        let query = {};
        if (searchQuery) {
        query = { name: new RegExp(searchQuery, 'i') }; // Case-insensitive search by name
        }
        const users = await userModel.find(query);
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: 'Failed to fetch user' });
    }
}

export const searchOrderController = async (req, res) => {
    try {
        const orderId = req.query.orderId; 
        if (!orderId) {
            return res.status(400).json({ error: 'OrderId is required' });
        }
        const order = await orderModel.findById(orderId).populate('items.product');
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error(error); // It's good practice to log the error for debugging
        res.status(400).json({ error: 'Failed to fetch order' });
    }
}

export const getUserAddressController = async (req, res) => {
    try {
        const {userId} = req.params
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user.address);

    } catch (error) {
        console.error(error); // It's good practice to log the error for debugging
        res.status(400).json({ error: 'Failed to fetch user address' });
    }
}

export const UpdateUserAddressController = async (req, res) => {
    try {
        const {userId} = req.params
        const addresses = req.body;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.address = addresses;
        await user.save();

        res.status(200).json(user.address);

    } catch (error) {
        console.error(error); // It's good practice to log the error for debugging
        res.status(400).json({ error: 'Failed to fetch user address' });
    }
}