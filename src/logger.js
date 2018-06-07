'use strict';

const Logging = require('@google-cloud/logging');
const _ = require('lodash');

function Logger(config) {
  let self = {};

  self._config = {};

  self.init = function(config) {
    self._config = _.merge(self._config, config);

    if (self._config.enabled) {
      const logging = new Logging({
        projectId: self._config.project.id
      });

      self.logger = logging.log(self._config.logger.name);
      self.logResource = {
        type: self._config.logger.type,
      };
    }
  }

  self.log = function(message) {
    if (self._config.enabled) {
      const entry = self.logger.entry({
        resource: self.logResource
      }, message);

      self.logger.write(entry)
        .then(() => {
          //console.log(`Logged the message to Google Cloud Logs`);
        })
        .catch(err => {
          //console.error('ERROR:', err);
        });
    } else {
      console.log(`${new Date()} - ${JSON.stringify(message)}`);
    }
  }

  self.init(config);

  return self;
}

module.exports = Logger;