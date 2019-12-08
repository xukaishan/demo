// pages/customerDetails/customerDetails.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 0,
    tab1:0,
    commodityList: 5,
    showUser:0,
    customerId:null,
    showUserInfo:null,
    browseHistory:null,
    userTrajectory:null,
    dateDays:{},
    showLable:false,
    topBack: false,
    lableData: null,//标签
    statNum: 1,
    searchStart: null, //筛选开始时间
    searchEnd: null, //筛选结束时间
    bottomTxt: '往下滑，查看更多~',
    imgheadurl: app.globalData.url,
    pageNum: null//当前列表页数
  },
  /**
     * 获取当前时间
     */
  currentTime: function () {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    console.info(currentdate);
    return currentdate;
  },
  /**
    * 日期选择
    */
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail);
    this.setData({
      searchStart: e.detail.value
    })
  },
  bindDateChangeEnd: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail);
    this.setData({
      searchEnd: e.detail.value
    })
  },
  /**按照时间筛选搜索 */
  screenTime:function(){
    var that=this;
    var obj={
      startDay:'',
      endDay:''
    }
    obj.startDay=that.data.searchStart+' 00:00:00';
    obj.endDay=that.data.searchEnd+' 23:59:59';
    that.setData({
      dateDays: obj,
      userTrajectory: [],
      browseHistory:[],
      statNum: 1
    })
    console.info(that.data.dateDays);
    console.info(that.data.topBack);
    if (!that.data.topBack) {
      this.userTrajectory(this.data.customerId, this.data.dateDays.startDay, this.data.dateDays.endDay);
    } else {
      this.browseHistory(this.data.customerId, this.data.dateDays.startDay, this.data.dateDays.endDay);
    }
  },
  //第一层tab选项
  clickTab: function (e) {
    var that = this;
    if (this.data.tab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        tab: e.target.dataset.current,
        showUser: e.target.dataset.current,
        tab1:0,
        statNum: 1,
        browseHistory:null,
        userTrajectory:null,
        dateDays: app.days(1),
      })
      if (e.target.dataset.current == 0){
        that.setData({
          topBack: false,
        })
        this.userTrajectory(this.data.customerId, this.data.dateDays.startDay, this.data.dateDays.endDay);
      }else{
        that.setData({
          topBack: true,
        })
        this.browseHistory(this.data.customerId, this.data.dateDays.startDay, this.data.dateDays.endDay);
      }
    }
    console.info(that.data.topBack);
  },
  //第二层选项
  clickTab1: function (e) {
    var that = this;
    if (this.data.tab1 === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        statNum: 1,
        browseHistory: null,
        userTrajectory: null,
        tab1: e.target.dataset.current,
        dateDays: app.days(parseInt(e.target.dataset.current)+1,true),
      })
    }
    if (that.data.tab==0){
      this.userTrajectory(this.data.customerId, this.data.dateDays.startDay, this.data.dateDays.endDay);
    }else{
      this.browseHistory(this.data.customerId, this.data.dateDays.startDay, this.data.dateDays.endDay);
    }
  },
  /**
   * 获取标签
   */
  // getTags:function(){
  //   var that = this;
  //   app.sendAjax({
  //     url: 'tags/customer',
  //     data: {
  //     },
  //     success: function (res) {
  //       console.log(res);
  //       if (res.code == "200") {
  //         console.info(JSON.stringify(res.data) + '获取标签')
  //         that.setData({
  //           lableData: res.data
  //         })
  //       } else {
  //         console.log('获取标签失败')
  //       }
  //     },
  //     fail: function (res) { }
  //   })
  // },
  /**
   * 点击打开标签
   */
  openLable:function(){
    wx.navigateTo({
      url: '/pages/editLabel/editLabel?id=' + this.data.showUserInfo.customerId,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    // this.setData({
    //   showLable: true
    // })
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
          that.showUserInfo(that.data.customerId);
        } else {
          console.log('点击展示星标失败')
        }
      },
      fail: function (res) { }
    })

  },
  /**
   * 点击关闭标签
   */
  closeLable: function () {
    this.setData({
      showLable: false
    })
  },
  /**
   * 查询顾客详情
   */
  showUserInfo:function(id){
    console.log(id);//为空
    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    var that = this;
    app.sendAjax({
      url: 'customer/detail',
      data: {
        "customerOpenId": id,
        "shoppingGuideId": shoppingGuideId
      },
      success: function (res) {
        console.log(res);
        if (res.code == "200") {
          console.info(JSON.stringify(res.data) +'查询顾客详情')
          that.setData({
            showUserInfo: res.data
          })
        } else {
          console.log('查询顾客详情失败')
        }
      },
      fail: function (res) { }
    })
  },
  /**
   * 查询历史链接
   */
  browseHistory: function (id,start,end){
    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    var that = this;
    app.sendAjax({
      url: 'customer/browseHistory',
      data: {
        "customerOpenId": id,
        "endTime": end,
        "page": that.data.statNum,
        "pageSize": 10,
        "shoppingGuideId": shoppingGuideId,
        "startTime": start
      },
      success: function (res) {
        if (res.code == "200") {
          console.info(JSON.stringify(res.data) + '查询历史链接')
          var arr = [];
          if (that.data.browseHistory) {
            for (var i = 0; i < that.data.browseHistory.length; i++) {
              arr.push(that.data.browseHistory[i]);
            }
          }
          if (res.data.data) {
            for (var j = 0; j < res.data.data.length; j++) {
              arr.push(res.data.data[j]);
            }
          }
          that.setData({
            browseHistory: arr,
            pageNum: res.data.totalPage
          })
          if (res.data.totalCount <= 10) {
            that.setData({
              bottomTxt: '暂无更多数据加载~'
            })
          }
        } else {
          console.log('查询历史链接失败');
          console.log(res)
        }
      },
      fail: function (res) { }
    })
  },
 
  /**
   * 用户轨迹查询
   */
  userTrajectory: function (id, start, end){
    console.log(id);
    console.log(wx.getStorageSync('shoppingGuideId'));
    var that = this;
    app.sendAjax({
      url: 'customer/track',
      data: {
        "customerOpenId": id,
        "endTime": end,
        "page": that.data.statNum,
        "pageSize": 10,
        "shoppingGuideId": wx.getStorageSync('shoppingGuideId'),
        "startTime": start
      },
      success: function (res) {
        if (res.code == "200") {
          console.info(JSON.stringify(res.data) + '用户轨迹查询')
          var arr = [];
          if (that.data.userTrajectory) {
            for (var i = 0; i < that.data.userTrajectory.length; i++) {
              arr.push(that.data.userTrajectory[i]);
            }
          }
          if (res.data.data) {
            for (var j = 0; j < res.data.data.length; j++) {
              arr.push(res.data.data[j]);
            }
          }
          that.setData({
            userTrajectory: arr,
            pageNum: res.data.totalPage
          })
          if (res.data.totalCount <= 10) {
            that.setData({
              bottomTxt: '暂无更多数据加载~'
            })
          }
        } else {
          console.log('用户轨迹查询失败')
        }
      },
      fail: function (res) {}
    })
  },
  /**
  * 点击进入子链接详情
  */
  openUserDetails: function (e) {
    console.info(e);
    wx.navigateTo({
      url: '/pages/userBrowseDetails/userBrowseDetails?userId='+this.data.customerId+'&shopId='+e.target.dataset.shopid+'&titel='+e.target.dataset.titel,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var dataDay=app.days(1);
    var that=this;
    that.setData({
      customerId: options.id,
      dateDays: dataDay,
      searchStart: that.currentTime(),
      searchEnd: that.currentTime(),
    })
    console.info(dataDay.startDay + "--------------" + dataDay.endDay);
    that.showUserInfo(that.data.customerId);
    that.userTrajectory(that.data.customerId, dataDay.startDay, dataDay.endDay);
    // that.getTags();
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
    this.showUserInfo(this.data.customerId);
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
    console.info("上拉加载了")
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
        this.browseHistory(this.data.customerId, this.data.dateDays.startDay, this.data.dateDays.endDay);
      } else {
        this.userTrajectory(this.data.customerId, this.data.dateDays.startDay, this.data.dateDays.endDay);
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
  onShareAppMessage: function () {

  }
})