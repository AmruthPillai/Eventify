const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const graphqlHttp = require('express-graphql');
const {
  buildSchema
} = require('graphql');

const Event = require('./models/event');
const User = require('./models/user');

const app = express();

app.use(express.json());

app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type User {
      _id: ID!
      email: String!
      password: String
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input UserInput {
      email: String!
      password: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => {
      return Event.find()
        .then(res => res)
        .catch((err) => {
          console.error(err);
        })
    },

    createEvent: (args) => {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: args.eventInput.price,
        date: new Date(args.eventInput.date),
        organiser: '5c44dce7c3583126c130d78a',
      });

      let newEvent;

      return event
        .save()
        .then(event => {
          newEvent = event;
          return User.findById('5c44dce7c3583126c130d78a');
        })
        .then(user => {
          if (!user) {
            throw new Error('User not found.')
          }
          user.createdEvents.push(event);
          return user.save();
        })
        .then(res => newEvent)
        .catch((err) => {
          throw err;
        });
    },

    createUser: (args) => {
      return User
        .findOne({
          email: args.userInput.email
        })
        .then((user) => {
          if (user) {
            throw new Error('User exists already.');
          }

          return bcrypt.hash(args.userInput.password, 12);
        })
        .then((hashedPassword) => {
          const user = new User({
            email: args.userInput.email,
            password: hashedPassword
          });

          return user
            .save()
            .then(res => {
              res.password = null;
              return res;
            })
            .catch((err) => {
              throw err;
            });
        })
        .catch((err) => {
          throw err;
        });
    },
  },
  graphiql: true,
}));

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0-ksfag.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`, {
      useNewUrlParser: true
    },
  )
  .then(() => {
    app.listen(3000);
  })
  // eslint-disable-next-line no-console
  .catch(err => console.error(err));