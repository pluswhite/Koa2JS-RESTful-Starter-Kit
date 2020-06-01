import jwt from 'koa-jwt';
import Router from 'koa-router';

import commentsCtl from '../controllers/comments';
import config from '../config';

const router = new Router({
  prefix: '/questions/:questionId/answers/:answerId/comments',
});

const { secret } = config;

const {
  create,
  update,
  find,
  findById,
  delete: del,
  checkCommentExist,
  checkCommentator,
} = commentsCtl;

// auth middleware
const auth = jwt({ secret });

router.get('/', find);
router.post('/', auth, create);
router.get('/:id', checkCommentExist, findById);
router.patch('/:id', auth, checkCommentExist, checkCommentator, update);
router.delete('/:id', auth, checkCommentExist, checkCommentator, del);

export default router;
