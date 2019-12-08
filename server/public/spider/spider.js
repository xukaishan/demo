/*
 * @Description: 爬取培训部静态链接，输出到public/spider/文件夹 命令：node public/spider/spider.js
 * @Author: xuks
 * @Date: 2019-08-21 19:17:15
<<<<<<< Updated upstream
 * @LastEditTime: 2019-08-29 15:25:58
=======
 * @LastEditTime: 2019-08-22 19:48:34
>>>>>>> Stashed changes
 */

/* 引入依赖 */
const fs = require('fs');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');

/* 爬取的html 链接网址 */
<<<<<<< Updated upstream
const URL = `https://b.xiumi.us/board/v5/40Lrn/163286396`;

/* 请求html */
request(URL, function (error, response, body) {
    if(error) console.error(error); 
    
    /* 创建文件及路径 */
=======
const URL = `https://v.xiumi.us/board/v5/40Lrn/162370194`;

/* 请求html */
request(URL, function (error, response, body) {
    if(error) console.error(error);  
    /* 获取html */
>>>>>>> Stashed changes
    let fileName = Date.parse(new Date())
    fs.mkdirSync(`public/spider/${fileName}`,function(err){
        if(err) console.log(err)
    });
<<<<<<< Updated upstream
    fs.mkdirSync(`public/spider/${fileName}/dist`,function(err){
        if(err) console.log(err)
    });
    let filePath = path.join(__dirname, `/${fileName}/index.html`);   
    let reg = /(png|gif|jpeg|jpg)$/img;
    let Suffix = '';
=======
    let filePath = path.join(__dirname, `/${fileName}/index.html`);

    fs.writeFile(filePath, body, function (err) {
        err && console.error(err) || console.log('html写入成功');
    });
>>>>>>> Stashed changes

    /* html dom处理获取img */
    const $ = cheerio.load(body);
    const ImgArr = [];
    let img = $('html').find('img');
<<<<<<< Updated upstream
    img.each(async function (i, el) {
        let itm='';
        if ($(this).attr('data-src')) {
            itm = $(this).attr('data-src');
=======
    img.each(function (i, el) {
        if ($(this).attr('data-src')) {
            let itm = $(this).attr('data-src')
>>>>>>> Stashed changes
            if (itm.indexOf('https') === -1 || itm.indexOf('http') === -1) {
                itm = 'http:' + itm
            }
            ImgArr.push(itm);

        } else if ($(this).attr('src')) {
<<<<<<< Updated upstream
            itm = $(this).attr('src');
=======
            let itm = $(this).attr('src')
>>>>>>> Stashed changes
            if (itm.indexOf('https') === -1 || itm.indexOf('http') === -1) {
                itm = 'http:' + itm
            }
            ImgArr.push(itm);
<<<<<<< Updated upstream
        };
        Suffix = itm.match(reg)&&itm.match(reg)[0]||'png';  
        $(this).attr('src',`dist/${i}.${Suffix}`);
=======
        }
>>>>>>> Stashed changes
    })

    if (ImgArr.length) {
        console.log(ImgArr)
    }else{
        console.log('未获取到任何img图片');
        return    
    }

<<<<<<< Updated upstream
    /* 写入html */
    fs.writeFile(filePath, $('html'), function (err) {
        err && console.error(err) || console.log('html写入成功');
    });
    
    /* 下载网页图片 */
  
    for (let i = 0; i < ImgArr.length; i++) {      
        Suffix = ImgArr[i].match(reg)&&ImgArr[i].match(reg)[0]||'png';        
        let ImgName = i;
        let ImgPath = path.join(__dirname, `/${fileName}/dist/${ImgName}.${Suffix}`);
        console.log(`正在写入...${ImgArr[i]}`);
=======
    /* 下载网页图片 */
    fs.mkdirSync(`public/spider/${fileName}/dist`,function(err){
        if(err) console.log(err)
    });
    let reg = /(png|gif|jpeg|jpg)$/img;
    let Suffix = '';
    for (let i = 0; i < ImgArr.length; i++) {    
        Suffix = ImgArr[i].match(reg)&&ImgArr[i].match(reg)[0]||'png'     
        let ImgName = i;
        let ImgPath = path.join(__dirname, `/${fileName}/dist/${ImgName}.${Suffix}`);
        console.log(`正在写入...${ImgArr[i]}`)
>>>>>>> Stashed changes
        request(ImgArr[i]).pipe(fs.createWriteStream(ImgPath));
    }

});

