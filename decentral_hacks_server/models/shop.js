var mongoose = require("mongoose");
var Schema = mongoose.Schema;

(shopSchema = new Schema({
	p_name: String,
	p_description: String,
	p_model_no: Number,
	p_link: String,
	p_price: Number,
	p_delivery: Number,
	p_count: Number,
})),
	(Shop = mongoose.model("Shop", shopSchema));

module.exports = Shop;
