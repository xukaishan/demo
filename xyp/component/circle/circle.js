/* component/circle/circle.js */



Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    draw: { //画板元素名称id
      type: String,
      value: 'draw',
    },
    per: { //百分比 通过此值转换成step
      type: String,
      value: '0'
    },
    r: { //半径
      type: String,
      value: '50'
    },

    isImgProgress: { //是否用图片连显示进度换，默认是
      type: Boolean,
      value: true
    },

  },

  data: { /*  私有数据，可用于模版渲染 */
    step: 1, //用来算圆的弧度0-2
    size: 0, //画板大小
    screenWidth: 750, //实际设备的宽度
    txt: 0,
    imgSrc: null,
    imgBgSrc: null,
    hasFinishedDraw: false,
  },
  methods: {

    /**
     * el:画圆的元素
     * r:圆的半径
     * w:圆的宽度
     * 功能:画背景
     */
    drawCircleBg: function(el, r, w) {
      const ctx = wx.createCanvasContext(el, this);
      // const ctx = wx.createsc
      ctx.setLineWidth(w); // 设置圆环的宽度
      ctx.setStrokeStyle('#E5E5E5'); // 设置圆环的颜色
      ctx.setLineCap('round') // 设置圆环端点的形状
      ctx.beginPath(); //开始一个新的路径
      ctx.arc(r, r, r - w, 0, 2 * Math.PI, false);
      //设置一个原点(110,110)，半径为100的圆的路径到当前路径
      ctx.stroke(); //对当前路径进行描边
      ctx.draw();

      // console.log("drawCircleBg" + el + r + w)
    },

    /**
     * el:画圆的元素
     * r:圆的半径
     * w:圆的宽度
     * step:圆的弧度 (0-2)
     * 功能:彩色圆环
     */
    drawCircle: function(el, r, w, step) {
      var that = this

      var context = wx.createCanvasContext(el, that);
      // 设置渐变
      var gradient = context.createLinearGradient(2 * r, r, 0);
      gradient.addColorStop("0", "#39B767");
      gradient.addColorStop("0.5", "#39B767");
      gradient.addColorStop("1.0", "#39B767");
      context.setLineWidth(w);
      context.setStrokeStyle(gradient);
      context.setLineCap('round')
      context.beginPath(); //开始一个新的路径
      // step 从0到2为一周
      context.arc(r, r, r - w, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
      context.stroke(); //对当前路径进行描边
      context.draw()
    }

  },


  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function() {
      const _this = this;
      //获取屏幕宽度
      wx.getSystemInfo({
        success: function(res) {
          _this.setData({
            screenWidth: res.windowWidth
          });
        },
      });

      // console.log("isImgProgress" + _this.data.isImgProgress)

      _this.setData({
        step: (2 * Number(_this.data.per)) / 100,
        txt: Math.round(_this.data.per * 100) / 100
      });

      if (_this.data.isImgProgress) {
        let progress = parseInt(_this.data.per) * 1
        if (progress < 0) {
          progress = 0
        }
        if (progress > 100) {
          progress = 100
        }

        let imgSrc = "../../component/circle/circle-progress-imgs/circle-progress-"+progress+".png"

        _this.setData({
          imgBgSrc:"../../component/circle/circle-progress-imgs/circle-bg.png",
          imgSrc: imgSrc
        })

      } else {
        //初始化
        const el = _this.data.draw; //画板元素
        const per = _this.data.per; //圆形进度
        const r = Number(_this.data.r); //圆形半径

        //获取屏幕宽度(并把真正的半径px转成rpx)
        let rpx = (_this.data.screenWidth / 750) * r;
        //计算出画板大小
        this.setData({
          size: rpx * 2
        });
        const w = 4; //圆形的宽度

        //组件入口,调用下面即可绘制 背景圆环和彩色圆环。
        _this.drawCircleBg(el + 'bg', rpx, w); //绘制 背景圆环
        _this.drawCircle(el, rpx, w, _this.data.step); //绘制 彩色圆环
      }
    }
  }
})



// let duration = 1 * 1000//延迟时间 这里是毫秒单位
// let timerForBg = setTimeout(function () {
//   new Promise((resolve, reject) => {

//     wx.canvasToTempFilePath({
//       canvasId: el,
//       success: (res) => {
//         let tempFilePath = res.tempFilePath;
//         console.log("\n\n\ntempFilePath = " + tempFilePath)
//         _this.setData({
//           hasFinishedDraw: true,
//           imgSrc: tempFilePath,
//         });
//         wx.saveImageToPhotosAlbum({
//           filePath: res.tempFilePath,
//           success: (res) => {
//             console.log(res)
//             back({
//               success: true
//             })
//             wx.showToast({
//               title: '保存成功',
//               icon: 'success'
//             })
//           },
//           fail: (err) => { }
//         })
//       }
//     }, _this);
//   })
//   clearInterval(timerForBg)

// }, duration)