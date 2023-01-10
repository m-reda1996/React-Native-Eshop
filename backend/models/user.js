const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique : true
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique : true
    
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  apartment: {
    type: String,
    default: "",
  },
  street: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
})

userSchema.virtual("id").get(function () {
  return this._id.toHexString()
})
userSchema.set("toJSON", {
  virtuals: true,
})

exports.Users = mongoose.model('User' , userSchema)

