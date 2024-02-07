const { INTERNAL_SERVER_ERROR_500 } = require('../utils/constants');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INTERNAL_SERVER_ERROR_500;
  }
}

module.exports = ServerError;
