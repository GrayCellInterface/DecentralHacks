const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

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
		.then((response) => res.send({ status: "success", data: response }))
		.catch((error) => {
			res.send({ status: "Error", msg: error.response.data });
		});
};

// Create end user wallet
const createWallet = async () => {
	const idempotencyKey = uuidv4();
	var walletId = "";
	var walletAddress = "";
	const body = { idempotencyKey: idempotencyKey };
	const headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
		Authorization:
			"Bearer QVBJX0tFWToyYjNlZDk2ZTg3NDM4MzRkYTM0YmY1NmEzZjA5YjdiZTozM2VmNWE2ZDM1MmFjYzQ1ZjNiMGM3OWJkN2ZhOTAwNQ==",
	};

	await axios
		.post("https://api-sandbox.circle.com/v1/wallets", body, { headers })
		.then(async (response) => {
			console.log(response.data.data);
			walletId = response.data.data.walletId;
			let { address } = await getBlockchainAddress(walletId);
			walletAddress = address
		});

	return { walletId: walletId, walletAddress: walletAddress };
};

// Retrieve existing wallet TEST
const getWallet = async (id) => {
	let balance = ""
	const headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
		Authorization:
			"Bearer QVBJX0tFWToyYjNlZDk2ZTg3NDM4MzRkYTM0YmY1NmEzZjA5YjdiZTozM2VmNWE2ZDM1MmFjYzQ1ZjNiMGM3OWJkN2ZhOTAwNQ==",
	};

	await axios
		.get(`https://api-sandbox.circle.com/v1/wallets/${id}`, { headers })
		.then((response) => {
			balance = response.data.data.balances[0].amount;

		})
		.catch((error) => {
			console.log({ status: "Error", msg: error.response });
		});

	return { balance: balance }
};

// Generating Blockchain Address
const getBlockchainAddress = async (id) => {
	var address = "";
	headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
		Authorization:
			"Bearer QVBJX0tFWToyYjNlZDk2ZTg3NDM4MzRkYTM0YmY1NmEzZjA5YjdiZTozM2VmNWE2ZDM1MmFjYzQ1ZjNiMGM3OWJkN2ZhOTAwNQ==",
	};

	const body = {
		chain: "TRX",
		idempotencyKey: uuidv4(),
		currency: "USD",
	};

	await axios
		.post(`https://api-sandbox.circle.com/v1/wallets/${id}/addresses`, body, {
			headers,
		})
		.then((response) => console.log((address = response.data.data.address)));

	return { address: address };
};

module.exports = {
	configuration,
	createWallet,
	getWallet,
	getBlockchainAddress,
};
