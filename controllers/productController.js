import slugify from "slugify";
import categoryModel from '../models/categoryModel.js'
import productModel from "../models/productModel.js"
import brandModel from "../models/brandModel.js"
import fs from 'fs';
import userModel from "../models/userModel.js";
import OpenAI from "openai";
import natural from 'natural';
import videoModel from "../models/videoModel.js";
import postModel from "../models/postModel.js";

// const openai = new OpenAI({
//     apiKey: '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'
// });

export const createProductController = async (req, res) => {
    try {
        const {name, slug, description, occasion, sleeve, price, category, quantity, shipping, color, material, brand} = req.fields;
        const {photo} = req.files;

        const products = new productModel({...req.fields, slug: slugify(name), reviews: []});
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        } 

        const properties = {
            red: 0, yellow: 0, green: 0, gold: 0, white: 0, black: 0, blue: 0, brown: 0,
            indowesternwear: 0, kurtistunics: 0, sari: 0,
            tank: 0, cap: 0, shortsleeve: 0, midlength: 0, threequarter: 0, fullsleeve: 0,
            cotton: 0, nylon: 0, silk: 0, wool: 0, leather: 0, chiffon: 0,
            party: 0, formal: 0, casual: 0, festival: 0, wedding: 0,
            pricerange1: 0, pricerange2: 0, pricerange3: 0, pricerange4: 0, pricerange5: 0
        };
    
            const categoryName = await categoryModel.findById(category).exec();
    
        // Helper function to update properties based on input
            const updateProperties = (key, value) => {
                const lowerValue = value.toLowerCase().replace(/[\s\-&]+/g, '');
                if (properties.hasOwnProperty(lowerValue)) {
                    properties[lowerValue] = 1;
                }
            };
    
            // Update properties based on input
            updateProperties('color', color);
            console.log(category)
            updateProperties('category', categoryName.name);
            updateProperties('sleeve', sleeve);
            updateProperties('material', material);
            updateProperties('occasion', occasion);
    
            // Price range logic (assuming price is a number)
            const priceRanges = [1000, 5000, 10000, 20000];
            const priceRangeKeys = ['pricerange1', 'pricerange2', 'pricerange3', 'pricerange4', 'pricerange5'];
            let priceIndex = priceRanges.findIndex(range => price < range);
            priceIndex = priceIndex === -1 ? priceRanges.length : priceIndex;
            properties[priceRangeKeys[priceIndex]] = 1;
    
            products.properties = properties;
    

        await products.save();
        const post = new postModel({
            image: {
                data: fs.readFileSync(photo.path), 
                contentType: photo.type
            },
            link: `/product/${products.slug}`,
            caption: 'Check out this new product!',
        });

        await post.save();
        res.status(201).send({
            success: true,
            message: "Product Created Successfully",
            products,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error while creating product'
        });
    }
}


