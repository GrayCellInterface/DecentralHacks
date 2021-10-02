var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Status Model
(oStatusSchema = new Schema({
	orderId: String,
	productId: String,
	orderName: String,
	email: String,
	status: String,
	amount: Number,
	order_date: String,
})),
	(OStatus = mongoose.model("OrderStatus", oStatusSchema));

module.exports = OStatus;
