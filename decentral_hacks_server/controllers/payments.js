const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const requestIp = require("request-ip");
const schedule = require("node-schedule");
const User = require("../models/user");

const headers = {
	Accept: "application/json",
	"Content-Type": "application/json",
	Authorization: `${process.env.BEARER}`

};

// Create a card
const createCard = async (data, record, ip) => {
	let cardId = "";
	let billingDetails = {
		name: record.name,
		city: record.city,
		country: record.country,
		line1: record.address,
		postalCode: record.postalCode,
	}

	if (record.country === "US" || record.country === "CA") {
		billingDetails = {
			...billingDetails,
			district: record.district
		}
	}

	const body = {
		idempotencyKey: uuidv4(),
		keyId: data.keyId,
		encryptedData: data.encryptedData,
		billingDetails: billingDetails,
		expMonth: parseInt(data.expiryMonth),
		expYear: parseInt(data.expiryYear),
		metadata: {
			email: data.email,
			sessionId: uuidv4(),
			ipAddress: ip,
		},
	};

	await axios
		.post("https://api-sandbox.circle.com/v1/cards", body, { headers })
		.then((response) => {
			cardId = response.data.data.id;
			console.log(response.data.data)
		})
		.catch((error) => console.log(error.response.data));
	return { cardId: cardId };
};

// To create Payment 
const createPayment = async (data, ip, cardId) => {
	var paymentId = "";

	const body = {
		metadata: {
			email: data.email,
			sessionId: uuidv4(),
			ipAddress: ip,
		},
		amount: { amount: data.amount, currency: "USD" },
		source: { id: cardId, type: "card" },
		idempotencyKey: uuidv4(),
		keyId: data.keyId,
		encryptedData: data.encryptedCvv,
		verification: "cvv",
		description: "Payment",
	};
	await axios
		.post("https://api-sandbox.circle.com/v1/payments", body, { headers })
		.then(async (response) => {
			console.log((paymentId = response.data.data.id));
		})
		.catch((error) => console.log(error.response.message));
	return { paymentId: paymentId };
};


// Update created Card Id in the database
const updateCardId = async (email, cardId, encryptedCvv, keyId) => {
	User.findOneAndUpdate(
		{
			email: email,
		},
		{
			$set: {
				cardId: cardId,
				encryptedCvv: encryptedCvv,
				keyId: keyId
			},
		},
		async function (err, updatedRecord) {
			if (err) {
				console.log("There was an error");
			} else {
				console.log("Record Updated Successfully");

				// Delete the card Id in 24 hours
				const date = new Date(Date.now() + 86400000);

				schedule.scheduleJob(date, async function () {
					User.findOneAndUpdate(
						{
							email: email,
						},
						{
							$set: {
								cardId: "",
								encryptedCvv: "",
								keyId: ""
							},
						},
						function (error) {
							{
								console.log({ status: "error", msg: error.response.data });
							}
						}
					);
				});
			}
		}
	);
	return;
};


// Payment main function
const payment = async (req, res) => {
	let data = req.body;
	const choice = data.choice;

	// IP Address
	var clientIp = await requestIp.getClientIp(req);
	ip = clientIp.toString().replace("::ffff:", "");

	User.findOne({ email: data.email }, async function (err, record) {
		if (choice === "new") {
			const { cardId } = await createCard(data, record, ip);
			console.log(cardId);
			// Update Database
			await updateCardId(data.email, cardId, data.encryptedCvv, data.keyId);
			const { paymentId } = await createPayment(data, ip, cardId);
			res.send({ status: "success", msg: "Credit Successful!", paymentId: paymentId });

		} else {
			if (record.cardId === "") {
				res.send({ status: "error", msg: "This card has expired" }); //Boundary case
			} else {
				data = { ...data, encryptedCvv: record.encryptedCvv, keyId: record.keyId }
				console.log("DATA", data);
				const { paymentId } = await createPayment(data, ip, record.cardId);
				res.send({ status: "success", msg: "Credit Successful!", paymentId: paymentId });
			}
		}
	});

};

module.exports = {
	createCard,
	createPayment,
	payment,
};
