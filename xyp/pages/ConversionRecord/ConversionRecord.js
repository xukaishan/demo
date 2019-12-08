// pages/ConversionRecord/ConversionRecord.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabShow:0,
    purchaseConversionResData:null,
  },

  showTab(e){
    let that=this;
    if (that == e.currentTarget.dataset.index){
      return
    }else{
      that.setData({
        tabShow: e.currentTarget.dataset.index
      })
    }

    that.requestPurchaseConversionList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    that.requestPurchaseConversionList()
  },

  cellTap:function(e) {
    var that = this
    let dataset = e.currentTarget.dataset
    let item = dataset.item
    console.log("item = " + JSON.stringify(item))

    wx.navigateTo({
      url: '/pages/myEntry/myEntry?accessType=1&item=' + JSON.stringify(item),
    })
  },


  /**
  * 请求转发情况数据
  */
  requestPurchaseConversionList: function () {
    var that = this
    // 审核状态: 1待审核，2: 已通过，3: 未通过, 全部传空
    let checkStatus = (that.data.tabShow == 0) ? null : that.data.tabShow
    let pageNo = "1"
    let pageSize = "100"
    let shoppingGuideId = wx.getStorageSync('shoppingGuideId');

    app.sendAjax({
      url: 'rest/rePurchaseConversion/list',
      data: {
        "checkStatus": checkStatus,
        "pageNo": pageNo,
        "pageSize": pageSize,
        "shoppingGuideId": shoppingGuideId,
      },
      success: function (res) {
        console.log("\n\n\n rest/rePurchaseConversion/list \n" + JSON.stringify(res))
        that.setData({
          purchaseConversionResData: res.data.results
        })
      },
      fail: function (res) { }
    })
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