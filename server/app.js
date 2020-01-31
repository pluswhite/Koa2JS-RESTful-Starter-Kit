const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const static = require('koa-static');
const parameter = require('koa-parameter');
const koaBody = require('koa-body');
const logger = require('koa-logger');
const morgan = require('koa-morgan');
const error = require('koa-json-error');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const env = process.env.NODE_ENV || 'development';
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
    useFindAndModify: false,
  },
  () => {
    console.log('Database(MongoDB) connect successfully!');
  },
);
mongoose.connection.on('error', console.error);

app.use(static(path.join(__dirname, '../public')));
app.use(parameter(app));
app.use(
  koaBody({
    multipart: true,
  }),
);
app.use(logger());
// logs use morgan
if (env !== 'production') {
  app.use(morgan('dev'));
} else {
  // production mode
  const logsFileName = path.join(__dirname, '../logs', 'access.log');
  const writeStream = fs.createWriteStream(logsFileName, {
    flags: 'a',
  });
  app.use(
    morgan('combined', {
      stream: writeStream, // default
    }),
  );
}
// format error to JSON
app.use(
  error({
    // avoid showing the stacktrace in 'production' env
    postFormat: (err, { stack, ...rest }) =>
      env === 'production' ? rest : { stack, ...rest },
  }),
);

routing(app);

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
