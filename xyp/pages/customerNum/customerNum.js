// pages/customerNum/customerNum.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: 1,
    tab: 0,
    userDataList: null,
    typeNum: 2,
    typeTime: 1,
    statNum: 1,
    bottomTxt: '往下滑，查看更多~',
    pageNum: null, //当前列表页数
    accessType: 0, //进入列表方式，0 - 统计进入，1 - 转化录入
  },
  /**
   * 条件筛选一级
   */
  clickTabs: function(e) {
    var that = this;
    if (this.data.tabs === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        statNum: 1,
        userDataList: [],
      })
      if (e.target.dataset.current == 1) {
        that.setData({
          typeNum: 2
        })
      } else if (e.target.dataset.current == 2) {
        that.setData({
          typeNum: 4
        })
      } else if (e.target.dataset.current == 3) {
        that.setData({
          typeNum: 3
        })
      } else {
        that.setData({
          typeNum: 5
        })
      }
      that.setData({
        tabs: e.target.dataset.current,
      })
      that.userDataList()
    }
  },
  //tab二级选择
  clickTab: function(e) {
    var that = this;
    if (this.data.tab === e.target.dataset.current) {
      return false;
    } else {
      if (e.target.dataset.current == 0) {
        that.setData({
          typeTime: 1
        })
      } else {
        that.setData({
          typeTime: 2,
        })
      }
      that.setData({
        tab: e.target.dataset.current
      })
      that.userDataList()
    }
  },
  /**
   * 点击展示星标
   */
  openStars: function(e) {
    console.info(e);
    console.log("openStars = " + JSON.stringify(e.currentTarget.dataset.item))

    var that = this
    let dataset = e.currentTarget.dataset
    let item = dataset.item
    var star = item.customer.like * 1;
    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    let customerId = item.customer.customerId
 
    star = (star == 0) ? 1 : 0

    app.sendAjax({
      url: 'customer/like',
      data: {
        "customerId": customerId,
        "like": star,
        "shoppingGuideId": shoppingGuideId
      },
      success: function(res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) + '点击展示星标')
          that.setData({
            userDataList: [],
          })
          that.userDataList()
        } else {
          console.log('点击展示星标失败')
        }
      },
      fail: function(res) {}
    })

  },
  /**
   * 按标签查询顾客浏览数据
   */
  userDataList: function(id, val) {
    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    console.log('userDataList' + shoppingGuideId);

    var that = this;
    app.sendAjax({
      url: 'customer/browse/label',
      data: {
        "dateType": that.data.typeTime,
        "endTime": "",
        "labelType": that.data.typeNum,
        "keyword": val || "",
        "page": that.data.statNum,
        "pageSize": 10,
        "shoppingGuideId": shoppingGuideId,
        "startTime": "",
        "timeSort": "DESC"
      },
      success: function(res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res))
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
          if (res.data.totalCount <= 10) {
            that.setData({
              bottomTxt: '暂无更多数据加载~'
            })
          }


          that.setData({
            userDataList: arr,
            pageNum: res.data.totalPage
          })
        } else {
          console.log('按标签查询顾客浏览数据失败')
        }
      },
      fail: function(res) {}
    })
  },
  /**
   * 打开顾客详情页面
   */
  customerDetails: function(e) {
    var that = this
    let dataset = e.currentTarget.dataset
    let item = dataset.item
    let customerId = item.customerOpenId
    let accessType = that.data.accessType * 1
    console.log("accessType = " + accessType + JSON.stringify(item))

    switch (accessType) {
      case 0:
        { //统计进入
          wx.navigateTo({
            url: '/pages/customerDetails/customerDetails?id=' + customerId,
          })
        }
        break;

      case 1:
        { //转化录入进入

          let userInfo = {
            state: true,
            selectedCustomerItem: item
          }
          app.notice.post('CustomerNumSelectedItemCompletionNotification', {
            userInfo
          })
          wx.navigateBack()
        }
        break;

      default:
        break;
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if ("accessType" in options) {
      that.setData({
        accessType: options.accessType
      })
    }
   
    that.userDataList();
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
    var that = this;
    console.info(that.data.statNum);
    if (that.data.pageNum > that.data.statNum) {
      var i = that.data.statNum + 1;
      that.setData({
        statNum: i,
        bottomTxt: '往下滑，查看更多~'
      })
      this.userDataList();
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