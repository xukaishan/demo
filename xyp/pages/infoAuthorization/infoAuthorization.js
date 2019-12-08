
// pages/infoAuthorization/infoAuthorization.js
var app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 1 - 资源链接 2 - 操作视频 3 - 在线中心资源列表
    accessType: 1, 
    // 资源链接
    optionsid: '',
    optionsUrl: '',

    // 操作视频
    videoId: '',

    // 在线中心资源列表
    aimid:'',

    //common
    shoppingGuideId:'',
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    let accessType = options.accessType * 1;
    let shareId = options.shareId ? options.shareId : '';
    let videoId = options.videoId ? options.videoId : '';
    let url = options.url ? options.url : '';
    let aimid = options.aimid ? options.aimid : '';
    let shoppingGuideId = options.shoppingGuideId ? options.shoppingGuideId : '';

    console.log('\n accessType = \n' + accessType + '\n aimid = ' + aimid + '\nshareId = ' + shareId + '\nvideoId = ' + videoId + '\nurl = ' + url);

    that.setData({
      accessType: accessType,
      optionsid: shareId,
      optionsUrl: url,
      shoppingGuideId: shoppingGuideId,
    })
  

    switch (accessType){
      case 1: {
      }
      break;

      case 2: {
        that.setData({
          videoId: videoId,
        })
      }
        break;
      case 3: {
        that.setData({
          aimid: aimid,
        })
        console.log(' that.setData'+ that.data.aimid);
      }
        break;

        default:
        break;
    }


    wx.login({
      success: function (res) {
        console.log(res);
        if (res.code) {
          var code = res.code;
          app.sendAjax({
            hideLoading: true,
            url: '/wechat/send',
            data: {
              "code": code,
            },
            success: function (res) {
              console.info(res);
              if (res.code == 200) {
                var jsonobj = JSON.parse(res.data);
                wx.setStorageSync('openId', jsonobj.openid); //保存openID
                wx.setStorageSync('unionid', jsonobj.unionid); //保存openID
                wx.getSetting({
                  success(res) {
                    if (res.authSetting['scope.userInfo']) {
                      // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                      wx.getUserInfo({
                        lang: "zh_CN",
                        success: function (res) {
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: "获取用户登录态失败！",
          })
        }
      },
      fail: function (res) {
        console.log('login fail: ' + res.errMsg);
      }
    })

  },

  bindGetUserInfo(e) {

    console.info('\n ------------bindGetUserInfo------------------进来了 \n ');

    console.log(JSON.stringify(this.data));

    var user = e.detail.userInfo;
    console.log('\n\n\n -----------------用户授权信息---------\n' + JSON.stringify(e.detail.userInfo) + '\n\n\n');

    wx.setStorageSync('userName', user.nickName);
    wx.setStorageSync('userAvatar', user.avatarUrl);
    wx.setStorageSync('customer.country', user.country);
    wx.setStorageSync('customer.province', user.province);
    wx.setStorageSync('customer.city', user.city);

    console.log('\nopenID = ' + wx.getStorageSync('openId'));
    console.log('\nnickName = ' + wx.getStorageSync('userName'));
    console.log('\nuserAvatar = ' + wx.getStorageSync('userAvatar') );
    console.log('\naimid = ' + this.data.aimid + 'this.data.aimid = ' + this.data.aimid);

    let accessType = this.data.accessType * 1;
    switch (accessType) {
      case 1: {
        wx.reLaunch({
          url: '/pages/web/web?shareId=' + this.data.optionsid + '&url=' + this.data.optionsUrl,
        })
      }
        break;

      case 2: {
        wx.reLaunch({
          url: '/pages/operationDetails/operationDetails?shareId=' + this.data.optionsid + '&url=' + this.data.optionsUrl + '&videoId=' + this.data.videoId,
        })
      }
        break;

      case 3: {
        wx.reLaunch({
          url: '/pages/onlineDetails/onlineDetails?shareId=' + this.data.optionsid + '&url=' + this.data.optionsUrl + '&aimid=' + this.data.aimid + '&shoppingGuideId=' + this.data.shoppingGuideId,
        })
      }
        break;

      default:
        break;
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