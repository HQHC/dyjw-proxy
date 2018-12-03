const {fetch,post,getStream} = require('../utils/frequest');
const format = require('../utils/formatutil')
const {turnToEn,chToEn,streamToBase64} = require('../utils/turnutil')
const cheerio = require('cheerio')

class DyjwService{

    async getCode(){
        let stream =  getStream('/verifycode.servlet')
        const base64 =  await streamToBase64(stream)
        const base64data = {
            data : base64
        }
        return format.success(200,base64data)
    }


    async login(name,pwd,code){
        let main = await post('/Logon.do?method=logon',{
            USERNAME:name,
            PASSWORD:pwd,
            RANDOMCODE:code
        }).catch(err => {

        })
    
        if (main.indexOf('http://jwgl.nepu.edu.cn/framework/main.jsp') == -1) {
                return format.success(404,{
                    name:'用户名，密码或验证码错误'
                })
                
        }
        let personalInfor = await fetch('/framework/main.jsp')
        const $ = cheerio.load(personalInfor)
        await fetch('/Logon.do?method=logonBySSO')
        let data = format.success(200,{
            name:$('title').text()
        })

        return data
        
    }

    async getJXPJ(){
        let menus = await fetch('/jiaowu/jxpj/jxpjgl_queryxs.jsp?tktime=' + new Date().getTime())
        const $ = cheerio.load(menus)
        let data = {}
        let xnxq = []
        $('#xnxq').children().each((index,el) => {
            if ($(el).val()){
                xnxq.push({
                    'name':$(el).text(),
                    'value' : $(el).val(),
                    'selected' : $(el).attr('selected') ? true : false
                })
            }
        })
        data['xnxq'] = xnxq
    
        let pjpc = []
        $('select[name="pjpc"]').children().each((index,el) => {
            if ($(el).val()){
                pjpc.push({
                    'name':$(el).text(),
                    'value' : $(el).val(),
                    'selected' : $(el).attr('selected') ? true : false
                })
            }
        })
        data['pjpc'] = pjpc
    
        let pjfl = []
        $('select[name="pjfl"]').children().each((index,el) => {
            if ($(el).val()){
                pjfl.push({
                    'name':$(el).text(),
                    'value' : $(el).val(),
                    'selected' : $(el).attr('selected') ? true : false
                })
            }
        })
        data['pjfl'] = pjfl
    
        let pjkc = []
        $('select[name="pjkc"]').children().each((index,el) => {
            if ($(el).val()){
                pjkc.push({
                    'name':$(el).text(),
                    'value' : $(el).val(),
                    'selected' : $(el).attr('selected') ? true : false
                })
            }
        })
        data['pjkc'] = pjkc
    
        return format.success(200,data)
    }

    async getJXPJDetail(xnxq,pjpc,pjfl,pjkc) {
        let html = await post('/jxpjgl.do?method=queryJxpj&type=xs',{
            xnxq,
            pjpc,
            pjfl,
            pjkc,
            sfxsyjzb:1,
            cmdok:'查询'
        })
    
        const $ = cheerio.load(html)
        let data = []
        $('table tr').each((index,el) => {
            if (index > 1 && parseInt($($(el).children()[0]).text())){
                data.push({
                    'num': $($(el).children()[0]).text(),
                    'classname':$($(el).children()[4]).text(),
                    'teacher':$($(el).children()[5]).text(),
                    'grade':$($(el).children()[6]).text(),
                    'evaluated': $($(el).children()[7]).text() === '是' ? true : false
                })
            }
        })
    
        return format.success(200,data);
    
    }

    async getSyllabusPeriod(){
        let html = await fetch('/tkglAction.do?method=kbxxXs&tktime=' + new Date().getTime())
        const $ = cheerio.load(html)
        let data = {}
    
        let perioddata = []
        $('#zc').children().each((index,el) => {
            if ($(el).val()){
                perioddata.push({
                    'title': $(el).text().replace('/\\t/g',''),
                    'value': $(el).val()
                })
            }
        })
    
        let datedata = []
        $('#xnxqh').children().each((index,el) => {
            if ($(el).val()){
                datedata.push({
                    'name':$(el).text(),
                    'value' : $(el).val(),
                    'selected' : $(el).attr('selected') ? true : false
                })
            }
        })
    
        data = {
            perioddata,
            datedata
        }
        return format.success(200,data);
    }

    async getSyllabus(period,studentnum){
        let gdata = await this.getSyllabusPeriod().catch(error => {console.log(error.message);});
        let perioddata = gdata.data.perioddata
        let data = []
        for (const element of perioddata) {
            let val = element.value
            let weekname = 'Week' + val
            let html = await fetch(`/tkglAction.do?method=goListKbByXs&sql=&xnxqh=${period}&zc=${val}&xs0101id=${studentnum}`).catch(error => {console.log(error.message);})
            const $ = cheerio.load(html)
            let wdata = []
            $('#kbtable tr').each((index,el) => {
                if (index > 0 && index < 7) {
                    let week = []
                    let classname = turnToEn(index - 1)
                  $(el).children().each((nindex,nel) => {                         
                        if (nindex > 0 && nindex < 8) {
                            
                            let ndata = unescape($($(nel).children()[1]).html().replace(/&#x/g,'%u').replace(/;/g,'')).split('<br>')
                            let name = chToEn(nindex)
                            if (ndata[0] === '%uA0') {
                                week.push({
                                    [name]: '空'
                                })
                            } else {
                                week.push({
                                [name]:{
                                    'classname': ndata[0].replace('%uA0','').replace('\n','').trim(),
                                    'classroomnum': '@' + ndata[4],
                                    'other': {
                                        'teacher': ndata[2],
                                        'time': ndata[3].replace('<nobr>','').replace('</nobr>','').replace('<nobr>','').trim()
                                    }
                                }
                            })
                        }   
                    }
                    
                  })
                  wdata.push({
                    [classname]:week
                })
                }
            })
            
            data.push({
                [weekname]: wdata
            })  
        }
        return format.success(200,data)
    }

}

module.exports =  new DyjwService();