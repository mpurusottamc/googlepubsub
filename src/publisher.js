'use strict';

const _ = require('lodash');
const Logger = require('./logger');
const PubSub = require('./pubsub');

function Publisher(config, logger) {
    let self = {};

    self._config = {};

    self.init = function(config, logger) {
        self._config = _.merge(self._config, config);

        self.logger = logger;

        self.pubsub = new PubSub({
            project: self._config.project,
            pubsub: config.Google.pubsub
        }, self.logger);
    }

    self.publishMessage = function(message, topicName) {
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