const mongoose = require("mongoose")
const orderItems = require("./order-item")
const orderSchema = mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
    },
  ],
  shippingAddress1: {
    type: String,
    required: true,
  },
  shippingAddress2: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
  totalPrice: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dateOrder: {
    type: Date,
    default: Date.now,
  },
})
orderSchema.virtual("id").get(function () {
  return this._id.toHexString()
})
orderSchema.set("toJSON", {
  virtuals: true,
})

// orderSchema.post('findOneAndDelete' , async function (doc) {
//   if (doc) {
//     await orderItems.deleteMany({
//       _id :{
//         $in : doc.orderItems
//       }
//     })
//   }
// })

exports.Order = mongoose.model("Order", orderSchema)
