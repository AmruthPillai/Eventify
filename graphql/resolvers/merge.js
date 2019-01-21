const User = require('../../models/user');
const Event = require('../../models/event');

const {
  dateToString
} = require('../../helpers/date');

const transformUser = user => {
  return {
    ...user._doc,
    password: null,
    createdEvents: events.bind(this, user.createdEvents),
  };
};

const transformEvent = event => {
  return {
    ...event._doc,
    date: dateToString(event.date),
    organiser: user.bind(this, event.organiser),
  };
};

const transformBooking = booking => {
  return {
    ...booking._doc,
    user: user.bind(this, booking.user),
    event: singleEvent.bind(this, booking.event),
    createdAt: dateToString(booking.createdAt),
    updatedAt: dateToString(booking.updatedAt),
  };
};

const user = async userId => {
  try {
    const user = await User.findById(userId)
    return transformUser(user);
  } catch (err) {
    throw err;
  }
};

const events = async eventIds => {
  try {
    const events = await Event.find({
      _id: {
        $in: eventIds
      }
    });

    return events.map(event => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  transformUser,
  transformEvent,
  transformBooking,
  user,
  events,
  singleEvent
}