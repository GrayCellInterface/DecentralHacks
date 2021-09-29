const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const env = require("dotenv").config();
const mongoose = require("mongoose");

const router = require("./routes/index");
const accountsRouter = require("./routes/accounts");
const shopRouter = require("./routes/shop");
const statusRoute = require("./routes/status");

const app = express();

// Connecting to mongodb
mongoose.connect(
	process.env.DATABASE_URL,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	(err) => {
		if (!err) {
			console.log("MongoDB Connected");
		} else {
			console.log("Error in connection : " + err);
		}
	}
);

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function () { });


// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
	res.send("Working!");
});

// Base Routes
app.use("/api/auth", router.route);
app.use("/api/accounts", accountsRouter.route);
app.use("/api/shop", shopRouter.route);
app.use("/api/status", statusRoute.route);

const PORT = process.env.PORT || 4000;
app.listen(PORT, function () {
	console.log("Server Running on PORT " + PORT);
});
