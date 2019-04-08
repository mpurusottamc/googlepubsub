'use strict';

const _ = require('lodash');
const PubSub = require('./pubsub');

function Publisher(config, logger) {
	let self = {};

	self.init = function (config, logger) {
		self.config = config;
		self.logger = logger;

		self.pubsub = new PubSub({
			project: self.config.project,
			pubsub: self.config.pubsub
		}, self.logger);
	}

	self.publishMessage = function (message, topicName) {
		return new Promise((resolve, reject) => {
			self.pubsub.publish(message, topicName).then(() => {
				resolve();
			}).catch(err => {
				reject(err);
			});
		});
	}

	self.init(config, logger);

	return self;
}

module.exports = Publisher;