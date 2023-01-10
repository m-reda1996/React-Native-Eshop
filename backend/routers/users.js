const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const { Users } = require("../models/user")
const bcrypt = require("bcryptjs")
router.get("/", async (req, res) => {
  const users = await Users.find().select('name email phone')
  if (!users) {
    res.status(500).json({ success: false })
  }
  res.send(users)
})

router.get("/:id", async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).send("invalid user id ")
  const user = await Users.findById(id).select('-password')
  if (!user) {
    res.status(500).json({ message: "the user with the given ID was not found" })
  }
  res.send(user)
})

router.post("/", async (req, res) => {
  const { name, email, password, phone, isAdmin, apartment, street, city } = req.body
  let user = new Users({
    name,
    email,
    password : bcrypt.hashSync(password,12),
    phone,
    isAdmin,
    apartment,
    street,
    city,
  })

  user = await user.save()
  if (!user) return res.status(404).send("the category cannot created ")
  res.send(user)
})

module.exports = router
