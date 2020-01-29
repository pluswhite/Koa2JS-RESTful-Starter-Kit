const path = require('path');
const Koa = require('koa');
const static = require('koa-static');
const koaBody = require('koa-body');
const error = require('koa-json-error');

const config = require('../config');
const routing = require('./routes');
const app = new Koa();

const { port } = config;

app.use(static(path.join(__dirname, '../public')));
app.use(koaBody());
app.use(error());

routing(app);

app.listen(port, () => {
  console.log(`Server is running at port 3000`);
});
