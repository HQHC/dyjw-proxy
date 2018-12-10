const baseUrl = 'http://jwgl.nepu.edu.cn'
const request = require('request')
const baseRequest = request.defaults({
    jar:true,
    baseUrl
})
const j = baseRequest.jar()

function getCodeAndSetSessionId(){
    return new Promise((resolve,reject) => {
        request('http://172.17.0.1/code',(err,response,body) => {
            let data = body.split(",")
            let code = data[0]
            let sessionid = data[1];
            let basecookie = baseRequest.cookie(sessionid)
            j.setCookie(basecookie,baseUrl)
            if (body) {
                resolve(code)
            }
            reject(err)
        })
    }).catch(new Function())
}

function fetch(url){
    return new Promise((resolve,reject) => {
        baseRequest({url,jar:j},(err,response,body) => {
            if (body) {
                resolve(body)
            }
            reject(err)
        })
    }).catch(new Function())
}

function post(url,formData){
    return new Promise(((resolve,reject) => {
        console.log(baseRequest.jar().getCookieString(baseUrl));
        baseRequest({
            url,
            method:'post',
            form: formData,
            jar:j
        },(err,response,body) => {
            if (body) {
                resolve(body)
            }
            reject(err)
        })
    })).catch(new Function())
}



module.exports = {fetch,post,getCodeAndSetSessionId}
