// pages/userBrowseDetails/userBrowseDetails.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:[]
  },
  shwoDeailt:function(userId,shopId){
    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    var that = this;
    app.sendAjax({
      url: 'customer/browse/product',
      data: {
        "aimId": shopId,
        "customerOpenId": userId,
        "shoppingGuideId": shoppingGuideId
      },
      success: function (res) {
        console.log(res);
        if (res.code == "200") {
          console.info(JSON.stringify(res.data) + '查询顾客详情')
          that.setData({
            num: res.data.data
          })
        } else {
          console.log('查询顾客详情失败')
        }
      },
      fail: function (res) { }
    })
  },
  /**
   * 设置标题
   */
  titel:function(data){
    wx.setNavigationBarTitle({
      title: data
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.info(options)
    this.shwoDeailt(options.userId,options.shopId);
    this.titel(options.titel);
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