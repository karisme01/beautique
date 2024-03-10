import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
    try {
        const {name, email, password, phone, address, answer, preferredCategories, 
                preferredColors, preferredMaterials, preferredOccasions, preferredPriceRanges} = req.body
        //validation
        if (!name) {
            return res.send({message: 'Name is Required'})
        }
        if (!email) {
            return res.send({message: 'Email is Required'})
        }
        if (!phone) {
            return res.send({message: 'Phone is Required'})
        }
        if (!address) {
            return res.send({message: 'Address is Required'})
        }
        if (!password) {
            return res.send({message: 'Password is Required'})
        }
        if (!answer) {
            return res.send({message: 'Answer is Required'})
        }
        // existing user
        const existinguser = await userModel.findOne({phone})
        if (existinguser) {
            return res.status(200).send({
                success: false,
                message: 'Already Register please login'
            })
        }
        //register user
        const hashedPassword = await hashPassword(password)

        //preferences
        const allPreferences = preferredCategories.concat(preferredColors, preferredMaterials, preferredOccasions, preferredPriceRanges);

        const preferences = {
            red: 0, yellow: 0, green: 0, gold: 0, white: 0, black: 0, blue: 0, brown: 0,
            indowesternwear: 0, kurtistunics: 0, sari: 0,
            tank: 0, cap: 0, shortsleeve: 0, midlength: 0, threequarter: 0, fullsleeve: 0,
            cotton: 0, nylon: 0, silk: 0, wool: 0, leather: 0, chiffon: 0,
            party: 0, formal: 0, casual: 0, festival: 0, wedding: 0,
            pricerange1: 0, pricerange2: 0, pricerange3: 0, pricerange4: 0, pricerange5: 0
        };
        //save
        allPreferences.forEach(pref => {
            const normalizedPref = pref.toLowerCase().replace(/[\s\-&]+/g, '');
            if (normalizedPref in preferences) {
                preferences[normalizedPref] = 1;
            }
        });
        const seenProducts = []

        const user = await new userModel({name, email, password: hashedPassword, phone, address, 
                answer, preferences: preferences, seenProducts: seenProducts}).save()

        res.status(201).send({
            success: true,
            message: 'User registered successfully',
            user
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'error in Registering',
            error
        })
    }
};


export const loginController = async (req, res) => {
    try {
        const {email, password} = req.body
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password",  
            })
        }
        //check user
        const user = await userModel.findOne({email})
        if (!user) {
            return res.status(404).send({
                success: "False",
                message: "Email not registered"
            })
        }
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password"
            })
        }
        //token creation
        const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        res.status(200).send({
            success: true,
            message: "login successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            }, 
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "error in login",
            error
        })
    }
}   

//forgotPasswordController

export const forgotPasswordController = async (req, res) => {
    try {
        const {email, answer, newPassword} = req.body
        if (!email) {
            res.status(400).send({message: 'Email is required'})
        }
        if (!answer) {
            res.status(400).send({message: 'Answer is required'})
        }
        if (!newPassword) {
            res.status(400).send({message: 'New Password is required'})
        }
        //check
        const user = await userModel.findOne({email, answer})
        if (!user) {
            return res.status(404).send({
                success: true,
                message: 'Wrong email or answer',
            })
        }
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id, {password:hashed})
        res.status(200).send({
            success: true,
            message: 'Password Reset Successfully'
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'something is wrong',
            error
        })
    }
}


//test controller
export const testController = (req, res) => {
    res.send("Protected Route");
}

//update profile controller
export const updateProfileController = async (req, res) => {
    try {
      const { name, email, password, address, phone } = req.body;
      const user = await userModel.findById(req.user._id);
      //password
      if (password && password.length < 6) {
        return res.json({ error: "Passsword is required and 6 character long" });
      }
      const hashedPassword = password ? await hashPassword(password) : undefined;
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          name: name || user.name,
          password: hashedPassword || user.password,
          phone: phone || user.phone,
          address: address || user.address,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Profile Updated Successfully",
        updatedUser,
      });
      
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error while Update profile",
        error,
      });
    }
  };



  export const updatePreferencesController = async (req, res) => {
    try {
        const { productLikes } = req.body;
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        for (const [productId, liked] of Object.entries(productLikes)) {
            const product = await productModel.findById(productId);
            if (!product) continue;
        
            const weightAdjustment = liked ? 0.1 : -0.1;
            const featuresToCheck = [
                "red", "yellow", "green", "gold", "white", "black", "blue", "brown",
                "indowesternwear", "kurtistunics", "sari",
                "tank", "cap", "shortsleeve", "midlength", "threequarter", "fullsleeve",
                "cotton", "nylon", "silk", "wool", "leather", "chiffon",
                "party", "formal", "casual", "festival", "wedding",
                "pricerange1", "pricerange2", "pricerange3", "pricerange4", "pricerange5"
              ];
            featuresToCheck.forEach(featureKey => {
                if (user.preferences.has(featureKey)) {
                    let currentWeight = user.preferences.get(featureKey);
                    let productWeight = product.properties.get(featureKey);
                    user.preferences.set(featureKey, currentWeight + weightAdjustment * productWeight); 
                }
            });

            if (!user.seenProducts.includes(product._id)) {
                user.seenProducts.push(product._id);
            }
        }
        await user.save();
        
        res.status(200).send({ 
            message: "Preferences updated successfully", 
            preferences: user.preferences }); 
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "An error occurred while updating preferences" });
    }
};

