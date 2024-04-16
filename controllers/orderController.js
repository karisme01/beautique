import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import orderItemModel from "../models/orderItemModel.js";
import brandModel from "../models/brandModel.js";

export const createOrderController = async (req, res) => {
    try {
        const { user, items } = req.body;
        const userObject = await userModel.findById(user);
        if (!userObject) {
            return res.status(404).json({ error: 'User not found' }); // Use 404 for "Not Found"
        }

        // Create and save OrderItem documents, collect their IDs
        const itemIds = await Promise.all(items.map(async itemData => {
            const orderItem = new orderItemModel({
                ...itemData,
                collectedDate: null,
                leaseReturnDate: null,
                extension: 0,
                leaseReturned: false,
                returned: false,
                returnReason: null
            });
            await orderItem.save();
            return orderItem._id; 
        }));

        const order = new orderModel({
            userId: user,
            userName: userObject.name,
            items: itemIds, 
            status: 'Production', 
        });

        await order.save();
        res.status(201).json(order); // Order creation successful
    } catch (error) {
        console.error("Failed to create order", error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to create order' }); // Use 500 for server errors
    }
};


export const createOrderBrandController = async (req, res) => {
    try {
        console.log(req.body);
        const { user, items } = req.body;
        const userObject = await userModel.findById(user);
        if (!userObject) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Helper function to add days to a date
        const addDays = (date, days) => {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        };

        const itemIds = await Promise.all(items.map(async itemData => {
            const currentDate = new Date();
            const baseDays = itemData.purchaseType === '1' ? 4 : 7; // 4 or 7 days based on purchaseType
            const leaseReturnDate = addDays(currentDate, baseDays);

            const orderItem = new orderItemModel({
                ...itemData,
                collectedDate: currentDate, 
                leaseReturnDate: leaseReturnDate,
                extension: 0,
                leaseReturned: false,
                returned: false,
                returnReason: null
            });
            await orderItem.save();
            return orderItem._id; 
        }));

        const order = new orderModel({
            userId: user,
            userName: userObject.name,
            items: itemIds,
            status: 'Collected', 
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(400).json({ error: 'Failed to create order' });
    }
}


export const getOrdersByUserController = async (req, res) => {
    try {
        const { userId } = req.params; 
        const orders = await orderModel.find({ userId: userId }).populate({path: 'items',
            populate: {path: 'product',model: 'Products' // Ensure 'Product' matches your product model name
            }
        }).sort({createdAt: -1})
        .exec();
        if (!orders.length) {
            return res.status(200).json({ message: 'No orders found for this user.' });
        }
        res.status(200).json(orders);
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
}  

export const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({}).populate('items').exec();; 
        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found.' });
        }
        res.status(200).json(orders);
    } catch (error) {
        console.error(error); // It's good practice to log the error for debugging purposes
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
} 

export const getOrderItembyBrandController = async (req, res) => {
    try {
        const {userId} = req.params
        const brand = await brandModel.findOne({userId: userId})
        const brandId = brand._id
        const orderItem = await orderItemModel.find({brandId: brandId}).sort({createdAt: -1}) ; 
        if (!orderItem.length) {
            return res.status(404).json({ message: 'No order found.' });
        }
        res.status(200).json(orderItem);
    } catch (error) {
        console.error(error); // It's good practice to log the error for debugging purposes
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
} 

export const getOrderItemsController = async (req, res) => {
    try {
        const orderItems = await orderItemModel.find({})
        if (!orderItems.length) {
            return res.status(404).json({ message: 'No order found.' });
        }
        res.status(200).json(orderItems);
    } catch (error) {
        console.error(error); // It's good practice to log the error for debugging purposes
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
} 

export const getOrderItemsByStatusController = async (req, res) => {
    try {
        const { status } = req.params
        console.log(status)
        const orderItems = await orderItemModel.find({status: status})
        // if (!orderItems.length) {
        //     return res.status(404).json({ message: 'No order found.' });
        // }
        res.status(200).json(orderItems);
    } catch (error) {
        console.error(error); // It's good practice to log the error for debugging purposes
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
} 

export const updateOrderController = async (req, res) => {  
    const { orderId } = req.params;
    const { status } = req.body; 

    try {
        const order = await orderItemModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.status = status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.log(error) 
        res.status(500).json({ error: 'Failed to update orders' });
    }
}


export const updateOrderItemStatus = async (req, res) => {
    const { itemId, newStatus } = req.body;
    try {
        const item = await orderItemModel.findById(itemId);
        if (newStatus === 'Collected') {
            const currentDate = new Date();
            item.collectedDate = currentDate;
            
            const addDays = (date, days) => {
                const result = new Date(date);
                result.setDate(result.getDate() + days);
                return result;
            };

            if (item.purchaseType !== '0') {
                const baseDays = item.purchaseType === '1' ? 3 : 7; 
                item.leaseReturnDate = addDays(currentDate, baseDays);
            }
        }

        item.status = newStatus;
        await item.save();

        const order = await orderModel.findOne({ items: itemId });
        if (!order) {
            return res.status(404).send({ message: 'Order not found for the specified item' });
        }
        const items = await orderItemModel.find({ _id: { $in: order.items } });
        const statusLevels = { 'Production': 1, 'Shipped': 2, 'Collected': 3 };
        const minStatus = items.reduce((acc, item) => {
            return statusLevels[item.status] < statusLevels[acc] ? item.status : acc;
        }, 'Collected'); 

        await orderModel.findByIdAndUpdate(order._id, { status: minStatus });

        res.send({ message: 'Order and order items updated successfully' });
    } catch (error) {
        console.error("Error updating order and item statuses:", error);
        res.status(500).send({ message: 'Failed to update statuses', error });
    }
};


export const updateOrderItemExtension = async (req, res) => {
    const { itemId, extensionDays } = req.body;
    try {
        const updatedItem = await orderItemModel.findByIdAndUpdate(
            itemId,
            { $set: { extension: extensionDays } },
            { new: true } 
        );

        if (!updatedItem) {
            return res.status(404).send({ message: 'Order item not found' });
        }

        res.send({ message: 'Order item extension updated successfully', updatedItem });
    } catch (error) {
        console.error("Error updating item extension:", error);
        res.status(500).send({ message: 'Failed to update extension', error });
    }
} 
 
export const updateReturnItemUserController = async (req, res) => {
    try {
        const {itemId, reason} = req.body
        console.log(req.body)
        await orderItemModel.findByIdAndUpdate(itemId, {status: 'Processing Return'});
        res.send({ message: 'Order item return updated successfully'});
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Failed to update return', error });
    }
}