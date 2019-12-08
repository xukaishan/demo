// pages/Situation/Situation.js
const app = getApp();
const util = require('../../utils/util.js')
const moment = require('../../utils/moment.js')
const defaultDateStatisticsTimestamp = 180 * 24 * 60 * 60 * 1000
const beginTimeString = "2019-06-01 00:00:00"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    areaInfo: null,
    showFilterDropMenu: false, //显示注册/未注册筛选条件

    registrationStatus: 0, //0 已注册 1未注册
    registrationStatusFilteredResult: "已注册",

    currentDateStartString: null,
    currentDateEndString: null,

    shoudShowTerminalDetail: false, //是否为终端详情

    guideResData: null,

    hasFilterConditionsChanged: false, //记录筛选条件是否变化，以便返回上一页面刷新界面

    registerInfoData: [],

    unregisterInfoData: [],

    sortMethods: [] //每个数据项排序方式记录
  },

  //数据排序
  sortData: function (e) {
    let that = this
    app.showLoading();
    let dataset = e.currentTarget.dataset
    let index = parseInt(dataset.option);
    let option = ''
    let sort = that.data.sortMethods[index - 1];
    //排序更改
    if ('asc' == sort) {
      that.data.sortMethods[index - 1] = 'desc';
    } else {
      that.data.sortMethods[index - 1] = 'asc';
    }
    if (index == 1) {
      option = 'registerRate'
    } else if (index == 2) {
      option = 'registerTerminals'
    } else if (index == 3) {
      option = 'registerNum'
    } else if (index == 4) {
      option = 'unregisterRate'
    }else if (index == 5) {
      option = 'unregisterTerminals'
    }
    that.doSortData(that.data.registerInfoResData, option, sort)
    that.setData({
      sortMethods: that.data.sortMethods
    })
    app.hideLoading();
  },

  doSortData: function (data, option, sort) {
    let that = this
    if (data.length > 2) {
      let tempData = []
      let sortData = []
      data.forEach(function (val) {
        if (data[0].id != val.id) {
          tempData.push(val)
        }
      })
      //排序操作
      tempData.sort(function (x, y) {
        //升序
        if ("asc" == sort) {
          return (x[option] * 100) - (y[option] * 100)
        } else if ("desc" == sort) {
          //降序
          return (y[option] * 100) - (x[option] * 100)
        }
      })
      sortData.push(data[0])
      tempData.forEach(function (val) {
        sortData.push(val);
      })
      that.splitRegisterInfoData(sortData)
    }
  },

  //初始化排序方式
  initSortMethod: function (size) {
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
   * 显示转发情况下拉
   */
  openForward() {
    let that = this;
    let showFilterDropMenu = !that.data.showFilterDropMenu
    that.setData({
      showFilterDropMenu: showFilterDropMenu
    })
  },

  registrationStatusTap: function (e) {
    var that = this
    let dataset = e.currentTarget.dataset
    let tag = dataset.tag * 1

    let registerInfoResData = []

    if (tag == 0) {
      registerInfoResData = that.data.registerInfoData
      that.setData({
        registerInfoResData: that.data.registerInfoData
      })
    } else if (tag == 1) {
      registerInfoResData = that.data.unregisterInfoData
      that.setData({
        registerInfoResData: that.data.unregisterInfoData
      })
    }

    if (registerInfoResData == null) {
      that.requestRegisterInfo()
    }

    that.setData({
      showFilterDropMenu: false,
    })

    //通知当前页面，以及上级、及其栈中开启监听的页面筛选条件已经变化
    //从而更新相关数据
    let item = {
      currentPage: that,
      registrationStatus: tag,
    }
    let userInfo = {
      item: item
    }
    app.notice.post('RegistrationStatusChangedNotification', {
      userInfo
    })
  },

  updateRegistrationStatusFilteredResult: function (registrationStatus) {
    var that = this
    var registrationStatusFilteredResult = "已注册"
    switch (registrationStatus) {
      case 0:
        { }
        break;

      case 1:
        {
          registrationStatusFilteredResult = "未注册"
        }
        break;

      default:
        break;
    }

    that.setData({
      registrationStatus: registrationStatus,
      registrationStatusFilteredResult: registrationStatusFilteredResult,
    })
  },

  bindDateChange: function (e) {
    var that = this
    let dataset = e.currentTarget.dataset
    let tag = dataset.tag * 1
    var item = null

    switch (tag) {
      case 0:
        { //当前开始时间
          item = {
            currentDateStartString: e.detail.value,
          }
        }
        break;

      case 1:
        { //当前结束时间
          item = {
            currentDateEndString: e.detail.value,
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
      app.notice.post('RegistrationStatusChangedNotification', {
        userInfo
      })

      that.requestRegisterInfo()
    }
  },

  dateFormatString() {
    return "YYYY-mm-dd"
  },

  /**
   * 更新日期
   */
  updateDate() {
    var that = this
    // var currentDateStart = new Date(moment(that.data.currentDateStartString, moment.ISO_8601))
    var currentDateStart = new Date(moment(that.data.currentDateStartString, moment.ISO_8601))
    if (!that.data.currentDateStartString) {
      // currentDateStart = util.dateEarlierFromCurrent(defaultDateStatisticsTimestamp)
      var currentDateStart = new Date(moment(beginTimeString, moment.ISO_8601))
    }

    var currentDateEnd = new Date(moment(that.data.currentDateEndString, moment.ISO_8601))
    if (!that.data.currentDateEndString) {
      currentDateEnd = new Date()
    }
    let currentDateStartString = util.dateFormat(that.dateFormatString(), currentDateStart)
    let currentDateEndString = util.dateFormat(that.dateFormatString(), currentDateEnd)

    that.setData({
      currentDateStartString: currentDateStartString,
      currentDateEndString: currentDateEndString,
    })
  },

  requestRegisterInfo: function () {
    
    var that = this
    var agentId = ""
    let id = []
    let areaInfo = that.data.areaInfo

    if (areaInfo != null) {
      agentId = areaInfo.agentId
    }
    if (areaInfo.id != null) {
      id.push(areaInfo.id)
    }
    let dataType = areaInfo.dataType
    if (dataType == null) {
      dataType = 1
    }

    let startTime = that.data.currentDateStartString
    let endTime = that.data.currentDateEndString
    let mobilePhoneNum = app.getMobilePhoneNum()

    //验证参数合法性
    if (!startTime) {
      console.log("startTime can not be undefine or null or empty")
    }
    if (!endTime) {
      console.log("endTime can not be undefine or null or empty")
    }

    app.sendAjax({
      url: 'rest/st/registerInfo',
      data: {
        "dataType": dataType,
        "agentId": agentId,
        "startTime": startTime,
        "endTime": endTime,
        "id": id
      },
      success: function (res) {
        console.log(JSON.stringify(res))
        that.splitRegisterInfoData(res.data);
      },
      fail: function (res) { }
    })
  },

  //数据加工
  splitRegisterInfoData: function (data) {
    if (data.length == 0) {
      return
    }

    var that = this
    that.setData({
      registerInfoResData: null,
    })
    
    //终端数据
    if (data[1].dataType ==2) { 
      let registerInfoData = []
      let unregisterInfoData = []

      registerInfoData.push(data[0])
      unregisterInfoData.push(data[0])

      for (var i = 1; i < data.length; i++) {
        if (data[i].registerNum > 0) {
          registerInfoData.push(data[i])
        } else {
          unregisterInfoData.push(data[i])
        }

        let registrationStatus = that.data.registrationStatus
        let registerInfoResData = (registrationStatus == 0) ? registerInfoData : unregisterInfoData

        that.setData({
          registerInfoData: registerInfoData,
          unregisterInfoData: unregisterInfoData,
          registerInfoResData: registerInfoResData,
        })

        wx.showLoading()
        //延时0.7秒，等待进度圆绘制图片完成
        let duration = 0.7
        let timer = setTimeout(function () {
          wx.hideLoading()
          clearInterval(timer)
        }, duration) 

      }
    } else {
      that.setData({
        registerInfoData: data,
        unregisterInfoData: data,
        registerInfoResData: data,
      })
    }

  },


  //获取终端导购列表
  requestTerminalInfo: function () {
    var that = this;
    let terminalId = that.data.areaInfo.id;
    let startTime = that.data.currentDateStartString
    let endTime = that.data.currentDateEndString
    app.sendAjax({
      url: 'rest/terminal/guideList/' + terminalId + '/' + startTime + '/' + endTime,
      data: {},
      success: function (res) {
        console.log("\n\n\n guideList" + JSON.stringify(res) + "\n\n\n");
        if (res.respCode == "0") {
          console.info(JSON.stringify(res.data) + '查询情况成功')
          that.setData({
            shoudShowTerminalDetail: true,
            guideResData: res.data
          })
        } else {
          console.log('查询失败')
        }
      },
      fail: function (res) { }
    })
  },

  handleChange: function (isOpen) { },
  handleSliderLeftStart: function (e) { 
  },

  //侧滑编辑
  handleDelete: function (e) {
    var that = this
    let dataset = e.currentTarget.dataset
    let item = dataset.item;

    wx.navigateTo({
      url: '/pages/modifyState/modifyState?item=' + JSON.stringify(item),
    })
  },

  cellTap(e) {
    var that = this
    let dataset = e.currentTarget.dataset
    let item = dataset.item;
    let index = dataset.index
    if (index == 0) {
      return
    }

    item.registrationStatus = that.data.registrationStatus
    item.currentDateStartString = that.data.currentDateStartString
    item.currentDateEndString = that.data.currentDateEndString

    wx.navigateTo({
      url: '/pages/registrationStatus/registrationStatus?item=' + JSON.stringify(item),
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()

    var that = this;
    that.initSortMethod(5)
    if ("item" in options) {
      var item = JSON.parse(options.item)

      that.updateFilterConditionsWithItem(item)

      that.setData({
        areaInfo: item,
        shoudShowTerminalDetail: item.dataType == 2 ? true : false
      })

      that.updateDate();

      //终端详情
      if (item.dataType == 2) {
        that.requestTerminalInfo()
      } else {
        that.requestRegisterInfo();
      }

      that.registerNotifications()
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this

    that.removeNotifications()
  },

  //注册监听筛选条件变化,需要在onUnload注销通知
  registerNotifications() {
    var that = this
    app.notice.register('RegistrationStatusChangedNotification', that.registrationStatusChanged, that)
  },

  //注销通知
  removeNotifications() {
    var that = this
    app.notice.remove("RegistrationStatusChangedNotification", that.registrationStatusChanged)
  },

  registrationStatusChanged: function (notification) {
    var that = this
    let userInfo = notification.userInfo
    let item = userInfo.item

    that.updateFilterConditionsWithItem(item)

    that.setData({
      hasFilterConditionsChanged: true,
    })
    // console.log("userInfo = " + JSON.stringify(item))
  },

  updateFilterConditionsWithItem: function (item) {
    var that = this
    if ("registrationStatus" in item) {
      let registrationStatus = item.registrationStatus * 1
      if (registrationStatus < 0 || registrationStatus > 1) {
        registrationStatus = 0
      }
      console.log("\n\n\nupdateFilterConditionsWithItem")
      that.updateRegistrationStatusFilteredResult(registrationStatus)
    }

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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    let hasFilterConditionsChanged = that.data.hasFilterConditionsChanged
    if (hasFilterConditionsChanged) {
      console.log("hasFilterConditionsChanged")
      that.setData({
        registerInfoResData: null,
      })
      that.requestRegisterInfo()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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

})