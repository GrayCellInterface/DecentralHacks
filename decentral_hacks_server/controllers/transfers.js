const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const sgMail = require("@sendgrid/mail");

const OStatus = require("../models/status");
const { updateProductCount } = require("./shop");


const transferDebit = async (req, res) => {
	const amount = req.body.amount;
	const email = req.body.email;
	let walletId = "";
	let transferId = "";
	const headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
		Authorization:
			"Bearer QVBJX0tFWToyYjNlZDk2ZTg3NDM4MzRkYTM0YmY1NmEzZjA5YjdiZTozM2VmNWE2ZDM1MmFjYzQ1ZjNiMGM3OWJkN2ZhOTAwNQ==",
	};

	User.findOne({ email: email }, async function (err, data) {
		if (data) {
			walletId = data.walletId;
			const body1 = {
				source: { type: "wallet", id: walletId }, // customer Wallet
				destination: {
					type: "blockchain",
					address: "TEGmWL8QsLqe7ivG3Rir9wPoPVJGLCvtMC",
					chain: "TRX",
				},
				amount: { amount: amount, currency: "USD" },
				idempotencyKey: uuidv4(),
			};

			await axios
				.post("https://api-sandbox.circle.com/v1/transfers", body1, { headers })
				.then(async (response) => {
					console.log(transferId = response.data.data.id);
					res.send({ transferId: transferId })

				})
				.catch((error) =>
					console.log({ status: "error", msg: error.response.data })
				);
		} else {
			res.send({ msg: "Invalid Email" });
		}
	});


};

// send email and card id in req body
const transfers = async (tot_amount, c_walletId) => {
	const profit = parseFloat(tot_amount) * 0.02;
	const amount = parseFloat(tot_amount) - profit;
	let transferId =
		console.log(profit, amount);
	const headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
		Authorization:
			"Bearer QVBJX0tFWToyYjNlZDk2ZTg3NDM4MzRkYTM0YmY1NmEzZjA5YjdiZTozM2VmNWE2ZDM1MmFjYzQ1ZjNiMGM3OWJkN2ZhOTAwNQ==",
	};

	const body1 = {
		source: { type: "wallet", id: c_walletId }, // customer Wallet
		destination: {
			type: "blockchain",
			address: "TVyXtKiMoG2PZpSsAnMaLZW747PSvRAQmT",
			chain: "TRX",
		},
		amount: { amount: amount, currency: "USD" },
		idempotencyKey: uuidv4(),
	};

	const body2 = {
		source: { type: "wallet", id: c_walletId },
		destination: { type: "wallet", id: "1000177235" },
		amount: { amount: profit, currency: "USD" },
		idempotencyKey: uuidv4(),
	};
	await axios
		.post("https://api-sandbox.circle.com/v1/transfers", body1, { headers })
		.then(async (response) => {
			console.log(response.data.data);

			// to the sellers wallet
			await axios
				.post("https://api-sandbox.circle.com/v1/transfers", body2, { headers })
				.then(async (response) => {
					transferId = response.data.data.id
					console.log({ status: "success", msg: response.data.data })

				})
				.catch((error) =>
					console.log({ status: "error", msg: error.response.data })
				);
		})
		.catch((error) =>
			console.log({ status: "error", msg: error.response.data })
		);

	return { transferId: transferId }
};

// Success or failure
const successOrFailure = () => {
	var y = Math.random();
	if (y < 0.5) y = 0;
	else y = 1;
	return y;
};

// Send OTP
const sendOTP = async (email, name, otp, orderId) => {
	sgMail.setApiKey(process.env.EMAIL_API_KEY);

	// Client message body
	const output = `
        <div style="padding:10px;  color: black ;font-size:16px; line-height: normal;">
            <p style="font-weight: bold;" >Hello ${name},</p>
			<p>Your order with order-id ${orderId} has been delievered successfully</p>
            <p>Your OTP is ${otp}</p>
            
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

	await sgMail
		.send(messageUser)
		.then((response) => {
			console.log({
				status: "success",
				statusCode: response[0].statusCode,
				msg: "Email Sent successfully",
			});
		})
		.catch((error) =>
			console.log({
				status: "error",
				msg: "Email Couldnot be sent",
			})
		);
	return;
};

// Add order status to db
const addStatus = async (orderId, orderName, status, email, p_id) => {
	const date = new Intl.DateTimeFormat("en-IN", {
		dateStyle: "long",
		timeStyle: "long",
	}).format(Date.now());

	var addStat = new OStatus({
		email: email,
		orderId: orderId,
		productId: p_id,
		orderName: orderName,
		status: status,
		order_date: date,
	});
	addStat.save(function (error, stat) {
		if (error) {
			console.log({
				status: "error",
				msg: "There was an error in adding the status",
			});
		} else {
			console.log({
				status: "success",
				msg: "Addes status successfully",
			});
		}
	});
};

const updateOrderStatus = async (orderId, status) => {
	OStatus.findOneAndUpdate(
		{ orderId: orderId },
		{
			status: status,
		},
		async function (error, doc) {
			if (error) {
				console.log({
					status: "error",
					msg: "There was an error updating the count",
				});
			} else {
				console.log({
					status: "success",
					msg: "Updated Status Successfully",
				});
			}
		}
	);
	return;
};

// Main funtion for CHECKOUT
const checkout = async (req, res) => {
	const p_id = req.body.p_id;
	const email = req.body.email;
	const name = req.body.name;
	const tot_amount = req.body.tot_amount;
	const c_walletId = req.body.c_walletId;
	const orderId = uuidv4();
	const orderName = req.body.orderName;
	// const delay = 120000;
	const delay = 30000;

	// Make payments
	const { transferId } = await transfers(tot_amount, c_walletId);

	// Status - On the way
	await addStatus(orderId, orderName, "on the way", email, p_id);

	// Update product count
	await updateProductCount("buy", p_id);

	// 1/0?
	const verdict = await successOrFailure();
	console.log("Verdict", verdict);

	setTimeout(async function () {
		if (verdict === 0) {
			console.log("No OTP");
			await updateOrderStatus(orderId, "pending");

			res.send({
				status: "pending",
				orderId: orderId,
			});
		} else {
			console.log("OTP");
			// Generate OTP
			const otp = Math.floor(100000 + Math.random() * 900000);

			// update status in db
			await updateOrderStatus(orderId, "completed");

			// send otp via mail
			await sendOTP(email, name, otp, orderId);
			// send otp to frontend
			res.send({
				status: "delivered",
				orderId: orderId,
				otp: otp,
			});
		}
	}, delay);
};

module.exports = {
	checkout,
	transfers,
	transferDebit
};
