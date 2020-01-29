/**
 * Home Controller
 */
class HomeController {
  async index(ctx) {
    ctx.body = 'Home Page';
  }
}

module.exports = new HomeController();
