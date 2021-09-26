const express = require("express");
const {
	configuration,
	createWallet,
	getWallet,
} = require("../controllers/accounts");

const { payment } = require("../controllers/payments");
const { payout } = require("../controllers/payouts");
const { transfers } = require("../controllers/transfers");

const router = express.Router();

//Get master wallet address TEST
router.get("/config", configuration);

//create wallet - TEST
router.post("/create-wallet", createWallet);

//get wallet TEST
router.get("/get-wallet", getWallet);

// Create Card & pay
router.post("/payment", payment);

// Create bank & payout
router.post("/payout", payout);

// Transfer - TEST
router.post("/transfer", transfers);

module.exports = {
	route: router,
};
