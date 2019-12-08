// pages/news/news.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bottomTxt: '往下滑，查看更多~',
    noticeList: null
  },

  /**
   * 获取公告列表
   */
  noticeList:function(){
    var that = this;
    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    app.sendAjax({
      url: 'notice/list',
      data: {
        "page": 0,
        "pageSize": 10,
        "shoppingGuideId": shoppingGuideId
      },
      success: function (res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) + '获取公告列表')
          that.setData({
            noticeList: res.data.data
          })
          if (res.data.totalCount<=10){
            that.setData({
              bottomTxt:'暂无更多数据加载~'
            })
          }
        } else {
          console.log('获取公告列表失败');
        }
      },
      fail: function (res) { }
    })
  },
  /**
   * 打开公告详情页面，
   */
  openNotices:function(e){
    wx.navigateTo({
      url: '/pages/noticeDetails/noticeDetails?id=' + e.target.dataset.current,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.noticeList();
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