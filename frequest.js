const baseUrl = 'http://jwgl.nepu.edu.cn'
const request = require('request')
const baseRequest = request.defaults({
    jar:true,
    baseUrl: baseUrl
})

function setCookie(cookie){
    let j= baseRequest.jar()
    let basecookie = baseRequest.cookie('JSESSIONID=',cookie)
    j.setCookie(basecookie,baseUrl)
}

function fetch(url){
    return new Promise((resolve,reject) => {
        baseRequest(url,(err,response,body) => {
            if (body) {
                resolve(body)
            }
            reject(err)
        })
    }).catch(new Function())
}

function post(url,formData){
    return new Promise(((resolve,reject) => {
        baseRequest({
            url: url,
            method:'post',
            form: formData
        },(err,response,body) => {
            if (body) {
                resolve(body)
            }
            reject(err)
        })
    })).catch(new Function())
}

function getStream(url){
    return baseRequest(url,(err,response,body) => {
        if (response.headers['set-cookie']) {
            let sessionid = response.headers['set-cookie'][0].split(';')[0].split('=')[1]
            setCookie(sessionid)
        } 
        else return
    })
}

module.exports = {fetch,post,getStream}