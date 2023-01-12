const { Order } = require("../models/order")
const { OrderItem } = require("../models/order-item")
const express = require("express")
const router = express.Router()

router.get(`/`, async (req, res) => {
  const orderList = await Order.find()
  if (!orderList) {
    res.status(500).json({ success: false })
  }
  res.send(orderList)
})

router.post("/", async (req, res) => {
    const orderItemsIds =Promise.all(req.body.orderItems.map(async (orderitem) =>{
        let neworderItem = new OrderItem({
            quantity : orderitem.quantity,
            product :orderitem.product
        })
        neworderItem = await neworderItem.save()
        return neworderItem._id
    }))
    const orderItem = await orderItemsIds
    console.log(orderItem)
  const {  shippingAddress1,shippingAddress2, city, phone, status, totalPrice, user, dateOrder } = req.body
  let order = new Order({
    orderItems :orderItem,
    shippingAddress1,
    shippingAddress2,
    city,
    phone,
    status,
    totalPrice,
    user,
    dateOrder,
  })
  order = await order.save()
  if(!order){
    return res.status(400).send('the order cannot be created!')
  }

  res.send(order)
   
})

module.exports = router
