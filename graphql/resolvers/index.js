const authRes = require('./auth');
const eventsRes = require('./events');
const bookingRes = require('./booking');

module.exports = {
  ...authRes,
  ...eventsRes,
  ...bookingRes,
};
