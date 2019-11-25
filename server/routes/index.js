const router = require('koa-router')();
const fs = require('fs');
const path = require('path');
const xlsx = require('node-xlsx').default;
var uuid = require('node-uuid');
var Pageres = require('pageres');

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
    }).then((data) => {
        ctx.body = data
    })
})

//上传文件
// router.post('/api/upload', async (ctx, next) => {
//   const file = ctx.request.files.file;   // 获取上传文件
//   const reader = fs.createReadStream(file.path);  // 创建可读流
//   const filePath = path.join(__dirname, '../', '/static/upload/');
//   // 组装成绝对路径
//   const fileResource = filePath + `/${file.name}`;
//   const upStream = fs.createWriteStream(fileResource); // 创建可写流
//   reader.pipe(upStream);  // 可读流通过管道写入可写流
//   console.log(upStream)
//   return ctx.body = { errcode: 0, errmsg: '上传成功' };

// })
router.post('/api/upload', async (ctx, next) => {
    const file = ctx.request.files.file;   // 获取上传文件
    console.log(ctx.request)
    const reader = fs.createReadStream(file.path);  // 创建可读流
    const filePath = path.join(__dirname, '../', '/static/upload/');
    // 组装成绝对路径
    const fileResource = filePath + `/${file.name}`;
    const upStream = fs.createWriteStream(fileResource); // 创建可写流
    reader.pipe(upStream);  // 可读流通过管道写入可写流
    console.log(upStream)
    return ctx.body = { errcode: 0, errmsg: '上传成功', src: file.name };

})


/* 读取excel */
router.get('/api/getExcelData', async (ctx, next) => {
    await new Promise((resolve, reject) => {
        const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(path.join(__dirname, `../static/upload/2.xls`)));
        console.log(JSON.stringify(workSheetsFromBuffer))
        resolve(workSheetsFromBuffer)
    }).then((data) => {
        ctx.body = data
    })
})
router.post('/api/question/excel/upload', async (ctx, next) => {
    /* const file = ctx.request.files.file;   // 获取上传文件 */
    const file = ctx.request.files.fileDatas;   // 获取上传文件
    const reader = fs.createReadStream(file.path);  // 创建可读流
    const filePath = path.join(__dirname, '../', '/static/upload/');
    // 组装成绝对路径
    const fileResource = filePath + `/${file.name}`;
    const upStream = fs.createWriteStream(fileResource); // 创建可写流
    reader.pipe(upStream);  // 可读流通过管道写入可写流
    console.log(upStream)
    return ctx.body = {
        "errcode": 0,
        "errmsg": "ok",
        "detail": null,
        "data": {
            "value": "756c6d8560b1479ba070a94f3d468cca",
            "key": null
        }
    };

})

router.post('/api/submit', async (ctx, next) => {
    ctx.set('Content-Type', 'application/json')
    console.log(ctx.request.body)
    ctx.body = { errcode: 0, errmsg: 'ok' };

})
router.post('/api/question/analysis/saveQuestion', async (ctx, next) => {
    console.log(ctx.request.body)
    ctx.body = { errcode: 0, errmsg: 'ok' };

})
router.get('/api/question/analysis/getQuestion', async (ctx, next) => {
    console.log(ctx.request.body)
    ctx.body = {
        "errcode": 0,
        "errmsg": "ok",
        "detail": null,
        "data": {
            "serialNo": 33,
            "question": [
                {
                    "content": "填空。"
                },
                {
                    "content": "(1)计算86÷2时，可以先算(　　)÷2＝(　　)，再算(　　)÷2＝(　　)，然后将两个商相加：(　　)＋(　　)＝(　　)，所以86÷2＝(　　)。"
                },
                {
                    "content": "(2)70里面有(　　)个7；从39中连续减去(　　)个3的差为0。"
                },
                {
                    "content": "(3)在〇里填上“＞”“＜”或“＝”。"
                },
                {
                    "content": "44÷4〇12　　　　82÷2〇40　　　　"
                },
                {
                    "content": "32〇96÷3　　　　23〇66÷3　　　　"
                },
                {
                    "content": "(4)62是2的(　　)倍；(　　)的3倍是99。"
                },
                {
                    "content": "(5)将87个苹果平均分成4份，每份是(　　)个，还剩(　　)个。"
                }
            ],
            "answer": [
                {
                    "content": "(1)80　40　6　3　40　3　43　43"
                },
                {
                    "content": "(2)10　13"
                },
                {
                    "content": "(3)＜　＞　＝　＞"
                },
                {
                    "content": "(4)31　33"
                },
                {
                    "content": "(5)21　3"
                }
            ],
            "analysis": null,
            "questionId": 2
        }
    }
})

/* 转换 */
router.get('/api/convert/http://192.168.41.11:8080/yxp-exercise/#/questionManage/paperManage/waitPaperList/1920x1080', function* (ctx, next) {
    var remoteUrl = decodeURIComponent(this.params.url);
    var size = this.params.size;
    var imgName = uuid.v4().split('-')[0];

    var filePath = path.join(__dirname, 'img');
    console.log(remoteUrl, size, filePath, imgName);

    //TODO You can not handle the time when the window load finished'
    new Pageres({ delay: 2, filename: imgName })
        .src(remoteUrl, [size])
        .dest(filePath)
        .run()
        .then(function () {
            console.log('done');
        });

    var fileFullPath = path.join(filePath, imgName);
    //pagers formart png & jpg default png, it seems not support pdf.
    //sad story! so you have to do something else...
    var mimetype = 'image/png' || 'application/pdf';

    this.set('Content-disposition', 'attachment; filename=' + imgName);
    this.set('Content-type', mimetype);

    var fs = require('fs');
    this.body = yield new Promise(function (resolve, reject) {
        fs.readFile(fileFullPath, function (err, data) {
            if (err) {
                reject(err);//文件存在返回true
            } else {
                resolve(data);//文件不存在，这里会抛出异常
            }
        });
    }).then(function (data) {
        console.log(data);
        return data;
    }, function (err) {
        console.log(err);
        return err;
    });
})




/* api测试 */
router.get('/api/list/getList', (ctx, next) => {
    ctx.set('Content-Type', 'application/json')
    console.log('get=====>',ctx.request.query)
    ctx.body = {
        errcode: 0,
        errmsg: 'ok',
        data:ctx.request.query
    }
})
/* api测试 */
router.post('/api/list/updateList', async (ctx, next) => {
    ctx.set('Content-Type', 'application/json')
    console.log('post====>',ctx.request.body)
    ctx.body = { errcode: 0, errmsg: 'ok', data: ctx.request.body };

})
/* api测试 */
router.post('/api/list/updateUser', async (ctx, next) => {
    ctx.set('Content-Type', 'application/json')
    console.log('post====>',ctx.request.body)
    ctx.body = { errcode: 0, errmsg: 'ok', data: ctx.request.body };

})








module.exports = router
