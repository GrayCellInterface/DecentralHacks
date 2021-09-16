var mongoose = require("mongoose");
var Schema = mongoose.Schema;

(userSchema = new Schema({
	email: String,
	name: String,
	password: String,
	walletId: Number,
	idempotencyKey: String,
})),
	(User = mongoose.model("User", userSchema));

module.exports = User;
