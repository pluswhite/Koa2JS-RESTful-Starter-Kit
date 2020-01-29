const Koa = require('koa');

const config = require('../config');
const routing = require('./routes');
const app = new Koa();

const { port } = config;

app.use(async (ctx, next) => {
  console.log('Hello World!');
  await next();
});

routing(app);

app.listen(port, () => {
  console.log(`Server is running at port 3000`);
});
