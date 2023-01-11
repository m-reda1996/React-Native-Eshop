const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const { Users } = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
var { expressjwt: Jwt } = require("express-jwt")

const secret = process.env.SECRET
router.get("/", Jwt({ secret, algorithms: ["HS256"] }), async (req, res) => {
  const users = await Users.find().select("name email phone")
  if (!users) {
    res.status(500).json({ success: false })
  }
  res.send(users)
})

router.get("/:id", Jwt({ secret, algorithms: ["HS256"] }), async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).send("invalid user id ")
  const user = await Users.findById(id).select("-password")
  if (!user) {
    res.status(500).json({ message: "the user with the given ID was not found" })
  }
  res.send(user)
})

router.post("/", Jwt({ secret, algorithms: ["HS256"] }), async (req, res) => {
  const { name, email, password, phone, isAdmin, apartment, street, city } = req.body
  let user = new Users({
    name,
    email,
    password: bcrypt.hashSync(password, 12),
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

router.post("/login", async (req, res) => {
  const { email, password } = req.body
  const user = await Users.findOne({ email })
  if (!user) {
    return res.status(400).send("the user not found")
  }
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin : user.isAdmin
      },
      secret
    )
    res.status(200).send({ user: user.email, token: token })
  } else {
    res.status(400).send("email or password is wrong")
  }
  // res.status(200).send(user)
})

module.exports = router
