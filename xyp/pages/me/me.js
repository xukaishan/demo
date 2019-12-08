// pages/me/me.js
const app = getApp();

Page({
  data: {
    userIdentiy: app.getUserIdentity(),
    name: "--",
    first_onload: false,
    APPNUM: app.globalData.APPNUM,
    headimg: '/images/default-avatar.png',
    isLogined: false,
  },

  loginTap:function() {
    if (!this.data.isLogined) {
      wx.redirectTo({
        url: '/pages/userAuthorization/userAuthorization',
      })
    }
  },

  //打开个人信息页面
  openUserInfo: function() {
    wx.navigateTo({
      url: '/pages/myinfo/myinfo?info=' + JSON.stringify(this.data.info),
    })
  },
  //打开转化录入页面
  openEntry: function () {
    wx.navigateTo({
      url: '/pages/myEntry/myEntry',
    })
  },
  /**
   * 打开转化记录
   */
  openConversionRecord(){
    wx.navigateTo({
      url: '/pages/ConversionRecord/ConversionRecord',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 打开本月任务
   */
  openTask:function(){
    wx.navigateTo({
      url: '/pages/task/task',
    })
  },
  /**
   * 打开培训上报
   */
  opentrainingReport:function(){
    wx.navigateTo({
      url: '/pages/trainingReport/trainingReport',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //打开二维码
  openUser: function() {
    wx.navigateTo({
      url: '/pages/code/code',
    })
  },

  openWeChatQrcode: function() {
    wx.navigateTo({
      url: '/pages/QRCode/QRCode',
    })
  },

  //退出
  btnquit: function() {
    wx.clearStorageSync(); //清除所有缓存
    wx.reLaunch({
       url: '/pages/index/index',
    })
  },

  /**
   * 获取个人信息
   */
  getuser: function(phon) {
    var that = this;

    app.sendAjax({
      url: 'guide/auth/info',
      data: {
        "mobilePhoneNum": app.getMobilePhoneNum(),
      },
      success: function(res) {
        console.log(JSON.stringify(res) + "导购信息");
        if (res.code == 200) {
          that.setData({
            info: res.data,
          })
        }
      },
      fail: function(res) {

      }
    })
  },
  /**
   * 打开代理商
   */
  openAgent(){
    wx.navigateTo({
      url: '/pages/echarts/echarts',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.editTabBar();//添加tabBar数据  
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
    var that = this;

    let shoppingGuideId = wx.getStorageSync('shoppingGuideId')
    if (!shoppingGuideId) {
      console.log('not Logined' + shoppingGuideId)
      that.setData({
        isLogined: false,
      })
    } else {
      that.setData({
        isLogined: true,
        userIdentiy:app.getUserIdentity(),
      })

      that.getuser();
      app.sendAjax({
        url: '/shoppingGuide/info',
        data: {
          "shoppingGuideId": shoppingGuideId,
        },
        success: function(res) {
          console.log(res);
          if (res.code == 200) {
            that.setData({
              headimg: res.data.shoppingGuide.headImgUrl,
              name: res.data.shoppingGuide.realName,
              info: res.data
            })
          }
        },
        fail: function(res) {}
      })
    }
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