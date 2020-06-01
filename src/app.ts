import path from 'path';
import Koa from 'koa';
import error from 'koa-json-error';
import koaBody from 'koa-body';
import koaStatic from 'koa-static';
import parameter from 'koa-parameter';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = new Koa();
import routers from './routes/index';
import config from './config';
const {
  database: { connectStr },
} = config;

const env = process.env.NODE_ENV;
const port = process.env.PORT;

mongoose.connect(
  connectStr,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('MongoDB connect successfully')
);
mongoose.connection.on('error', console.error);

app.use(koaStatic(path.join(__dirname, 'public')));
app.use(
  error({
    postFormat: (err, { stack, ...rest }) =>
      env === 'production' ? rest : { stack, ...rest },
  })
);
app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, '/public/uploads'),
      keepExtensions: true,
    },
  })
);
app.use(parameter(app));

app.use(routers.routes()).use(routers.allowedMethods());

app.listen(port, () => {
  console.log(`Severing is running on http://localhost:${port}/api`);
});
