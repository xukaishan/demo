// pages/purchaseStatistics/purchaseStatistics.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    txt: "",
    txtTime: '',
    commodityList: 5,
    showScreen: false,
    optstar: null,
    optend: null,
    show: 2,
    tabTime: 1, //关注时间and浏览时间 
    optid: null,
    userDataList: null,
    stateShowId: null,
    dateDays: null,
    searchStart: null, //筛选开始时间
    searchEnd: null, //筛选结束时间
    screenData: false,
    userTags: [{
        name: "已购买",
        data: false,
        num: 0 //筛选状态
      },
      {
        name: "未购买",
        data: false,
        num: 0 //筛选状态
      }
    ],
    userTags1: [{
        name: "星标用户",
        data: false,
        num: 0 //筛选状态
      },
      {
        name: "微信好友",
        data: false,
        num: 0 //筛选状态
      }
    ],
    userTags2: [{
        name: "星标用户",
        data: false,
        num: 0 //筛选状态
      },
      {
        name: "微信好友",
        data: false,
        num: 0 //筛选状态
      }
    ],
    statNum: 1,
    bottomTxt: '往下滑，查看更多~',
    pageNum: null //当前列表页数
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
   * 获取当前时间
   */
  currentTime: function() {
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
        } else {
          console.log('点击展示星标失败')
        }
      },
      fail: function(res) {}
    })
    that.setData({
      userDataList: [],
    })
    this.userDataList(that.data.optid, that.data.dateDays.startDay, that.data.dateDays.endDay);
  },

  /**
   * 搜索
   */
  search: function(e) {
    console.info(e)
    var that = this;
    that.setData({
      userDataList: [],
    })
    that.userDataList(that.data.optid, that.data.dateDays.startDay, that.data.dateDays.endDay, e.detail.value);
  },
  /**
   * 用户标签多选
   */
  clickTags: function(e) {
    var that = this;
    var index = e.target.dataset.current;

    if (!this.data.userTags[index].data) {
      this.data.userTags[index].data = true;
      this.data.userTags[index].num = 1;
      var tags = this.data.userTags;
      that.setData({
        userTags: tags,
      })
    } else {
      this.data.userTags[index].data = false;
      this.data.userTags[index].num = 0;
      var tags = this.data.userTags;
      that.setData({
        userTags: tags,
      })
    }
    console.info(this.data.userTags);
  },
  clickTags1: function(e) {
    var that = this;
    var index = e.target.dataset.current;
    console.info(this.data.userTags1[index])
    if (!this.data.userTags1[index].data) {
      this.data.userTags1[index].data = true;
      this.data.userTags1[index].num = 1;
      var tags = this.data.userTags1;
      that.setData({
        userTags1: tags,
      })
    } else {
      this.data.userTags1[index].data = false;
      this.data.userTags1[index].num = 0;
      var tags = this.data.userTags1;
      that.setData({
        userTags1: tags,
      })
    }
    console.info(this.data.userTags1);
  },
  clickTags2: function(e) {
    var that = this;
    var index = e.target.dataset.current;
    if (!this.data.userTags2[index].data) {
      this.data.userTags2[index].data = true;
      this.data.userTags2[index].num = 1;
      var tags = this.data.userTags2;
      that.setData({
        userTags2: tags,
      })
    } else {
      this.data.userTags2[index].data = false;
      this.data.userTags2[index].num = 0;
      var tags = this.data.userTags2;
      that.setData({
        userTags2: tags,
      })
    }
    console.info(this.data.userTags2);
  },
  /**
   * 时间分类筛选
   */
  clickTab: function(e) {
    var that = this;
    if (this.data.tabTime === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        tabTime: e.target.dataset.current
      })
    }
    console.info(that.data.tabTime);
  },
  /**
   * 重置
   */
  reset: function() {
    var that = this;
    that.setData({
      searchStart: that.currentTime(),
      searchEnd: that.currentTime(),
      tabTime: 1,
      userTags: [],
      userTags1: [],
      userDataList: [],
      statNum: 1,
      screenData: false,
      txtTime: that.data.txt
    })
    that.labeArr();
    that.userDataList(that.data.optid, that.data.optstar, that.data.optend);
  },
  /**
   * 筛选确定
   */
  determine: function() {
    var that = this;
    var labs = [];
    for (var i = 0; i < that.data.userTags.length; i++) {
      if (that.data.userTags[i].num == 1) {
        labs.push(that.data.userTags[i].tagName)
      }
    }
    for (var i = 0; i < that.data.userTags1.length; i++) {
      if (that.data.userTags1[i].num == 1) {
        labs.push(that.data.userTags1[i].tagName)
      }
    }

    that.setData({
      userDataList: [],
      statNum: 1,
      screenData: true,
      txtTime: that.data.searchStart + '~' + that.data.searchEnd
    })
    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    app.sendAjax({
      url: 'share/record/condition',
      data: {
        "dateType": that.data.tabTime, //查询时间类型
        "endTime": that.data.searchEnd + ' 23:59:59',
        "page": that.data.statNum,
        "pageSize": 10,
        "keyword": "",
        "shoppingGuideId": shoppingGuideId,
        "startTime": that.data.searchStart + ' 00:00:00',
        "tagName": labs //查询标签
      },
      success: function(res) {
        if (res.code == "200") {
          console.log(res);
          console.info(JSON.stringify(res) + '条件筛选');
          that.setData({
            userDataList: [],
            pageNum: res.data.totalPage
          })
          var arr = [];
          if (that.data.userDataList) {
            for (var i = 0; i < that.data.userDataList.length; i++) {
              arr.push(that.data.userDataList[i]);
            }
          }
          if (res.data.data) {
            for (var j = 0; j < res.data.data.length; j++) {
              arr.push(res.data.data[j]);
            }
          }
          that.setData({
            userDataList: arr,
            pageNum: res.data.totalPage
          })
          if (res.data.totalCount <= 10) {
            that.setData({
              bottomTxt: '暂无更多数据加载~'
            })
          }
        } else {
          console.log('条件筛选失败');
        }
      },
      fail: function(res) {}
    })
    this.closeScreen();
  },
  /**
   * 日期选择
   */
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail);
    this.setData({
      searchStart: e.detail.value
    })
  },
  bindDateChangeEnd: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail);
    this.setData({
      searchEnd: e.detail.value
    })
  },
  /**
   * 控制筛选弹窗
   */
  openScreen: function() {
    var that = this;
    if (!that.data.showScreen) {
      that.setData({
        showScreen: true,
      })
      setTimeout(function() {
        that.setData({
          show: 1,
        })
      }, 100)
    }
  },
  /**
   * 关闭筛选弹窗
   */
  closeScreen: function() {
    var that = this;
    if (that.data.showScreen) {
      that.setData({
        show: 2,
      })
      setTimeout(function() {
        that.setData({
          showScreen: false
        })
      }, 500)
    }
  },
  closePrevents: function() {
    return false;
  },
  /**
   * 按标签查询顾客浏览数据
   */
  userDataList: function(id, start, end, val) {
    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    console.info(id);
    var i = id;
    var that = this;
    app.sendAjax({
      url: 'share/record/list',
      data: {
        "endTime": end,
        "page": that.data.statNum,
        "pageSize": 10,
        "keyword": val || "",
        "productId": id,
        "shareChannelId": that.data.sharid,
        "shoppingGuideId": shoppingGuideId,
        "startTime": start
      },
      success: function(res) {
        if (res.code == "200") {
          console.log(res);
          console.info(JSON.stringify(res) + '浏览数据');
          that.setData({
            userDataList: [],
            pageNum: res.data.totalPage,
            txtTime: that.data.txt
          })
          var arr = [];
          if (that.data.userDataList) {
            for (var i = 0; i < that.data.userDataList.length; i++) {
              arr.push(that.data.userDataList[i]);
            }
          }
          if (res.data.data) {
            for (var j = 0; j < res.data.data.length; j++) {
              arr.push(res.data.data[j]);
            }
          }
          that.setData({
            userDataList: arr,
            pageNum: res.data.totalPage
          })
          if (res.data.totalCount <= 10) {
            that.setData({
              bottomTxt: '暂无更多数据加载~'
            })
          }
        } else {
          console.log('按标签查询顾客浏览数据失败');
        }
      },
      fail: function(res) {}
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
   * 获取标签列表
   */
  labeArr: function() {
    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    var that = this;
    app.sendAjax({
      url: 'tag/list2',
      data: {
        "shoppingGuideId": shoppingGuideId
      },
      success: function(res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) + '获取查询标签')
          that.setData({
            userTags: res.data[0].tagList,
            userTags1: res.data[1].tagList
          })
        } else {
          console.log('获取查询标签失败')
        }
      },
      fail: function(res) {}
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.info(options)
    var that = this;
    var time = app.days(2);
    that.setData({
      optid: options.id,
      dateDays: time,
      searchStart: that.currentTime(),
      searchEnd: that.currentTime(),
      txt: options.txt,
      optstar: options.startime,
      optend: options.endtime,
      sharid: options.sharid
    })
    that.userDataList(options.id, options.startime, options.endtime);
    that.labeArr();
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
    this.setData({
      statNum: 1,
      userDataList: [],
      bottomTxt: '往下滑，查看更多~'
    })
    if (this.data.screenData) {
      this.determine();
    } else {
      this.userDataList(this.data.optid, this.data.optstar, this.data.optend);
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
    console.info('刷新了')
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
      if (that.data.screenData) {
        this.determine();
      } else {
        this.userDataList(that.data.optid, that.data.dateDays.startDay, that.data.dateDays.endDay);
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