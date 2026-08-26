const logger = require('../utils/logger');

// Logs one structured entry per request, once it finishes, with the
// response status code and how long it took.
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info('request', {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - start,
    });
  });
  next();
};

module.exports = requestLogger;
