const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const morgan = require("morgan")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

app.use(cors())
app.options("*", cors())
//middleware
app.use(bodyParser.json())
app.use(morgan("tiny"))

mongoose.set("strictQuery", true)
const api = process.env.PI_URL
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


app.use(`${api}/products`, proudctRouter)
app.use(`${api}/categories`, categoriesRouter)
app.use(`${api}/users`, usersRouter)

//listen
app.listen(3333)
