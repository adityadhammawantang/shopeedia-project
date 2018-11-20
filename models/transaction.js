var mongoose = require('mongoose');

var transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: String,
    sum: Number,
    dateConfirmed: String,
    datePaid: String,
    dateSent: String,
    dateReceived: String
});

module.exports = mongoose.model("Transaction", transactionSchema);