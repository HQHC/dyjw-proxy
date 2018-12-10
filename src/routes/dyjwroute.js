const Router = require('koa-router')
const router = Router({
    prefix: '/dyjw'
});
const dyjwctrl = require('../controllers/dyjwcontroller')

router.post('/login',dyjwctrl.login);

router.get('/getJXPJ',dyjwctrl.getJXPJ)

router.post('/postJXPJDetail',dyjwctrl.getJXPJDetail)

router.get('/getSyllabusPeriod',dyjwctrl.getSyllabusPeriod)

router.get('/getSyllabus/:preiod/:studentnum',dyjwctrl.getSyllabusDetail)

router.post('/postJXPJInfor',dyjwctrl.postJXPJInfor)

module.exports = router