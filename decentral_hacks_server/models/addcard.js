var mongoose = require("mongoose");
var Schema = mongoose.Schema;

(cardSchema = new Schema({
	cid: Number,
	cno: Number,
	cvv: Number,
})),
	(Card = mongoose.model("Card", cardSchema));

module.exports = Card;
