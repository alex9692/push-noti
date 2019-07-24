const express = require("express");
const path = require('path')
const webpush = require("web-push");
const bodyParser = require("body-parser");

const publicVapidKey = require("./keys").publicKey;
const privateVapidKey = require("./keys").privateKey;
const app = express();

webpush.setVapidDetails(
	"mailto:battle253@gmail.com",
	publicVapidKey,
	privateVapidKey
);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client')));

app.post("/subscribe", (req, res) => {
	const subscription = req.body;
	res.status(201).json({});
	const payload = JSON.stringify({ title: "test" });
	console.log(subscription);

	webpush
		.sendNotification(subscription, payload)
		.then(response => {
			console.log(response);
		})
		.catch(error => {
			console.error(error.stack);
		});
});

app.listen(3001, () => {
	console.log("running in port 3001");
});
