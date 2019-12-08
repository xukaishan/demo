// pages/QRCode/QRCode.js

var util = require('../../utils/util.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    headimg: "",
    qrcodeURLPath: '',
    name: "--",
    //  进入类型 
    //  0 导购 - 我的二维码进入 
    //  1 粉丝 - 一键微信联系进入
    accessType: 0,
    shoppingGuideId: wx.getStorageSync("shoppingGuideId")
  },

  updateGuideWechatQrcode: function (qrcodeURLPath) {
    var that = this;

    wx.showLoading()
    app.sendAjax({
      url: '/shoppingGuide/update/wechatQrcode',
      data: {
        "shoppingGuideId": that.data.shoppingGuideId,
        "wechatQrcodeUrl": qrcodeURLPath
      },
      success: function (res) {
        wx.hideLoading()
        console.log('/shoppingGuide/update/wechatQrcode updateGuideWechatQrcode' + JSON.stringify(res));

        if (res.code == 200) {
          that.setData({
            qrcodeURLPath: app.globalData.url + res.data.wechatQrcodeUrl
          })
        }
      },
      fail: function (res) {

      }
    })
  },

  uploadImage: function () {
    console.log('uploadImage')
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        wx.showLoading({
          mask: true
        });
        console.log(res.tempFilePaths[0]);
        var imgurl = res.tempFilePaths[0]
        wx.compressImage({
          src: imgurl, // 图片路径
          quality: 60, // 压缩质量
          success(res) {
            console.log(res.tempFilePath);
            wx.uploadFile({
              url: app.globalData.url + '/ossUpload',
              filePath: res.tempFilePath,
              name: 'file',
              formData: {
                'wechatQrcode': 'wechatQrcode'
              },
              success(res) {
                console.log(JSON.stringify(res));
                var json = JSON.parse(res.data);
                if (json.code == 200) {
                  wx.hideLoading();
                  that.updateGuideWechatQrcode(json.msg);
                } else {
                  wx.showToast({ title: '上传失败', icon: 'none' })
                }
              }
            })
          },
          fail(res) {
            wx.hideLoading();

            console.log(res);
            wx.showToast({ title: '上传失败' + JSON.stringify(res), icon: 'none' })
          }
        })
      }
    })
  },

  requestGuideInfo: function () {
    var that = this;
    app.sendAjax({
      url: '/shoppingGuide/info',
      data: {
        "shoppingGuideId": that.data.shoppingGuideId,
      },
      success: function (res) {
        let qrcodeURLPath = res.data.shoppingGuide.wechatQrcodeUrl ? (app.globalData.url + res.data.shoppingGuide.wechatQrcodeUrl) : ''
        console.log(res);
        if (res.code == 200) {
          that.setData({
            headimg: res.data.shoppingGuide.headImgUrl,
            name: res.data.shoppingGuide.realName,
            qrcodeURLPath: qrcodeURLPath
          })
        }
      },
      fail: function (res) {

      }
    })
  },


  saveImage: function (imgUrl) {
    wx.downloadFile({
      url: imgUrl,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '成功保存到相册',
              icon: 'success'
            })
          }
        })
      }
    })
  },

  //保存图片
  longpress: function (event) {
    let imgUrl = event.currentTarget.dataset.imgurl;
    console.log("长按" + imgUrl);

    if (!imgUrl) {
      wx.showToast({
        title: '保存图片失败',
      })
    }

    let that = this
    util.requestWritePhotosAlbumAuthorization(function (res) {
      if (res.isFirstWritePhotosAlbumAuthorization) {
        that.saveImage(imgUrl);
      }
      else {
        if (res.hasAuthorization) {
          that.saveImage(imgUrl);
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let accessType = options.accesstype ? options.accesstype : 0;
    let shoppingGuideId = options.shoppingGuideId ? options.shoppingGuideId : wx.getStorageSync("shoppingGuideId");

    this.setData({
      accessType: accessType,
      shoppingGuideId: shoppingGuideId,
    }),

    this.requestGuideInfo();
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