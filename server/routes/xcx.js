const router = require('koa-router')();
const fs = require('fs');
const path = require('path');
const static = require('koa-static');

router.post('/api/wx', async (ctx, next) => {
    ctx.body = {
        title: 'wx'
    }
})



module.exports = router
