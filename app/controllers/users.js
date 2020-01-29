/**
 * Users Controller
 */
class UsersController {
  async index(ctx) {
    ctx.body = 'Users Page';
  }
}

module.exports = new UsersController();
