const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const requestIp = require("request-ip");
const schedule = require("node-schedule");
const User = require("../models/user");

// Create a card
const createCard = async (data, record, ip) => {

	let cardId = "";

	const headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
		Authorization:
			"Bearer QVBJX0tFWToyYjNlZDk2ZTg3NDM4MzRkYTM0YmY1NmEzZjA5YjdiZTozM2VmNWE2ZDM1MmFjYzQ1ZjNiMGM3OWJkN2ZhOTAwNQ==",
	};

	let billingDetails = {
		name: record.name,
		city: record.city,
		country: record.country,
		line1: record.address,
		postalCode: record.postalCode,
	}

	if (record.country === "US" || record.country === "CA") {      //Remaining to test
		billingDetails = {
			...billingDetails,
			district: record.district
		}
	}

	const body = {
		idempotencyKey: uuidv4(),
		keyId: data.keyId,
		encryptedData: data.encryptedData,
		// encryptedData:
		// 	"LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tDQpWZXJzaW9uOiBPcGVuUEdQLmpzIHY0LjEwLjQNCkNvbW1lbnQ6IGh0dHBzOi8vb3BlbnBncGpzLm9yZw0KDQp3Y0JNQTBYV1NGbEZScFZoQVFmK0oycG5Jc2ZSYzYydUowODMycVNaWlRUNDV1cGQydGI4YXVVaDgwMzkNClRNSGNDUlRxQmM3TVRzdTI1VThyU3dpUWNTTWI4eGhEU1NPc0FLbjZjY09JUEowOW1UK1lnNDB1ejlRag0KSjRJZm93Vi9sOFNRU2dmYU5sR2VydXZQWStOZTlJQWQycVB4VXZTaU9wbGp6cGpTUlRIMTRFYmNWak1pDQp3cDA0UFhEN0ZGU3NTTkh3eHNzR1pmc3pHVVpIV2dzQTNINXppaTVTMUZKanFkNzV2UndGM0xJaUpEQk8NCjBNeWErcnZ3VThuTXdVNHM0ckprSnplQkY5TnIrdlhWZmthTkU4Um8rc1Q0emFCVUxMeHEwQXdYZERKWQ0KWmVSYzlXc1NTNW9ZM0JtZWI5Y0FrMFZVbjRCQkxKYW4ya3U2b1NDT1VPcWtHWUZBaTVzeDVET0hmdzhXDQpuTkpoQWNheVdBTEJTOTF1bUJvQ3R3RDYydi9uUVNyOTNmMEsxblpDZHQvdGV5MlVMWGJsdVB6T2JBc0sNClZUYjlaNDVkQld0dGtnTTFpaWZySGtnc3pKWll2R2lUc2dQOE1HWnp0NEptTitaZVp2V1E2TEY0NTg3ZQ0KaXd2VEdtTXZ2ZWZRZFE9PQ0KPWpEYlcNCi0tLS0tRU5EIFBHUCBNRVNTQUdFLS0tLS0NCg==",
		billingDetails: billingDetails,
		expMonth: parseInt(data.expiryMonth),
		expYear: parseInt(data.expiryYear),
		metadata: {
			email: data.email,
			sessionId: uuidv4(), // "graycellinterface",
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

const createPayment = async (data, ip, cardId) => {
	var payload = "";

	const headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
		Authorization:
			"Bearer QVBJX0tFWToyYjNlZDk2ZTg3NDM4MzRkYTM0YmY1NmEzZjA5YjdiZTozM2VmNWE2ZDM1MmFjYzQ1ZjNiMGM3OWJkN2ZhOTAwNQ==",
	};

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
		//encryptedData: "LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tDQpWZXJzaW9uOiBPcGVuUEdQLmpzIHY0LjEwLjQNCkNvbW1lbnQ6IGh0dHBzOi8vb3BlbnBncGpzLm9yZw0KDQp3Y0JNQTBYV1NGbEZScFZoQVFnQWlwUmZoODhvT1BVL0xQTjQ4cGFCUG1iR2Z3UDArN0NCQlprUjRtZzINCjFiNVVvcTh1RUx1T1U3ZVRqR3NENDBNRVhiZVA3SCtoSnM5VzBZeE5zRk1uZnJsM0VPaUVNbXpyVDJNUQ0KVGJnWUtxcndZUms4YnNzZ3BYQlN2c0pmQThXS3Z6ZzM2NElwMmJsN1Nhem13V21acTBPNzk0WXI4N20wDQpqaTNYRHczaUZRSWZPeHVkWGplVDZBanVrcllYa00vc3V6bVNXZWFFWFZmWElFT3Rndmw0ckhTL056ZGYNClorMDJicEVRQnZJSGVOUDlXQk9ST213RU03d1pUMkNnZEhUUGk4L3pueGRlZlZacGhhWkt3QXRZdWtaRQ0KL0d1SnYwSVdiZFBoRWpUK3FRT0crWnVvdXluM2lxR2pYNldFekVhOW9GcnRCR1V2bDlRNWxpYXI5QlRODQpLZEpGQVR1QSs5SWwzQzRab1N0QjNDL3c2V1dwaEZMNWlyVDJyZFB0UjhRN0pDOURmeXdEZHVtbGpMT2oNClU4alpWVE5wcGJyN2NZRlEwUk01bVFuQzFkVmErcXk0d09lTQ0KPWc4ZXoNCi0tLS0tRU5EIFBHUCBNRVNTQUdFLS0tLS0NCg==",
		verification: "cvv",
		description: "Payment",
	};
	await axios
		.post("https://api-sandbox.circle.com/v1/payments", body, { headers })
		.then(async (response) => {
			// console.log(response.data.data);
			console.log((payload = response.data.data));
		})
		.catch((error) => console.log(error.response.message));
	return { payload: payload };
};

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
				// Function to delete from the record
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
	let data = req.body;  // email ,encrypted ccv and ccv+card, expi month & exp year, keyID
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
			await createPayment(data, ip, cardId);
			res.send({ status: "success", msg: "Credit Successful!" });

		} else {
			if (record.cardId === "") {
				res.send({ status: "error", msg: "This card has expired" }); //Boundary case
			} else {
				data = { ...data, encryptedCvv: record.encryptedCvv, keyId: record.keyId }
				console.log("DATA", data);
				await createPayment(data, ip, record.cardId);
				res.send({ status: "success", msg: "Credit Successful!" });
			}
		}
	});

};

module.exports = {
	createCard,
	createPayment,
	payment,
};
