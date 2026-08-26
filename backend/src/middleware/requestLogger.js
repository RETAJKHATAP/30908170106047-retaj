const logger = require('../utils/logger');

// Logs one structured entry as soon as each request arrives. We log on
// entry (not on the response 'finish' event) because Vercel's serverless
// functions can freeze/terminate right after the response is sent, before
// a 'finish' listener gets a chance to run.
const requestLogger = (req, res, next) => {
  logger.info('request', {
    method: req.method,
    path: req.originalUrl,
  });
  next();
};

module.exports = requestLogger;
