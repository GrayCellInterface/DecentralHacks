const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const headers = {
	Accept: "application/json",
	"Content-Type": "application/json",
	Authorization: `${process.env.BEARER}`
};

// Check master wallet configuration
const configuration = async (req, res) => {
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

	await axios
		.get(`https://api-sandbox.circle.com/v1/wallets/${id}`, { headers })
		.then((response) => {
			balance = response.data.data.balances;
			if (balance.length === 0) {
				balance = "0"
			} else {
				balance = response.data.data.balances[0].amount
			}
			console.log("BALANCE", balance);

		})
		.catch((error) => {
			console.log({ status: "Error", msg: error });
		});

	return { balance: balance };
};

// Generating Blockchain Address using wallet ID
const getBlockchainAddress = async (req, res) => {
	var walletId = "";
	var walletAddress = "";

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

// Get wallet Id from email
const getCustomerTransactions = async (req, res) => {
	let walletId = "";

	User.findOne({ email: req.params.email }, async function (err, data) {
		if (data) {
			walletId = data.walletId;
			await axios
				.get(
					`https://api-sandbox.circle.com/v1/transfers?walletId=${walletId}`,
					{
						headers,
					}
				)
				.then((response) => {
					res.send({ transactions: response.data.data });
				});
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
	getWalletId,
	getCustomerTransactions,
};
