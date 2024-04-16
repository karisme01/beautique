import slugify from "slugify"
import brandModel from "../models/brandModel.js"
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js"
import fs from 'fs';
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import requestModel from "../models/requestModel.js";


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