// pages/Poster/Poster.js

//引入util
var canvasHelper = require('../../utils/CanvasHelper.js')
var app = getApp();
let canvasID = 'Poster_Canvas'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    refmodule: '',
    scene: '',
    showModo: false,
    canvasWidth: 0,
    canvasHeight: 0,
    imgheadurl: app.globalData.url,
    posterURLPath: ''
  },

  longpress: function () {
    this.openShow();
  },

  openShow: function () {
    var that = this;
    if (this.data.time == false) {
      return
    } else {
      that.setData({
        showModo: true
      })
    }
  },
  /**
   * 底部自定义取消弹窗
   */
  cancelModo: function () {
    var that = this;
    that.setData({
      showModo: false
    })
  },

  /**
   * 保存canvas图片到相册
   */
  saveCanvasToPhotosAlbum() {
    let that = this;
    canvasHelper.saveImageToPhotosAlbum(canvasID, function (res) {
      if (res.success) {
        that.cancelModo();
      }
      else {
        wx.showToast({
          title: '保存海报失败',
        })
      }
    })
  },

  requestQrcodeData: function (res) {
    wx.showLoading();
    let that = this;
    let posterURLPath = this.data.imgheadurl + res.data.billImgUrl;
    
    console.log("posterURLPath " + posterURLPath);

    app.sendAjax({
      url: 'bill/qrcode',
      data: {
        "billId": res.data.billId,
        "billName": res.data.billName,
        "mobilePhoneNum": wx.getStorageSync('phones'),
        "shoppingGuideId": wx.getStorageSync('shoppingGuideId'),
      },
      
      success: function (res) {
        wx.hideLoading()
        console.info('requestQrcodeData success \n' + JSON.stringify(res));
        if (res.code == '200') {
          let data = {
            "posterURLPath": posterURLPath,
            "qrcodeURLPath": res.data.url
          }
          that.drawPoster(data);
        }
        else {
          wx.showToast({
            title: '获取二维码失败' + JSON.stringify(res),
          })
        }
      },

      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '获取二维码失败' + JSON.stringify(res),
        })
      }
    })
  },

  //获取海报背景
  requestPosterData: function () {
    wx.showLoading();
    var that = this;
    app.sendAjax({
      url: 'bill/info',
      data: {
        "billId": that.data.refmodule
      },
      success: function (res) {
        console.log('requestPosterData ' + JSON.stringify(res));
        wx.hideLoading();
        if (res.code == '200') {
         that.requestQrcodeData(res);
       }else {
         wx.showToast({
           title: '获取海报地址失败' + JSON.stringify(res),
         })
       }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: '获取海报地址失败' + JSON.stringify(res),
        })
      }
    })
  },

  drawPoster: function (data) {
    var string = data.posterURLPath;
    if (string.length == 0 || string == null) {
      wx.showModal({ title: '海报地址不能为空！', })
      return;
    }

    console.log('data.posterURLPath ' + data.posterURLPath)

    var that = this
    wx.showLoading()
    wx.downloadFile({
      url: data.posterURLPath,
      success(res) {
        wx.hideLoading()

        wx.showLoading()
        let posterURLPath = res.tempFilePath
        wx.downloadFile({
          url:data.qrcodeURLPath,
          success(res) {
            console.log(JSON.stringify(res))
            let qrcodeTempURLPath = res.tempFilePath
            if (res.statusCode === 200) {
              canvasHelper.drawImageWithQRCode(posterURLPath, qrcodeTempURLPath, 0.5, 0.33, canvasID, function (res) {
                that.setData({
                  canvasWidth: res.canvasWidth,
                  canvasHeight: res.canvasHeight
                })
               
              })
            }
            else {
              wx.showToast({
                title: '下载二维码失败' + JSON.stringify(res),
              })
            }

            wx.hideLoading();
          }
        })
      },
      fail(res) {
        wx.hideLoading();
        wx.showToast({
          title: '下载二维码失败' + JSON.stringify(res),
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      refmodule: options.refmodule
    });
    this.requestPosterData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})