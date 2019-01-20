const bcrypt = require('bcryptjs');

const User = require('../../models/user');
const Event = require('../../models/event');

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
}