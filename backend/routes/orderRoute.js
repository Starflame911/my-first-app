import express from 'express'
import { placeOrder, placeOrderStripe, placeOrderazorpay, allOrders, userOrders, updateStatus, verifyStripe} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

//admin features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth,updateStatus)

//payment features
orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.post('/razorpay', authUser, placeOrderazorpay)

//user feature
orderRouter.post('/userorders', authUser, userOrders)

//verify payemnt
orderRouter.post('/verifyStripe', authUser, verifyStripe)

export default orderRouter