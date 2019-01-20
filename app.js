const express = require('express');
const mongoose = require('mongoose');
const graphqlHttp = require('express-graphql');
const {
  buildSchema
} = require('graphql');

const Event = require('./models/event');

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

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
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
      });

      return event
        .save()
        .then(res => res._doc)
        .catch((err) => {
          console.error(err);
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