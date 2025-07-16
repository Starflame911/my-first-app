import express from 'express'
import {addProduct,listProducts,removeProduct,singleProduct,filterProducts} from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import productModel from '../models/productModel.js';

const productRouter= express.Router();

productRouter.post('/add',adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),addProduct)
productRouter.post('/remove',adminAuth,removeProduct)
productRouter.post('/single',singleProduct)
productRouter.get('/list',listProducts)
productRouter.get('/filter', filterProducts);

//new
productRouter.get('/bulk', async (req, res) => {
  try {
    const ids = req.query.ids?.split(',');
    if (!ids || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No IDs provided' });
    }

    const products = await productModel.find({ _id: { $in: ids } });

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
});

// GET a single product by ID
productRouter.get('/:id', async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
});


export default productRouter