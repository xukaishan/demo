// pages/Statistics/Statistics.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stars: 0,
    tab: 0,
    tabs: 0,
    commodityList: 5,
    statistics: null,
    statisticsList: null,
    share: null,
    topBack: false,
    btnNum: 1,
    showBtn: false,
    dateDays: {},
    dateDays1: {},
    timeText: "近一周分享",
    timetxt: "近一周分享次数",
    bottomTxt: '往下滑，查看更多~',
    slectShow: false,
    tabClick: 0,
    tabday: "当天",
    days: ["当天", "近一周", "近一月"],
    num: null,
    statNum: 1,
    pageNum: null, //当前列表页数
    px: "DESC",
    imgheadurl: app.globalData.url,
    isLogined: false,
  },

  /**
   * 点击展示星标
   */
  openStars: function(e) {
    console.info(e);

    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    var that = this;
    var star = e.target.dataset.customer;
    console.info(e.target.dataset.customer);
    if (star == 0) {
      star = 1
    } else {
      star = 0
    }
    app.sendAjax({
      url: 'customer/like',
      data: {
        "customerId": e.target.dataset.customerid,
        "like": star,
        "shoppingGuideId": shoppingGuideId
      },
      success: function(res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) + '点击展示星标')
          that.setData({
            statisticsList: [],
          })
          that.statisticsList(that.data.dateDays1.startDay, that.data.dateDays1.endDay);
        } else {
          console.log('点击展示星标失败')
        }
      },
      fail: function(res) {}
    })
    
  },
  /**
   * 打开编辑标签页面
   */
  openLabel: function(e) {
    wx.navigateTo({
      url: '/pages/editLabel/editLabel?id=' + e.target.dataset.customer,
    })
  },
  /**
   * 顾客统计下拉选择时间
   */
  slectShows: function() {
    var that = this;
    if (that.data.slectShow == true) {
      that.setData({
        slectShow: false
      })
    } else {
      that.setData({
        slectShow: true
      })
    }
  },
  /**
   * 顾客下拉选择
   */
  tabClick: function(e) {
    var that = this;
    if (that.data.tabClick === e.target.dataset.current) {
      that.setData({
        slectShow: false,
      })
      return false;
    } else {
      var i = that.data.days[e.target.dataset.current]
      that.setData({
        statNum: 1,
        bottomTxt: '往下滑，查看更多~',
        statisticsList: [],
        tabClick: e.target.dataset.current,
        dateDays1: app.days(e.target.dataset.current + 1,true),
        slectShow: false,
        tabday: i
      })
    }
    console.info(that.data.dateDays1)
    this.statisticsList(that.data.dateDays1.startDay, that.data.dateDays1.endDay);
  },
  /**
   * 联系顾客
   */
  contactCustomers: function() {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  /**
   * 二级选择，选择时间展示数据
   */
  clickBtnNum: function(e) {
    var that = this;
    if (this.data.btnNum === e.target.dataset.current) {
      that.setData({
        showBtn: false,
      })
      return false;
    } else {
      if (e.target.dataset.current == 0) {
        that.setData({
          statNum: 1,
          share: [],
          btnNum: e.target.dataset.current,
          dateDays: app.days(e.target.dataset.current + 1),
          showBtn: false,
          timeText: "当日分享",
          timetxt: "今日分享次数"
        })
      } else if (e.target.dataset.current == 1) {
        that.setData({
          statNum: 1,
          share: [],
          btnNum: e.target.dataset.current,
          dateDays: app.days(e.target.dataset.current + 1, true),
          showBtn: false,
          timeText: "近一周分享",
          timetxt: "近一周分享次数"
        })
      } else {
        that.setData({
          statNum: 1,
          share: [],
          btnNum: e.target.dataset.current,
          dateDays: app.days(e.target.dataset.current + 1, true),
          showBtn: false,
          timeText: "近一月分享",
          timetxt: "近一月分享次数"
        })
      }

      this.shareLinks(that.data.dateDays.startDay, that.data.dateDays.endDay);
      this.sharNum(that.data.dateDays.startDay, that.data.dateDays.endDay);
    }
  },
  //第一层选项，链接分享和顾客统计
  clickTab: function(e) {
    var that = this;
    if (e.target.dataset.current == 0) {
      var dataDay = app.days(2,true);
      that.setData({
        share: [],
        dateDays: dataDay,
        topBack: false
      })
      this.shareLinks(that.data.dateDays.startDay, that.data.dateDays.endDay);
    } else {
      var dataDay1 = app.days(1);
      that.setData({
        statisticsList: [],
        topBack: true,
        dateDays1: dataDay1,
      })
      this.statisticsList(that.data.dateDays1.startDay, that.data.dateDays1.endDay);
    }
    if (this.data.tab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        tab: e.target.dataset.current
      })
    }
  },
  //链接分享统计tab选择
  clickTabs: function(e) {
    console.info(e.target.dataset.current);
    var that = this;
    if (this.data.tabs === e.target.dataset.current) {
      if (e.target.dataset.current == '0') {
        if (this.data.showBtn == true) {
          that.setData({
            showBtn: false
          })
        } else {
          that.setData({
            showBtn: true
          })
        }
      } else {
        that.setData({
          tabs: 0,
          statNum: 1,
          bottomTxt: '往下滑，查看更多~',
          share: []
        })
        this.shareLinks(that.data.dateDays.startDay, that.data.dateDays.endDay);
      }
      return false;
    } else {
      if (e.target.dataset.current == 0) {
        that.setData({
          showBtn: true
        })
      } else {
        that.setData({
          showBtn: false,
          statNum: 1,
          bottomTxt: '往下滑，查看更多~',
          share: []
        })
        this.shareLinks(that.data.dateDays.startDay, that.data.dateDays.endDay, that.data.px);
      }
      that.setData({
        tabs: e.target.dataset.current
      })
    }
  }, 

  customerNumber: function () {
    wx.navigateTo({
      url: '/pages/customerNum/customerNum',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 打开今日链接次数页面
   */
  openSharingTimes: function() {
    wx.navigateTo({
      url: '/pages/sharingTimes/sharingTimes',
    })
  },
  /**
   * 打开今日新增页面
   */
  customerAdd: function() {
    wx.navigateTo({
      url: '/pages/addCustomer/addCustomer',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  openPurchase: function(e) {
    wx.navigateTo({
      url: '/pages/purchaseStatistics/purchaseStatistics?id=' + e.target.dataset.current,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 打开顾客详情页面
   */
  customerDetails: function(e) {
    console.info(e.target.dataset.customer);
    wx.navigateTo({
      url: '/pages/customerDetails/customerDetails?id=' + e.target.dataset.customer,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 打开近一周分享统计
   */
  aWeek: function(e) {
    wx.navigateTo({
      url: '/pages/aWeek/aWeek?id=' + e.target.dataset.customer + '&startime=' + this.data.dateDays.startDay + '&endtime=' + this.data.dateDays.endDay + '&txt=' + this.data.timeText+'&sharid='+e.target.dataset.sharid,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 获取分享链接统计
   */
  shareLinks: function(start, end, watch) {
    console.info(start + '开始时间' + end + '结束时间')
    var that = this;
    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    console.info(shoppingGuideId)
    app.sendAjax({
      url: 'share',
      data: {
        "endTime": end, //结束时间
        "page": that.data.statNum, //页数
        "pageSize": 10, //显示几条数据
        "shoppingGuideId": shoppingGuideId, //导购ID
        "watchSort": watch || "",
        "startTime": start //开始时间
      },
      success: function(res) {
        if (res.code == "200") {
          console.log('---------分享统计--------------')
          console.log(JSON.stringify(res) + '获取分享链接统计')
          console.log('---------分享统计--------------')

          var arr = [];
          if (that.data.share) {
            for (var i = 0; i < that.data.share.length; i++) {
              arr.push(that.data.share[i]);
            }
          }
          if (res.data.data) {
            for (var j = 0; j < res.data.data.length; j++) {
              arr.push(res.data.data[j]);
            }
          }
          if (res.data.totalCount <= 10) {
            that.setData({
              bottomTxt: '暂无更多数据加载~'
            })
          }
          that.setData({
            share: arr,
            pageNum: res.data.totalPage
          })
        } else {
          console.log('---------获取分享链接统计失败--------------')
          console.log(JSON.stringify(res))
          console.log('---------获取分享链接统计失败--------------')
        }
      },
      fail: function(res) {
      }
    })
  },
  /**
   * 获取分享链接数据统计
   */
  sharNum: function(start, end) {
    var that = this;
    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    console.info(shoppingGuideId)
    app.sendAjax({
      url: 'share/count',
      data: {
        "endTime": end, //结束时间
        "page": 0, //页数
        "pageSize": 50, //显示几条数据
        "shoppingGuideId": shoppingGuideId, //导购ID
        "startTime": start //开始时间
      },
      success: function(res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) + '获取分享数量');
          that.setData({
            num: res.data
          })
        } else {
          console.log('获取分享数量失败')
        }
      },
      fail: function(res) {}
    })
  },
  /**
   * 获取顾客统计详情
   */
  statistics: function() {
    var that = this;
    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    app.sendAjax({
      url: 'customer/statistics',
      data: {
        "shoppingGuideId": shoppingGuideId
      },
      success: function(res) {
        if (res.code == "200") {
          console.log(res)
          that.setData({
            statistics: res.data
          })
        } else {
          console.log('获取顾客统计详情失败')
        }
      },
      fail: function(res) {}
    })
  },
  /**
   * 获取顾客详情列表
   */
  statisticsList: function(start, end) {
    var that = this;
    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    app.sendAjax({
      url: 'customer/browse',
      data: {
        "dateType": 2,
        "endTime": end,
        "page": that.data.statNum,
        "pageSize": 10,
        "shoppingGuideId": shoppingGuideId,
        "startTime": start
      },
      success: function(res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) + "获取顾客详情列表")
          var arr = [];
          if (that.data.statisticsList) {
            for (var i = 0; i < that.data.statisticsList.length; i++) {
              arr.push(that.data.statisticsList[i])
            }
          }
          if (res.data.data) {
            for (var j = 0; j < res.data.data.length; j++) {
              arr.push(res.data.data[j])
            }
          }
          if (res.data.totalCount <= 10) {
            that.setData({
              bottomTxt: '暂无更多数据加载~'
            })
          }
          that.setData({
            statisticsList: arr,
            pageNum: res.data.totalPage
          })

        } else {
          console.log('获取顾客详情列表失败')
        }
      },
      fail: function(res) {}
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.editTabBar();//添加tabBar数据  
    
    var dataDay = app.days(2, true);
    var that = this;
    that.setData({
      dateDays: dataDay,
    })
    console.info(dataDay.startDay + "--------------" + dataDay.endDay);
    this.statistics();
    this.shareLinks(dataDay.startDay, dataDay.endDay);
    this.sharNum(dataDay.startDay, dataDay.endDay);
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
    let shoppingGuideId = wx.getStorageSync('shoppingGuideId')
    console.log('shoppingGuideId' + shoppingGuideId)
    if (!shoppingGuideId) {
      console.log('not Logined' + shoppingGuideId)
      this.setData({
        isLogined: false,
      })
    }
    else {
      this.setData({
        statisticsList: [],
        isLogined: true,
      })
      this.statisticsList(this.data.dateDays1.startDay, this.data.dateDays1.endDay);
      this.statistics();
    }

  
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
    var that = this;
    if (that.data.topBack == true) {
      console.info(that.data.statNum);
      that.setData({
        statNum: 1,
        bottomTxt: '往下滑，查看更多~',
        statisticsList: []
      })
      this.statisticsList(that.data.dateDays1.startDay, that.data.dateDays1.endDay);
    } else {
      that.setData({
        statNum: 1,
        bottomTxt: '往下滑，查看更多~',
        share: []
      })
      this.shareLinks(that.data.dateDays.startDay, that.data.dateDays.endDay);
    }
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    console.info(that.data.statNum);
    if (that.data.pageNum > that.data.statNum) {
      var i = that.data.statNum + 1;
      that.setData({
        statNum: i,
        bottomTxt: '往下滑，查看更多~'
      })
      if (that.data.topBack == true) {
        console.info(that.data.statNum);
        this.statisticsList(that.data.dateDays1.startDay, that.data.dateDays1.endDay);
      } else {
        this.shareLinks(that.data.dateDays.startDay, that.data.dateDays.endDay);
      }
    } else {
      that.setData({
        bottomTxt: '暂无更多数据加载~'
      })
      return false
    }


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})