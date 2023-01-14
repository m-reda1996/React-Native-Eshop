const express = require("express")
const { Category } = require("../models/category")
const router = express.Router()
const { Product } = require("../models/product")
const mongoose = require("mongoose")
const secret = process.env.SECRET
var { expressjwt: jwt } = require("express-jwt")
const multer = require("multer")

const fileType = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = fileType[file.mimetype]
    let updateError = new Error("invalid image tyoe ")
    if (isValid) {
      updateError = null
    }
    cb(updateError, "public/uploads")
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-")
    const extension = fileType[file.mimetype]
    console.log("extension",extension)
    cb(null, `${Date.now()}${fileName}`)
  },
})

const uploadOptions = multer({ storage: storage })

//get all

router.get("/", async (req, res) => {
  let filter = {}
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") }
  }
  const productList = await Product.find(filter).populate("category") //.select('name image price category')
  res.send(productList)
})

//get product by id

router.get("/:id", async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).send("invalid product id ")
  const product = await Product.findById(id).populate("category")
  if (!product) return res.status(500).json({ message: "the product with the given ID was not found" })
  res.send(product)
})

//post product

router.post("/", uploadOptions.single("image"), async (req, res) => {
  const productCategory = await Category.findById(req.body.category)
  if (!productCategory) return res.status(400).send("invalid category")

  const file = req.file
  if (!file) return res.status(400).send("invalid file")
  const fileName = req.file.filename
  console.log('filename ',fileName)
  console.log("file" ,  file)
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`
  console.log("basePath", basePath)
  const { name, discription, richDescription, images, brand, price, category, countInStock, rating, numReviews, isFeatured, dateCreated } = req.body
  let product = new Product({
    name,
    discription,
    richDescription,
    image: `${basePath}${fileName}`,
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

//edit product by id

router.put("/:id", uploadOptions.single("image"), async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).send("invalid product id ")

  const productCategory = await Category.findById(req.body.category)
  if (!productCategory) return res.status(400).send("invalid category")

  const product = await Product.findById(id)
  if (!product) return res.status(400).send("invalid product ")

  const file = req.file
  let imagepath
  if (file) {
    const fileName = file.filename
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`
    imagepath = `${basePath}${fileName}`
  } else {
    imagepath = product.image
  }

  const { name, discription, richDescription, images, brand, price, category, countInStock, rating, numReviews, isFeatured, dateCreated } = req.body
  const updateProduct = await Product.findByIdAndUpdate(
    id,
    { name, discription, richDescription, image: imagepath, images, brand, price, category, countInStock, rating, numReviews, isFeatured, dateCreated },
    { new: true }
  )
  if (!updateProduct) {
    res.status(500).json({ message: "the categoy with the given ID was not found" })
  }
  res.send(updateProduct)
})
//delete product by id

router.delete("/:id", async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).send("invalid product id ")
  const product = await Product.findByIdAndDelete(id)
  res.send("delted")
})

//get count

router.get("/get/count", async (req, res) => {
  const productCount = await Product.countDocuments("name")
  if (!productCount) return res.status(500).json({ message: "the product with the given ID was not found" })
  res.send({
    productCount: productCount,
  })
})

//get product in featured

router.get("/get/featured/:count", async (req, res) => {
  let count = req.params.count ? req.params.count : 1

  const product = await Product.find({ isFeatured: true }).limit(+count)
  if (!product) return res.status(500).json({ message: "the product with the given ID was not found" })
  res.send(product)
})

router.put("/gallaryImage/:id", uploadOptions.array("images", 4), async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).send("invalid product id ")
  const files = req.files
  let imagesPaths = []
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`
  
  if (files) {
    files.map((file) => {
      imagesPaths.push(`${basePath}${file.filename}`)
    })
  }
  const updateProduct = await Product.findByIdAndUpdate(id, { images: imagesPaths }, { new: true })
  if (!updateProduct) {
    res.status(500).json({ message: "the categoy with the given ID was not found" })
  }
  res.send(updateProduct)
})
module.exports = router
