import slugify from "slugify";
import categoryModel from '../models/categoryModel.js'
import productModel from "../models/productModel.js"
import brandModel from "../models/brandModel.js"
import fs from 'fs';

export const createProductController = async (req, res) => {
    try {
        const {name, slug, description, occasion, sleeve, price, category, quantity, shipping, color, material, brand} = req.fields
        const {photo} = req.files
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({error: 'Name is required'})
            case !description:
                return res.status(500).send({error: 'Description is required'})
            case !price:
                return res.status(500).send({error: 'Price is required'})
            case !category:
                return res.status(500).send({error: 'Category is required'})    
            case !quantity:
                return res.status(500).send({error: 'Quantity is required'})
            case photo && photo.size > 1000000:
                return res.status(500).send({error: 'Photo is required and should be less than 1MB'})
        }
        const products = new productModel({...req.fields, slug: slugify(name)})
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save();
        res.status(201).send({
        success: true,
        message: "Product Created Successfully",
        products,
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error while creating product'
        })
    }
}

// get all products
export const getProductController = async (req, res) => {
    try {
        const products = await productModel
            .find({})
            .populate('category')
            .select("-photo")
            .sort({createdAt: -1}) 
        res.status(200).send({
            success: true, 
            message: 'All products',
            totalCount: products.length,
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error while getting products'
        })
    }
} 

//get single product
export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({slug:req.params.slug}).select('-photo').populate('category').populate('brand')
        res.status(200).send({
            success: true,
            message: 'Single Product Fetched',
            product
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'error while getting single product'
        })
    }
}

//get photo
export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo")
        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error, 
            message: 'error while getting product photo'
        })
    }
}

export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success: true,
            message: 'Product Deleted Successfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error, 
            message: 'Error in deleting product'
        })
    }
}

export const updateProductController = async (req, res) => {
    try {
        const { name, description, occasion, sleeve, price, category, quantity, shipping, color, material, brand} =
        req.fields;
      const { photo } = req.files;
      //alidation
      switch (true) {
        case !name:
          return res.status(500).send({ error: "Name is Required" });
        case !description:
          return res.status(500).send({ error: "Description is Required" });
        case !price:
          return res.status(500).send({ error: "Price is Required" });
        case !category:
          return res.status(500).send({ error: "Category is Required" });
        case !quantity:
          return res.status(500).send({ error: "Quantity is Required" });
        case photo && photo.size > 1000000:
          return res
            .status(500)
            .send({ error: "photo is Required and should be less then 1mb" });
      }
  
      const products = await productModel.findByIdAndUpdate(
        req.params.pid,
        { ...req.fields, slug: slugify(name) },
        { new: true }
      );
      if (photo) {
        products.photo.data = fs.readFileSync(photo.path);
        products.photo.contentType = photo.type;
      }
      await products.save();
      res.status(201).send({
        success: true,
        message: "Product Updated Successfully",
        products,
      });        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: true,
            error,
            message: 'Error while updating product'
        })
    }
}


//filter controller
export const productFiltersController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const products = await productModel.find(args);
        res.status(200).send({
        success: true,
        products,
        });
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error while filtering products',
            error
        })
    }
}

// export const productFiltersCategoryController = async (req, res) => {
//     try {
//         const {radio, color, sleeve, size, material, occasion} = req.body;
//         let args = {};
//         if (color.length > 0) args.color = color;
//         if (sleeve.length > 0) args.sleeve = sleeve;
//         if (size.length > 0) args.size = size;
//         if (material.length > 0) args.material = material;
//         if (occasion.length > 0) args.occasion = occasion;
//         if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
//         const products = await productModel.find(args);
//         res.status(200).send({
//         success: true,
//         products,
//         });
//     } catch (error) {
//         console.log(error)
//         res.status(400).send({
//             success: false,
//             message: 'Error while filtering products in a specific category',
//             error
//         })
//     }
// }
export const productFiltersCategoryController = async (req, res) => {
    try {
        const {category, radio, filterColor, filterSleeve, filterSize, filterMaterial, filterOccasion, filterRent} = req.body;
        let args = {};
        console.log(req.body)
        console.log([radio, filterColor, filterSleeve, filterSize, filterMaterial, filterOccasion])
        // Ensure array properties are defined and are arrays before accessing their length
        args.category = category
        if (Array.isArray(filterColor) && filterColor.length > 0) {
            args.color = { $in: filterColor };
        } 
        if (Array.isArray(filterSleeve) && filterSleeve.length > 0) {
            args.sleeve = { $in: filterSleeve };
        } 
        if (Array.isArray(filterSize) && filterSize.length > 0) {
            args.size = { $in: filterSize };
        } 
        if (Array.isArray(filterMaterial) && filterMaterial.length > 0) {
            args.material = { $in: filterMaterial };
        } 
        if (Array.isArray(filterOccasion) && filterOccasion.length > 0) {
            args.occasion = { $in: filterOccasion };
        } 

        // Ensure radio is defined and is an array before attempting to use its values for price range
        if (Array.isArray(radio) && radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

        const products = await productModel.find(args);
        console.log(args)
        console.log('hii')
        console.log(products)
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error while filtering products in a specific category',
            error
        });
    }
}

