const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: null,
    },
    role: {
        type: String,
        required: true,
        enum: ["staff", "admin"],
        default: 'staff'
    },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);