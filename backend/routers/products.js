const express = require("express")
const { Category } = require("../models/category")
const router = express.Router()
const { Product } = require("../models/product")
const mongoose = require('mongoose')

router.get("/", async (req, res) => {
  const productList = await Product.find().populate('category') //.select('name image price category')
  res.send(productList)
})
router.get('/:id', async (req,res) =>{
  const {id} = req.params
  if(!mongoose.isValidObjectId(id)) return res.status(400).send('invalid product id ')
  const product = await Product.findById(id).populate('category')
  if(!product) return res.status(500).json({message : 'the product with the given ID was not found' })
  res.send(product)
})

//post request
router.post("/", async (req, res) => {
  const productCategory = await Category.findById(req.body.category)
  if (!productCategory) return res.status(400).send("invalid category")
  const { name, discription, richDescription, image, images, brand, price, category, countInStock, rating, numReviews, isFeatured, dateCreated } = req.body
  let product = new Product({
    name,
    discription,
    richDescription,
    image,
    images,
    brand,
    price,
    category,
    countInStock,
    rating,
    numReviews,
    isFeatured,
    dateCreated,
  })
  product = await product.save()
  if (!product) return res.status(500).send("the product cannot be create ")

  res.send(product)
})

router.put('/:id' , async(req,res) => {
  const {id} = req.params
  if(!mongoose.isValidObjectId(id)) return res.status(400).send('invalid product id ')
  const productCategory = await Category.findById(req.body.category)
  if (!productCategory) return res.status(400).send("invalid category")
  const { name, discription, richDescription, image, images, brand, price, category, countInStock, rating, numReviews, isFeatured, dateCreated } = req.body
  const product = await Product.findByIdAndUpdate(id,{name, discription, richDescription, image, images, brand, price, category, countInStock, rating, numReviews, isFeatured, dateCreated},{new : true})
  if (!product) {
      res.status(500).json({ message : 'the categoy with the given ID was not found' })
    } 
  res.send(product)
})


router.delete("/:id", async (req, res) => {
  const { id } = req.params
  if(!mongoose.isValidObjectId(id)) return res.status(400).send('invalid product id ')
  const product = await Product.findByIdAndDelete(id)
  res.send("delted")
})

module.exports = router
