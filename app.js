const express = require('express')
const proxy = require('http-proxy-middleware')

const app = express();

const options = {

        target: 'http://jwgl.nepu.edu.cn', // target host
        pathRewrite: (path,req) =>  path.replace('/dyjw',''),
        onProxyRes(proxyRes, req, res) {
            console.log(proxyRes['JSESSIONID'])
        }
}


app.use('/dyjw', proxy(options));

app.listen(3001);