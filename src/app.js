const Koa = require('koa')
const dyjwrouter = require('./routes/dyjwroute')
const koabody = require('koa-body')
const app = new Koa();

app.use(koabody())
app.use(dyjwrouter.routes())

app.listen(3000,() => {
    console.log('object');
})

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection:', reason)
    // 在这里处理
})




