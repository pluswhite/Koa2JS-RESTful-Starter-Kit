const path = require('path');
const Koa = require('koa');
const static = require('koa-static');
const parameter = require('koa-parameter');
const koaBody = require('koa-body');
const error = require('koa-json-error');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const routing = require('./routes');
const config = require('../config');

const app = new Koa();

const { port, database } = config;
const { username, password, dbname } = database;

// Database config
const dbConnectUri = `mongodb+srv://${username}:${password}@webapp-voh6z.mongodb.net/${dbname}?retryWrites=true&w=majority`;
mongoose.connect(
  dbConnectUri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log('Database(MongoDB) connect successfully!');
  }
);
mongoose.connection.on('error', console.error);

app.use(static(path.join(__dirname, '../public')));
app.use(parameter(app));
app.use(
  koaBody({
    multipart: true,
  })
);
app.use(error());

routing(app);

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
