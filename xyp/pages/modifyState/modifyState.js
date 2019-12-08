// pages/modifyState/modifyState.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    deleteResionConditions: ['终端撤柜', '重复终端', '无人终端', '其他'],
    deleteResionSelectedIndex: 0,
    deleteDesc: null,
    terminalId: null,
    terminalResData:null
  },
  /**
   * 选择内容类型
   */
  bindTypeChange: function(e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value);

    that.setData({
      deleteResionSelectedIndex: parseInt(e.detail.value)
    })
  },

  textAreaInput: function(e) {
    console.log('textAreaInput value = ', e.detail.value);
    var that = this
    that.setData({
      deleteDesc: e.detail.value
    })
  },

  submit: function(e) {
    var that = this

    that.requestSubmit()
  },

  getDeleteReason() {
    var that = this;
    let index = that.data.deleteResionSelectedIndex
    if (index < 0 || index >= that.data.deleteResionConditions.length) {
      index = 0
    }
    return that.data.deleteResionConditions[index]
  },

  //修改终端状态
  requestSubmit: function() {
    var that = this;
    let deleteReason = that.getDeleteReason()
    let deleteDesc = that.data.deleteDesc;
    let terminalId = that.data.terminalId;

    app.sendAjax({
      url: 'rest/reModifyTerminal',
      data: {
        "deleteReason": deleteReason,
        'deleteDesc': deleteDesc,
        "terminalId": terminalId,
      },
      success: function(res) {
        console.log("\n\n\n rest/reModifyTerminal \n" + JSON.stringify(res) + "\n\n\n");
        if (res.respCode == "0") {
          wx.showToast({
            title: '提交成功',
          });

          setTimeout(function () {
            wx.hideToast()
            wx.navigateBack()
          }, 1.5 * 1000)

        } else {
          console.log('查询失败')
        }
      },
      fail: function(res) {}
    })
  },

  requestTerminalInfo: function() {
    var that = this
    let terminalId = that.data.terminalId

    app.sendAjax({
      url: 'rest/terminal/info',
      data: {
        "terminalId": terminalId
      },
      success: function(res) {
        console.log("\n\n\n" + JSON.stringify(res) + "\n\n\n");
        if (res.respCode == "0") {
          console.info(JSON.stringify(res.data) + '查询情况成功')
          that.setData({
            terminalResData: res.data
          })
        } else {
          console.log('查询失败')
        }
      },
      fail: function(res) {}
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("\n\n\n + options" + JSON.stringify(options))
    var that = this
    if (JSON.stringify(options) != "{}") {
      let item = JSON.parse(options.item)
      that.setData({
        terminalId: item.id
      })
      that.requestTerminalInfo()
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