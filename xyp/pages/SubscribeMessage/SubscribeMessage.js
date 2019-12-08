// pages/Managers Home/SubscribeMessage/SubscribeMessage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  //请求订阅
  requestSubscribe: function () {

    console.log("\n\n\n\nrequestSubscribe")

    var that = this;
    wx.requestSubscribeMessage({
      tmplIds: ['MKlOqgiTy4INEYfl5Vyjld-oVQFp-2Zm33CYRxdF1ao'],
      success(res) {
        console.log(res);

      },
      fail(res) {
        console.log(res);
      },
      complete(res) {
        console.log(res);
       }
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