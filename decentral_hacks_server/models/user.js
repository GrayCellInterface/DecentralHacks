var mongoose = require("mongoose");
var Schema = mongoose.Schema;

(userSchema = new Schema({
	uid: String,
	email: String,
	name: String,
	password: String,
	walletId: Number,
})),
	(User = mongoose.model("User", userSchema));

module.exports = User;
