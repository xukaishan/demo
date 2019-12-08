var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },


  //授权按钮事件
  bindGetUserInfo: function (e) {
    console.log(e);
    var that = this;
    if (e.detail.encryptedData) {
      console.log(e.detail.userInfo.avatarUrl);
      wx.setStorageSync('headimg', e.detail.userInfo.avatarUrl)
      app.jiemiunionid(e.detail.encryptedData, e.detail.iv, wx.getStorageSync('session_key'))
    } else {
      wx.showToast({
        title: '获取失败,请重试',  //标题
        icon: 'loading',  //图标，支持"success"、"loading
        duration: 2000, //提示的延迟时间，单位毫秒，默认：1500
        mask: false,  //是否显示透明蒙层，防止触摸穿透，默认：false
        success: function () { }, //接口调用成功的回调函数
        fail: function () { },  //接口调用失败的回调函数
        complete: function () { } //接口调用结束的回调函数
      })
    }
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