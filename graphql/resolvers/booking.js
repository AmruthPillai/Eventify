const Event = require('../../models/event');
const Booking = require('../../models/booking');

const {
  transformEvent,
  transformBooking
} = require('./merge');

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthorized Access.')
    }

    try {
      const bookings = await Booking.find();

      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },

  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthorized Access.')
    }

    const fetchedEvent = await Event.findOne({
      _id: args.eventId
    });

    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent
    });

    const result = await booking.save();
    return transformBooking(result);
  },

  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthorized Access.')
    }

    try {
      const booking = await Booking.findById(args.bookingId)
        .populate('event');
      const event = transformEvent(booking.event);

      await Booking.findByIdAndDelete(args.bookingId);
      return event;
    } catch (err) {
      throw err;
    }
  },
};