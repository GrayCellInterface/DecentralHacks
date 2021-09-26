var mongoose = require("mongoose");
var Schema = mongoose.Schema;

(userSchema = new Schema({
	email: String,
	name: String,
	password: String,
	walletId: Number,
	walletAddress: String,
	country: String,
	city: String,
	district: String,
	address: String,
	postalCode: String,
	cardId: String,
	encryptedCvv: String,
	keyId: String,
	bankId: String,
})),
	(User = mongoose.model("User", userSchema));

module.exports = User;
