import Router from 'koa-router';

import homeCtl from '../controllers/home';

const router = new Router();
const { index, upload } = homeCtl;

router.get('/', index);
router.post('/upload', upload);

export default router;