// get all products
export const getProductController = async (req, res) => {
    try {
        const products = await productModel
            .find({})
            .populate('category brand')
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

//get single product using id
export const getSingleProductIdController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id) 
                       .select('-photo') 
                       .populate('category') 
                       .populate('brand'); 

        if (!product) {
            return res.status(404).send({ success: false, message: 'Product not found' });
        }
            
        res.status(200).send({
            success: true,
            message: 'Single Product Fetched',
            product
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error while getting single product'
        });
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

//get-video
export const getProductVideoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("video");
        if (product.video && product.video.data) {
            res.set('Content-Type', product.video.contentType);
            return res.status(200).send(product.video.data);
        } else {
            return res.status(404).send({
                success: false,
                message: 'No video found for this product'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error while getting product video'
        });
    }
};


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
      const { photo, video } = req.files;
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

      if (video) {
        products.video.data = fs.readFileSync(video.path);
        products.video.contentType = video.type;
    }
      const properties = {
        red: 0, yellow: 0, green: 0, gold: 0, white: 0, black: 0, blue: 0, brown: 0,
        indowesternwear: 0, kurtistunics: 0, sari: 0,
        tank: 0, cap: 0, shortsleeve: 0, midlength: 0, threequarter: 0, fullsleeve: 0,
        cotton: 0, nylon: 0, silk: 0, wool: 0, leather: 0, chiffon: 0,
        party: 0, formal: 0, casual: 0, festival: 0, wedding: 0,
        pricerange1: 0, pricerange2: 0, pricerange3: 0, pricerange4: 0, pricerange5: 0
    };

        const categoryName = await categoryModel.findById(category).exec();

    // Helper function to update properties based on input
        const updateProperties = (key, value) => {
            const lowerValue = value.toLowerCase().replace(/[\s\-&]+/g, '');
            if (properties.hasOwnProperty(lowerValue)) {
                properties[lowerValue] = 1;
            }
        };

        // Update properties based on input
        updateProperties('color', color);
        console.log(category)
        updateProperties('category', categoryName.name);
        updateProperties('sleeve', sleeve);
        updateProperties('material', material);
        updateProperties('occasion', occasion);

        // Price range logic (assuming price is a number)
        const priceRanges = [1000, 5000, 10000, 20000];
        const priceRangeKeys = ['pricerange1', 'pricerange2', 'pricerange3', 'pricerange4', 'pricerange5'];
        let priceIndex = priceRanges.findIndex(range => price < range);
        priceIndex = priceIndex === -1 ? priceRanges.length : priceIndex;
        properties[priceRangeKeys[priceIndex]] = 1;

        products.properties = properties;
        if (!products.reviews) {
            products.reviews = [];
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
        const products = await productModel.find(args).populate("category brand");;
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
        const {category, filterPrice, filterColor, filterSleeve, filterSize, filterMaterial, filterOccasion, filterRent} = req.body;
        let args = {};
        console.log(req.body)
        console.log([filterPrice, filterColor, filterSleeve, filterSize, filterMaterial, filterOccasion])
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
        if (Array.isArray(filterPrice) && filterPrice.length > 0) {
            args.$or = filterPrice.map(range => ({
                price: { $gte: range[0], $lte: range[1] }
            }));
        }
        
        const products = await productModel.find(args).populate('brand');
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
        const {brand, filterPrice, filterColor, filterSleeve, filterSize, filterMaterial, filterOccasion} = req.body;
        let args = {};
        console.log(req.body)
        console.log([brand, filterPrice, filterColor, filterSleeve, filterSize, filterMaterial, filterOccasion])
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
        if (Array.isArray(filterPrice) && filterPrice.length > 0) {
            args.$or = filterPrice.map(range => ({
                price: { $gte: range[0], $lte: range[1] }
            }));
        }

        const products = await productModel.find(args).populate("category brand");;
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
      const perPage = 8;
      const page = req.params.page ? req.params.page : 1;
      const products = await productModel
        .find({})
        .select("-photo")
        .skip((page - 1) * perPage)
        .limit(perPage) 
        .sort({ createdAt: -1 })
        .populate("category brand");;
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
//   export const searchProductController = async (req, res) => {
//     try {
//         const {keyword} = req.params
//         const results = await productModel.find({
//             $or: [
//                 {name: {$regex: keyword, $options: 'i'}},
//                 {description: {$regex: keyword, $options: 'i'}},
//                 {color: {$regex: keyword, $options: 'i'}},
//                 {material: {$regex: keyword, $options: 'i'}},
//                 {occasion: {$regex: keyword, $options: 'i'}},
//                 // {brand.name: {$regex: keyword, $options: 'i'}}, 
//             ]
//         }).select('-photo')
//         res.json(results)
//     } catch (error) {   
//         console.log(error)
//         res.status(400).send({
//             success: false,
//             message: 'Error in search product API',
//             error
//         })
//     }
//   };

export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;

        // Stem the keyword using Natural
        const stemmer = natural.PorterStemmer;
        const stemmedKeyword = stemmer.stem(keyword);

        // Example search logic with stemmed keyword
        const results = await productModel.find({
            $or: [
                {name: {$regex: stemmedKeyword, $options: 'i'}},
                {description: {$regex: stemmedKeyword, $options: 'i'}},
                {color: {$regex: stemmedKeyword, $options: 'i'}},
                {material: {$regex: stemmedKeyword, $options: 'i'}},
                {occasion: {$regex: stemmedKeyword, $options: 'i'}},
                // Uncomment and adjust if needed
                // {"brand.name": {$regex: stemmedKeyword, $options: 'i'}}, 
            ]
        }).select('-photo').populate("category brand");;

        res.json(results);
    } catch (error) {   
        console.error(error);
        res.status(400).send({
            success: false,
            message: 'Error in search product API',
            error: error.message
        });
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
        .populate("category brand");
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
        const perPage = 15;
        const page = req.params.page ? req.params.page : 1;
        const category = await categoryModel.findOne({ slug: req.params.slug });
        const sortOption = req.query.sort;
        let sortCriteria = { createdAt: -1 }; // Default sorting by createdAt
        if (sortOption === 'price (Low To High)') {
            sortCriteria = { price: 1 };
        } else if (sortOption === 'price (High To Low)') {
            sortCriteria = { price: -1 };
        } else if (sortOption === 'new Arrivals') {
            sortCriteria = { createdAt: -1 };
        }
        const count = await productModel.countDocuments({ category });
        console.log(category)
        const products = await productModel
            .find({ category })
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort(sortCriteria)
            .populate("category brand");
        res.status(200).send({
          success: true,
          category,
          products,
          count
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

export const getCuratedProductsController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const products = await productModel.find({
            _id: { $nin: [...user.seenProducts] }
        }).select("-photo").exec();

        const userPreferences = user.preferences; 

        const calculateMatchScore = (productProperties = new Map(), userPreferences = new Map()) => {
            let score = 0;
        
            // Ensure productProperties and userPreferences are Maps
            if (!(productProperties instanceof Map) || !(userPreferences instanceof Map)) {
                console.error('Invalid arguments: productProperties and userPreferences must be Maps');
                return 0;
            }
            for (const [key, prefValue] of userPreferences) {
                const productValue = productProperties.get(key);
                if (typeof productValue === 'number' && typeof prefValue === 'number') {
                    score += productValue * prefValue;
                } else {
                    console.log(`Mismatch or non-numeric value for ${key}: productValue=${productValue}, prefValue=${prefValue}`);
                }
            }
            return score;
        };
        
        // Map products with their match scores
        const productsWithScores = products.map(product => {
            const score = calculateMatchScore(product.properties, userPreferences)
            return { ...product.toObject(), matchScore: score };
        });
        const sortedProducts = productsWithScores.sort((a, b) => b.matchScore - a.matchScore);

        const seenProducts = await productModel.find({
            _id: { $in: user.seenProducts }
        }).select("-photo").exec();

        const combinedProducts = [...sortedProducts, ...seenProducts]; 

        res.status(200).send({ success: true, products: combinedProducts });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "An error occurred while getting curated products" });
    }
}; 

