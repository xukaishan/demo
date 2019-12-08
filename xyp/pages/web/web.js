// pages/web/web.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:null,
    shareid:null,
    h5url:null,
    starTime:null,
    updataId:null,//更新浏览数据id
    openid:null,
    userNames: null,
    userAvatars: null,
    inteval:null,
    showUrl:false,
    unid:''
  },
  
  startTimes:function () {
    var startTime = Date.parse(new Date()) / 1000;
    console.info(startTime);
    return startTime;
  },
  endTimes:function () {
    var endTime = Date.parse(new Date()) / 1000;
    console.info(endTime);
    return endTime;
  },
 
  /**
   * 数据更新接口
   */
  updataAdd:function(){
    var that = this;
    app.sendAjax1({
      url: 'share/browse',
      data: {
        customerAvatarUrl:that.data.userAvatars,
        customerNickName: that.data.userNames,
        customerOpenId: that.data.openid,
        shareId: that.data.shareid,
        trackEndTimestamp: that.endTimes(),
        trackStartTimestamp: that.data.starTime,
        shareRecordId: that.data.updataId,
        unionId: that.data.unid
      },
      success: function (res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) + '数据更新')
        } else {
          console.log('数据更新失败')
        }
      },
      fail: function (res) { }
    })
  },

  /**
   * 调用数据
   */
  add:function(url){
    var that = this;

    console.log('---------------参数开始 -----------------')

    console.info('shareID = ' + this.data.shareid);
    console.info('头像 =' + that.data.userAvatars);
    console.info('名字 = ' + that.data.userNames);
    console.info('openId = ' + that.data.openid);
   
    console.log('---------------参数结束 -----------------')
    
      app.sendAjax({
        url: 'share/browse',
        data: {
          // actions: actionsData,
          customerAvatarUrl: that.data.userAvatars,
          customerNickName: that.data.userNames,
          customerOpenId: that.data.openid,
          shareId: that.data.shareid,
          trackEndTimestamp: that.endTimes()+5,
          trackStartTimestamp: that.data.starTime,
          unionId: that.data.unid
        },
        success: function (res) {
          if (res.code == "200") {
            console.log(JSON.stringify(res) + '调用数据')
            console.info(url + '?shareId=' + res.data.shareRecordId + '&openId=' + that.data.openid)
            // if (res.data.shareRecordId != null && that.data.openid != null){
            var r = JSON.stringify(res);
            console.info(that.data.showUrl)
              that.setData({
                showUrl: true,
                updataId: res.data.shareRecordId,
                h5url: url + '?shareId=' + res.data.shareRecordId + '&openId=' + that.data.openid + '&res=' + r,
              })
            console.info(that.data.showUrl)
          } else {

            that.setData({
              showUrl: true,
              h5url: url,
            })

            console.log('调用数据失败')
            console.log('---------------Res begin -----------------')
            console.log(JSON.stringify(res))
            console.log('---------------Res end -----------------')
          }
        },
        fail: function (res) { }
      })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();


    // let h5LinkUrlKey = 'webPage' + options.aimid
    // let h5LinkUrl = wx.getStorageSync(h5LinkUrlKey)
    // wx.removeStorageSync(h5LinkUrlKey);

    let h5LinkUrl = options.url
    
    wx.setNavigationBarTitle({
      title: options.productname,
    })
    
    console.info(JSON.stringify(options)+'接收数据----------------------------------');
    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    if (!shoppingGuideId){
      shoppingGuideId=options.shoppingGuideId;
    }
    var that = this;
    var starTimes = that.startTimes();
    that.setData({
      starTime: starTimes,
    })

    //1007单人聊天会话中的小程序消息卡片
    //单人聊天会话中的小程序消息卡片
    if (app.globalData.sharEntrance !='1007'){
      that.setData({
        showUrl: true,
        h5url: h5LinkUrl,
      })
    }
    console.info(JSON.stringify(app.globalData.sharEntrance) + '-----获取微信小程序入口')

    //1008群聊会话中的小程序消息卡片
    // 进入非群聊会话中的小程序消息卡片
    if (options.shareId && app.globalData.sharEntrance!='1008'){
      that.setData({
        shareid: options.shareId
      })
      var openId = wx.getStorageSync('openId');
      var userName = wx.getStorageSync('userName');
      var userAvatar = wx.getStorageSync('userAvatar');
      var unionid = wx.getStorageSync('unionid');
      that.setData({
        openid: openId,
        userNames: userName,
        userAvatars: userAvatar,
        unid: unionid
      })
      
      // userAvatar 微信可能返回为空这里不做必要项校验
      if (openId && userName) {
        console.info("已授权调用提交数据")
        that.add(h5LinkUrl);
      }else{
        console.info(that.data.shareid+"跳转认证携带参数")
        wx.redirectTo({
          url: '/pages/infoAuthorization/infoAuthorization?shareId=' + that.data.shareid + '&url=' + options.url + '&accessType=1'
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    console.info(app.globalData)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('---------------onHide -----------------')
    var that=this;
    if (app.globalData.sharEntrance == '1007' && app.globalData.sharEntrance != '1008'){
      that.updataAdd();
    }
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {

     }
    return {
      title: '转发',
      path: '/pages/web/web?shareId=' + this.data.shareid + '&url=' + this.data.h5url,
      success: function (res) { 
      }
    }
  }
})