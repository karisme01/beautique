import slugify from "slugify"
import brandModel from "../models/brandModel.js"
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js"
import fs from 'fs';


export const createBrandController = async (req, res) => {
    try {
        const {name, phone} = req.fields
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
        const brand = await new brandModel({name, slug:slugify(name), phone: phone}).save()
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