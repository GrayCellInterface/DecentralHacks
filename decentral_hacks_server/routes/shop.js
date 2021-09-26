const express = require("express");
const {
	getAllProducts,
	addProduct,
	editProductInfo,
	deleteProduct,
} = require("../controllers/shop");

const { checkout } = require("../controllers/transfers");

const router = express.Router();

//Get All products For sender and receiver
router.get("/all-products", getAllProducts);

//Add product
router.post("/add-product", addProduct);

//Delete product
router.post("/delete-product", deleteProduct);

//Update Product
router.post("/edit-product", editProductInfo);

// Checkout
router.post("/checkout", checkout);

module.exports = {
	route: router,
};
