import {v2 as cloudinary} from 'cloudinary'
import productModel from '../models/productModel.js'

//function for adding products
const addProduct = async (req, res)=>{
    try {
        
        const{name,description,price,category,subCategory,sizes,bestseller}=req.body

        const image1=req.files.image1 && req.files.image1[0]
        const image2=req.files.image2 && req.files.image2[0]
        const image3=req.files.image3 && req.files.image3[0]
        const image4=req.files.image4 && req.files.image4[0] 

        const images=[image1,image2,image3,image4].filter((item)=>item!==undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item)=>{
                let result= await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url
            })
        )

        const productData={
            name,
            description,
            price:Number(price),
            image:imagesUrl,
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestseller: bestseller=== "true" ? true : false,
            date: Date.now()
        }

        console.log(productData);

        const product= new productModel(productData);
        await product.save()

        res.json({success:true, message: "product Added"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})

    }
}

//function for listing products
const listProducts = async (req, res)=>{
    try {
        
        const products = await productModel.find({})
        res.json({success:true,products})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//function for removing products
const removeProduct = async (req, res)=>{
    
    try {
        
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true, message:"Product Removed"})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }

}

//function for single product info
const singleProduct = async (req, res)=>{
    try {
        
        const { productId }= req.body
        const product= await productModel.findById(productId)
        res.json({success:true, product})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// GET /api/product/filter
const filterProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { category, subCategory, sort, search } = req.query;
    const query = {};

    // Search by name (case-insensitive)
    if (search?.trim()) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    // Normalize category to array
    const categories = category
      ? Array.isArray(category)
        ? category
        : [category]
      : [];

    if (categories.length > 0) {
      query.category = { $in: categories };
    }

    // Normalize subCategory to array
    const subCategories = subCategory
      ? Array.isArray(subCategory)
        ? subCategory
        : [subCategory]
      : [];

    if (subCategories.length > 0) {
      query.subCategory = { $in: subCategories };
    }

    // Sorting
    const sortQuery = {};
    if (sort === 'low-high') {
      sortQuery.price = 1;
    } else if (sort === 'high-low') {
      sortQuery.price = -1;
    }

    const products = await productModel
      .find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    res.status(200).json({ products });
  } catch (err) {
    console.error('Error filtering products:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};



export {addProduct,listProducts,removeProduct,singleProduct, filterProducts}