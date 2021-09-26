const OStatus = require("../models/status");

const { updateProductCount } = require("./shop");

// get all statuses
const getAllStatus = async (req, res) => {
	OStatus.find((error, docs) => {
		if (error) {
			res.send({
				status: "error",
				msg: error.message,
			});
		} else {
			res.send({
				status: "success",
				data: docs,
			});
		}
	});
};

// to update status from front end
const updateCancelStatus = async (req, res) => {
	const p_id = req.body.p_id;
	const orderId = req.body.orderId;
	const action = req.body.action;

	OStatus.findOne({ orderId: orderId }, async function (err, data) {
		if (data.status === "pending") {
			// Update
			OStatus.findOneAndUpdate(
				{ orderId: orderId },
				{
					$set: {
						status: action,
					},
				},
				async function (error, doc) {
					if (error) {
						console.log({
							status: "error",
							msg: "There was an error",
						});
					} else {
						console.log({
							status: "success",
							msg: "success",
						});
					}
				}
			);
			// update count
			await updateProductCount(action, p_id);

			res.send({
				status: "success",
				msg: "Updated Successfully",
			});
		} else {
			res.send({
				status: "error",
				msg: "Could not cancel your order",
			});
		}
	});
};

// get users orders
const getUserOrders = async (req, res) => {
	const email = req.params.email;
	OStatus.find({ email: email }, async function (error, doc) {
		if (error) {
			res.send({
				status: "Error",
				msg: error.response.data,
			});
		} else {
			res.send({
				status: "success",
				data: doc,
			});
		}
	});
};

// get specific orders
const getSpecificOrder = async (req, res) => {
	const type = req.params.type;

	OStatus.find({ status: type }, async function (error, doc) {
		if (error) {
			res.send({
				status: "Error",
				msg: error.response.data,
			});
		} else {
			res.send({
				status: "success",
				data: doc,
			});
		}
	});
};
module.exports = {
	getAllStatus,
	updateCancelStatus,
	getUserOrders,
	getSpecificOrder,
};
