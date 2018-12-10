const cheerio = require('cheerio')
const service = require('../services/dyjwservice')


class DyjwController{


    //登陆
    async login(ctx){
        let {USERNAME,PASSWORD} = ctx.request.body
        let result = await service.login(USERNAME,PASSWORD)
        ctx.body = result
    }

    //教学评价
    async getJXPJ(ctx){
        let menus = await service.getJXPJ()
        ctx.body = menus
    }

    //教学评价详情
    async getJXPJDetail(ctx) {
        let {xnxq,pjpc,pjfl,pjkc} = ctx.request.body
        let html = await service.getJXPJDetail(xnxq,pjpc,pjfl,pjkc);
        ctx.body = html
    }


    //课表周期
    async getSyllabusPeriod(ctx){
        let data = await service.getSyllabusPeriod()
        ctx.body = data
    }

    //课表详情
    async getSyllabusDetail(ctx){
        let data = await service.getSyllabus(ctx.params.preiod,ctx.params.studentnum)
        ctx.body = data
    }

    //评价
    async postJXPJInfor(ctx){
        let {url} = ctx.request.body
        url = url.split(',')
        console.log(url[0]);
        let data = await service.postJXPJInfor(url);
        ctx.body = data
    }

}

module.exports = new DyjwController();