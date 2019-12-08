// pages/code/code.js

var util = require('../../utils/util.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: false,
    myTime: null,
    headimg: "",
    name: "--"
  },
  //进入首页
  goindex: function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //点击开始的时间  
  timestart: function() {
    // console.log(e.target.dataset.url);
    var that = this;
    clearInterval(that.data.myTime);
    that.data.myTime = setInterval(function() {
      that.setData({
        time: true
      })
      that.openSuccsCode();
      clearInterval(that.data.myTime);
    }, 500);
  },
  //点击结束的时间
  timeend: function() {
    var that = this;
    clearInterval(that.data.myTime);
    if (that.data.time == false) {
      that.setData({
        time: false
      })
    }
  },

  downloaImgThenSave:function() {
    let imgUrl = "https://youxuepai-wechat.oss-cn-beijing.aliyuncs.com/youxuepaiMs/png/YouxuepaiQRcode.png";
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
  saveImg: function() {
    let that = this

    util.requestWritePhotosAlbumAuthorization(function (res) {
      if (res.isFirstWritePhotosAlbumAuthorization) {
        that.downloaImgThenSave();
      }
      else {
        if (res.hasAuthorization) {
          that.downloaImgThenSave();
        }
      }
    })
  },

  /**
   * 点击弹窗模态框
   */
  openSuccsCode: function() {
    var that = this;
    if (this.data.time == false) {
      return
    } else {
      wx.showActionSheet({
        itemList: ['保存图片'],
        success(res) {
          console.log(res.tapIndex)
          if (res.tapIndex == 0) {
            that.saveImg();
          }
        },
        fail(res) {
          console.log(res.errMsg)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    var that = this;
    if (options.showbtn){
      that.setData({
        indexbtn: true
      })
    }
    app.sendAjax({
      url: '/shoppingGuide/qrcode',
      data: {
        "shoppingGuideId": wx.getStorageSync('shoppingGuideId')
      },
      success: function(res) {
        console.log(res);
        if (res.code == 200) {
          that.setData({
            headimg: res.data.headImgUrl,
            name: res.data.realName,
            code: app.globalData.url + res.data.personalQrcodeUrl
          })
        }
      },
      fail: function(res) {

      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})