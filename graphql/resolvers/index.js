const bcrypt = require('bcryptjs');

const User = require('../../models/user');
const Event = require('../../models/event');
const Booking = require('../../models/booking');

const events = async eventIds => {
  try {
    const events = await Event.find({
      _id: {
        $in: eventIds
      }
    });

    events.map(event => {
      return {
        ...event._doc,
        date: new Date(event.date).toISOString(),
        organiser: user.bind(this, event.organiser)
      };
    });

    return events;
  } catch (err) {
    throw err;
  }
}

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);

    return {
      ...event._doc,
      date: new Date(event.date).toISOString(),
      organiser: user.bind(this, event.organiser),
    };
  } catch (err) {
    throw err;
  }
}

const user = async userId => {
  try {
    const user = await User.findById(userId)

    return {
      ...user._doc,
      createdEvents: events.bind(this, user.createdEvents)
    };
  } catch (err) {
    throw err;
  }
}

module.exports = {
  events: async () => {
    try {
      const events = await Event.find()
      return events.map(event => {
        return {
          ...event._doc,
          date: new Date(event.date).toISOString(),
          organiser: user.bind(this, event.organiser)
        }
      });
    } catch (err) {
      throw err;
    }
  },

  bookings: async () => {
    try {
      const bookings = await Booking.find();

      return bookings.map(booking => {
        return {
          ...booking._doc,
          user: user.bind(this, booking.user),
          event: singleEvent.bind(this, booking.event),
          createdAt: new Date(booking.createdAt).toISOString(),
          updatedAt: new Date(booking.updatedAt).toISOString(),
        };
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

      newEvent = {
        ...result._doc,
        organiser: user.bind(this, event.organiser)
      };

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

  createUser: async (args) => {
    try {
      const user = await User
        .findOne({
          email: args.userInput.email
        });

      if (user) {
        throw new Error('User exists already.');
      }

      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const newUser = new User({
        email: args.userInput.email,
        password: hashedPassword
      });

      const result = await newUser.save();
      return {
        ...result._doc,
        password: null
      };
    } catch (err) {
      throw err;
    }
  },

  bookEvent: async args => {
    const fetchedEvent = await Event.findOne({
      _id: args.eventId
    });
    const booking = new Booking({
      user: '5c44dce7c3583126c130d78a',
      event: fetchedEvent
    });

    const result = await booking.save();
    return {
      ...result._doc,
      createdAt: new Date(result.createdAt).toISOString(),
      updatedAt: new Date(result.updatedAt).toISOString(),
    };
  },

  cancelBooking: async args => {
    try {
      const booking = await Booking.findById(args.bookingId)
        .populate('event');

      const event = {
        ...booking.event._doc,
        organiser: user.bind(this, booking.event.organiser),
      };

      await Booking.findByIdAndDelete(args.bookingId);
      return event;
    } catch (err) {
      throw err;
    }
  },
}