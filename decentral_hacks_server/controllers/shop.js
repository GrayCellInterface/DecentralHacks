const mongoose = require("mongoose");
const Shop = require("../models/shop");

// Get All Products
const getAllProducts = async (req, res) => {
	Shop.find((err, docs) => {
		if (err) {
			res.send("Error in retrieving docs ");
		} else {
			res.send({ status: "success", data: docs });
		}
	});
};

// Add product to db
const addProduct = async (req, res) => {
	const data = req.body;
	const p_name = data.p_name;
	const p_description = data.p_description;
	const p_model_no = data.p_model_no;
	const p_link = data.p_link;
	const p_price = data.p_price;
	const p_count = data.p_count;
	const p_delivery = data.p_delivery;

	var newItem = new Shop({
		p_name: p_name,
		p_description: p_description,
		p_model_no: p_model_no,
		p_link: p_link,
		p_price: p_price,
		p_count: p_count,
		p_delivery: p_delivery,
	});
	newItem.save(function (err, Product) {
		if (err) {
			res.send({
				status: "error",
				msg: "There was an error in adding the product",
			});
		} else {
			res.send({
				status: "success",
				msg: "Product Added Successfully ",
			});
		}
	});
};

// Get Product from database based on id
const getProductToEdit = async (req, res) => {
	const id = req.params.id;
	Shop.findOne(
		{
			_id: id,
		},
		(err, docs) => {
			if (err === null) {
				res.send({
					status: "success",
					data: docs,
				});
			} else {
				res.send({ status: "error", msg: "Product could not be found" });
			}
		}
	);
};

// Edit Product Info
const editProductInfo = async (req, res) => {
	const data = req.body;

	const id = data._id;
	const description = data.description;
	const link = data.link;
	const delivery = data.delivery;
	const price = data.price;
	const count = data.count;

	Shop.findOneAndUpdate(
		{ _id: id },
		{
			$set: {
				p_description: description,
				p_link: link,
				p_delivery: delivery,
				p_price: price,
				p_count: count,
			},
		},
		(error, doc) => {
			if (error) {
				res.send({
					status: "error",
					msg: "There was an error editing the product information",
				});
			} else {
				res.send({
					status: "success",
					msg: "Product Info Updated Successfully ",
				});
			}
		}
	);
};

// Delete Product from database
const deleteProduct = async (req, res) => {
	const id = req.body._id;
	Shop.deleteOne(
		{
			_id: id,
		},
		(err, docs) => {
			if (err === null) {
				res.send({
					status: "success",
					msg: "Product successfully deleted from database",
				});
			} else {
				res.send({ status: "error", msg: "Product could not be deleted" });
			}
		}
	);
};

// Update Product count
const updateProductCount = async (action, id) => {
	var p_id = mongoose.Types.ObjectId(id);
	var updated_count = 0;

	Shop.findOne({ _id: p_id }, async function (err, data) {
		if (err) console.log("From update error", err);
		else {
			if (data) {
				if (action === "refund" || action === "cancel") {
					updated_count = parseFloat(data.p_count) + 1;
				} else if (action === "buy") {
					updated_count = parseFloat(data.p_count) - 1;
				}

				if (updated_count >= 0) {
					// update record

					Shop.findOneAndUpdate(
						{ _id: p_id },
						{
							$set: {
								p_count: updated_count,
							},
						},
						(error, doc) => {
							if (error) {
								console.log({
									status: "Error",
									msg: "There was an error updating the count",
								});
							} else {
								console.log({ status: "success", data: doc });
							}
						}
					);
				} else {
					console.log({
						status: "Error",
						msg: "Count is less than 0",
					});
				}
			} else {
				console.log({
					status: "Error",
					msg: "Product doesnot exist",
				});
			}
		}
	});
};

module.exports = {
	getAllProducts,
	addProduct,
	deleteProduct,
	updateProductCount,
	editProductInfo,
	getProductToEdit,
};
