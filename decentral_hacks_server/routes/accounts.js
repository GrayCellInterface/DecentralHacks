const express = require("express");
const {
	configuration,
	createWallet,
	getWallet,
	createCard,
	getPublicKey,
} = require("../controllers/accounts");

const router = express.Router();

//Test
router.get("/config", configuration);

//create wallet - just to check the workability
router.post("/create-wallet", createWallet);

//get wallet
router.get("/get-wallet", getWallet);

// Create Card
router.post("/card", createCard);

module.exports = {
	route: router,
};
