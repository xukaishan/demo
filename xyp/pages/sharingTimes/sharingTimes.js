// pages/addCustomer/addCustomer.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commodityList: null,
    tab: 0,
    share:null,
    dateDays:null,
    bottomTxt:'往下滑，查看更多~',
    pageNum:null,
    statNum:1,
    timeText:"今日分享",
    url: app.globalData.url,
    rankList:null
  },
  /**
   * 条件筛选
   */
  clickTab: function (e) {
    console.info(e)
    var that = this;
    if (this.data.tab === e.target.dataset.current) {
      return false;
    } else if (e.target.dataset.current<3){
      var setDays="";
      if (e.target.dataset.current==0){
        setDays="今日"
      } else if (e.target.dataset.current == 1){
        setDays = "本周"
      }else{
        setDays = "本月"
      }
      that.setData({
        statNum: 1,
        bottomTxt: '往下滑，查看更多~',
        share: [],
        timeText: setDays+'分享',
        tab: e.target.dataset.current,
        dateDays: app.days(parseInt(e.target.dataset.current)+1,true)
      })
      this.shareLinks(that.data.dateDays.startDay, that.data.dateDays.endDay);
    }else{
      that.setData({
        tab: e.target.dataset.current,
        statNum: 1,
        bottomTxt: '往下滑，查看更多~',
        rankList:[]
      })
      that.rankStatistics()
    }
  },
  /**
   * 获取排名统计
   */
  rankStatistics(){
    var that = this;
    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    app.sendAjax({
      url: 'share/link/rank',
      data: {
        "page": that.data.statNum,//页数
        "pageSize": 10,//显示几条数据
        "shoppingGuideId": shoppingGuideId,//导购ID
      },
      success: function (res) {
        
        if (res.code == "200") {
          console.log(JSON.stringify(res) + '获取分享排名')
          var arr = [];
          if (that.data.rankList) {
            for (var i = 0; i < that.data.rankList.length; i++) {
              arr.push(that.data.rankList[i]);
            }
          }
          if (res.data.data) {
            for (var j = 0; j < res.data.data.length; j++) {
              arr.push(res.data.data[j]);
            }
          }
          console.info(JSON.stringify(arr)+'所有的数据')
          that.setData({
            rankList: arr,
            pageNum: res.data.totalPage
          })
          if (res.data.totalCount <= 10) {
            that.setData({
              bottomTxt: '暂无更多数据加载~'
            })
          }
        } else {
          console.log('获取分享排名失败！')
        }
      },
      fail: function (res) { }
    })
  },
   /**
   * 获取分享链接统计
   */
  shareLinks: function (start, end) {
    var that = this;
    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    app.sendAjax({
      url: 'share',
      data: {
        "endTime": end,//结束时间
        "page": that.data.statNum,//页数
        "pageSize": 10,//显示几条数据
        "shoppingGuideId": shoppingGuideId,//导购ID
        "startTime": start//开始时间
      },
      success: function (res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) + '获取分享链接统计')
          var arr = [];
          if (that.data.share) {
            for (var i = 0; i < that.data.share.length; i++) {
              arr.push(that.data.share[i]);
            }
          }
          if (res.data.data) {
            for (var j = 0; j < res.data.data.length; j++) {
              arr.push(res.data.data[j]);
            }
          }
          that.setData({
            share: arr,
            pageNum: res.data.totalPage
          })
          if (res.data.totalCount <= 10) {
            that.setData({
              bottomTxt: '暂无更多数据加载~'
            })
          }
        } else {
          console.log('获取分享链接统计失败')
        }
      },
      fail: function (res) { }
    })
  },
 
  /**
  * 打开顾客详情页面
  */
  customerDetails: function (e) {
    console.info(e.target.dataset.customer);
    wx.navigateTo({
      url: '/pages/customerDetails/customerDetails?id=' + e.target.dataset.customer,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
  * 打开近一周分享统计
  */
  aWeek: function (e) {
    wx.navigateTo({
      url: '/pages/aWeek/aWeek?id=' + e.target.dataset.customer + '&startime=' + this.data.dateDays.startDay + '&endtime=' + this.data.dateDays.endDay + '&txt=' + this.data.timeText,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var dataDay = app.days(1);
    var that = this;
    that.setData({
      dateDays: dataDay,
    })
    this.shareLinks(dataDay.startDay, dataDay.endDay);
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
    console.info('选择的是第' + that.data.tab + '个')
    console.info(that.data.statNum);
    if (that.data.pageNum > that.data.statNum) {
      var i = that.data.statNum + 1;
      that.setData({
        statNum: i,
        bottomTxt: '往下滑，查看更多~'
      })
      if (that.data.tab<3){
        this.shareLinks(that.data.dateDays.startDay, that.data.dateDays.endDay);
      }else{
        that.rankStatistics()
      }
    } else {
      that.setData({
        bottomTxt: '暂无更多数据加载~'
      })
      return false
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})