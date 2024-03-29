'use strict';

const _ = require('lodash');
const Logger = require('./logger');
const PubSubClient = require('./pubsub');

function Subscriber(config, logger) {
	let self = {};

	self.init = function (config, logger) {
		self.config = config;
		self.logger = logger;

		self.pubsub = new PubSubClient(
			{
				project: self.config.project,
				pubsub: self.config.pubsub,
			},
			self.logger
		);
	};

	self.attachListener = function (subscription) {
		self.subscription = subscription;
		self.pubsub.subscribe(
			subscription,
			self.messageHandler,
			self.errorHandler
		);
	};

	self.errorHandler = function (error) {
		console.error(`ERROR: ${error} - ${error.stack}`);

		console.log(
			`reattaching listener to subscription - ${self.subscription}`
		);

		// Reattach after couple of seconds - 5
		self.attachListener(self.subscription);
	};

	self.messageHandler = function (message) {
		console.log(`Received a message for processing ${message.id}:`);
		console.log(`\tData: ${message.data}`);
		console.log(`\tAttributes: ${JSON.stringify(message.attributes)}`);

		self.logger.log({
			status: 'processing',
			message: `received a message for processing ${message.data}`,
		});

		const data = JSON.parse(message.data);
		console.log(`timeout: ${data.timeout}`);

		let timeout = data.timeout ? data.timeout : 1000;
		setTimeout(function () {
			message.ack();

			console.log(`message acknowledged`);
		}, data.timeout);
	};

	self.init(config, logger);

	return self;
}

module.exports = Subscriber;
