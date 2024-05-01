import express from "express"
import colors from "colors"
import dotenv from "dotenv"
import morgan from "morgan"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoute.js"
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import brandRoutes from './routes/brandRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import messageRoutes from './routes/messageRoutes.js'

import cors from "cors"


dotenv.config()

// database 
connectDB()

const app = express()

// middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));

//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes)
app.use('/api/v1/product', productRoutes)
app.use('/api/v1/brand', brandRoutes)
app.use('/api/v1/order', orderRoutes)
app.use('/api/v1/admin', adminRoutes)
app.use('/api/v1/messages', messageRoutes)
// app.use('/api/v1/payment', paymentsRoutes);

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server Running on ${process.env.DEV_MODE} on ${PORT}`.bgCyan.white)
})