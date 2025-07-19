const mongoose = require("mongoose");
const { type } = require("os");

const groupexpenseSchema = new mongoose.Schema({

    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },

    paidBy: {
        type: String,
        ref: 'User'
    },

    expense: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("GroupExpense", groupexpenseSchema);