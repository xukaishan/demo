// pages/trainingDetails/trainingDetails.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoUrl: null,
    h5LinkUrl: '',
    startTime: '',
    shareRecordId: '',
    imgheadurl: app.globalData.url,
    playData: 0,
    openid: null,
    userNames: null,
    userAvatars: null,
    unid: '',
    shareid:'',
    operavideotype:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('\n\n---------------onLoad options begin------------\n\n')
    console.info(options);
    console.log('\n\n---------------onLoad options end------------\n\n')

    wx.hideShareMenu();
    let that = this;
    
    if (options.shareId && app.globalData.sharEntrance != '1008') {

      let openId = wx.getStorageSync('openId');
      let userName = wx.getStorageSync('userName');
      let userAvatar = wx.getStorageSync('userAvatar');
      let unionid = wx.getStorageSync('unionid');
      let startTime = this.startTimes();

      that.setData({
        shareid: options.shareId,
        startTime: startTime,
        openid: openId,
        userNames: userName,
        userAvatars: userAvatar,
        unid: unionid
      })
   
      if (openId && userName) {//userAvatar为选填项
        this.queryInfo(options.videoId);
        this.trackingBrowseTime();
      } 
      else {
        console.info(that.data.shareid + "跳转认证携带参数")
        wx.redirectTo({
          url: '/pages/infoAuthorization/infoAuthorization?shareId=' + that.data.shareid + '&videoId=' + options.videoId +'&accessType=2'
        })
      }
    }
    else{
      that.queryInfo(options.videoId);
    }
  },

  /**
   * 查询视频页面详情
   */
  queryInfo(id){
    let that=this;
    app.sendAjax({
      url: 'operavideo/info',
      data: {
        "operavideoId": id,
      },
      success: function (res) {
        console.info('--------queryInfo ----------');
        console.info(JSON.stringify(res));
        that.setData({
          operavideotype: res.data.operavideoType,
          videoUrl: res.data.operavideoUrl,
          content: res.data.operavideoName,
          operavideoDesc: res.data.operavideoDesc,
          h5LinkUrl: res.data.h5LinkUrl,
        })
      
        let article = res.data.operavideoContent;
        WxParse.wxParse('article', 'html', article, that);

      },
      fail: function (res) { }
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
  },
  /**
   * 调用上传视频浏览时长
   */
  trackingBrowseTime() {
    var that = this;
    let customerAvatarUrl = that.data.userAvatars;
    let customerNickName = that.data.userNames;
    let customerOpenId = that.data.openid;
    let shareId = that.data.shareid;
    let shareRecordId = that.data.shareRecordId;
    let trackStartTimestamp = that.data.startTime;
    let trackEndTimestamp = that.endTimes();
    let unionId = that.data.unid;

    if (customerAvatarUrl == null || customerAvatarUrl.length == 0) { console.log("\n CustomerAvatarUrl is empty \n")}
    else {  console.log("\n customerAvatarUrl = " + customerAvatarUrl)}

    if (customerNickName == null || customerNickName.length == 0) { console.log("\n customerNickName is empty \n") }
    else { console.log("\n customerNickName = " + customerNickName) }

    if (customerOpenId == null || customerOpenId.length == 0) { console.log("\n customerOpenId is empty \n") }
    else { console.log("\n customerOpenId = " + customerOpenId) }

    if (shareId == null || shareId.length == 0) {  console.log("\n shareId is empty \n")}
    else { console.log("\n shareId = " + shareId) }

    if (shareRecordId == null || shareRecordId.length == 0) { console.log("\n  进入创建 shareRecordId is empty \n") }
    else { console.log("\n shareRecordId = " + shareRecordId) }

    if (trackStartTimestamp == null || trackStartTimestamp == 0) { console.log("\n trackStartTimestamp is null \n") }
    else { console.log("\n trackStartTimestamp = " + trackStartTimestamp) }

    if (trackEndTimestamp == null || trackEndTimestamp == 0) { console.log("\n trackEndTimestamp is null \n") }
    else { console.log("\n trackEndTimestamp = " + trackEndTimestamp) }

    if (unionId == null || unionId.length == 0) { console.log("\n unionId is null \n")  }
    else { console.log("\n unionId = " + unionId) }

     app.sendAjax1({
       url: '/operavideoshare/browse',
       data: {
         "customerAvatarUrl": customerAvatarUrl,
         "customerNickName": customerNickName,
         "customerOpenId": customerOpenId,
         "shareId": shareId,
         "shareRecordId": shareRecordId,
         "trackStartTimestamp": trackStartTimestamp,
         "trackEndTimestamp": trackEndTimestamp,
         "unionId": unionId
       },
       success: function (res) {
         if (res.code == "200") {
           console.log(JSON.stringify(res) + '数据更新')
           that.setData({
             shareRecordId: res.data.shareRecordId
           })
         } else {
           console.log('数据更新失败'+ JSON.stringify(res))
         }
       },
       fail: function (res) { }
     })
  //  }
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
    console.log("\n\n-----------onHideBegin-------------------\n\n")
    this.trackingBrowseTime();
    console.log("\n\n-----------onHideEnd-------------------\n\n")
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