export const getOpenAISearchController = async (req, res) => {
    const { text } = req.body;
    console.log(text)
    try {
        function parseClothingOptions(str) {
            console.log('Original String:', str);
            const map = new Map();
            const regex = /(\w+):\s*\[([^\]]+)\]/g;
            let match;
            while ((match = regex.exec(str)) !== null) {
              // Key: match[1], Value: match[2] (potential array elements)
              const key = match[1].trim();
              const valueString = match[2];
              const elements = [...valueString.matchAll(/'([^']+)'/g)].map(m => m[1]);
              map.set(key, elements);
            }
            return map;
          }

          const calculateMatchScore = (product, criteria) => {
            let score = 0;
            if (criteria.color.includes(product.color)) score += 3;
            // if (criteria.category.includes(product.category.toString())) score += 4;
            if (criteria.occasion.includes(product.occasion)) score += 3;
            if (criteria.material.includes(product.material)) score += 2;
            if (criteria.sleeve.includes(product.sleeve)) score++;
            return score;
          };
           
        const completion = await openai.completions.create({
            model: "gpt-3.5-turbo-instruct",
            prompt: `I am going to give you a text about my needs for clothing options. I want you to imply certain categories from the text. 1) Category - what kind of clothing option would be apt. Choose from 'Sari', 'Indo-Western Wear', 'Kurtis & Tunics'. 2) Color - what kind of color would be apt. Choose from 'Black', 'White', 'Orange', 'Red', 'Blue', 'Yellow', 'Green'. 3) What kind of sleevelength would be apt. If hot, you can choose tank or cap, if cold, can use full. Choose from 'Tank', 'Cap', 'Mid-length', and 'Full-sleeve'. 4) Occasion - what ype of occasion is more apt. Choose from 'Party', 'Wedding', 'Festival', 'Casual', 'Formal'. 5) Material - what type of material is apt. Choose from 'Cotton', 'Leather', 'Nylon', 'Wool', 'Silk'. After choosing, give me a javascript map of these categories with their respective options in an array in plain text. You can choose more than one option. Like you can choose red and yellow and white for color. JUST GIVE ME THE MAP. NO TEXT. This is the text - ${text}. Give your output in this structure - Category: ['western'], Color: ['black']...etc. Give all the categories.`,
            max_tokens: 120,
            temperature: 0.5,
          });
          const aiResponse = completion.choices[0].text
          const clothingOptions = parseClothingOptions(aiResponse);
          console.log(clothingOptions)

          const categoryFetchPromises = clothingOptions.get('Category').map(async (categoryName) => {
            return await categoryModel.findOne({ name: categoryName }); 
            });
          const categoriesObjects = await Promise.all(categoryFetchPromises);
          const categoryIds = categoriesObjects.map(obj => obj._id); 


          //sorting all the products with score
          let args = {};
          if (categoryIds.length > 0) {
                args.category = { $in: categoryIds }; 
            }
          const allProducts = await productModel.find(args).select("-photo")
          const scoredProducts = allProducts.map(product => ({
            product,
            score: calculateMatchScore(product, {
              color: clothingOptions.get('Color') || [],
            //   category: categoryIds,
              occasion: clothingOptions.get('Occasion') || [],
              sleeve: clothingOptions.get('Sleeve') || [],
              material: clothingOptions.get('Material') || [],
            })
          }));

          scoredProducts.sort((a, b) => b.score - a.score);
          const sortedProducts = scoredProducts.map(sp => sp.product);

          res.status(200).send({
            success: true,
            products: sortedProducts,
          });


            // let args = {};

            // const categoryFetchPromises = clothingOptions.get('Category').map(async (categoryName) => {
            //     return await categoryModel.findOne({ name: categoryName }); 
            // });

            // const categoriesObjects = await Promise.all(categoryFetchPromises);
            
            // const categoryIds = categoriesObjects.map(obj => obj._id); 

            // if (categoryIds.length > 0) {
            //     args.category = { $in: categoryIds }; 
            // }

            // if (Array.isArray(clothingOptions.get('Color')) && clothingOptions.get('Color').length > 0) {
            //     args.color = { $in: clothingOptions.get('Color')};
            // } 
            // if (Array.isArray(clothingOptions.get('Sleevelength')) && clothingOptions.get('Sleevelength').length > 0) {
            //     args.sleevelength = { $in: clothingOptions.get('Sleevelength') };
            // } 
            // if (Array.isArray(clothingOptions.get('Occasion')) && clothingOptions.get('Occasion').length > 0) {
            //     args.occasion = { $in: clothingOptions.get('Occasion') };
            // } 
            // if (Array.isArray(clothingOptions.get('Material')) && clothingOptions.get('Material').length > 0) {
            //     args.material = { $in: clothingOptions.get('Material') };
            // } 
            // console.log(args)
            // const products = await productModel.find(args).select("-photo");
            // res.status(200).send({
            //     success: true,
            //     products,
            // });

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "An error occurred while getting openAI search" });
    }
}


// export const getVideosController = async (req, res) => {
//     try {
//         const videos = await videoModel.find({}).populate({ path: 'productId', select: 'name description'});
//         const formattedVideos = videos.map(video => ({
//             name: video.productId.name,
//             description: video.productId.description,
//             video: {
//                 data: video.video.data.toString('base64'), 
//                 contentType: video.video.contentType
//             }
//         }));

//         res.status(200).json(formattedVideos);
//     } catch (error) { 
//         console.log(error);
//         res.status(500).json({ message: "An error occurred while getting videos" });
//     }
// };


export const getVideosController = async (req, res) => {
    try {
        const videos = await videoModel.find({}).populate({ path: 'productId', select: 'name description'});
        const SliderItems1 = videos.map(video => ({
            title: video.productId.name,
            content: video.productId.description,
            video: `data:${video.video.contentType};base64,${video.video.data.toString('base64')}`
        }));

        res.status(200).json(SliderItems1);
    } catch (error) { 
        console.log(error);
        res.status(500).json({ message: "An error occurred while getting videos" });
    }
};








