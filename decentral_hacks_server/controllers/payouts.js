const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const schedule = require("node-schedule");

// Create Bank
const bank = async (req) => {
	var bankId = "";
	const headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
		Authorization:
			"Bearer QVBJX0tFWToyYjNlZDk2ZTg3NDM4MzRkYTM0YmY1NmEzZjA5YjdiZTozM2VmNWE2ZDM1MmFjYzQ1ZjNiMGM3OWJkN2ZhOTAwNQ==",
	};

	const body = {
		billingDetails: {
			name: "Satoshi Nakamoto",
			city: "Boston",
			country: "US",
			line1: "100 Money Street",
			line2: "Suite 1",
			district: "MA",
			postalCode: "01234",
		},
		bankAddress: {
			bankName: "SAN FRANCISCO",
			city: "SAN FRANCISCO",
			country: "US",
			line1: "100 Money Street",
			line2: "Suite 1",
			district: "CA",
		},
		idempotencyKey: uuidv4(),
		accountNumber: "12340010",
		routingNumber: "121000248",
	};

	await axios
		.post("https://api-sandbox.circle.com/v1/banks/wires", body, { headers })
		.then(async (response) => {
			bankId = response.data.data.id;
			// console.log("BANK", response.data.data);
		})
		.catch((error) => console.log({ status: "error", msg: error.response }));

	return { bankId: bankId };
};

// Create Payout
const createPayout = async (bankId) => {
	console.log("BANKID FROM CreatePayout", bankId);
	const headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
		Authorization:
			"Bearer QVBJX0tFWToyYjNlZDk2ZTg3NDM4MzRkYTM0YmY1NmEzZjA5YjdiZTozM2VmNWE2ZDM1MmFjYzQ1ZjNiMGM3OWJkN2ZhOTAwNQ==",
	};

	const body = {
		source: { type: "wallet", id: "1000177235" },
		destination: { type: "wire", id: bankId },
		amount: { amount: "3.14", currency: "USD" },
		metadata: { beneficiaryEmail: "sanchi.shirur4@gmail.com" },
		idempotencyKey: uuidv4(),
	};

	await axios
		.post("https://api-sandbox.circle.com/v1/payouts", body, { headers })
		.then(async (response) => {
			// console.log(response);
		})
		.catch((error) => console.log({ status: "error", msg: error.response }));
};

//
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
		async function (err, updatedRecord) {
			if (error) {
				console.log({
					status: "Error",
					msg: error.response.data,
				});
			} else {
				console.log({
					status: "Error",
					msg: "Record Updated Successfully",
				});
				// Function to delete from the record
				const date = new Date(Date.now() + 86400000);

				await schedule.scheduleJob(date, async function () {
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

	User.findOne({ email: data.email }, async function (err, data) {
		if (data.bankId === "" && choice === "new") {
			const { bankId } = await bank(req);
			// Update Database
			await updateBankId(data.email, bankId);
			await createPayout(bankId);
			res.send({ status: "success", msg: "Debit successful!" });
		} else if (data.bankId !== "" && (choice === "new" || choice === "old")) {
			if (choice === "new") {
				const { bankId } = await bank(req);
				await updateBankId(data.email, bankId);
				await createPayout(data.bankId);
				res.send({ status: "success", msg: "Debit successful!" });
			} else {
				await createPayout(data.bankId);
				res.send({ status: "success", msg: "Debit successful!" });
			}
		} else {
			res.send({
				status: "error",
				message: "There was an error",
			});
		}
	});
	// res.send("Payout Successful");
};

module.exports = {
	bank,
	createPayout,
	payout,
};
