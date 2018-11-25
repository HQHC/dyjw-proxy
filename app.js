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
    ctx.response.body = base64
})

router.post('/login',async ctx=>{
    let {USERNAME,PASSWORD,RANDOMCODE} = ctx.request.body
    let result = await login(USERNAME,PASSWORD,RANDOMCODE)
    ctx.response.body = result
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

    return $('title').text();

    // return new Promise(resolve => {
        
    //     request({
    //         url:'http://jwgl.nepu.edu.cn/Logon.do?method=logon',
    //         method:'post',
    //         form:{
    //             USERNAME:name,
    //             PASSWORD:pwd,
    //             RANDOMCODE:code
    //         }
    //     },(err,response,body) => {
    //         if (body.indexOf('http://jwgl.nepu.edu.cn/framework/main.jsp') == -1) {
    //             resolve('用户名，密码或验证码错误')
    //         }
            
    //         request('http://jwgl.nepu.edu.cn/framework/main.jsp',(err,response,body) => {
                
    //         })

    //     })
    // })
}




