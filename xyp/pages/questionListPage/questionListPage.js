// pages/questionListPage/questionListPage.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionList:null
  },
  /**
     * 打开问题详情 
     */
  questionDetails: function (e) {
    let dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/questionDetails/questionDetails?qaBankId=' + dataset.qabankid + '&questionClassificationId=' + dataset.questionclassificationid,
    })
  },
  /**
   * 获取问题列表
   */
  questionList:function(id){
    var that = this;
    app.sendAjax({
      url: 'questionClassification/qa/list',
      data: {
        "page": 0,
        "pageSize": 20,
        "questionClassificationId": id
      },
      success: function (res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) + '获取问题列表');
          that.setData({
            questionList: res.data.data
          })
        } else {
          console.log('获取问题列表失败')
        }
      },
      fail: function (res) { }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.questionList(options.id);
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