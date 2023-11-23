const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    src: String,
    price: Number,
    category: String,
    subCategory: String,
    quantity: Number,
    description: String,
    sale: Boolean,
    popular: Boolean
});



productSchema.statics.findProducts = function(productName) {
    console.log(productName)
    let re = new RegExp(productName);
    return this.find({ name: { $regex: re } });
};


productSchema.methods.isEnoughProductQuantity = function(quantity) {
    return this.quantity >= quantity ? true : false;
}


productSchema.methods.changeQuantity = async function(newQuantity, increment) {
    increment ? this.quantity += newQuantity : this.quantity -= newQuantity;
    await this.save();
}


let Product = mongoose.model('Product', productSchema);


module.exports = Product;


