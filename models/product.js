var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    productName	: String,
    price		: Number,
    discount	: Number,
    category	: String,
    stock		: Number,
    image		: String,
    description	: String,
    // comments	: [
    // 	{
    //         type : mongoose.Schema.Types.ObjectId,
    //         ref : "Comment"
    //     }
    // ]
});

module.exports = mongoose.model("Product", productSchema);