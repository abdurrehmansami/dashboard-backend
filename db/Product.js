const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    name:String,
    price:Number,
    category:String,
    userId:String,
    company:String
})
module.exports= mongoose.model("products",productSchema)
// products collection ka naam hai jo db me hai