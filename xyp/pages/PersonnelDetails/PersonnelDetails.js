// pages/PersonnelDetails/PersonnelDetails.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    optionsItem:null, //接受收的传值项
    resTerminalData:null
  },

  requestTerminalInfo: function () {
    var that = this;
    let terminalId = that.data.optionsItem.terminalId;

    app.sendAjax({
      url: '/rest/terminal/guideList/' + terminalId,
      data: {
      },
      success: function (res) {
        console.log("\n\n\n guideList" + JSON.stringify(res) + "\n\n\n");
        if (res.respCode == "0") {
          console.info(JSON.stringify(res.data) + '查询情况成功')
          that.setData({
            resTerminalData: res.data
          })
        } else {
          console.log('查询失败')
        }
      },
      fail: function (res) { }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    var that = this
    console.log("\n\n\n options " + JSON.stringify(options))
    if ("item" in options) {
      let item = JSON.parse(options.item)
      that.setData({
        optionsItem: item,
      })
      that.requestTerminalInfo()
    }

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


})