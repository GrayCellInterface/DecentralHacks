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
		});

	return { walletId: walletId };
};

// Retrieve existing wallet TEST
const getWallet = async (id) => {
	let balance = "";
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

	return { balance: balance };
};


// Generating Blockchain Address using wallet ID
const getBlockchainAddress = async (req, res) => {
	var walletId = "";
	var walletAddress = ""
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

	User.findOne({ email: req.params.email }, async function (err, data) {
		if (data) {
			walletId = data.walletId;
			await axios
				.post(
					`https://api-sandbox.circle.com/v1/wallets/${walletId}/addresses`,
					body,
					{
						headers,
					}
				)
				.then((response) => {
					console.log((walletAddress = response.data.data.address));
					res.send({ walletId: walletId, walletAddress: walletAddress });
				});
		} else {
			res.send({ msg: "Invalid Email" });
		}
	});
};

// Get wallet Id from email
const getWalletId = async (req, res) => {
	let walletId = "";
	User.findOne({ email: req.params.email }, async function (err, data) {
		if (data) {
			walletId = data.walletId;
			const { balance } = await getWallet(walletId);
			res.send({ status: "success", balance: balance });
		} else {
			res.send({ status: "error", msg: "User Doesnot exist" });
		}
	});
};


module.exports = {
	configuration,
	createWallet,
	getWallet,
	getBlockchainAddress,
	getWalletId
};


