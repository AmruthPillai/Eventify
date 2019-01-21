const User = require('../../models/user');
const Event = require('../../models/event');

const {
  transformEvent
} = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find()
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },

  createEvent: async (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: args.eventInput.price,
      date: new Date(args.eventInput.date),
      organiser: '5c44dce7c3583126c130d78a',
    });

    let newEvent;

    try {
      const result = await event.save();
      newEvent = transformEvent(result);

      const organiser = await User.findById('5c44dce7c3583126c130d78a');

      if (!organiser) {
        throw new Error('User not found.')
      }

      organiser.createdEvents.push(event);
      await organiser.save();

      return newEvent;
    } catch (err) {
      throw err;
    }
  },
};