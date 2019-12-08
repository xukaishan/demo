// pages/train/train.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
    ],
    imgUrlList:null,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 800,
    imgheadurl: app.globalData.url
  },
  /**
   * 打开web页面
   */
  openWeb: function () {
    wx.navigateTo({
      url: '/pages/webs/webs',
    })
  },
/**
 * 获取轮播图
 */
  rotationChart:function(){
    var that = this;
      app.sendAjax({
        url: 'carousel/list',
        data: {
          "carouselCategoryCode": "resource"
        },
        success: function (res) {
          console.log(res);
          if (res.code == "200") {
            that.setData({
              imgUrls: res.data
            })
          } else {
            console.log('获取轮播失败')
          }
        },
        fail: function (res) { }
      })
  },
  /**
   * 获取培训资料分类
   */
  cateroty:function(){
    var that = this;
    app.sendAjax({
      url: 'trainingMaterials/cateroty',
      data: {
        "parentId": "0"
      },
      success: function (res) {
        if (res.code == "200") {
          // console.log(JSON.stringify(res) + '获取问题列表')
          that.setData({
            imgUrlList: res.data
          })
        } else {
          console.log('获取问题列表失败')
        }
      },
      fail: function (res) { }
    })
  },
  /**
   * 打开优学派平板
   */
  openFlat:function(e){
    // if (e.target.dataset.customer==1){
    //   wx.navigateTo({
    //     url: '/pages/Flat/Flat?id=' + e.target.dataset.customer,
    //     success: function (res) { },
    //     fail: function (res) { },
    //     complete: function (res) { },
    //   })
    // } else if (e.target.dataset.customer==2){
      wx.navigateTo({
        url: '/pages/competingProducts/competingProducts?id=' + e.target.dataset.customer+"&last="+e.target.dataset.last,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    // }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.rotationChart();
    this.cateroty();
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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})