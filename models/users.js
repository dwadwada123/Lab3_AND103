const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Users = new Schema({
    username: {type: String, unique: true, maxLength: 255},
    password: {type: String, maxLength: 255},
    email: {type: String, unique: true},
    name: {type: String, maxLength: 255},
    avatar: String,
    availabel: {type: Boolean, default: false},
},{
    timestamps: true
})

module.exports = mongoose.model('user', Users);