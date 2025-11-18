const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Fruits = new Schema({
    name: String,
    quantity: Number,
    price: Number,
    status: Number,
    image: Array,
    description: String,
    id_distributor: {type: Schema.Types.ObjectId, ref: 'distributor'},
}, {
    timestamps: true
})

module.exports = mongoose.model('fruit', Fruits);