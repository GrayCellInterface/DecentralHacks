const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const requestIp = require("request-ip");
const schedule = require("node-schedule");
const User = require("../models/user");

// Create a card
const createCard = async (req) => {
	// IP Address
	var clientIp = await requestIp.getClientIp(req);
	ip = clientIp.toString().replace("::ffff:", "");

	var id = "";

	headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
		Authorization:
			"Bearer QVBJX0tFWToyYjNlZDk2ZTg3NDM4MzRkYTM0YmY1NmEzZjA5YjdiZTozM2VmNWE2ZDM1MmFjYzQ1ZjNiMGM3OWJkN2ZhOTAwNQ==",
	};

	const body = {
		idempotencyKey: uuidv4(),
		keyId: "key1",
		encryptedData:
			"LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tDQpWZXJzaW9uOiBPcGVuUEdQLmpzIHY0LjEwLjQNCkNvbW1lbnQ6IGh0dHBzOi8vb3BlbnBncGpzLm9yZw0KDQp3Y0JNQTBYV1NGbEZScFZoQVFmK0oycG5Jc2ZSYzYydUowODMycVNaWlRUNDV1cGQydGI4YXVVaDgwMzkNClRNSGNDUlRxQmM3TVRzdTI1VThyU3dpUWNTTWI4eGhEU1NPc0FLbjZjY09JUEowOW1UK1lnNDB1ejlRag0KSjRJZm93Vi9sOFNRU2dmYU5sR2VydXZQWStOZTlJQWQycVB4VXZTaU9wbGp6cGpTUlRIMTRFYmNWak1pDQp3cDA0UFhEN0ZGU3NTTkh3eHNzR1pmc3pHVVpIV2dzQTNINXppaTVTMUZKanFkNzV2UndGM0xJaUpEQk8NCjBNeWErcnZ3VThuTXdVNHM0ckprSnplQkY5TnIrdlhWZmthTkU4Um8rc1Q0emFCVUxMeHEwQXdYZERKWQ0KWmVSYzlXc1NTNW9ZM0JtZWI5Y0FrMFZVbjRCQkxKYW4ya3U2b1NDT1VPcWtHWUZBaTVzeDVET0hmdzhXDQpuTkpoQWNheVdBTEJTOTF1bUJvQ3R3RDYydi9uUVNyOTNmMEsxblpDZHQvdGV5MlVMWGJsdVB6T2JBc0sNClZUYjlaNDVkQld0dGtnTTFpaWZySGtnc3pKWll2R2lUc2dQOE1HWnp0NEptTitaZVp2V1E2TEY0NTg3ZQ0KaXd2VEdtTXZ2ZWZRZFE9PQ0KPWpEYlcNCi0tLS0tRU5EIFBHUCBNRVNTQUdFLS0tLS0NCg==",
		//data.encryptedData
		billingDetails: {
			name: "Satoshi Nakamoto", //data.name
			city: "Mumbai", //data.city
			country: "IN", //data.country
			line1: "Address 1", //data.address
			postalCode: "400053", //data.postalCode
		},
		expMonth: 11, //data.expMonth
		expYear: 2022, //data.expYear
		metadata: {
			email: "satoshi@circle.com", // data.email
			phone: "9167079283", //data.phone
			sessionId: uuidv4(), // "graycellinterface",
			ipAddress: ip,
		},
	};

	await axios
		.post("https://api-sandbox.circle.com/v1/cards", body, { headers })
		.then(async (response) => {
			cardId = response.data.data.id;
		})
		.catch((error) => console.log({ status: "error", msg: error.response }));

	return { cardId: cardId };
};

