'use strict';

// const fs = require('fs');
// const dotenv = require('dotenv');
// const envConfig = dotenv.parse(fs.readFileSync('.env'));

// if (envConfig.GOOGLE_APPLICATION_CREDENTIALS) {
//   process.env.GOOGLE_APPLICATION_CREDENTIALS = envConfig.GOOGLE_APPLICATION_CREDENTIALS;
// }

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const config = require('config');

console.log(`Configuration: ${JSON.stringify(config)}`);

const Logger = require('./logger');
const Publisher = require('./publisher');
const Subscriber = require('./subscriber');

const PORT = process.env.PORT || 8090;
const HOST = '0.0.0.0';

process.on('SIGINT', function () {
	console.log('server', 'SIGINT - shutting down...');
	process.exit(1);
});

process.on('SIGTERM', function () {
	console.log('server', 'SIGTERM - shutting down...');
	process.exit(1);
});

const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
); // support encoded bodies

app.get('/', (req, res) => {
	console.log('server', 'In am running ...');

	res.status(200).send({
		status: 'success',
	});
});

const logger = new Logger({
	project: config.Google.project,
	logger: config.Google.logger,
});

app.route('/:topic/publish').post((req, res) => {
	const message = req.body;

	const publisher = new Publisher(
		{
			project: config.Google.project,
			pubsub: config.Google.pubsub,
		},
		logger
	);

	publisher
		.publishMessage(message, req.params.topic)
		.then(() => {
			console.log(`published message successfully`);

			res.status(200).send({
				status: 'success',
			});
		})
		.catch((err) => {
			console.log(`failed to publish message ${err} - ${err.stack}`);

			res.status(500).send(err);
		});
});

app.route('/:subscription/subscribe').get((req, res) => {
	const subscriber = new Subscriber(
		{
			project: config.Google.project,
			pubsub: config.Google.pubsub,
		},
		logger
	);

	subscriber.attachListener(req.params.subscription);

	res.status(200).send({
		status: 'success',
	});
});

app.listen(PORT, HOST);

console.log('server', `Running on http://${HOST}:${PORT}`);
