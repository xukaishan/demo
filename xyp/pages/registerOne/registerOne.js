// pages/Situation/Situation.js
const app = getApp();
import * as echarts from '../../component/ec-canvas/echarts';
let chart = null;
var barChart = null;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    registerInfoResData: null,
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

    console.log("index" + index)

    if (index == 1) {
      opntion = 'registerRate'
    } else if (index == 2) {
      opntion = 'registerTerminals'
    }
    that.doSortData(that.data.registerInfoResData, opntion, sort)
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
        registerInfoResData: null
      })

      that.setData({
        registerInfoResData: sortData
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
   * 打开代理商
   */
  openRegister(e) {
    let dataset = e.currentTarget.dataset
    let item = dataset.item;
    item.id = null;

    let idx = dataset.idx;
    if (idx != 0) {
      console.log("JSON.stringify(item) = " + JSON.stringify(item))
      wx.navigateTo({
        url: '/pages/registrationStatus/registrationStatus?item=' + JSON.stringify(item),
      })
    }
  },

  bindDateChange: function(e) {
    var that = this
    that.setData({
      date: e.detail.value
    })
  },

  /**
   * 请求转发情况数据
   */
  requestRegisterInfo: function() {

    var that = this
    let mobilePhoneNum = app.getMobilePhoneNum()

    //验证参数合法性
    app.sendAjax({
      url: 'rest/st/registerInfo/agentList',
      data: {
        "mobilePhoneNum": mobilePhoneNum
      },
      success: function(res) {
        console.log(JSON.stringify(res))
        that.setData({
          registerInfoResData: res.data
        })
      },
      fail: function(res) {}
    })
  },

  search: function(e) {
    var that = this
    let mobilePhoneNum = app.getMobilePhoneNum()

    //验证参数合法性
    app.sendAjax({
      url: 'rest/st/registerInfo/agentList',
      data: {
        "mobilePhoneNum": mobilePhoneNum,
        "keyword": e.detail.value || ""
      },
      success: function(res) {
        console.log(JSON.stringify(res))
        that.setData({
          registerInfoResData: res.data
        })
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
    that.initSortMethod(2)
    that.requestRegisterInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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