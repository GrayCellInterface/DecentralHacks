const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

// Check master wallet configuration
const configuration = async (req, res) => {
	const headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
		Authorization:
			"Bearer QVBJX0tFWTo1YjAwMGYwOTAxZjUwYmZhNjBkMzlmMjUxNDAwNTg1Zjo3NGE5NDUwZGNjNDJkMzAyNDRkODVmZDYyYzIwNGY4ZA==",
	};

	axios
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
			"Bearer QVBJX0tFWTo1YjAwMGYwOTAxZjUwYmZhNjBkMzlmMjUxNDAwNTg1Zjo3NGE5NDUwZGNjNDJkMzAyNDRkODVmZDYyYzIwNGY4ZA==",
	};

	await axios
		.post("https://api-sandbox.circle.com/v1/wallets", body, { headers })
		.then((response) => (walletId = response.data.data.walletId));
	// console.log(walletId);
	return walletId;
};

// Retrieve existing wallet
const getWallet = async (id = 1000175725) => {
	const headers = {
		Accept: "application/json",
		"Content-Type": "application/json",
		Authorization:
			"Bearer QVBJX0tFWTo1YjAwMGYwOTAxZjUwYmZhNjBkMzlmMjUxNDAwNTg1Zjo3NGE5NDUwZGNjNDJkMzAyNDRkODVmZDYyYzIwNGY4ZA==",
	};

	axios
		.get("https://api-sandbox.circle.com/v1/wallets/${id}", { headers })
		.then((response) => resp.send(response));
};

module.exports = {
	configuration,
	createWallet,
	getWallet,
};
