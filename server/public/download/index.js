/*
 * @Description: 爬取培训部静态链接，输出到public/spider/文件夹 命令：node public/download/index.js
 * @Author: xuks
 * @Date: 2019-08-21 19:17:15
 * @LastEditTime: 2019-08-22 19:48:34
 */

/* 引入依赖 */
const fs = require('fs');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');

/* 爬取的html 链接网址 */
// const URL = ``;


/* 请求html */
request(URL, function (error, response, body) {
    console.log('res',response)
    if(error) console.error(error);  
    /* 获取html */
    let fileName = Date.parse(new Date())
    fs.mkdirSync(`public/download/${fileName}`,function(err){
        if(err) console.log(err)
    });
    let filePath = path.join(__dirname, `/${fileName}/index.html`);

    fs.writeFile(filePath, body, function (err) {
        err && console.error(err) || console.log('html写入成功');
    });

    /* html dom处理获取img */
    const $ = cheerio.load(body);
    const spanArr = [];
    let span = $('html').find('.selfScale .bg');
    span.each(function (i, el) {
        if ($(this).attr('style')) {
            
            ImgArr.push(itm);

        } 
    })

    if (spanArr.length) {
        console.log(spanArr)
    }else{
        console.log('未获取到任何地址');
        return    
    }

    /* 下载网页图片 */
    // fs.mkdirSync(`public/spider/${fileName}/dist`,function(err){
    //     if(err) console.log(err)
    // });
    // let reg = /(png|gif|jpeg|jpg)$/img;
    // let Suffix = '';
    // for (let i = 0; i < ImgArr.length; i++) {    
    //     Suffix = ImgArr[i].match(reg)&&ImgArr[i].match(reg)[0]||'png'     
    //     let ImgName = i;
    //     let ImgPath = path.join(__dirname, `/${fileName}/dist/${ImgName}.${Suffix}`);
    //     console.log(`正在写入...${ImgArr[i]}`)
    //     request(ImgArr[i]).pipe(fs.createWriteStream(ImgPath));
    // }

});

