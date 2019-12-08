const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isshow: false,
  },
  
  //授权按钮事件
  getPhoneNumber: function (e) {
    var that = this;
    wx.login({
      success: function (res) {
        console.log(res);
        if (res.code) {
          var code = res.code;
          app.sendAjax({
            url: '/wechat/send',
            data: {
              "code": code,
            },
            success: function (res) {
              console.log(JSON.stringify(res));
              if (res.code == 200) {
                var jsonobj = JSON.parse(res.data);
                console.log(jsonobj);
                console.log(jsonobj.openid);
                wx.setStorageSync('openId', jsonobj.openid); //保存openID
                wx.setStorageSync('unionid', jsonobj.unionid); //保存unionid
                wx.setStorageSync('session_key', jsonobj.session_key); //保存session_key
                var keyStr = jsonobj.session_key; //获取session_key
                console.log(keyStr);
                var encDataStr = e.detail.encryptedData; //获取加密数据
                console.log(encDataStr);
                var ivStr = e.detail.iv; //加密算法的初始向量
                console.log(ivStr);
                that.jiemiphone(encDataStr, ivStr, keyStr);
              } else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none'
                })
              }
            },
            fail: function (res) { }
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        console.log('login fail: ' + res.errMsg);
      }
    })
  },

  // 判断头像地址是否存在
  judgementHeadeImgrURL: function (data) {
    if (data.shoppingGuide.headImgUrl) {
      wx.redirectTo({
        url: '/pages/phoneInfo/phoneInfo?phone=' + app.getMobilePhoneNum(),
      })
    }
    else {
      //需跳转页面点击按钮授权获取
      wx.navigateTo({
        url: '/pages/getuserinfo/getuserinfo',
      })
    }
  },

  //解密手机号
  jiemiphone: function (encDataStr, ivStr, keyStr) {
    var that = this;
    app.sendAjax({
      url: '/wechat/decrypt',
      data: {
        "encDataStr": encDataStr,
        "ivStr": ivStr,
        "keyStr": keyStr
      },

      success: function (res) {

        console.log(JSON.stringify(res));

        var jsObject = JSON.parse(res.data);
        if (res.code == 200) {
          app.setMobilePhoneNum(jsObject.phoneNumber)

          //2 后台获取头像地址
          app.sendAjax({
            url: '/guide/auth/info',
            data: {
              "mobilePhoneNum": jsObject.phoneNumber
            },
            success: function (res) {
      

              if (res.code == 200) {
                if (res.data) {
                  that.judgementHeadeImgrURL(res.data)
                }
                else {
                   //需跳转页面点击按钮授权获取
                  wx.navigateTo({
                    url: '/pages/getuserinfo/getuserinfo',
                  })
                }
              }
              else {
                wx.showToast({
                  title: res.msg,
                  icon: 'none'
                })
              }
            }
          })
        } else {
          console.log("fail" + JSON.stringify(res))

          wx.showToast({
            title: '获取手机号失败请重新授权',
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        console.log("fail" + JSON.stringify(res))
        wx.showToast({
          title: '调用手机号解密接口失败',
          icon: 'none'
        })
      }
    })
  },

  compareVersion: function (v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    var len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
      v1.push('0')
    }
    while (v2.length < len) {
      v2.push('0')
    }

    for (var i = 0; i < len; i++) {
      var num1 = parseInt(v1[i])
      var num2 = parseInt(v2[i])

      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }
    return 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  cancelTap: function() {
    wx.reLaunch({
      url: '/pages/me/me',
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