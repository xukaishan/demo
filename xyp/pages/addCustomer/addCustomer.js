// pages/addCustomer/addCustomer.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankingList:15,
    commodityList: null,
    tab: 0,
    tabs:1,
    dateDays:null,
    statNum: 1,
    bottomTxt: '往下滑，查看更多~',
    pageNum: null,//当前列表页数
    slectDown:false,
    today:"今日",
    dayIcon:true,
    showRank:true,
    notice:null,
    myRanking:null,
    activityType:null
  },
  /**
   * 点击展示星标
   */
  openStars: function (e) {
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
      success: function (res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) + '点击展示星标')
          that.setData({
            commodityList: [],
          })
          that.addCustomer(that.data.dateDays.startDay, that.data.dateDays.endDay);
        } else {
          console.log('点击展示星标失败')
        }
      },
      fail: function (res) { }
    })

  },
  /**
   * 打开编辑标签页面
   */
  openLabel: function (e) {
    wx.navigateTo({
      url: '/pages/editLabel/editLabel?id=' + e.target.dataset.customer,
    })
  },
  /**
   * 条件筛选
   */
  clickTab: function (e) {
    var that = this;
    var obj = ['今日', '本周', '本月']
      that.setData({
        statNum: 1,
        bottomTxt: '往下滑，查看更多~',
        commodityList: [],
        slectDown: false,
        today: obj[e.target.dataset.currents],
        dateDays: app.days(parseInt(e.target.dataset.currents)+1)
      })
      this.addCustomer(that.data.dateDays.startDay, that.data.dateDays.endDay);
  },
  /**
   * 条件筛选一级
   */
  clickTabs: function (e) {
    var that = this;
    if (this.data.tabs === e.target.dataset.current) {
      // if (e.target.dataset.current == 0 &&that.data.slectDown==false){
      //   that.setData({
      //     slectDown: true
      //   })
      // }else{
      //   that.setData({
      //     slectDown: false
      //   })
      // }
      return false;
    } else {
      that.setData({
        statNum: 1,
        commodityList: [],
      })
      if (e.target.dataset.current==1){
        console.info(e.target.dataset.current)
        that.setData({
          slectDown: true,
          showRank: true,
          dayIcon:true,
          commodityList: [],
          dateDays: app.days(parseInt(e.target.dataset.current), true)
        })
        that.addCustomer(that.data.dateDays.startDay, that.data.dateDays.endDay);
      } else if (e.target.dataset.current == 2){
        that.setData({
          slectDown: false,
          dayIcon: false,
          showRank:true,
          dateDays: app.days(parseInt(e.target.dataset.current), true)
        })
        that.addCustomer(that.data.dateDays.startDay, that.data.dateDays.endDay);
      } else if (e.target.dataset.current == 3){
        that.setData({
          slectDown: false,
          dayIcon: false,
          showRank: true,
          dateDays: app.days(parseInt(e.target.dataset.current), true)
        })
        that.addCustomer(that.data.dateDays.startDay, that.data.dateDays.endDay);
      }
      else{
        that.setData({
          slectDown: false,
          dayIcon: false,
          showRank:false
        })
      }
      that.setData({
        tabs: e.target.dataset.current,
      })
    }
  },
  /**
   * 获取新增统计数据
   */
  addCustomer: function (start, end){
    var that = this;
    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    app.sendAjax({
      url: 'customer/browse/info',
      data: {
        "endTime": end,
        // "labelType": "1",
        "page": that.data.statNum,
        "pageSize": 10,
        "shoppingGuideId": shoppingGuideId,
        "startTime": start
      },
      success: function (res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) +'获取新增统计数据');
          that.setData({
            commodityList: [],
          })
          var arr = [];
          if (that.data.commodityList) {
            for (var i = 0; i < that.data.commodityList.length; i++) {
              arr.push(that.data.commodityList[i]);
            }
          }
          if (res.data.data) {
            for (var j = 0; j < res.data.data.length; j++) {
              arr.push(res.data.data[j]);
            }
          }
          that.setData({
            commodityList: arr,
            pageNum: res.data.totalPage
          })
          if (res.data.totalCount <= 10) {
            that.setData({
              bottomTxt: '暂无更多数据加载~'
            })
          }
        } else {
          console.log('获取新增统计数据失败');
        }
      },
      fail: function (res) {}
    })
  },
  /**
  * 打开顾客详情页面
  */
  customerDetails: function (e) {
    console.info(e.target.dataset.customer);
    wx.navigateTo({
      url: '/pages/customerDetails/customerDetails?id=' + e.target.dataset.customer,
      success: function (res) {
        console.info(res)
      },
      fail: function (res) {
        console.info(res)
      },
      complete: function (res) {
        console.info(res)
      },
    })
  },
  /**
 * 获取当前用户的信息
 */
  userInfo: function () {
    var that = this;
    app.sendAjax({
      url: 'guide/auth/info',
      data: {
        "mobilePhoneNum": app.getMobilePhoneNum()
      },
      success: function (res) {
        console.log(JSON.stringify(res.data.terminal.shopLevel));
        that.setData({
          activityType: res.data.terminal.shopLevel
        })
        that.rankingStatistics();
      },
      fail: function (res) {

      }
    })
  },
  /**
   * 全国统计排名数据
   */
  rankingStatistics:function(){
    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    console.info(shoppingGuideId);
    var that = this;
    app.sendAjax({
      url: 'customer/statistics/whole',
      data: {
        "shoppingGuideId": shoppingGuideId,
        "shopLevel": that.data.activityType
      },
      success: function (res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) + '全国统计排名数据');
          that.setData({
            notice: res.data.notice,
            rankingList: res.data.statistics,
            myRanking:res.data,
            // shopLevel: //门店等级
          })
        } else {
          wx.showToast({
            title: '获取数据失败，请重试',
            icon:'none'
          })
          console.log('全国统计排名失败');
        }
      },
      fail: function (res) { }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var dataDay = app.days(1);
    var that = this;
    that.setData({
      dateDays: dataDay,
    })
    console.log(dataDay);
    that.addCustomer(dataDay.startDay, dataDay.endDay);
    that.userInfo();
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
    this.setData({
      commodityList: [],
      statNum:1
    })
    this.addCustomer(this.data.dateDays.startDay, this.data.dateDays.endDay);
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
    var that = this;
    console.info(that.data.statNum);
    if (that.data.pageNum > that.data.statNum) {
      var i = that.data.statNum + 1;
      that.setData({
        statNum: i,
        bottomTxt: '往下滑，查看更多~'
      })
      this.addCustomer(that.data.dateDays.startDay, that.data.dateDays.endDay);
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
  onShareAppMessage: function () {

  }
})