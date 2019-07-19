const router = require('koa-router')();
const fs = require('fs');
const path = require('path');
const xlsx = require('node-xlsx').default;

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

// 导航数据
router.get('/api/getNavData', async (ctx, next) => {
  let file = path.join(__dirname, '../static/data/nav.json');
  //读取json文件
  await new Promise((resolve, reject) => { // 读image文件夹
    fs.readFile(file, 'utf-8', function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    });
  }).then((data)=>{
    ctx.body = data
  })
})

//上传文件
router.post('/api/upload', async (ctx, next) => {
  const file = ctx.request.files.file;   // 获取上传文件
  const reader = fs.createReadStream(file.path);  // 创建可读流
  const filePath = path.join(__dirname, '../', '/static/upload/');
  // 组装成绝对路径
  const fileResource = filePath + `/${file.name}`;
  const upStream = fs.createWriteStream(fileResource); // 创建可写流
  reader.pipe(upStream);  // 可读流通过管道写入可写流
  console.log(upStream)
  return ctx.body = { errcode: 0, errmsg: '上传成功' };

})


/* 读取excel */
router.get('/api/getExcelData', async (ctx, next) => {
  await new Promise((resolve, reject) => { 
    const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(path.join(__dirname,`../static/upload/2.xls`)));
    console.log(JSON.stringify(workSheetsFromBuffer))
        resolve(workSheetsFromBuffer)
  }).then((data)=>{
    ctx.body = data
  })
})


// Parse a buffer











module.exports = router
