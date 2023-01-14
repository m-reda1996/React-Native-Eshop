const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const morgan = require("morgan")
const mongoose = require("mongoose")
const cors = require("cors")
var { expressjwt: jwt } = require("express-jwt")
const errorHandler = require("./utils/errorHandler")
require("dotenv").config()
const api = process.env.PI_URL
const secret = process.env.SECRET

app.use(cors())
app.options("*", cors())

//middleware
app.use(bodyParser.json())
app.use(morgan("tiny"))

// async function isRevoked(req, payload, done) {
//   if (!payload.isAdmin) {
//     done(null, true)
//   }
//   done();
// }
app.use(
  jwt({ secret, algorithms: ["HS256"], isRevoked: isRevoked }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, method: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/products(.*)/, method: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, method: ["GET", "OPTIONS"] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  })
)
app.use("/public/uploads", express.static(__dirname + "/public/uploads"))

async function isRevoked(req, token) {
  if (token.payload.isAdmin == false) {
    return true
  }
  return false
}
app.use(errorHandler)

mongoose.set("strictQuery", true)
const { Product } = require("./models/product")

uri = "mongodb+srv://mahmoud:1234qw@mahmoudelshent.9kxght1.mongodb.net/mahmoudElshent?retryWrites=true&w=majority"

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "firstDbEshop",
  })
  .then(() => {
    console.log("done dbs")
  })
  .catch((err) => {
    console.log(err)
  })

//Routers
const proudctRouter = require("./routers/products")
const categoriesRouter = require("./routers/categories")
const usersRouter = require("./routers/users")
const userOrder = require("./routers/orders")
app.use(`${api}/products`, proudctRouter)
app.use(`${api}/categories`, categoriesRouter)
app.use(`${api}/users`, usersRouter)
app.use(`${api}/order`, userOrder)
//listen
app.listen(3333)
