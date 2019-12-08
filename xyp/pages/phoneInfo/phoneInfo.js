// pages/phoneInfo/phoneInfo.js
var app = getApp();
let countDownThreshold = 60;
var timer = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    countDownNum: countDownThreshold,
    buttonTitle: '发送',
    codetype: true
  },
  //手机号
  getphone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //验证码
  getnum: function (e) {
    this.setData({
      num: e.detail.value
    })
  },
  //获取验证码
  getyzm: function () {
    var that = this;
    console.log(that.data.phone);
    app.sendAjax({
      url: '/msg/login',
      data: {
        "phoneNum": that.data.phone
      },
      success: function (res) {
        console.log(res);
        if (res.code == 200) {
          wx.showToast({
            title: '发送验证码成功',
            icon: 'none',
          })
          
          that.setData({
            countDownNum: countDownThreshold,
            codetype: false,
            buttonTitle: countDownThreshold + 's后可重发'
          })

          if (timer) clearInterval(timer);
          var countDownNum = that.data.countDownNum;
          timer = setInterval(function () {
            if (countDownNum >= 1) {
              countDownNum--;
              that.setData({
                countDownNum: countDownNum,
                buttonTitle: countDownNum + 's后可重发'
              })
            }
            else {
              that.setData({
                codetype: true,
                buttonTitle: '发送'
              })
              return false;
            }
          }, 1000)

          if (countDownNum === 0) {
            clearInterval(timer);
          }

        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      },
      fail: function (res) {
      }
    })
  },


  //手机号登录接口
  yesbtn: function () {
    var that = this;
    var phone = that.data.phone;
    var num = that.data.num;

    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
    } else if (!num) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
    } else {

      app.sendAjax({
        url: 'guide/login',
        data: {
          "authCode": num, //默认926513
          "mobilePhoneNum": phone,
          "openId": wx.getStorageSync('openId'),
          "unionId": wx.getStorageSync('unionid')
        },
        success: function (res) {
          console.log("\n\n\n yesbtn" + JSON.stringify(res));
          if (res.code == 200) {

            app.setMobilePhoneNum(phone)
            wx.setStorageSync('isfirst', true); //完成认证不再是第一次
            wx.setStorageSync('shoppingGuideId', res.data.shoppingGuideId);

            app.setUserIdentity(res.data.userIdentity);
            
            app.resetHomePage()

          } else if (res.code == 600025) {
            //没有认证跳转认证页面
            that.wxlogin();
          } else {
            setTimeout(function () {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
            }, 1000)
          }
        },
        fail: function (res) { }
      })
    }
  },


  //微信首次登录*
  wxlogin: function () {
    var that = this;
    console.log(that.data.phone);
    console.log(wx.getStorageSync('openId'));
    console.log(wx.getStorageSync('unionid'));
    app.sendAjax({
      url: '/guide/wechat/fristLogin',
      data: {
        "mobilePhoneNum": that.data.phone,
        "openId": wx.getStorageSync('openId'),
        "unionId": wx.getStorageSync('unionid')
      },
      success: function (res) {
        console.log(res);
        if (res.code == 200) {
          wx.setStorageSync('shoppingGuideId', res.data.shoppingGuideId);
          wx.redirectTo({
            url: '/pages/onemyinfo/onemyinfo?phone=' + that.data.phone + '&name=' + res.data.realName,
          })
        } else {
          setTimeout(function () {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          }, 1000)
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '调用微信首次登录接口失败',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setMobilePhoneNum(options.phone)
    console.info(options.phone + "电话");

    var that = this;
    if (options.phone) {
      console.log(options.phone);
      //保存手机号
      that.setData({
        phone: options.phone
      });
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