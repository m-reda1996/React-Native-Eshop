const { Order } = require("../models/order")
const { OrderItem } = require("../models/order-item")
const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

router.get(`/`, async (req, res) => {
  const orderList = await Order.find()
    .populate({ path: "orderItems", populate: { path: "product", populate: "category" } })
  .populate("user", "name")
  .sort("dateOrder")
  .select("totalPrice")

  if (!orderList) {
    res.status(500).json({ success: false })
  }
  res.send(orderList)
})
router.get("/:id", async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).send("invalid order id ")
  const order = await Order.findById(id)
    .populate({ path: "orderItems", populate: { path: "product", populate: "category" } })
    .populate("user", "name")
  if (!order) {
    res.status(500).json({ message: "the categoy with the given ID was not found" })
  }
  res.send(order)
})
router.post("/", async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderitem) => {
      let neworderItem = new OrderItem({
        quantity: orderitem.quantity,
        product: orderitem.product,
      })
      neworderItem = await neworderItem.save()
      return neworderItem._id
    })
  )
  const orderItem = await orderItemsIds
  const { shippingAddress1, shippingAddress2, city, phone, status, user, dateOrder } = req.body
  const totalPrices = await Promise.all(
    orderItem.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate("product", "price")
      const totalPrice = orderItem.product.price * orderItem.quantity
      return totalPrice
    })
  )
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0)
  console.log(totalPrices)
  let order = new Order({
    orderItems: orderItem,
    shippingAddress1,
    shippingAddress2,
    city,
    phone,
    status,
    totalPrice: totalPrice,
    user,
    dateOrder,
  })
  order = await order.save()
  if (!order) {
    return res.status(400).send("the order cannot be created!")
  }
  res.send(order)
})
router.put("/:id", async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).send("invalid category id ")
  const { status } = req.body
  const order = await Order.findByIdAndUpdate(id, { status }, { new: true })
  if (!order) {
    res.status(500).json({ message: "the order with the given ID was not found" })
  }
  res.send(order)
})

router.delete("/:id", (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) return res.status(400).send("invalid category id ")
  Order.findByIdAndDelete(id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndDelete(orderItem)
        })
        return res.status(200).json({ success: true, message: "deleted" })
      } else {
        return res.status(404).json({ success: false, message: "order not found " })
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err })
    })
})
router.get("/get/totalsales", async (req, res) => {
  const totalSales = await Order.aggregate([{ $group: { _id: null, totalSales: { $sum: "$totalPrice" } } }])
  if (!totalSales) {
    return res.status(4000).send("the order salws connat be generated")
  }
  res.send({ totalSales: totalSales.pop().totalSales })
})

router.get("/get/count", async (req, res) => {
  const orderCount = await Order.countDocuments("name")
  if (!orderCount) return res.status(500).json({ message: "the order with the given ID was not found" })
  res.send({
    orderCount: orderCount,
  })
})

router.get("/get/userorders/:userId", async (req, res) => {
  const { userId } = req.params
  const userOrderList = await Order.find({user : userId})
    .populate({ path: "orderItems", populate: { path: "product", populate: "category" } })
    .sort({"dateOrder" : -1})

    if(!userOrderList){
      res.status(500).json({success : false})
    }
    res.send(userOrderList)
})
// router.delete("/:id", async (req, res) => {

//   const { id } = req.params
//   if (!mongoose.isValidObjectId(id)) return res.status(400).send("invalid product id ")
//   const order = await Order.findByIdAndDelete(id)
//   res.send("delted")
// })

module.exports = router
