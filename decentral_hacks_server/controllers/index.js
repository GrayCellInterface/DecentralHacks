const User = require("../models/user");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");

const { createWallet, getBlockchainAddress, getWallet } = require("./accounts");

// *************************Register*************************
const sendOtp = async (req, res, next) => {
	const email = req.body.email;
	const name = req.body.name;
	const password = req.body.password;

	User.findOne({ email: email }, async function (err, data) {
		//send mail
		if (!data) {
			//generate otp
			const otp = Math.floor(100000 + Math.random() * 900000);
			console.log(otp);
			const ttl = 5 * 60 * 1000;
			const expires = Date.now() + ttl;
			const data = `${email}.${name}.${password}.${otp}.${expires}`;
			const hash = crypto
				.createHmac("sha256", process.env.emailKey)
				.update(data)
				.digest("hex");
			const fullHash = `${hash}.${expires}`;
			console.log(fullHash);
			await sendMail(email, name, otp);
			res.status(200).send({
				msg: "Registered",
				expires,
				hash: fullHash,
				name,
				email,
				password,
				otp,
			});
		} else {
			res.send({ msg: "User already exists. Try a different email." });
		}
	});
};

// **********************Mail**********************
const sendMail = async (email, name, otp) => {
	sgMail.setApiKey(process.env.EMAIL_API_KEY);

	// Client message body
	const output = `
        <div style="padding:10px;  color: black ;font-size:16px; line-height: normal;">
            <p style="font-weight: bold;" >Hello ${name},</p>
            <p>Your OTP to verify email is ${otp}</p>
            <p>If you have not registered on the website, kindly ignore the email</p>
            <br/>
            <p>Have a Nice Day!</p>            
        </div>
        `;

	// Client message
	const messageUser = {
		to: email,
		from: {
			name: "GRAY CELL INTERFACE",
			email: "graycellinterface@gmail.com", // senders email as registered with sendgrid
		},
		subject: "Email Verification",
		html: output,
	};

	await sgMail.send(messageUser).then((response) => {
		console.log(response[0].statusCode);
	});
	return;
};

// *******************verify and register******************
const registerUser = async (req, res) => {
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;
	const hash = req.body.hash;
	const otp = req.body.otp;

	// Address
	const country = req.body.country;
	const city = req.body.city;
	const district = req.body.district;
	const address = req.body.address;
	const postalCode = req.body.postalCode;
	let [hashValue, expires] = hash.split(".");

	console.log("postalCode", postalCode);

	let now = Date.now();

	if (now > parseInt(expires)) {
		return res.send({ msg: "OTP Timeout" });
	}

	const data = `${email}.${name}.${password}.${otp}.${expires}`;
	const newCalculatedHash = crypto
		.createHmac("sha256", process.env.emailKey)
		.update(data)
		.digest("hex");

	if (newCalculatedHash === hashValue) {
		const { walletId, walletAddress } = await createWallet();
		console.log(walletId);
		var newPerson = new User({
			email: email,
			name: name,
			password: password,
			walletId: walletId,
			walletAddress: walletAddress,
			country: country,
			city: city,
			district: district,
			address: address,
			postalCode: postalCode,
			cardId: "",
			encryptedCvv: "",
			keyId: "",
			bankId: "",
		});

		newPerson.save(function (err, Person) {
			if (err) console.log(err);
			else console.log("Successfully registered");
		});

		res.status(200).send({ msg: "Verified Success" });
	} else {
		res.send({ msg: "Invalid OTP" });
	}
};

// **********************Login**********************
const loginUser = async (req, res) => {
	User.findOne({ email: req.body.email }, async function (err, data) {
		// console.log("data" + data);
		if (data) {
			if (data.password === req.body.password) {
				// req.session.userId = data.uid;
				// console.log(req.session.userId);

				// const { address } = await getBlockchainAddress(
				// 	data.walletId,
				// 	data.idempotencyKey
				// );
				const { balance } = await getWallet(data.walletId)
				console.log(data.walletId)
				res.status(200).send({
					msg: "Logged In",
					name: data.name,
					email: req.body.email,
					address: data.walletAddress,
					balance: balance,

				});
			} else {
				res.send({ msg: "Incorrect Password" });
			}
		} else {
			res.send({ msg: "Invalid Email" });
		}
	});
};

// Get bankId and cardId
const getID = async (req, res) => {
	const email = req.params.email;
	User.findOne({ email: email }, async function (error, data) {
		if (error) {
			res.send({
				status: "error",
				msg: "There was an error",
			});
		} else {
			const bankId = data.bankId === "" ? "false" : "true";
			const cardId = data.cardId === "" ? "false" : "true"
			res.send({
				status: "success",
				data: {
					bankId: bankId,
					cardId: cardId,
				},
			});
		}
	});
};

module.exports = {
	sendOtp,
	registerUser,
	loginUser,
	getID,
};

// ***********Profile Page **************
// const userProfile = async (req, res) => {
// 	// console.log(req.session.userId);
// 	User.findOne({ uid: req.session.userId }, function (err, data) {
// 		if (!data) {
// 			res.redirect("/");
// 		} else {
// 			return res.send(data);
// 		}
// 	});
// };

// ***********Logout**************
// const userLogout = async (req, res) => {
// 	console.log(req.session);
// 	if (req.session) {
// 		req.session.destroy(function (err) {
// 			if (err) {
// 				return next(err);
// 			} else {
// 				return res.redirect("/");
// 			}
// 		});
// 	}
// };
