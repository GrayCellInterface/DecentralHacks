const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const sgMail = require("@sendgrid/mail");
const schedule = require("node-schedule");

const OStatus = require("../models/status");
const { updateProductCount } = require("./shop");

// Transfer Function for Payout
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
					console.log((transferId = response.data.data.id));
					res.send({ transferId: transferId });
				})
				.catch((error) =>
					console.log({ status: "error", msg: error.response.data })
				);
		} else {
			res.send({ msg: "Invalid Email" });
		}
	});
};

// transfers for shop 1.
const transfers = async (req, res) => {
	const email = req.body.email;
	const fee = parseFloat(req.body.fee);
	const profit = parseFloat(req.body.tot_amount) * 0.02;
	const amount = (parseFloat(req.body.tot_amount) - profit).toFixed(2);


	const masterAmount = parseFloat(fee + profit).toFixed(2);
	console.log(masterAmount);
	console.log(amount)

	let transferIdSeller = "";
	let walletId = "";

	const headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
		Authorization:
			"Bearer QVBJX0tFWToyYjNlZDk2ZTg3NDM4MzRkYTM0YmY1NmEzZjA5YjdiZTozM2VmNWE2ZDM1MmFjYzQ1ZjNiMGM3OWJkN2ZhOTAwNQ==",
	};

	User.findOne({ email: email }, async function (err, data) {
		if (data) {
			walletId = data.walletId;
			console.log("Wallet ID", walletId);

			const body1 = {
				source: { type: "wallet", id: walletId }, // customer Wallet
				destination: {
					type: "blockchain",
					address: "TVyXtKiMoG2PZpSsAnMaLZW747PSvRAQmT",
					chain: "TRX",
				},
				amount: { amount: amount, currency: "USD" },
				idempotencyKey: uuidv4(),
			};

			const body2 = {
				source: { type: "wallet", id: walletId },
				destination: { type: "wallet", id: "1000177235" },
				amount: { amount: masterAmount, currency: "USD" },
				idempotencyKey: uuidv4(),
			};

			await axios
				.post("https://api-sandbox.circle.com/v1/transfers", body1, { headers })
				.then(async (response) => {
					console.log(response.data.data);

					// to the sellers wallet
					await axios
						.post("https://api-sandbox.circle.com/v1/transfers", body2, {
							headers,
						})
						.then(async (response) => {
							transferIdSeller = response.data.data.id;
							console.log(transferIdSeller);
							res.send({ transferIdSeller: transferIdSeller });
						})
						.catch((error) =>
							res.send({ status: "error", msg: error.response.data })
						);
				})
				.catch((error) =>
					res.send({ status: "error", msg: error.response.data })
				);
		} else {
			res.send({ msg: "Invalid Email" });
		}
	});
};

// Success or failure
const successOrFailure = () => {
	var y = Math.random();
	if (y < 0.1) y = 0;
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
const addStatus = async (orderId, orderName, status, email, p_id, amount) => {
	const date = new Intl.DateTimeFormat("en-IN", {
		dateStyle: "long",
		timeStyle: "long",
	}).format(Date.now());

	var addStat = new OStatus({
		email: email,
		orderId: orderId,
		productId: p_id,
		orderName: orderName,
		amount: amount,
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

// Update Order Status
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
	const orderId = uuidv4();
	const p_id = req.body.p_id;
	const email = req.body.email;
	const name = req.body.name;
	const amount = req.body.amount;
	const orderName = req.body.orderName;

	// Update product count
	await updateProductCount("buy", p_id);

	// 1/0?
	const verdict = await successOrFailure();

	console.log("Verdict", verdict);

	if (verdict === 0) {
		console.log("No OTP");

		// Add status in db
		await addStatus(orderId, orderName, "pending", email, p_id, amount);


		res.send({ status: "Delivery Started" })
	} else {
		console.log("OTP");
		// Generate OTP
		const otp = Math.floor(100000 + Math.random() * 900000);

		// Add status in db
		await addStatus(orderId, orderName, "completed", email, p_id, amount);

		// send otp via mail
		await sendOTP(email, name, otp, orderId);
		// send otp to frontend

		res.send({ status: "Delivery Started" });
	}
};
module.exports = {
	checkout,
	transfers,
	transferDebit,
};
