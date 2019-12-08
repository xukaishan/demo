// pages/managersHome/managersHome.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 使用情况
   */
  openUse() {
    wx.navigateTo({
      url: '/pages/Situation/Situation',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 注册情况
   */
  openregistration() {
    var that = this

    let userIdentity = app.getUserIdentity()

    //1 - 导购 2 - 培训师 3 - 代理商 4-管理员
    switch (userIdentity) {
      case 1:
      case 2:
        that.requestTrainerInfo();
        break;

      case 3:
        {
          that.requestAgentInfo();
        }
        break;

      case 4:
        {
          wx.navigateTo({
            url: '/pages/registerOne/registerOne'
          })
        }
        break;

      default:
        break;
    }
  },

  requestTrainerInfo: function () {
    var that = this;
    var trainerId = wx.getStorageSync('shoppingGuideId')
    app.sendAjax({
      url: 'rest/trainerAgent/' + trainerId,
      method: "GET",
      data: {
        // "mobilePhoneNum": app.getMobilePhoneNum(),
      },
      success: function (res) {
        console.log("\n\n\n/rest/agent" + JSON.stringify(res) + "\n\n\n");
        if (res.respCode == "0") {
          console.info(JSON.stringify(res.data) + '查询情况成功')
          var resData = res.data[0]
          var areaInfo = {
            agentId: resData.agentId,
          }
          that.setData({
            areaInfo: areaInfo
          })
          wx.navigateTo({
            url: '/pages/registrationStatus/registrationStatus?item=' + JSON.stringify(areaInfo),
          })

        } else {
          console.log('查询失败')
        }
      },
      fail: function (res) { }
    })
  },

  requestAgentInfo: function() {
    var that = this;
    app.sendAjax({
      url: 'rest/agenterAgent/' + app.getMobilePhoneNum(),
      method: "GET",
      data: {
        // "mobilePhoneNum": app.getMobilePhoneNum(),
      },
      success: function(res) {
        console.log("\n\n\n/rest/agent" + JSON.stringify(res) + "\n\n\n");
        if (res.respCode == "0") {
          console.info(JSON.stringify(res.data) + '查询情况成功')
          var resData = res.data[0]
          var areaInfo = {
            agentId: resData.agentId,
          }
          that.setData({
            areaInfo: areaInfo
          })
          wx.navigateTo({
            url: '/pages/registrationStatus/registrationStatus?item=' + JSON.stringify(areaInfo),
          })

        } else {
          console.log('查询失败')
        }
      },
      fail: function(res) {}
    })
  },


  /**
   * 人员情况
   */
  openPersonnelSituation() {
    var that = this
    wx.navigateTo({
      url: '/pages/PersonnelSituation/PersonnelSituation',
    })
  },
  /**
   * 打开培训情况
   */
  openTrainingRecord() {
    wx.navigateTo({
      url: '/pages/trainingRecord/trainingRecord',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })


  },

  trainingLibaryTap: function() {
    wx.navigateTo({
      url: '/pages/train/train',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("\n\n\n onLoad ")

    wx.hideShareMenu()
    app.editTabBar(); //添加tabBar数据  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})