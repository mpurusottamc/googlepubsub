'use strict';

const { PubSub } = require('@google-cloud/pubsub');

const _ = require('lodash');
const Logger = require('./logger');

function PubSubClient(config, logger) {
	let self = {};

	self._config = {};

	self.init = function (config, logger) {
		self._config = _.merge(self._config, config);

		self.logger = logger;
	};

	self.publish = function (message, topicName) {
		return new Promise((resolve, reject) => {
			const pubsubClient = PubSub({
				projectId: self._config.project.id,
			});

			let topic = pubsubClient.topic(topicName);
			let pub = topic.publisher();
			let msg = new Buffer(JSON.stringify(message));

			console.log(`About to publish message on pubsub`);

			self.logger.log({
				status: 'success',
				message: `About to publish message on pubsub`,
			});

			pub.publish(msg)
				.then((results) => {
					console.log(`message published on pubsub`);

					self.logger.log({
						status: 'success',
						message: `message published on pubsub`,
					});
					resolve();
				})
				.catch((err) => {
					console.log(
						`failed to publish message on pubsub: ${err} - ${err.stack}`
					);

					self.logger.log({
						status: 'error',
						message: `Message not published : ${err}`,
					});

					reject();
				});
		});
	};

	self.subscribe = function (subscriptionName, messageHandler, errorHandler) {
		console.log(`about to begin processing pubsub requests`);

		self.logger.log({
			status: 'init',
			message: `about to begin processing pubsub requests`,
		});

		// Creates a client
		const pubsubClient = new PubSub({
			projectId: self._config.project.id,
		});

		const timeout = 10;

		// References an existing subscription
		const subscription = pubsubClient.subscription(subscriptionName, {
			flowControl: {
				maxMessages: 1,
			},
		});

		subscription.ackDeadline =
			self._config.pubsub.messageAckTimeInSeconds * 1000;

		// Listen for new messages until timeout is hit
		subscription.on(`message`, messageHandler);
		subscription.on(`error`, errorHandler);

		console.log(`attached listener to pubsub: ${subscriptionName}`);

		self.logger.log({
			status: 'init',
			message: `attached listener to pubsub: ${subscriptionName}`,
		});
	};

	self.init(config, logger);

	return self;
}

module.exports = PubSubClient;
