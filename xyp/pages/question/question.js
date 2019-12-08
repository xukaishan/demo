// pages/question/question.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [{
      dataList:[{
        icon: '../../images/setUp-icon.png',
        text:'系统'
      }, {
          icon: '../../images/setUp-icon.png',
          text: 'WIFI'
        }, {
          icon: '../../images/wifi.png',
          text: 'USB'
        }, {
          icon: '../../images/setUp-icon.png',
          text: '名师辅导班'
        }, {
          icon: '../../images/wifi.png',
          text: '家长管理/助手'
        }, {
          icon: '../../images/wifi.png',
          text: '应用商店'
        }, {
          icon: '../../images/setUp-icon.png',
          text: '一键搜'
        }, {
          icon: '../../images/wifi.png',
          text: '学科同步'
        }, {
          icon: '../../images/setUp-icon.png',
          text: '视力保护'
        }]
    },{
        dataList: [{
          icon: '../../images/setUp-icon.png',
          text: '视力保护'
        }]
    }
    ],
    problemList:null,
    commonProblem:null,
    indicatorDots: true,
    autoplay: false,
    duration: 800,
    url:app.globalData.url
  },
  /**
   * 跳转问题搜索页
   */
  openSearchProblem:function(){
    wx.navigateTo({
      url: '/pages/searchProblem/searchProblem',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
/**
 * 获取问题列表
 */
problem:function(){
  var that = this;

  app.sendAjax({
    url: 'questionClassification/list',
    data: {
      "parentId": "string"
    },
    success: function (res) {
      if (res.code == "200") {
        console.log(JSON.stringify(res) + '获取问题列表')
        that.setData({
          problemList: res.data
        })
      } else {
        console.log('获取问题列表失败')
      }
    },
    fail: function (res) { }
  })
},
/**
 * 获取常见问题
 */
  commonProblem:function(){
    var that = this;
    app.sendAjax({
      url: 'questionClassification/common/list',
      data: {
        "page": 0,
        "pageSize": 0
      },
      success: function (res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) + '获取常见问题')
          that.setData({
            commonProblem: res.data.data
          })
        } else {
          console.log('获取问题列表失败')
        }
      },
      fail: function (res) { }
    })
  },
  /**
   * 打开问题列表
   */
  openQuestionList:function(e){
    wx.navigateTo({
      url: '/pages/questionListPage/questionListPage?id=' + e.target.dataset.current,
    })
  },
   /**
   * 打开问题详情 
   */
  questionDetails:function(e){
    let dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/questionDetails/questionDetails?qaBankId=' + dataset.qabankid + '&questionClassificationId=' + dataset.questionclassificationid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.problem();
    this.commonProblem();
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