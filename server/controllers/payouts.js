const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const schedule = require("node-schedule");

const headers = {
	Accept: "application/json",
	"Content-Type": "application/json",
	Authorization: `${process.env.BEARER}`
};

// Create Bank
const bank = async (data, record) => {
	var bankId = "";

	let billingDetails = {
		name: record.name,
		city: record.city,
		country: record.country,
		line1: record.address,
		district: record.district,
		postalCode: record.postalCode,
	}

	if (record.country === "US" || record.country === "CA") {      //Remaining to test
		billingDetails = {
			...billingDetails,
			district: record.district
		}
	}

	// US BANK
	const body = {
		billingDetails: billingDetails,
		bankAddress: {
			bankName: data.bankName,
			city: data.city,
			country: data.country,
			line1: data.address,
			district: data.district,
		},
		idempotencyKey: uuidv4(),
		accountNumber: data.accountNumber,
		routingNumber: data.routingNumber,
	};


	await axios
		.post("https://api-sandbox.circle.com/v1/banks/wires", body, { headers })
		.then(async (response) => {
			bankId = response.data.data.id;
		})
		.catch((error) => console.log({ status: "error", msg: error.response.data }));

	return { bankId: bankId };
};

// Create Payout
const createPayout = async (email, bankId, amount) => {
	let payoutId = ""
	console.log("BANKID FROM CreatePayout", bankId);

	const body = {
		source: { type: "wallet", id: "1000177235" },
		destination: { type: "wire", id: bankId },
		amount: { amount: amount, currency: "USD" },
		metadata: { beneficiaryEmail: email },
		idempotencyKey: uuidv4(),
	};

	await axios
		.post("https://api-sandbox.circle.com/v1/payouts", body, { headers })
		.then(async (response) => {
			payoutId = response.data.data.id;
		})
		.catch((error) => console.log({ status: "error", msg: error.response.data }));

	return { payoutId: payoutId }
};


// Update created bank Id in the database
const updateBankId = async (email, bankId) => {
	User.findOneAndUpdate(
		{
			email: email,
		},
		{
			$set: {
				bankId: bankId,
			},
		},
		async function (error, updatedRecord) {
			if (error) {
				console.log({
					status: "Error",
					msg: error.response.data,
				});
			} else {
				console.log({
					status: "Success",
					msg: "Record Updated Successfully",
				});

				// Delete the bank Id in 24 hours
				const date = new Date(Date.now() + 86400000);

				schedule.scheduleJob(date, async function () {
					User.findOneAndUpdate(
						{
							email: email,
						},
						{
							$set: {
								bankId: "",
							},
						},
						function (error) {
							{
								console.log({
									status: "Error",
									msg: error.response.data,
								});
							}
						}
					);
				});
			}
		}
	);
	return;
};


// Payout Main Function
const payout = async (req, res) => {
	const data = req.body;
	const choice = data.choice;

	User.findOne({ email: data.email }, async function (err, record) {
		if (choice === "new") {
			const { bankId } = await bank(data, record);
			// Update Database
			// console.log("BANK ID", bankId)
			await updateBankId(data.email, bankId);
			const { payoutId } = await createPayout(data.email, bankId, data.amount);
			res.send({ payoutId: payoutId });
		} else {
			if (record.bankId === "") {
				res.send({ status: "error", msg: "This bank Id has expired" }); //Boundary case
			} else {
				const { payoutId } = await createPayout(data.email, record.bankId, data.amount);
				res.send({ payoutId: payoutId });
			}
		}
	});
};

module.exports = {
	bank,
	createPayout,
	payout,
};
