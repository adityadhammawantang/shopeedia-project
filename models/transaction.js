var mongoose = require('mongoose');

var transactionSchema = new mongoose.Schema({
    user		: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    status		: String,
    sum	        : Number,
    date	    : Date
});

module.exports = mongoose.model("Transaction", transactionSchema);