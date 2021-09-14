const express = require("express");
const {
	sendOtp,
	registerUser,
	loginUser,
	userProfile,
	userLogout,
} = require("../controllers/index");

const router = express.Router();

//send mail for verification
router.get("/register", (req, res) => {
	res.send("Register");
});
router.post("/register", sendOtp);

//Registration on after verification
router.get("/register-verified", (req, res) => {
	res.send("Register-verified");
});
router.post("/register-verified", registerUser);

//Login
router.get("/login", (req, res) => {
	res.send("Login Page");
});
router.post("/login", loginUser);

//User Profile
// router.get("/profile", userProfile);

//Logout
// router.get("/logout", userLogout);

module.exports = {
	route: router,
};
