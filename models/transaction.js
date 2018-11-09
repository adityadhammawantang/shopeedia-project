var mongoose = require('mongoose');

var transactionSchema = new mongoose.Schema({
    productName	: String,
    status		: String,
    sum	        : Number,
    date	    : Date,
    user		: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    products    : {
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Product"
        },
        quantity : Number
    }
});

module.exports = mongoose.model("Transaction", transactionSchema);