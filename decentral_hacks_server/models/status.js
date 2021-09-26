var mongoose = require("mongoose");
var Schema = mongoose.Schema;

(oStatusSchema = new Schema({
	orderId: String,
	productId: String,
	orderName: String,
	email: String,
	status: String,
	order_date: String,
})),
	(OStatus = mongoose.model("OrderStatus", oStatusSchema));

module.exports = OStatus;
