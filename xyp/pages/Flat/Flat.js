// pages/Recommend/Recommend.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    tab: 0,
    commodityList: null,
    bottomTxt: '往下滑，查看更多~',
    pageNum: null,
    statNum: 1
  },
  clickTab: function (e) {
    var that = this;
    that.setData({
      statNum: 1,
      bottomTxt: '往下滑，查看更多~',
      commodityList: []
    })
    if (this.data.tab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        tab: e.target.dataset.current
      })
    }
    this.videoList(that.data.id);
  },
  /**
   * 打开详情页面
   */
  openDetails:function(e){
    wx.navigateTo({
      url: '/pages/trainingDetails/trainingDetails?url=' + e.target.dataset.current + '&share=' + e.target.dataset.share,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
 * 搜索
 */
  search: function (e) {
    console.info(e.detail.value)
    var that = this;
    that.setData({
      statNum: 1,
      bottomTxt: '往下滑，查看更多~',
      commodityList: []
    })
    that.videoList(that.data.id, e.detail.value);
  },
  /**
   * 获取视频列表
   */
  videoList:function(id,val){
    var that = this;

    app.sendAjax({
      url: 'trainingMaterials/list',
      data: {
        "page": that.data.statNum,
        "pageSize": 10,
        "keyword": val,
        "trainingCategoryId": id
      },
      success: function (res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) + '获取视频列表')
          var arr = [];
          if (that.data.commodityList) {
            for (var i = 0; i < that.data.commodityList.length; i++) {
              arr.push(that.data.commodityList[i]);
            }
          }
          if (res.data.data) {
            for (var j = 0; j < res.data.data.length; j++) {
              arr.push(res.data.data[j]);
            }
          }
          if (res.data.totalCount <= 10) {
            that.setData({
              bottomTxt: '暂无更多数据加载~'
            })
          }
          that.setData({
            commodityList: arr
          })
         
        } else {
          console.log('获取视频列表失败')
        }
      },
      fail: function (res) { }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    console.info(options.id);
    that.setData({
      id: options.id
    })
    that.videoList(options.id);
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
    var that = this;
    console.info(that.data.statNum);
    if (that.data.pageNum > that.data.statNum) {
      var i = that.data.statNum + 1;
      that.setData({
        statNum: i,
        bottomTxt: '往下滑，查看更多~'
      })
      this.videoList(that.data.id);
    } else {
      that.setData({
        bottomTxt: '暂无更多数据加载~'
      })
      return false
    }
  },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})