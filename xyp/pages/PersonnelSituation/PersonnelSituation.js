// pages/PersonnelSituation/PersonnelSituation.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    expnadedIndex: 0, //展开列
    showCitys: 0,
    isDataCompare:false,// 是否为数据对比（市区终端）
    shouldShowDropMenu: false, //显示城市选择样式
    shouldShowNavMenu: false,
    selectedIndexForNavMenuItem: 0,
    areaInfo: null,
    navigationMenuItems: [],

    dropMenuItems: null,
    agentListResData: null,
    compareResData:null,
    sortMethods: [] //每个数据项排序方式记录
  },

  //数据排序
  sortData: function (e) {
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
      opntion = 'shoppingGuides'
    } else if (index == 2) {
      opntion = 'terminals'
    }
    that.doSortData(that.data.agentListResData, opntion, sort)
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
      that.setData({
        agentListResData:sortData
      })
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

  navItemTap(e) {
    var that = this;
    let dataset = e.currentTarget.dataset
    let item = dataset.item

    that.setData({
      shouldShowDropMenu: (!that.data.shouldShowDropMenu),
    })
  },

  navItemArrowTap(e) {
    console.log("navItemArrowTap")
    var that = this;
    that.navItemTap(e)
  },

  //点击
  menuItemTap(e) {
    var that = this;
    let dataset = e.currentTarget.dataset
    let selectedItem = dataset.item
    let selectedIndex = dataset.idx
    var originalItem = null
    var dropMenuItems = that.data.dropMenuItems

    originalItem = 'dropMenuItems[' + selectedIndex + ']'
    selectedItem.selected = !selectedItem.selected;

    that.setData({
      [originalItem]: selectedItem, //更新模型层
      dropMenuItems: dropMenuItems, //更新显示层
    })

    console.log("dropMenuItems = " + JSON.stringify(that.data.dropMenuItems))
  },

  dropMenuBgTap(e) {
    let that = this;
    that.setData({
      shouldShowDropMenu: false
    })
  },

  /**
   * 下拉展示列表
   */
  expnadedCollapsedTap(e) {
    var that = this;
    let dataset = e.currentTarget.dataset
    let selectedIndex = dataset.idx
    let expnadedIndex = (that.data.expnadedIndex == selectedIndex) ? -1 : selectedIndex

    that.setData({
      expnadedIndex: expnadedIndex
    })
  },

  cellTap(e) {
    var that = this
    let dataset = e.currentTarget.dataset
    let selectedIndex = dataset.idx
    let item = dataset.item

    console.log("\n\n\n selected item = " + JSON.stringify(item) + "\n\n\n")

    //dataType 0 - 管理员 dataType - 1代理商 dataType -1
    if (selectedIndex == 0) {

      let isDataCompare = that.data.isDataCompare
      let url = isDataCompare ? '/pages/PersonnelSituation/PersonnelSituation?item=' : '/pages/personnelEcharts/personnelEcharts?item='
      wx.navigateTo({
        url: url + JSON.stringify(item),
      })
    } else {
      if (item.dataType == 5) {
        wx.navigateTo({
          url: '/pages/PersonnelDetails/PersonnelDetails?item=' + JSON.stringify(item),
        })
      } else {
        wx.navigateTo({
          url: '/pages/PersonnelSituation/PersonnelSituation?item=' + JSON.stringify(item),
        })
      }
    }
  },



  /**
   * 显示地址选择
   */
  showDropMenuTap() {
    var that = this;

    that.setData({
      shouldShowDropMenu: (that.data.shouldShowDropMenu == false) ? true : false
    })
  },

  connectSelectedInfoWithItems: function(items) {
    if (items == null || items.length == 0) {
      return [
        [], ""
      ]
    }
    
    var selectedItemIds = []
    var selectedItemTerminalIds = []
    var selectedItemNames = ''

    items.forEach(function(item) {
      if (item.selected == true) {
        selectedItemIds.push(item.areaId)
        selectedItemTerminalIds.push(item.terminalId)
        if (item.dataType == 2) {
          selectedItemNames += item.terminalName + ','
        } else {
          selectedItemNames += item.areaName + ','
        }
      }
    })
    let length = selectedItemNames.length
    selectedItemNames = selectedItemNames.slice(0, length - 1)

    return [selectedItemIds, selectedItemNames, selectedItemTerminalIds]
  },

  /**
   * 确认选择
   */
  sureTap(e) {
    var that = this;
    let info = that.connectSelectedInfoWithItems(that.data.dropMenuItems)
    let selectedItemsIds = []
    let selectedItemNames = ''
    let selectedItemTerminalIds = []

    console.log("\n\n\n info" + JSON.stringify(info) + "\n\n\n")

    selectedItemsIds = info[0]
    selectedItemNames += info[1]
    selectedItemTerminalIds = info[2]

    if (selectedItemNames.length > 0) {
      let index = that.data.selectedIndexForNavMenuItem;
      let previousSelectedItemNames = 'navigationMenuItems[' + index + '].areaName'
      let previousSelectedItemIds = 'navigationMenuItems[' + index + '].areaId'

      that.setData({
        [previousSelectedItemNames]: selectedItemNames,
        [previousSelectedItemIds]: selectedItemsIds,
      })

      that.updateNavigationMenuItems()

      var areaInfo = that.data.dropMenuItems[0]
      let areaInfo1=that.data.areaInfo
      let areaLevel = areaInfo.areaLevel

      console.log("\n\n\nareaLevel requestPeopleCompare" + areaLevel)

      if (areaLevel != null && areaInfo.areaLevel < 4) {
        //areaID, TeminalID,areaLevel
        console.log("inside  TeminalID requestPeopleCompare")
        that.requestPeopleCompare(selectedItemsIds, [], areaInfo1.agentId)
      }
      else {
        console.log(" outside TeminalID requestPeopleCompare")
        //areaID, TeminalID,areaLevel
        that.requestPeopleCompare([], selectedItemTerminalIds, areaInfo1.agentId)
      }
    }

    that.setData({
      shouldShowDropMenu: false
    })
  },

  resetItems(items) {
    var that = this;

    if (items == null || items.length == 0) {
      console("\n\n\n items can not be null or empty")
      return
    }
  
    for (var index in items) {
      var item = items[index]
      if (item.selected == true) {
        let originalItem = "dropMenuItems" + '[' + index + ']'
        item.selected = false

        that.setData({
          [originalItem]: item,
        })
      }
    }

    let areaItem = items[0]
    let areaLevel = areaItem.areaLevel
    console.log("areaLevel" + areaLevel)
    if (areaLevel == null) {
      areaLevel = 4
    }

    that.updateNavigationMenuItems(areaLevel-1)
  },

  resetTap(e) {
    var that = this;

    that.setData({
      navigationMenuItems: [],
      isDataCompare: false,
      shouldShowDropMenu: false
    })

    that.resetItems(that.data.dropMenuItems)
    that.updateNavigationMenuItems()
    // that.requestPeopleInfo()
  },

  getDefaultNavigationMenuItem(areaName, defaultName) {
    var that = this
    let length = that.data.navigationMenuItems.length
    let item = that.data.navigationMenuItems[length - 1]
    var addItem = null
    if (item == null || item.areaName != defaultName) {
      addItem = {
        "selected": false,
        "areaName": areaName,
        "areaId": [],
      }
    }
    return addItem
  },

  updateNavigationMenuItems(areaLevel) {
    var that = this
    var addItem = null
    console.log("\n\n\n" + areaLevel + "areaLevel" + "\n\n\n")
    switch (areaLevel) {
      case 0:
        {
          addItem = that.getDefaultNavigationMenuItem("选择省", "")
        }
        break;

      case 1:
        {
          addItem = that.getDefaultNavigationMenuItem("选择市", "")
        }
        break;

      case 2:
        {
          addItem = that.getDefaultNavigationMenuItem("选择区", "")
        }
        break;

      case 3:
        {
          addItem = that.getDefaultNavigationMenuItem("选择终端", "")
        }
        break;

      default:
        break;
    }

    if (addItem) {
      var navigationMenuItems = that.data.navigationMenuItems
      navigationMenuItems.push(addItem)
      that.setData({
        navigationMenuItems: navigationMenuItems
      })
    }
  },


  /**
   * 打开全国
   */
  openPersonnelEcharts() {
    wx.navigateTo({
      url: '/pages/personnelEcharts/personnelEcharts',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
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

    //如果区域ID = 代理商ID areaId传null
    //当前页面为代理商数据
    if (areaId == agentId) {
      areaId = null
    }

    app.sendAjax({
      url: 'rest/st/peopleInfo',
      data: {
        "agentId": agentId,
        "areaId": areaId,
        "dataType": dataType
      },
      success: function(res) {
        console.log("\n\n\n 查询情况成功 = \n" + JSON.stringify(res) + "\n\n\n");
        if (res.respCode == "0") {
          that.setData({
            agentListResData: null,
          })
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

  requestAgentList: function() {
    var that = this;
    app.sendAjax({
      url: 'rest/st/peopleInfo/agentList',
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
          that.requestPeopleInfo()

        } else {
          console.log('查询失败')
        }
      },
      fail: function (res) { }
    })
  },

  requestAgentInfo: function () {
    var that = this;
    app.sendAjax({
      url: 'rest/agenterAgent/' + app.getMobilePhoneNum(),
      method:"GET",
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
          that.requestPeopleInfo()

        } else {
          console.log('查询失败')
        }
      },
      fail: function (res) { }
    })
  },

  //获取区域数据 areaId为区域ID 
  //区域层级areaLevel 0 - 省级 1 - 市级 2 - 区级 3 - 终端
  requestAreaInfo: function(areaId, areaLevel,agentId) {
    var that = this
    if (areaId == null) {
      console.log("\n\n\n items can not be null or empty")
    }
    if (areaLevel < 0 || areaLevel > 5) {
      console.log("\n\n\n items can not be null or empty")
    }

    app.sendAjax({
      url: '/rest/st/peopleInfo/region',
      data: {
        "areaId": areaId,
        "areaLevel": areaLevel,
        "agentId":agentId
      },
      success: function(res) {
        console.log(JSON.stringify(res))

        if (res.respCode == "0") {
          var items = res.data;
          if (items == null) {
            items = []
          }
          items.forEach(function(item, index) {
            item.selected = false //新增selected标记选择状态
          })

          that.setData({
            dropMenuItems: items
          })

          console.log("\n\n\n dropMenuItems = " + JSON.stringify(that.data.dropMenuItems) + "\n\n\n")

        } else {

        }
      },
      fail: function(res) {}
    })
  },

  requestPeopleCompare: function (areaId, terminalId, agentId) {
    var that = this;
    if (areaId == null) {
      areaId = []
    }
    if (terminalId == null) {
      terminalId = []
    }
    if (agentId == null) {
      agentId = 0
    }

    if (!areaId || areaId.length == 0) {
      console.log("areaId array can not be undefine or null or empty")
    }

    app.sendAjax({
      url: 'rest/st/peopleInfo/compare',
      data: {
        "areaId": areaId,
        "terminalId": terminalId,
        "agentId": agentId,
      },
      success: function(res) {
        console.log("\n\n\n compare compare " + JSON.stringify(res) + "\n\n\n");
        if (res.respCode == "0") {
          console.info(JSON.stringify(res.data) + '查询情况成功')
          that.setData({
            // agentListResData: res.data
            expnadedIndex:-1,
            isDataCompare:true,
            compareResData: res.data
          })
        } else {
          wx.showToast({
            title: '获取对比数据失败，请稍后尝试',
            icon: 'none',
          })
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
    if ("item" in options) {
      console.log("options = " + JSON.stringify(JSON.parse(options.item)))

      let item = JSON.parse(options.item)
      let shouldShowNavMenu = item.areaLevel < 1 ? false : true
      console.log("options item.areaLevel = " + item.areaLevel)

      that.setData({
        areaInfo: item,
        shouldShowNavMenu: shouldShowNavMenu
      })

      let areaLevel = item.areaLevel * 1
      let areaId = item.areaId
      let agentId = item.agentId

      //导航栏Item
      that.updateNavigationMenuItems(areaLevel)
      //获取区域列表
      that.requestAreaInfo([areaId], areaLevel,agentId)
      //获取区域人员情况
      that.requestPeopleInfo()
    } else {
      
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
            that.requestAgentList()
          }
          break;

        default:
          break;
      }
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