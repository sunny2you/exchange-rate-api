const express = require('express');
const { graphqlHTTP } = require('express-graphql');
require('dotenv').config();
const connectDB = require('../config/database');
const schema = require('../graphql/schema');

const app = express();

connectDB();

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

const PORT = process.env.PORT || 5110;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
