const express = require("express");
const {
	configuration,
	createWallet,
	getWallet,
	getBlockchainAddress,
	getWalletId,
	getCustomerTransactions,
} = require("../controllers/accounts");

const { payment } = require("../controllers/payments");
const { payout } = require("../controllers/payouts");
const { transfers, transferDebit } = require("../controllers/transfers");

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

// Transfer - for debit
router.post("/transfer-debit", transferDebit);

// Get wallet Id & address from email
router.get("/get-wallet-id/:email", getBlockchainAddress);

// Get wallet Id & address from email
router.get("/get-walletId/:email", getWalletId);

// Get wallet Id & address from email
router.get("/get-customer-transcations/:email", getCustomerTransactions);

module.exports = {
	route: router,
};
