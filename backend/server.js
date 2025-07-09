import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

//app config
const app =express()
app.use(cors());

const port = process.env.port || 4000
connectDB()
connectCloudinary()

//middlewares
app.use(express.json())

//api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order', orderRouter)

app.get('/',(req,res)=>{
    res.send("API working")
})

app.listen(port, ()=>console.log('server started on port '+port))