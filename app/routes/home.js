const Router = require('koa-router');
const router = new Router();

const homeCtl = require('../controllers/home');
const { index } = homeCtl;

router.get('/', index);

module.exports = router;
