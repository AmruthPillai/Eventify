const express = require('express');
const mongoose = require('mongoose');
const graphqlHttp = require('express-graphql');

const schema = require('./graphql/schema/index');
const resolvers = require('./graphql/resolvers/index');

const app = express();

app.use(express.json());

app.use('/graphql', graphqlHttp({
  schema: schema,
  rootValue: resolvers,
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