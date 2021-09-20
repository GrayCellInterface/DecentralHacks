const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
var requestIp = require("request-ip");
const crypto = require("crypto");

// Check master wallet configuration
const configuration = async (req, res) => {
	const headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
		Authorization:
			"Bearer QVBJX0tFWToyYjNlZDk2ZTg3NDM4MzRkYTM0YmY1NmEzZjA5YjdiZTozM2VmNWE2ZDM1MmFjYzQ1ZjNiMGM3OWJkN2ZhOTAwNQ==",
	};

	await axios
		.get("https://api-sandbox.circle.com/v1/configuration", { headers })
		.then((response) => res.send(response));
};

// Create end user wallet
const createWallet = async () => {
	const idempotencyKey = uuidv4();
	var walletId = "";
	const body = { idempotencyKey: idempotencyKey };
	const headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
		Authorization:
			"Bearer QVBJX0tFWToyYjNlZDk2ZTg3NDM4MzRkYTM0YmY1NmEzZjA5YjdiZTozM2VmNWE2ZDM1MmFjYzQ1ZjNiMGM3OWJkN2ZhOTAwNQ==",
	};

	await axios
		.post("https://api-sandbox.circle.com/v1/wallets", body, { headers })
		.then((response) => (walletId = response.data.data.walletId));
	// console.log(walletId);
	return { idempotencyKey: idempotencyKey, walletId: walletId };
};

// Retrieve existing wallet
const getWallet = async (id = 1000175725) => {
	const headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
		Authorization:
			"Bearer QVBJX0tFWToyYjNlZDk2ZTg3NDM4MzRkYTM0YmY1NmEzZjA5YjdiZTozM2VmNWE2ZDM1MmFjYzQ1ZjNiMGM3OWJkN2ZhOTAwNQ==",
	};

	await axios
		.get("https://api-sandbox.circle.com/v1/wallets/${id}", { headers })
		.then((response) => resp.send(response))
		.catch((error) => {
			console.log("Create Wallet", error);
		});
};

// Generating Blockchain Address
const getBlockchainAddress = async (id, key) => {
	// console.group(id, key);
	var address = "";
	headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
		Authorization:
			"Bearer QVBJX0tFWToyYjNlZDk2ZTg3NDM4MzRkYTM0YmY1NmEzZjA5YjdiZTozM2VmNWE2ZDM1MmFjYzQ1ZjNiMGM3OWJkN2ZhOTAwNQ==",
	};

	const body = {
		chain: "TRX",
		idempotencyKey: key,
		currency: "USD",
	};

	await axios
		.post(`https://api-sandbox.circle.com/v1/wallets/${id}/addresses`, body, {
			headers,
		})
		.then((response) => console.log((address = response.data.data.address)));

	return { address: address };
};

// Create a card
const createCard = async (req, res, next) => {
	// IP Address
	var clientIp = await requestIp.getClientIp(req);
	ip = clientIp.toString().replace("::ffff:", "");

	const data = req.body;

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
			"LS0tLS1CRUdJTiBQR1AgTUVTU0FHRS0tLS0tDQpWZXJzaW9uOiBPcGVuUEdQLmpzIHY0LjYuMg0KQ29tbWVudDogaHR0cHM6Ly9vcGVucGdwanMub3JnDQoNCndjQk1BMFhXU0ZsRlJwVmhBUWdBbXRPUG9xT0VEeFV5VHRmanM3SHdyM3FIREpVN0lEcUZrVkNTVTRBVw0KbXArTmh4aU5XL2dsVkt6THhmTXRSZjV1YTBmOXpLWXFqMnpRekJjUXNJclpFU2RhMXZzeU5kKzVJT05yDQpkNUFuQzhlT2J1WXo4a1huVDBsMU93bUJGNTNzSE51aVU1N2JFZDQreld1eXR6SmM3U1RzSDNWT0tDaGUNCkVVZEZ6a2d6UnlyMzIxbDFmcUNUcTZzUDZ5SGpLYmFjVHJZdWExbGU2TklSaHFqNTJuSDdRb0NGL3hYYg0KOHFzNUtFMHhyYThvNFdmZzNERzZMSVVBOVhHaXRVSGRpbUpuMnducEM2a0p5ai93bGlVKzVZT1hpZkpoDQpBUmRmditWSjBFSDBRMzlnNzB6RGxSeDd6aTFXSkd3WEpsWml3MzdSa2FKMnpGMFQ1UnlYb1JuZGZHcHoNCmtOSmhBVGNLY3c3eU9BLzB1L1M5YmN6aitXRzM5b2cwTkRBelowQThkQjl3WC9TTGRhTVVTaExMNFQ2Vg0KOWdYcStkY2FKNG5KaDROQVdUQ3FTSDE2ak5pU1UreERwbCtIRGlKVldSSGUvVnV3V1EzRE5iUytnbzNvDQoxYzVCdTFySHNOVmNxUT09DQo9Z2RVaA0KLS0tLS1FTkQgUEdQIE1FU1NBR0UtLS0tLQ0K",
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
		.then((response) => res.status(201).send(response.data))
		.catch((error) => console.log(error.response.data));
};

module.exports = {
	configuration,
	createWallet,
	getWallet,
	getBlockchainAddress,
	createCard,
};
