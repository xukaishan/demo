// pages/noticeDetails/noticeDetails.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeTitel:null,
    noticeTime:null,
    content:null
  },
/**
 * 获取消息详情
 */
noticeTxt:function(id){
  var that = this;
  var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
  app.sendAjax({
    url: 'notice/info',
    data: {
      "noticeId": id,
      "shoppingGuideId": shoppingGuideId
    },
    success: function (res) {
      if (res.code == "200") {
        console.log(JSON.stringify(res) + '获取公告列表')
        var details=res.data
        that.setData({
          noticeTitel: details.noticeTitle,
          noticeTime: details.noticeTime,
          content: details.noticeContent
        })
      } else {
        console.log('获取公告列表失败')
      }
    },
    fail: function (res) { }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.info(options);
    this.noticeTxt(options.id);
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