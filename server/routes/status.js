const express = require("express");

const {
	getAllStatus,
	updateCancelStatus,
	getUserOrders,
	getSpecificOrder,
} = require("../controllers/status");

const router = express.Router();

//Get All status
router.get("/get-all-status", getAllStatus);

//Update Status - for cancelled orders
router.post("/update_cancelled", updateCancelStatus);

//Get user orders
router.get("/get-user-orders/:email", getUserOrders);

//Get orders on seller side
router.get("/get-order-type/:type", getSpecificOrder);

module.exports = {
	route: router,
};
