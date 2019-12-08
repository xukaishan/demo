// pages/trainingDetails/trainingDetails.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoUrl: null,
    startTime: '',
    id: '',
    playData: 0,
    title: '',
    content:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.info(options);
    console.info(options.url);
    console.log(options.share);
    console.log("options.content" + JSON.stringify(options.content));

    var content = options.content
    if (typeof (content) == "undefined" || content == null || content.length == 0) {
      content = options.title
    }

    this.setData({
      videoUrl: options.url,
      share: options.share,
      content: content,
      title: options.title,
      dataid: options.dataid
    })
    
  },
  /**
   * 开始时间
   */
  startTimes: function () {
    var startTime = Date.parse(new Date()) / 1000;
    console.info(startTime);
    return startTime;
  },
  /**
   * 结束时间
   */
  endTimes: function () {
    var endTime = Date.parse(new Date()) / 1000;
    console.info(endTime);
    return endTime;
  },
  /**
   * 开始播放
   */
  openPlay() {
    let that = this;
    that.setData({
      playData: 1
    })
    if (that.data.startTime == '') {
      that.setData({
        startTime: this.startTimes(),
      })
    }
  },

  // copy:function () {
  //   var that = this;
  //   console.log(e);
  //   wx.setClipboardData({
  //     data: that.data.OrderModel.OrderNo,
  //     success: function (res) {
  //       wx.showToast({
  //         title: '复制成功',
  //       });
  //     }
  //     }
  // },


  /**
   * 调用上传视频浏览时长
   */
  updataPlayTime() {
    var that = this;
    that.setData({
      playData: 0
    })
    var shopping = wx.getStorageSync('shoppingGuideId');
    app.sendAjax1({
      url: 'trainingMaterials/browse',
      data: {
        "id": that.data.id,
        "shoppingGuideId": shopping,
        "trackEndTimestamp": that.endTimes(),
        "trackStartTimestamp": that.data.startTime,
        "trainingDataId": that.data.dataid,
        "trainingDataName": that.data.title
      },
      success: function (res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) + '数据更新')
          that.setData({
            id: res.data.id
          })
        } else {
          console.log('数据更新失败')
        }
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
    console.log('onHide')
    let that = this;
    if (that.data.playData == 1) {
      that.updataPlayTime();
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload')
    //返回按钮，或者返回手势调用
    let that = this;
    if (that.data.playData == 1) {
      that.updataPlayTime();
    }
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
    console.log(this.data.isshare);
    var path;
    if (this.data.share == 1) {
      //根据share为1能分享 否则不能
      path = '/pages/trainingDetails/trainingDetails?url=' + this.data.videoUrl + '&share=' + this.data.share//正确路径可正常分享
    } else {
      // path = '/page/qwer'//乱写的路径不能分享
    }
    console.log(path)
    return {
      path: path
    }
  }
})