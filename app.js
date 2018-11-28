const Koa = require('koa')
const Router = require('koa-router')
const {fetch,post,getStream} = require('./frequest')
const {Base64Encode} = require('base64-stream')
const app = new Koa();
const router = Router();
const koabody = require('koa-body')
const cheerio = require('cheerio')

router.get('/code',async ctx => {
    let stream =  getStream('/verifycode.servlet')
    const base64 =  await streamToBase64(stream)
    const base64data = {
        data : base64
    }
    ctx.body = base64
})

router.post('/login',async ctx=>{
    let {USERNAME,PASSWORD,RANDOMCODE} = ctx.request.body
    let result = await login(USERNAME,PASSWORD,RANDOMCODE)
    ctx.body = result
})

router.get('/getJXPJ',async ctx => {
    let menus = await getJXPJ()
    ctx.body = menus
})

router.post('/postJXPJDetail',async ctx =>{
    let {xnxq,pjpc,pjfl,pjkc} = ctx.request.body
    let html = await getJXPJDetail(xnxq,pjpc,pjfl,pjkc);
    ctx.body = html
})

router.get('/getSyllabus',async ctx => {
    let data = await getSyllabus('2018-2019-1','161501140323')
    ctx.body = data
})

app.use(koabody())
app.use(router.routes())

app.listen(3000,() => {
    console.log('object');
})


function streamToBase64(stream){
    return new Promise(resolve => {
        let data = 'data:image/jpeg;base64,'
        let base64code = stream.pipe(new Base64Encode())
        base64code.setEncoding('UTF8')
        base64code.on('data',function(chunk){
            data += chunk
        })

        base64code.on('end', function(){
            resolve(data)     
        })
    })
}


async function login(name,pwd,code){

    let main = await post('/Logon.do?method=logon',{
        USERNAME:name,
        PASSWORD:pwd,
        RANDOMCODE:code
    })

    if (main.indexOf('http://jwgl.nepu.edu.cn/framework/main.jsp') == -1) {
            return '用户名，密码或验证码错误'
    }
    let personalInfor = await fetch('/framework/main.jsp')
    const $ = cheerio.load(personalInfor)
    await fetch('/Logon.do?method=logonBySSO')
    return $('title').text();
}

async function getJXPJ(){
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

    return data
}

async function getJXPJDetail(xnxq,pjpc,pjfl,pjkc) {
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

    return data;

}

async function getSyllabusPeriod(){
    let html = await fetch('/tkglAction.do?method=kbxxXs&tktime=' + new Date().getTime())
    const $ = cheerio.load(html)
    let data = {}

    let perioddata = []
    $('#zc').children().each((index,el) => {
        if ($(el).val()){
            perioddata.push({
                'title': $(el).text(),
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
    return data;
}

async function getSyllabus(period,studentnum){
    let {perioddata} = await getSyllabusPeriod().catch(error => {console.log(error.message);});
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
        console.log("adasd");    
    }


    console.log(data + "dadaqewqweqweqwe"); 
    return data

}

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection:', reason)
    // 在这里处理
})


function turnToEn(value){
    const data = {
        0 : "FirstClass",
        1 : "SecondClass",
        2 : "ThirdClass",
        3 : "TourthClass",
        4 : "FifthClass",
        5 : "SixthClass"
    }
    return data[value]
}

function chToEn(value) {
    const data = {
        1: 'Mon',
        2: 'Tue',
        3: 'Wed',
        4: 'Thur',
        5: 'Feb',
        6: 'Sat',
        7: 'Sun'
    }
    return data[value]
}




