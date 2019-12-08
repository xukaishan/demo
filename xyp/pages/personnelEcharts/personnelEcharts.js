// pages/Situation/Situation.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbarSelectedIndex: 1,
    agentListResData: null,
    agentListResDatas: null,
    isAgentData: true,
    isNation: false,
    hasFilterConditionsChanged: false,
    userIdentity: 0,
    sortMethods: [] //每个数据项排序方式记录
  },

  //数据排序
  sortData: function(e) {
    let that = this
    app.showLoading();
    let dataset = e.currentTarget.dataset
    let index = parseInt(dataset.option);
    let opntion = ''
    let sort = that.data.sortMethods[index - 1]
    let tabbarSelectedIndex = that.data.tabbarSelectedIndex
    //排序更改
    if ('asc' == sort) {
      that.data.sortMethods[index - 1] = 'desc';
    } else {
      that.data.sortMethods[index - 1] = 'asc';
    }
    if (index == 1) {
      if (tabbarSelectedIndex == 1) {
        opntion = 'aTotalRate'
      } else if (tabbarSelectedIndex == 2) {
        opntion = 'bTotalRate'
      } else if (tabbarSelectedIndex == 3) {
        opntion = 'cTotalRate'
      } else {
        opntion = 'dTotalRate'
      }
    } else if (index == 2) {
      if (tabbarSelectedIndex == 1) {
        opntion = 'aTerminalNum'
      } else if (tabbarSelectedIndex == 2) {
        opntion = 'bTerminalNum'
      } else if (tabbarSelectedIndex == 3) {
        opntion = 'cTerminalNum'
      } else {
        opntion = 'dTerminalNum'
      }
    }

    that.doSortData(that.data.agentListResData, opntion, sort)
    that.setData({
      sortMethods: that.data.sortMethods
    })
    app.hideLoading();
  },

  doSortData: function(data, option, sort) {
    let that = this
    if (data.length > 2) {
      let tempData = []
      let sortData = []
      data.forEach(function(val) {
        if (data[0].id != val.id) {
          tempData.push(val)
        }
      })
      //排序操作
      tempData.sort(function(x, y) {
        //升序
        if ("asc" == sort) {
          return (x[option] * 100) - (y[option] * 100)
        } else if ("desc" == sort) {
          //降序
          return (y[option] * 100) - (x[option] * 100)
        }
      })
      sortData.push(data[0])
      tempData.forEach(function(val) {
        sortData.push(val);
      })
      that.setData({
        agentListResData: []
      })
      that.setData({
        agentListResData: sortData
      })
    }
  },

  //初始化排序方式
  initSortMethod: function(size) {
    let that = this
    let sortMethods = that.data.sortMethods
    for (let i = 0; i < size; i++) {
      //默认升序
      sortMethods.push("asc");
    }
    that.setData({
      sortMethods: sortMethods
    })
  },

  /**
   * tab切换
   */
  showTab(e) {
    let that = this;
    let dataset = e.currentTarget.dataset
    let selectedIndex = dataset.index
    let tabbarSelectedIndex = that.data.tabbarSelectedIndex

    if (tabbarSelectedIndex == selectedIndex) {
      return
    }

    //通知当前页面，已经上级、及其堆栈中开启监听的页面筛选条件已经变化
    //从而更新相关数据
    let userInfo = {
      tabbarSelectedIndex: selectedIndex
    }
    app.notice.post('GuideCategoryChangedNotification', {
      userInfo
    })
  },

  /**
   * 打开代理商
   */
  openRegister(e) {
    var that = this
    let dataset = e.currentTarget.dataset
    let index = dataset.index
    if (index <= 0) {
      return
    }

    let item = dataset.item
    item.tabbarSelectedIndex = that.data.tabbarSelectedIndex

    console.log("\n\n\n openRegister = \n" + JSON.stringify(item) + "\n\n\n")

    if (item.dataType == 5) {
      wx.navigateTo({
        url: '/pages/PersonnelDetails/PersonnelDetails?item=' + JSON.stringify(item),
      })
    } else {
      wx.navigateTo({
        url: '/pages/personnelEcharts/personnelEcharts?item=' + JSON.stringify(item),
      })
    }
  },

  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  requestAgentList: function() {
    var that = this;
    app.sendAjax({
      url: '/rest/st/peopleInfo/agentList',
      data: {
        "mobilePhoneNum": app.getMobilePhoneNum(),
      },
      success: function(res) {
        console.log("\n\n\n" + JSON.stringify(res) + "\n\n\n");
        if (res.respCode == "0") {
          console.info(JSON.stringify(res.data) + '查询情况成功')
          that.setData({
            agentListResData: res.data
          })
        } else {
          console.log('查询失败')
        }
      },
      fail: function(res) {}
    })
  },

  requestPeopleInfo: function() {
    var that = this;
    var areaInfo = that.data.areaInfo
    var agentId = areaInfo.agentId
    var areaId = areaInfo.areaId
    var dataType = areaInfo.dataType

    if (dataType == null) {
      dataType = 1
    }

    if (!agentId || agentId.length == 0) {
      console.log("agentId can not be undefine or null or empty")
    }

    app.sendAjax({
      url: 'rest/st/peopleInfo',
      data: {
        "agentId": agentId,
        "areaId": areaId,
        "dataType": dataType
      },
      success: function(res) {
        console.log("\n\n\n" + JSON.stringify(res) + "\n\n\n");
        if (res.respCode == "0") {
          console.info(JSON.stringify(res.data) + '查询情况成功')
          that.setData({
            agentListResData: res.data
          })
          if (res.data[0].dataType == 4) {
            that.setData({
              agentListResDatas: res.data
            })
            that.splitTerminals(that.data.tabbarSelectedIndex)
          }
        } else {
          console.log('查询失败')
        }
      },
      fail: function(res) {}
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.initSortMethod(2)
    console.log("options = " + JSON.stringify(options))

    if ("item" in options) {
      let item = JSON.parse(options.item)
      let tabbarSelectedIndex = 1
      if ("tabbarSelectedIndex" in item) {
        tabbarSelectedIndex = item.tabbarSelectedIndex
      }
      that.setData({
        tabbarSelectedIndex: tabbarSelectedIndex,
        areaInfo: item,
        isAgentData: item.dataType == 0 ? true : false,
        isNation: item.areaLevel == -1 ? true : false,
      })

      that.requestGuideCategoryStatisticsInfo()
      that.registerNotifications()
    }
  },

  requestGuideCategoryStatisticsInfo() {
    var that = this

    let areaInfo = that.data.areaInfo
    let userIdentity = app.getUserIdentity()
    that.setData({
      userIdentity: userIdentity,
    })

    //areaLevel 全国 - （-1） 代理商 -（0） 省 - （1） 市 - （2） 区 - （3） 终端 - (4) 详情 - （5）
    //dataLevel 全国 - （-1） 代理商 -（0） 省 - （1） 市 - （2） 区 - （3） 终端 - (4) 详情 - （5）


    //1 - 导购 2 - 培训师 3 - 代理商 4-管理员
    switch (userIdentity) {
      case 1:
      case 2:
        if (areaInfo.dataType == 0) {
          that.requestTrainerInfo()
        }
        break;
      case 3:
        {
          if (areaInfo.dataType == 0) {
            that.requestAgentInfo()
          } else {
            that.requestPeopleInfo()
          }
        }
        break;

      case 4:
        {
          if (areaInfo.dataType == 0) {
            that.requestAgentList()
          } else {
            that.requestPeopleInfo()
          }
        }
        break;

      default:
        break;
    }
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
          that.requestPeopleInfo()

        } else {
          console.log('查询失败')
        }
      },
      fail: function(res) {}
    })
  },

  requestTrainerInfo: function() {
    var that = this;
    var trainerId = wx.getStorageSync('shoppingGuideId')
    app.sendAjax({
      url: 'rest/trainerAgent/' + trainerId,
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
          that.requestPeopleInfo()

        } else {
          console.log('查询失败')
        }
      },
      fail: function(res) {}
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    var that = this

    that.removeNotifications()
  },

  //注册监听筛选条件变化,需要在onUnload注销通知
  registerNotifications() {
    var that = this
    app.notice.register('GuideCategoryChangedNotification', that.guideCategoryChanged, that)
  },

  //注销通知
  removeNotifications() {
    var that = this
    app.notice.remove("GuideCategoryChangedNotification", that.guideCategoryChanged)
  },

  guideCategoryChanged: function(notification) {
    var that = this
    let userInfo = notification.userInfo
    let tabbarSelectedIndex = userInfo.tabbarSelectedIndex
    that.setData({
      tabbarSelectedIndex: tabbarSelectedIndex,
      hasFilterConditionsChanged: true,
    })
    that.splitTerminals(tabbarSelectedIndex)
    console.log("userInfo = " + JSON.stringify(userInfo))
  },

  splitTerminals: function(index) {
    let that = this;
    let agentListResData = that.data.agentListResDatas
    if (agentListResData != null) {
      if (index == "1") {
        index = 'aTypeNum';
      } else if (index == "2") {
        index = 'bTypeNum';
      } else if (index == "3") {
        index = 'cTypeNum';
      } else if (index == "4") {
        index = 'dTypeNum';
      }
      let areaInfo = agentListResData[0]
      let tempArray = []
      if (areaInfo.dataType == 4) {
        // this.data.agentListResData = null;
        agentListResData.forEach(function(val) {
          if (val[index] > 0) {
            tempArray.push(val)
          }
        })
        that.setData({
          agentListResData: null
        })
        that.setData({
          agentListResData: tempArray
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    let hasFilterConditionsChanged = that.data.hasFilterConditionsChanged
    if (hasFilterConditionsChanged) {
      console.log("hasFilterConditionsChanged")
      that.setData({
        agentListResData: null,
      })
      that.requestGuideCategoryStatisticsInfo()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

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