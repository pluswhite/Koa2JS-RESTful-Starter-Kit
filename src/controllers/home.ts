import { Context } from 'koa';
import path from 'path';

class HomeController {
  index(ctx: Context) {
    ctx.body = 'Home Page';
  }

  upload(ctx: Context) {
    const file = ctx.request.files.file;
    const basename = path.basename(file.path);
    ctx.body = {
      url: `${ctx.origin}/uploads/${basename}`,
    };
  }
}

const homeCtrl = new HomeController();

export default homeCtrl;
