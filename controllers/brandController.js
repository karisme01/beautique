import slugify from "slugify"
import brandModel from "../models/brandModel.js"
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js"
import fs from 'fs';
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import requestModel from "../models/requestModel.js";
import orderItemModel from '../models/orderItemModel.js'
import videoModel from "../models/videoModel.js";


export const createBrandController = async (req, res) => {
    try {
        const {name, phone, userId} = req.fields
        const {photo} = req.files
        if (!name) {
            return res.status(401).send({message: 'Name is required'})
        }
        const existingBrand = await brandModel.findOne({name})
        if (existingBrand) {
            return res.status(200).send({
                success: true,
                message: 'Brand already exists'
            })
        }
        const brand = await new brandModel({name, slug:slugify(name), phone: phone, userId: userId}).save()
        if (photo) {
            console.log('photo is true')
            brand.photo.data = fs.readFileSync(photo.path)
            brand.photo.contentType = photo.type
        }
        await brand.save();
        res.status(201).send({
            success: true,
            message: 'new brand created',
            brand
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Brand'
        })
    }
}   


//update brand
export const updateBrandController = async (req, res) => {
    try {
        const {name, phone} = req.body
        const {id} = req.params
        const brand = await brandModel.findByIdAndUpdate(id, {name, slug: slugify(name), phone}, {new:true})
        res.status(200).send({
            success: true,
            message: 'Brand Updated Successfully',
            brand
        });
    } catch (error) {   
        console.log(error)
        res.status(500).send({
            sucess: false,
            error,
            message: 'Error while updating brand'
        })
    }
};

//getAll brands
export const brandController = async (req, res) => {
    try {
        const brand = await brandModel.find({})
        res.status(200).send({
            success: true,
            message: 'All Brands List',
            brand
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error while getting all brands'
        })
    }
}

//single brand get
export const singleBrandController = async (req, res) => {
    try {
        const brand = await brandModel.findOne({slug: req.params.slug})
        res.status(200).send({
            success: true,
            message: 'Get Single Brand Successfully',
            brand
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error while getting single brand'
        })
    }
}

//delete brand 
export const deleteBrandController = async (req, res) => {
    try {
        const {id} = req.params
        await brandModel.findByIdAndDelete(id)
        res.status(200).send({
            success: true,
            message: 'Brand deleted successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error while deleting brand'
        })
    }
}

//get brand photo
export const brandPhotoController = async (req, res) => {
    try {
        const brand = await brandModel.findById(req.params.bid).select("photo")
        if (brand.photo.data) {
            res.set('Content-type', brand.photo.contentType)
            return res.status(200).send(brand.photo.data)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error, 
            message: 'error while getting brand photo'
        })
    } 
}

export const searchUserBrandController = async (req, res) => {
    try {
        const searchQuery = req.query.name;
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

export const findBrandsAndProductsByUserId = async (req, res) => {
    try {
        const { userId } = req.params; 
        const brands = await brandModel.find({ userId: userId }); 
        // console.log(brands)
        const brandIds = brands.map(brand => brand._id);
        const products = await productModel.find({ brand: { $in: brandIds } }).select("-photo").populate('brand', 'name'); 

        res.status(200).send({ 
            success: true,
            message: 'Products found for brands associated with the given user',
            brands, 
            products
        });
    } catch (error) { 
        console.error(error); // Log error to the console for debugging
        res.status(500).send({
            success: false,
            message: 'Failed to find brands or products',
            error: error.message
        });
    }
};

export const createRequestController = async (req, res) => {
    try {
        const {userId, requestType, selectedDate, inputText} = req.body
        console.log(userId)
        const brand = await brandModel.findOne({userId: userId})
        console.log(brand)
        if (!brand) {
            return res.status(404).json({ error: 'Brand not found' });
        }
        const newRequest = new requestModel({
            userId: userId, brandId: brand._id, date: selectedDate, type: requestType, text: inputText
        })
        await newRequest.save();
        res.status(201).send({ message: 'Request created successfully', data: newRequest });
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'Failed to create ad request' });
    }
}

