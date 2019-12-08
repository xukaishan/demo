// pages/guideCard/guideCard.js
var util = require('../../utils/util.js')
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // qrcodeURLPath: app.globalData.url+'/file/wechat/img/0905080537003gh_92ad161b86bc_1280.jpg'
  },

  contactWechat:function () {
    wx.navigateTo({
      url: '/pages/QRCode/QRCode?accesstype=' + 1,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    //当options.shoppingGuideId不为空时，表示从分享页面进入
    if (options && options.shoppingGuideId) {
      that.setData({
        shoppingGuideId: options.shoppingGuideId
      })
      //获取导购分享二维码
      app.sendAjax1({
        url: 'shoppingGuide/getGuideShareCode',
        data: {
          "shoppingGuideId": options.shoppingGuideId
        },
        success: function (res) {
          console.log(res);
          if (res.code == "200") {
            that.setData({
              shoppingGuideInfo: res.data,
              qrcodeURLPath: app.globalData.url + res.data.shareCodePath,
            })
          } else {
            console.log('获取导购二维码失败')
          }
        },
        fail: function (res) {
            console.log("获取导购二维码失败")
        }
      })
    }
    //当options.scene不为空时，表示扫码进入
    if (options && options.scene) {
      console.log("导购数据库主键id为:" + options.scene);
      that.setData({
        "primaryKeyId": options.scene
      })
      //获取导购信息
      app.sendAjax1({
        url: '/shoppingGuide/getGuideInfoById',
        data: {
          "primaryKeyId": options.scene
        },
        success: function (res) {
          console.log(res);
          if (res.code == "200") {
            that.setData({
              shoppingGuideInfo: res.data,
              qrcodeURLPath: app.globalData.url + res.data.shareCodePath,
            })
          } else {
            console.log('获取导购信息失败')
          }
        },
        fail: function (res) {
          console.log("获取导购信息失败")
        }
      })
    }
  },

  //保存图片
  longpress: function (event) {
    let imgUrl = event.currentTarget.dataset.qrcodeurlpath;
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