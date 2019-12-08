// pages/questionDetails/questionDetails.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    answer:"无",
    question: "无",
    createTime: "无",
    qaBankId:"",
    questionClassificationId:"",
    //查看记录ID
    trackingId:"",
    trackStartTimestamp:0,
  },
  /**
    * 获取问题详情
    */
  questionList: function () {
    var that = this;
    let qaBankId = that.data.qaBankId;
    if (qaBankId == null || qaBankId.length == 0) {
      console.log("\n qaBankId = " + qaBankId + "\n API questionClassification/qa/browse qaBankId can not be null or empty \n")
    }

    app.sendAjax({
      url: 'questionClassification/qa/info',
      data: {
        "qaBankId": qaBankId
      },
      success: function (res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) + '获取问题详情')
          that.setData({
            answer: res.data.answer,
            question: res.data.question,
            createTime: res.data.createTime,
            questionClassificationId:res.data.questionClassificationId,
          })
        } 
        else {
          console.log('获取问题详情失败')
        }
      },
      fail: function (res) { }
    })
  },

  /**
    * 开始时间
    */
  startTimes: function () {
    var startTime = Date.parse(new Date()) / 1000;
    return startTime;
  },

  /**
   * 结束时间
   */
  endTimes: function () {
    var endTime = Date.parse(new Date()) / 1000;
    return endTime;
  },

/**
   * 查看统计
   */
  trackingBrowse: function () {
    var that = this;
    let trackingId = that.data.trackingId;
    let qaBankId = that.data.qaBankId;
    let questionClassificationId = that.data.questionClassificationId;  
    let trackStartTimestamp = that.data.trackStartTimestamp;
    let trackEndTimestamp = that.endTimes();
    let shoppingGuideId = wx.getStorageSync('shoppingGuideId')

    if (trackingId == null || trackingId.length == 0) {
      console.log("\n Create Tracking  trackingId is empty \n")
    }
    else  {
      console.log("\n trackingId = " + trackingId )
    }

    if (qaBankId == null || qaBankId.length == 0)  {
      console.log( "\n API questionClassification/qa/browse qaBankId can not be null or empty  \n " )
    } else {
      console.log("\n qaBankId = " + qaBankId)
    }

    if (shoppingGuideId == null || shoppingGuideId.length == 0) {
      console.log("\n API questionClassification/qa/browse shoppingGuideId can not be null or empty  \n ")
    } else {
      console.log("\n shoppingGuideId = " + shoppingGuideId)
    }

    if (questionClassificationId == null || questionClassificationId.length == 0) {
      console.log("\n API questionClassification/qa/browse questionClassificationId can not be null or empty \n")
    }
    else {
      console.log("\n questionClassificationId = " + questionClassificationId)
    }

    if (trackStartTimestamp == null || trackStartTimestamp==0) {
      console.log("\n API questionClassification/qa/browse trackStartTimestamp can not be null or equal zero \n")
    }
    else {
      console.log("\n trackStartTimestamp = " + trackStartTimestamp)
    }

    if (trackEndTimestamp == null || trackEndTimestamp==0) {
      console.log("\n API questionClassification/qa/browse trackEndTimestamp can not be null or equal zero \n")
    }
    else {
      console.log("\n trackEndTimestamp = " + trackEndTimestamp + "\n")
    }
    

    app.sendAjax({
      url: 'questionClassification/qa/browse',
      data: {
        "id": trackingId,
        "qaBankId": qaBankId,
        "shoppingGuideId": shoppingGuideId,
        "questionClassificationId": questionClassificationId,
        "trackStartTimestamp": trackStartTimestamp,
        "trackEndTimestamp": trackEndTimestamp,
      },

      success: function (res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) + '数据统计成功')
          that.setData({
            trackingId: res.data.id,
          })
        } else {
          console.log('创建数据统计失败' + JSON.stringify(res))
        }
      },
      fail: function (res) { }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.info(options)
    var that = this

    that.setData({
      trackStartTimestamp: that.startTimes(),
      qaBankId: options.qaBankId,
      questionClassificationId: options.questionClassificationId
    })

    that.questionList()
    that.trackingBrowse();

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
    console.log("\n function onHide \n ")
    this.trackingBrowse();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("\n function onUnload \n ")
    this.trackingBrowse();
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