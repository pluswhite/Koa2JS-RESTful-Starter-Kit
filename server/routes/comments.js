const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({
  prefix: '/comments',
});

const { appSecret: secret } = require('../../config');
const commentsCtl = require('../controllers/comments');
const {
  getCommentList,
  createComment,
  updateComment,
  getCommentById,
  deleteComment,
} = commentsCtl;
// Authentication middleware
const auth = jwt({
  secret,
});

router.get('/', getCommentList);
router.get('/:id', getCommentById);
router.post('/', createComment);
router.put('/:id', auth, updateComment);
router.delete('/:id', auth, deleteComment);

module.exports = router;
