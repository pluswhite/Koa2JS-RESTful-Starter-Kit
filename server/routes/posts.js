const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
  prefix: '/posts',
});
const { appSecret: secret } = require('../../config');
const postsCtl = require('../controllers/posts');

const {
  getPostList,
  createPost,
  updatePost,
  getPostById,
  deletePost,
} = postsCtl;

// auth middleware
const auth = jwt({ secret });

router.get('/', getPostList);
router.get('/:id', getPostById);
router.post('/', auth, createPost);
router.put('/:id', auth, updatePost);
router.del('/:id', deletePost);

module.exports = router;
