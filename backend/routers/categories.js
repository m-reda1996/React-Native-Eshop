const { Category } = require("../models/category")
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const secret = process.env.SECRET
var { expressjwt: jwt } = require("express-jwt");

// get all category
router.get("/", async (req, res) => {
  const categoryList = await Category.find()
  if (!categoryList) {
    res.status(500).json({ success: false })
  }
  res.send(categoryList)
})

//get vategory by id
router.get("/:id", async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).send("invalid category id ")
  const category = await Category.findById(id)
  if (!category) {
    res.status(500).json({ message: "the categoy with the given ID was not found" })
  }
  res.send(category)
})

// update the category

// router.put("/:id",jwt({ secret, algorithms: ["HS256"] }), async (req, res) => {
router.put("/:id", async (req, res) => {
  
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).send("invalid category id ")
  const { name, icon, color } = req.body
  const category = await Category.findByIdAndUpdate(id, { name, icon, color }, { new: true })
  if (!category) {
    res.status(500).json({ message: "the categoy with the given ID was not found" })
  }
  res.send(category)
})

// router.post("/",jwt({ secret, algorithms: ["HS256"] }), async (req, res) => {
  router.post("/", async (req, res) => {
  const { name, icon, color } = req.body
  let category = new Category({
    name,
    icon,
    color,
  })

  category = await category.save()
  if (!category) return res.status(404).send("the category cannot created ")
  res.send(category)
})
// router.delete("/:id",jwt({ secret, algorithms: ["HS256"] }), (req, res) => {
router.delete("/:id", (req, res) => {

  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).send("invalid category id ")
  const category = Category.findByIdAndDelete(id)
    .then((category) => {
      if (category) {
        return res.status(200).json({ success: true, message: "deleted" })
      } else {
        return res.status(404).json({ success: false, message: "category not found " })
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err })
    })
})

router.get("/get/count", async (req, res) => {

  const categoryCount = await Category.countDocuments("name")
  if (!categoryCount) return res.status(500).json({ message: "the product with the given ID was not found" })
  res.send({
    categoryCount: categoryCount,
  })
})

module.exports = router
