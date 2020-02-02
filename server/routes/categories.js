const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
  prefix: '/categories',
});

const { appSecret: secret } = require('../../config');
const categoriesCtl = require('../controllers/categories');
const {
  getCategoryList,
  createCategory,
  updateCategory,
  getCategoryById,
  deleteCategory,
} = categoriesCtl;
// Authentication middleware
const auth = jwt({
  secret,
});

router.get('/', getCategoryList);
router.get('/:id', getCategoryById);
router.post('/', createCategory);
router.put('/:id', auth, updateCategory);
router.delete('/:id', auth, deleteCategory);

module.exports = router;
