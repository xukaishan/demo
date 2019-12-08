// pages/onlinePoster/onlinePoster.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgheadurl: app.globalData.url,
    activityPic: '',
    alterPic: '',
    alertText: '',
    modalHidden: true,
    imageHeight: 0,
    billName: '',
    activityButtonPic: '',
    shoudShowActivityButton: false,
  },

  bottomButtonTap: function() {
    var that = this;
    that.setData({
      modalHidden: false,
    })
  },


  modalReply: function() {
    var that = this;
    that.setData({
      modalHidden: true,
    })
    if (that.data.updataId) { //以获取到浏览记录id
      that.addClickRecord(that.data.updataId, 5, util.formatTime(new Date()));
    }
  },
  /**
   * 添加点击记录
   */
  addClickRecord: function(shareRecordId, type, createdTime) {
    app.sendAjax1({
      url: '/billshare/uploadClickInfo',
      data: {
        shareRecordId: shareRecordId,
        type: type,
        createdTime: createdTime,
      },
      success: function(res) {
        console.log("新增点击记录结果：" + JSON.stringify(res))
      },
      fail: function(res) {
        console.log("新增点击记录结果：" + JSON.stringify(res))
      },
    });
  },

  modalCandel: function() {
    this.setData({
      modalHidden: true,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("\n\n\n onLoad onLoad" + JSON.stringify(options));
    var that = this;
    let shoudShowActivityButton = (options.activityButtonPic == "null") ? true: false;
    that.setData({
      imageHeight: wx.getSystemInfoSync().windowHeight,
      billName: options.billName,
      activityPic: options.activityPic,
      alterPic: options.alterPic,
      alertText: options.alertText,
      updataId: options.updataId,
      activityButtonPic: options.activityButtonPic,
      shoudShowActivityButton: shoudShowActivityButton,
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
    return {
      title: this.data.billName,
      path: 'pages/onlinePoster/onlinePoster?activityPic=' + this.data.activityPic + '&alterPic=' + this.data.alterPic + '&alertText=' + this.data.alertText + '&updataId=' + this.data.updataId + '&billName=' + this.data.billName,
      success: (res) => {
        console.log("转发成功", res);
      },
    }
  }
})