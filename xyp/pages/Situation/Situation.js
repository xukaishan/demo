// pages/Situation/Situation.js

const app = getApp()
const util = require('../../utils/util.js')
const moment = require('../../utils/moment.js')
const defaultDateStatisticsTimestamp = 30 * 24 * 60 * 60 * 1000
const increaseColor = "color:#3BC26D"
const decreaseColor = "color:#EA5A5A"
const balanceColor = "" //FFCC00
const increaseIcon = "↑"
const decreaseIcon = "↓"
const balanceIcon = "• "

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showForward: 0, //显示转发情况
    showStatistics: 0, //显示统计情况

    hasFilterConditionsChanged: false, //筛选条件是否改变，

    currentDateStartString: null,
    currentDateEndString: null,
    compareDateStartString: null,
    compareDateEndString: null,

    usageSituationCondition: 0, //0 转发情况 1 粉丝情况
    usageSituationFilteredResult: "转发情况",

    statisticsCondition: 0, //0 统计 1 同比 2 环比
    statisticsFilteredResult: "统计",

    areaInfo: null, //每一级区域信息，用于存储上级传参
    shareCustomerResData: null, //转发情况、粉丝情况
    shareCustomerCompareResData: null, //转发同比、环比

    currentAreaInfo: null, //当前区域信息
    mobilePhoneNum: '',
    isFirst: true,
    isFirstCompare: true,
    historyCustomers: false,

    sortMethods: [] //每个数据项排序方式记录
  },

  //数据排序
  sortData: function(e) {
    let that = this
    app.showLoading();
    let dataset = e.currentTarget.dataset
    let index = parseInt(dataset.option);
    let opntion = ''
    let sort = that.data.sortMethods[index - 1];
    //排序更改
    if ('asc' == sort) {
      that.data.sortMethods[index - 1] = 'desc';
    } else {
      that.data.sortMethods[index - 1] = 'asc';
    }
    if (index == 1) {
      opntion = 'areaPerShare'
    } else if (index == 2) {
      opntion = 'registedGuides'
    } else if (index == 3) {
      opntion = 'customers'
    } else if (index == 4) {
      opntion = 'historyCustomers'
    }
    
    that.doSortData(that.data.shareCustomerResData, opntion, sort)
    that.setData({
      sortMethods: that.data.sortMethods
    })
    app.hideLoading();
  },

  doSortData: function(data, option, sort) {
    let that = this
    if (data.length > 2) {
      let tempData = []
      let sortData=[]
      data.forEach(function(val) {
        if (data[0].id != val.id) {
          tempData.push(val)
        }
      })
      //排序操作
      tempData.sort(function(x, y) {
        //升序
        if ("asc" == sort) {
          return x[option] - y[option]
        } else if ("desc" == sort) {
          //降序
          return y[option] - x[option]
        }
      })
      sortData.push(data[0])
      tempData.forEach(function(val){
        sortData.push(val);
      })
      that.setData({
        shareCustomerResData: sortData
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

  requestStatisticsCompareInfo() {
    var that = this

    let areaInfo = that.data.areaInfo
    if (areaInfo == null) {
      areaInfo = that.data.shareCustomerResData[0]
    }
    let dataType = areaInfo.dataType
    let userIdentity = app.getUserIdentity()
    let agentId = null
    let id = null
    if (2 != userIdentity) {
      agentId = (that.data.isFirstCompare) ? null : areaInfo.agentId
      id = (that.data.isFirstCompare) ? null : areaInfo.id
    } else {
      agentId = areaInfo.agentId
      id = that.data.shareCustomerResData[0].id
    }
    let compareMethod = that.data.statisticsCondition
    let currentStartTime = that.data.currentDateStartString
    let currentEndTime = that.data.currentDateEndString
    let compareStartTime = that.data.compareDateStartString
    let compareEndTime = that.data.compareDateEndString
    let mobilePhoneNum = (that.data.isFirstCompare) ? that.data.mobilePhoneNum : null
    //验证参数合法性
    if (compareMethod != 1 && compareMethod != 2) {
      console.log("\n\n\ncompareMethod must be equal  1 or equal 2\n\n\n")
    }
    if (!currentStartTime) {
      console.log("currentStartTime can not be undefine or null or empty")
    }
    if (!currentEndTime) {
      console.log("currentEndTime can not be undefine or null or empty")
    }
    if (!compareStartTime) {
      console.log("compareStartTime can not be undefine or null or empty")
    }
    if (!compareEndTime) {
      console.log("compareEndTime can not be undefine or null or empty")
    }

    console.log("\n\n\n requestStatisticsCompareInfo 对比 \n\n\n")

    app.sendAjax({
      url: 'rest/st/shareInfo/compare',
      data: {
        "compareMethod": compareMethod,
        "currentStartTime": currentStartTime,
        "currentEndTime": currentEndTime,
        "compareStartTime": compareStartTime,
        "compareEndTime": compareEndTime,
        "dataType": dataType,
        "id": id,
        "agentId": agentId,
        "mobilePhoneNum": mobilePhoneNum
      },
      success: function(res) {
        console.log("\n\n\n" + JSON.stringify(res))
        that.setData({
          shareCustomerCompareResData: res.data
        })
      },
      fail: function(res) {}
    })
  },

  /**
   * 请求转发情况数据
   */
  requestUsageSituation: function() {
    var that = this
    var agentId = ""
    var id = []
    var dataType = 1
    let areaInfo = that.data.areaInfo
    let userIdentity = app.getUserIdentity()
    if (areaInfo != null) {
      agentId = areaInfo.agentId
      if (areaInfo.id != null) {
        id.push(areaInfo.id)
      }
      dataType = areaInfo.dataType
    }


    let startTime = that.data.currentDateStartString
    let endTime = that.data.currentDateEndString
    let mobilePhoneNum = (that.data.isFirst) ? that.data.mobilePhoneNum : null
    let historyCustomers = that.data.historyCustomers
    //验证参数合法性
    if (!startTime) {
      console.log("startTime can not be undefine or null or empty")
    }
    if (!endTime) {
      console.log("endTime can not be undefine or null or empty")
    }
    if (!id || id.length == 0) {
      console.log("agent id array can not be undefine or null or empty")
    }

    let paramters = {
      "dataType": dataType,
      "agentId": agentId,
      "startTime": startTime,
      "endTime": endTime,
      "id": id,
      "mobilePhoneNum": mobilePhoneNum,
      "historyCustomers": false,
      "userIdentity": userIdentity
    }

    app.sendAjax({
      url: 'rest/st/shareInfo',
      data: paramters,
      success: function(res) {
        console.log(JSON.stringify(res))

        let resData = res.data
        if (resData != null && resData.length > 1) {
          that.setData({
            currentAreaInfo: res.data[1],
          })
        }

        that.setData({
          shareCustomerResData: resData,
        })
      },
      fail: function(res) {}
    })
  },

  cellTap: function(e) {
    var that = this
    let usageSituationCondition = that.data.usageSituationCondition
    let dataset = e.currentTarget.dataset
    let idx = dataset.idx
    let item = that.data.shareCustomerResData[idx]
    if (idx != 0) {

      //传递当前页面状态
      item.currentDateStartString = that.data.currentDateStartString
      item.currentDateEndString = that.data.currentDateEndString
      item.compareDateStartString = that.data.compareDateStartString
      item.compareDateEndString = that.data.compareDateEndString
      item.usageSituationCondition = that.data.usageSituationCondition
      item.statisticsCondition = that.data.statisticsCondition
      item.isFirst = false
      item.isFirstCompare = false

      //粉丝情况无终端详情datatype = 2就不跳转了
      let lastDataType = usageSituationCondition == 0 ? 3 : 2
      if (item.dataType < lastDataType) {
        wx.navigateTo({
          url: '/pages/Situation/Situation?item=' + JSON.stringify(item),
        })
      }
    }
  },

  bindDateChange: function(e) {
    var that = this
    let dataset = e.currentTarget.dataset
    let tag = dataset.tag * 1
    var item = null
    that.setData({
      historyCustomers: false
    })
    switch (tag) {
      case 1:
        { //当前开始时间
          item = {
            currentDateStartString: e.detail.value
          }
        }
        break;

      case 2:
        { //当前结束时间
          item = {
            currentDateEndString: e.detail.value
          }
        }
        break;

      case 3:
        { //比较开始时间
          item = {
            compareDateStartString: e.detail.value
          }
        }
        break;

      case 4:
        { //比较结束时间
          item = {
            compareDateEndString: e.detail.value
          }
        }
        break;

      default:
        break
    }

    //通知当前页面，已经上级、及其堆栈中开启监听的页面筛选条件已经变化
    //从而更新相关数据
    if (item != null) {
      let userInfo = {
        item: item
      }
      app.notice.post('SituationFilterConditionsChangedNotification', {
        userInfo
      })
    }

    if (that.data.statisticsCondition == 0) {
      that.requestUsageSituation()
    } else {
      that.requestStatisticsCompareInfo()
    }

  },

  /**
   * 显示转发情况下拉
   */
  openForward() {
    let that = this;
    let showForward = (that.data.showForward == 0) ? 1 : 0
    that.setData({
      showStatistics: 0,
      showForward: showForward
    })
  },

  /**
   * 显示统计下拉
   */
  openStatistics() {
    console.log("openStatistics")
    let that = this;
    let showStatistics = (that.data.showStatistics == 0) ? 1 : 0
    that.setData({
      showForward: 0,
      showStatistics: showStatistics
    })
  },

  fowwardFollowersTap(e) {
    var that = this
    let dataset = e.currentTarget.dataset
    let tag = dataset.tag * 1

    that.setData({
      showForward: 0,
    })

    //通知当前页面，以及上级、及其栈中开启监听的页面筛选条件已经变化
    //从而更新相关数据
    let item = {
      currentPage: that,
      usageSituationCondition: tag,
    }
    let userInfo = {
      item: item
    }
    app.notice.post('SituationFilterConditionsChangedNotification', {
      userInfo
    })

    let shareCustomerResData = that.data.shareCustomerResData
    if (shareCustomerResData == null) {
      that.requestUsageSituation()
    }

  },

  // 统计筛选
  statisticsTap(e) {
    var that = this
    let dataset = e.currentTarget.dataset
    let tag = dataset.tag * 1

    that.setData({
      showStatistics: 0,
    })

    //通知当前页面，以及上级、及其栈中开启监听的页面筛选条件已经变化
    //从而更新相关数据
    let item = {
      currentPage: that,
      statisticsCondition: tag,
    }
    let userInfo = {
      item: item
    }
    app.notice.post('SituationFilterConditionsChangedNotification', {
      userInfo
    })

  },

  dateFormatString() {
    return "YYYY-mm-dd"
  },

  /**
   * 更新日期
   */
  updateDate() {
    var that = this
    var currentDateStart = new Date(moment(that.data.currentDateStartString, moment.ISO_8601))
    if (!that.data.currentDateStartString) {
      currentDateStart = util.dateEarlierFromCurrent(defaultDateStatisticsTimestamp)
    }

    var currentDateEnd = new Date(moment(that.data.currentDateEndString, moment.ISO_8601))
    if (!that.data.currentDateEndString) {
      currentDateEnd = new Date()
    }

    switch (that.data.statisticsCondition) {
      case 0:
        {
          let currentDateStartString = util.dateFormat(that.dateFormatString(), currentDateStart)
          let currentDateEndString = util.dateFormat(that.dateFormatString(), currentDateEnd)

          that.setData({
            currentDateStartString: currentDateStartString,
            currentDateEndString: currentDateEndString
          })
        }
        break;

      case 1:
        {
          let compareDateStart = moment(currentDateStart).subtract(1, 'years').toDate()
          let compareDateEnd = moment(currentDateEnd).subtract(1, 'years').toDate()
          let compareDateStartString = util.dateFormat(that.dateFormatString(), compareDateStart)
          let compareDateEndString = util.dateFormat(that.dateFormatString(), compareDateEnd)

          that.setData({
            compareDateStartString: compareDateStartString,
            compareDateEndString: compareDateEndString
          })
        }
        break;

      case 2:
        {

          //预留 上个月对应的时间区间
          // let compareDateStart = moment(currentDateStart).subtract(1, 'months').toDate()
          // let compareDateEnd = moment(currentDateEnd).subtract(1, 'months').toDate()
          // let compareDateStartString = util.dateFormat(that.dateFormatString(), compareDateStart)
          // let compareDateEndString = util.dateFormat(that.dateFormatString(), compareDateEnd)

          //前一个时间周期内时间
          let differDays = moment(currentDateEnd).diff(moment(currentDateStart), 'days')
          let compareDateStart = moment(currentDateStart).subtract(differDays, "days").toDate()
          let compareDateEnd = moment(currentDateStart).subtract(0, "days").toDate()
          let compareDateStartString = util.dateFormat(that.dateFormatString(), compareDateStart)
          let compareDateEndString = util.dateFormat(that.dateFormatString(), compareDateEnd)

          that.setData({
            compareDateStartString: compareDateStartString,
            compareDateEndString: compareDateEndString
          })
        }
        break;

      default:
        break;
    }
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
            dataType: 1
          }
          that.setData({
            areaInfo: areaInfo
          })
          that.updateDate() //初始化日期
          that.requestUsageSituation() //获取转发情况数据
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
    wx.hideShareMenu()
    var that = this
    that.initSortMethod(4);
    let userIdentity = app.getUserIdentity()
    if (userIdentity != 2) {
      that.setData({
        mobilePhoneNum: app.getMobilePhoneNum()
      })
    }
    //接受参数,主页进入无Item参数
    //更新筛选条件和状态
    if ("item" in options) {
      let item = JSON.parse(options.item)
      console.log("\n\n\n item = " + JSON.stringify(item))
      that.setData({
        areaInfo: item,
        isFirst: item.isFirst,
        isFirstCompare: item.isFirstCompare
      })

      that.updateFilterConditionsWithItem(item)
      that.updateDate() //初始化日期
      that.requestUsageSituation() //获取转发情况数据
    } else {
      if (2 != userIdentity) {
        that.updateDate() //初始化日期
        that.requestUsageSituation() //获取转发情况数据
      } else {
        that.requestTrainerInfo();
      }
    }

    that.registerNotifications()
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
    app.notice.register('SituationFilterConditionsChangedNotification', that.stuationFilterConditionsChanged, that)
  },

  //注销通知
  removeNotifications() {
    var that = this
    app.notice.remove("SituationFilterConditionsChangedNotification", that.stuationFilterConditionsChanged)
  },

  stuationFilterConditionsChanged: function(notification) {
    var that = this
    let userInfo = notification.userInfo
    let item = userInfo.item

    that.updateFilterConditionsWithItem(item)

    that.setData({
      hasFilterConditionsChanged: true,
    })
    // console.log("userInfo = " + JSON.stringify(item))
  },

  updateUsageSituationConditionFilteredResult: function(usageSituationCondition) {
    var that = this
    var usageSituationFilteredResult = "转发情况"
    switch (usageSituationCondition) {
      case 0:
        {}
        break;

      case 1:
        {
          usageSituationFilteredResult = "粉丝情况"
        }
        break;

      default:
        break;
    }

    console.log("usageSituationCondition" + usageSituationCondition)
    that.setData({
      usageSituationCondition: usageSituationCondition,
      usageSituationFilteredResult: usageSituationFilteredResult,
    })
  },

  updateStatisticsFilteredResult: function(statisticsCondition) {
    var that = this
    that.setData({
      statisticsCondition: statisticsCondition
    })
    that.updateDate()
    var statisticsFilteredResult = "统计"
    switch (statisticsCondition) {
      case 0:
        {
          let shareCustomerResData = that.data.shareCustomerResData
          if (shareCustomerResData == null) {
            that.requestUsageSituation()
          }
        }
        break;

      case 1:
        {
          statisticsFilteredResult = "同比"
          that.requestStatisticsCompareInfo()
        }
        break;

      case 2:
        {
          statisticsFilteredResult = "环比"
          that.requestStatisticsCompareInfo()
        }
        break;

      default:
        break;
    }

    that.setData({
      statisticsFilteredResult: statisticsFilteredResult,
    })
  },

  updateFilterConditionsWithItem: function(item) {
    var that = this

    //更新data数据必须顺序执行
    if ("currentDateStartString" in item) {
      that.setData({
        currentDateStartString: item.currentDateStartString,
      })
    }

    if ("currentDateEndString" in item) {
      that.setData({
        currentDateEndString: item.currentDateEndString,
      })
    }

    if ("compareDateStartString" in item) {
      that.setData({
        compareDateStartString: item.compareDateStartString,
      })
    }

    if ("compareDateEndString" in item) {
      that.setData({
        compareDateEndString: item.compareDateEndString,
      })
    }

    if ("usageSituationCondition" in item) {
      let usageSituationCondition = item.usageSituationCondition * 1
      if (usageSituationCondition < 0 || usageSituationCondition > 1) {
        usageSituationCondition = 0
      }
      that.updateUsageSituationConditionFilteredResult(usageSituationCondition)
    }

    if ("statisticsCondition" in item) {
      let statisticsCondition = item.statisticsCondition * 1
      if (statisticsCondition < 0 || statisticsCondition > 2) {
        statisticsCondition = 0
      }
      that.updateStatisticsFilteredResult(statisticsCondition)
    }
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
    var that = this
    let hasFilterConditionsChanged = that.data.hasFilterConditionsChanged
    if (hasFilterConditionsChanged) {
      console.log("hasFilterConditionsChanged")

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
})