const createPayment = async (email, ip, amount, id, encryptedData) => {
	var payload = "";

	const headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
		Authorization:
			"Bearer QVBJX0tFWToyYjNlZDk2ZTg3NDM4MzRkYTM0YmY1NmEzZjA5YjdiZTozM2VmNWE2ZDM1MmFjYzQ1ZjNiMGM3OWJkN2ZhOTAwNQ==",
	};

	const body = {
		metadata: {
			email: email,
			sessionId: uuidv4(),
			ipAddress: ip,
		},
		amount: { amount: amount, currency: "USD" },
		autoCapture: true,
		source: { id: id, type: "card" },
		idempotencyKey: uuidv4(),
		keyId: "key1",
		encryptedData: encryptedData,
		verification: "cvv",
		description: "Payment",
	};
	await axios
		.post("https://api-sandbox.circle.com/v1/payments", body, { headers })
		.then(async (response) => {
			// console.log(response.data.data);
			console.log((payload = response.data.data));
		})
		.catch((error) => console.log(error.response));
	return { payload: payload };
};

const updateCardId = async (email, cardId) => {
	User.findOneAndUpdate(
		{
			email: email,
		},
		{
			$set: {
				cardId: cardId,
			},
		},
		async function (err, updatedRecord) {
			if (err) {
				console.log("There was an error");
			} else {
				console.log("Record Updated Successfully");
				// Function to delete from the record
				const date = new Date(Date.now() + 86400000);

				await schedule.scheduleJob(date, async function () {
					User.findOneAndUpdate(
						{
							email: email,
						},
						{
							$set: {
								cardId: "",
							},
						},
						function (error) {
							{
								console.log({ status: "error", msg: errpr.response.data });
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
	const data = req.body;
	const choice = data.choice;

	User.findOne({ email: data.email }, async function (err, data) {
		if (data.cardId === "" && choice === "new") {
			const { cardId } = await createCard(req);
			// Update Database
			await updateCardId(data.email, cardId);
			await createPayment(
				"sanchi.shirur4@gmail.com",
				"127.0.0.1",
				"30",
				cardId,
				"LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tDQpWZXJzaW9uOiBPcGVuUEdQLmpzIHY0LjEwLjQNCkNvbW1lbnQ6IGh0dHBzOi8vb3BlbnBncGpzLm9yZw0KDQp3Y0JNQTBYV1NGbEZScFZoQVFnQWlwUmZoODhvT1BVL0xQTjQ4cGFCUG1iR2Z3UDArN0NCQlprUjRtZzINCjFiNVVvcTh1RUx1T1U3ZVRqR3NENDBNRVhiZVA3SCtoSnM5VzBZeE5zRk1uZnJsM0VPaUVNbXpyVDJNUQ0KVGJnWUtxcndZUms4YnNzZ3BYQlN2c0pmQThXS3Z6ZzM2NElwMmJsN1Nhem13V21acTBPNzk0WXI4N20wDQpqaTNYRHczaUZRSWZPeHVkWGplVDZBanVrcllYa00vc3V6bVNXZWFFWFZmWElFT3Rndmw0ckhTL056ZGYNClorMDJicEVRQnZJSGVOUDlXQk9ST213RU03d1pUMkNnZEhUUGk4L3pueGRlZlZacGhhWkt3QXRZdWtaRQ0KL0d1SnYwSVdiZFBoRWpUK3FRT0crWnVvdXluM2lxR2pYNldFekVhOW9GcnRCR1V2bDlRNWxpYXI5QlRODQpLZEpGQVR1QSs5SWwzQzRab1N0QjNDL3c2V1dwaEZMNWlyVDJyZFB0UjhRN0pDOURmeXdEZHVtbGpMT2oNClU4alpWVE5wcGJyN2NZRlEwUk01bVFuQzFkVmErcXk0d09lTQ0KPWc4ZXoNCi0tLS0tRU5EIFBHUCBNRVNTQUdFLS0tLS0NCg=="
			);
			res.send({ status: "success", msg: "Payment successful!" });
		} else if (data.cardId !== "" && (choice == "new" || choice == "old")) {
			if (choice === "new") {
				const { cardId } = await createCard(req);
				await updateCardId(data.email, cardId);
				await createPayment(
					"sanchi.shirur4@gmail.com",
					"127.0.0.1",
					"30",
					cardId,
					"LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tDQpWZXJzaW9uOiBPcGVuUEdQLmpzIHY0LjEwLjQNCkNvbW1lbnQ6IGh0dHBzOi8vb3BlbnBncGpzLm9yZw0KDQp3Y0JNQTBYV1NGbEZScFZoQVFnQWlwUmZoODhvT1BVL0xQTjQ4cGFCUG1iR2Z3UDArN0NCQlprUjRtZzINCjFiNVVvcTh1RUx1T1U3ZVRqR3NENDBNRVhiZVA3SCtoSnM5VzBZeE5zRk1uZnJsM0VPaUVNbXpyVDJNUQ0KVGJnWUtxcndZUms4YnNzZ3BYQlN2c0pmQThXS3Z6ZzM2NElwMmJsN1Nhem13V21acTBPNzk0WXI4N20wDQpqaTNYRHczaUZRSWZPeHVkWGplVDZBanVrcllYa00vc3V6bVNXZWFFWFZmWElFT3Rndmw0ckhTL056ZGYNClorMDJicEVRQnZJSGVOUDlXQk9ST213RU03d1pUMkNnZEhUUGk4L3pueGRlZlZacGhhWkt3QXRZdWtaRQ0KL0d1SnYwSVdiZFBoRWpUK3FRT0crWnVvdXluM2lxR2pYNldFekVhOW9GcnRCR1V2bDlRNWxpYXI5QlRODQpLZEpGQVR1QSs5SWwzQzRab1N0QjNDL3c2V1dwaEZMNWlyVDJyZFB0UjhRN0pDOURmeXdEZHVtbGpMT2oNClU4alpWVE5wcGJyN2NZRlEwUk01bVFuQzFkVmErcXk0d09lTQ0KPWc4ZXoNCi0tLS0tRU5EIFBHUCBNRVNTQUdFLS0tLS0NCg=="
				);

				res.send({ status: "success", msg: "Payment successful!" });
			} else {
				await createPayment(
					"sanchi.shirur4@gmail.com",
					"127.0.0.1",
					"30",
					data.cardId,
					"LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tDQpWZXJzaW9uOiBPcGVuUEdQLmpzIHY0LjEwLjQNCkNvbW1lbnQ6IGh0dHBzOi8vb3BlbnBncGpzLm9yZw0KDQp3Y0JNQTBYV1NGbEZScFZoQVFnQWlwUmZoODhvT1BVL0xQTjQ4cGFCUG1iR2Z3UDArN0NCQlprUjRtZzINCjFiNVVvcTh1RUx1T1U3ZVRqR3NENDBNRVhiZVA3SCtoSnM5VzBZeE5zRk1uZnJsM0VPaUVNbXpyVDJNUQ0KVGJnWUtxcndZUms4YnNzZ3BYQlN2c0pmQThXS3Z6ZzM2NElwMmJsN1Nhem13V21acTBPNzk0WXI4N20wDQpqaTNYRHczaUZRSWZPeHVkWGplVDZBanVrcllYa00vc3V6bVNXZWFFWFZmWElFT3Rndmw0ckhTL056ZGYNClorMDJicEVRQnZJSGVOUDlXQk9ST213RU03d1pUMkNnZEhUUGk4L3pueGRlZlZacGhhWkt3QXRZdWtaRQ0KL0d1SnYwSVdiZFBoRWpUK3FRT0crWnVvdXluM2lxR2pYNldFekVhOW9GcnRCR1V2bDlRNWxpYXI5QlRODQpLZEpGQVR1QSs5SWwzQzRab1N0QjNDL3c2V1dwaEZMNWlyVDJyZFB0UjhRN0pDOURmeXdEZHVtbGpMT2oNClU4alpWVE5wcGJyN2NZRlEwUk01bVFuQzFkVmErcXk0d09lTQ0KPWc4ZXoNCi0tLS0tRU5EIFBHUCBNRVNTQUdFLS0tLS0NCg=="
				);
				res.send({ status: "success", msg: "Payment successful!" });
			}
		} else {
			res.send({
				status: "error",
				message: "There was an error in making your payment ",
			});
		}
	});
	// res.send("Payment Successful");
};

module.exports = {
	createCard,
	createPayment,
	payment,
};