export const productFiltersBrandController = async (req, res) => {
    try {
        const {brand, radio, filterColor, filterSleeve, filterSize, filterMaterial, filterOccasion} = req.body;
        let args = {};
        console.log(req.body)
        console.log([brand, radio, filterColor, filterSleeve, filterSize, filterMaterial, filterOccasion])
        // Ensure array properties are defined and are arrays before accessing their length
        args.brand = brand
        if (Array.isArray(filterColor) && filterColor.length > 0) {
            args.color = { $in: filterColor };
        } 
        if (Array.isArray(filterSleeve) && filterSleeve.length > 0) {
            args.sleeve = { $in: filterSleeve };
        } 
        if (Array.isArray(filterSize) && filterSize.length > 0) {
            args.size = { $in: filterSize };
        } 
        if (Array.isArray(filterMaterial) && filterMaterial.length > 0) {
            args.material = { $in: filterMaterial };
        } 
        if (Array.isArray(filterOccasion) && filterOccasion.length > 0) {
            args.occasion = { $in: filterOccasion };
        } 

        // Ensure radio is defined and is an array before attempting to use its values for price range
        if (Array.isArray(radio) && radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

        const products = await productModel.find(args);
        console.log(args)
        console.log('hii')
        console.log(products)
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error while filtering products in a specific category',
            error
        });
    }
}




//product count
export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
        success: true,
        total,
        });
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error while counting products',
            error
        })
    }
}

//product list controller
export const productListController = async (req, res) => {
    try {
      const perPage = 10;
      const page = req.params.page ? req.params.page : 1;
      const products = await productModel
        .find({})
        .select("-photo")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });
      res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "error in per page ctrl",
        error,
      });
    }
  };

  //single product
  export const searchProductController = async (req, res) => {
    try {
        const {keyword} = req.params
        const results = await productModel.find({
            $or: [
                {name: {$regex: keyword, $options: 'i'}},
                {description: {$regex: keyword, $options: 'i'}},
            ]
        }).select('-photo')
        res.json(results)
    } catch (error) {   
        console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error in search product API',
            error
        })
    }
  };


//related product controller
export const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productModel
        .find({
            category: cid,
            _id: { $ne: pid },
        })
        .select("-photo")
        .limit(5)
        .populate("category");
        res.status(200).send({
        success: true,
        products,
        });
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error in searching related products',
            error
        })
    }
};

//productCategoryController
export const productCategoryController = async (req, res) => {
    try {
        const perPage = 10;
        const page = req.params.page ? req.params.page : 1;
        const category = await categoryModel.findOne({ slug: req.params.slug });
        const products = await productModel
            .find({ category })
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 })
            .populate("category");
        res.status(200).send({
          success: true,
          category,
          products,
        });
      } catch (error) {
        console.log(error);
        res.status(400).send({
          success: false,
          error,
          message: "Error While Getting products",
        });
      }
}

export const productBrandController = async (req, res) => {
    try {
        const perPage = 10;
        const page = req.params.page ? req.params.page : 1;
        const brand = await brandModel.findOne({ slug: req.params.slug });
        const products = await productModel
            .find({ brand: brand._id })
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 })
            .populate("brand");
        res.status(200).send({
          success: true,
          brand,
          products,
        });
      } catch (error) {
        console.log(error);
        res.status(400).send({
          success: false,
          error,
          message: "Error While Getting products",
        });
      }
}