export const getBrandDetailsController = async (req, res) => {
    try {
        const { userId } = req.params;
        const brand = await brandModel.findOne({ userId: userId });
        if (!brand) {
            return res.status(404).json({ error: 'Brand not found' });
        }
        const brandId = brand._id;
        const results = await orderItemModel.aggregate([
            { $match: { brandId: brandId } },
            { $lookup: { // Joining with Products collection to fetch price details
                from: 'products', // Ensure this matches your actual collection name
                localField: 'product',
                foreignField: '_id',
                as: 'productDetails'
            }},
            { $unwind: '$productDetails' }, // Unwinding the results of the lookup to access product details
            { $group: {
                _id: null,
                totalUnitsSold: { $sum: 1 },
                totalRevenue: { $sum: {
                    $switch: {
                        branches: [
                            { case: { $eq: ["$purchaseType", "0"] }, then: "$productDetails.price" },
                            { case: { $eq: ["$purchaseType", "1"] }, then: { $multiply: ["$productDetails.price", 0.3] }},
                            { case: { $eq: ["$purchaseType", "2"] }, then: { $multiply: ["$productDetails.price", 0.4] }}
                        ],
                        default: 0
                    }
                }}
            }}
        ]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'No sales data available for this brand.' });
        }
        res.json({ 
            totalUnitsSold: results[0].totalUnitsSold,
            totalRevenue: results[0].totalRevenue
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Failed to get brand details' });
    }
}



export const getProductTrendsController = async (req, res) => {
    try {
        // Here we are calculating trends without filtering by a specific brand or user
        const trends = await productModel.aggregate([
            {
                $facet: {
                    colorTrends: [
                        { $group: { _id: "$color", count: { $sum: 1 } } },
                        { $sort: { count: -1 } }
                    ],
                    occasionTrends: [
                        { $group: { _id: "$occasion", count: { $sum: 1 } } },
                        { $sort: { count: -1 } }
                    ],
                    materialTrends: [
                        { $group: { _id: "$material", count: { $sum: 1 } } },
                        { $sort: { count: -1 } }
                    ],
                    categoryTrends: [
                        { $lookup: {
                            from: 'categories', // Assuming your categories collection name is 'categories'
                            localField: 'category',
                            foreignField: '_id',
                            as: 'categoryDetails'
                        }},
                        { $unwind: '$categoryDetails' },
                        { $group: { _id: '$categoryDetails.name', count: { $sum: 1 } } },
                        { $sort: { count: -1 } }
                    ]
                }
            }
        ]);

        // Handling the case where no trends could be computed
        if (!trends || trends.length === 0 || Object.keys(trends[0]).some(key => trends[0][key].length === 0)) {
            return res.status(404).json({ message: 'No product trends data available.' });
        }
        // Sending the computed trends as response
        res.json({ trends });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Failed to get product trends' });
    }
}


export const uploadVideoController = async (req, res) => { 
    try { 
        const { id } = req.params; 
        const {userId} = req.body
        const brand = await brandModel.findOne({userId: userId})
        if (!brand) {
            return res.status(404).json({ error: 'Brand not found' });
          }
        if (req.file) {
            const { buffer, mimetype } = req.file;
            const newVideo = new videoModel({
                productId: id,
                brandId: brand._id,
                video: {
                    data: buffer,
                    contentType: mimetype
                }
            });
            await newVideo.save();
            res.status(201).json({ success: true, message: "Video uploaded successfully" });
        } else {
            res.status(400).json({ error: "No video uploaded" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to upload video' });
    }
};

export const getProductsbyBrandController = async (req, res) => {
    try {
        const {userId} = req.params
        const brand = await brandModel.findOne({userId: userId})
        const brandId = brand._id
        const products = await productModel.find({brand: brandId}).sort({createdAt: -1}) ; 
        if (!products.length) {
            return res.status(404).json({ message: 'No order found.' });
        }
        res.status(200).json(products);
    } catch (error) {
        console.error(error); // It's good practice to log the error for debugging purposes
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
} 

export const getVideosByBrandController = async (req, res) => {
    try {
        const userId = req.params.id
        const brand = await brandModel.findOne({userId: userId})
        console.log(userId)
        console.log(brand)
        const brandId = brand._id
        const videos = await videoModel.find({brandId: brandId})
        if (!videos.length) {
            return res.status(404).json({ message: 'No video found.' });
        }
        const processedVideos = videos.map(video => ({
            ...video._doc,
            videoUrl: `data:${video.video.contentType};base64,${video.video.data.toString('base64')}`
        }));

        res.status(200).json(processedVideos);
    } catch (error) {
        console.error(error); // It's good practice to log the error for debugging purposes
        res.status(500).json({ error: 'Failed to retrieve brand videos' });
    }
}