const Koa = require('koa')
const path = require('path');
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const static_ = require('koa-static')



const index = require('./routes/index')
const users = require('./routes/users')
const xcx = require('./routes/xcx')

const app = new Koa()

//跨域处理
app.use(cors());
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 2000 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
  }
}));
// 设置浏览器静态访问目录
app.use(static_(
  path.join(__dirname, './static')
))
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(xcx.routes(), xcx.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
