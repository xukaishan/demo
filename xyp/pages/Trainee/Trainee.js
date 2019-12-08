// pages/Trainee/Trainee.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trainerList: [],
    checkList: [],
    shoppingGuideId: '',
    selectedIndexForTrainers: -1,
  },

  //获取培训师列表
  getTrainerList: function() {
    let that = this;
    let url = "rest/trainerAgent/list";
    console.log(url);
    app.sendAjax({
      url: url,
      method: 'post',
      data: {
        "id": that.data.shoppingGuideId
        // "id": "ba7e6be9-0d74-4fbf-97be-95374e0f596b",
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      success: function(res) {
        console.log(JSON.stringify(res) + '获取成功')
        if (res.respCode == "0") {
          let data = res.data;
          for (var i = 0; i < data.length; i++) {
            let item = data[i]
            item.isSelected = false
            item.index = i
          }
          that.setData({
            trainerList: data,
          });

        }
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },

  itemSelected: function(e) {
    var that = this
    let dataset = e.currentTarget.dataset
    var previousSelectedItem = null
    var selectedItem = dataset.item
    var trainerList = that.data.trainerList
    let arrayLength = trainerList.length
    let previousSelectedIndex = that.data.previousSelectedIndex

    //Deselcted Previous Item
    if (previousSelectedIndex >= 0 && previousSelectedIndex < arrayLength) {
      previousSelectedItem = trainerList[previousSelectedIndex]
      previousSelectedItem.isSelected = false
    }

    selectedItem.isSelected = !selectedItem.isSelected

    //Update Model and UI
    var previousSelectedItemForUpdate = null
    if (previousSelectedItem != null) {
      previousSelectedItemForUpdate = 'trainerList[' + previousSelectedItem.index + ']'
    }
    let selectedItemForUpdate = 'trainerList[' + selectedItem.index + ']'

    that.setData({
      previousSelectedIndex: selectedItem.index,
      [previousSelectedItemForUpdate]: previousSelectedItem,
      [selectedItemForUpdate]: selectedItem,
    })
    that.setData({
      checkList: [selectedItem]
    })
  },

  inputTrainee: function (e) {
    let value = e.detail.value

  },
  search: function(e) {
    let that = this;
    let url = "rest/trainerAgent/list";
    console.log(url);
    app.sendAjax({
      url: url,
      method: 'post',
      data: {
        "id": that.data.shoppingGuideId,
        "keyword": e.detail.value || ""
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      success: function(res) {
        console.log(JSON.stringify(res) + '获取成功')
        if (res.respCode == "0") {
          let data = res.data;
          for (var i = 0; i < data.length; i++) {
            if (that.data.shoppingGuideId == data[i].shoppingGuideId) {
              data[i].isSelected = true;
            }
            data[i].index = i
          }
          that.setData({
            trainerList: data,
          });

        }
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  //提交数据
  postTrainerSelective: function() {
    let that = this
    if (that.data.checkList.length > 0) {
      //Update Previous Page Model 通知提交页面上传成功
      let userInfo = that.data.checkList
      app.notice.post('TrainnerSelectionValueChangedNotification', {
        userInfo
      })
      wx.navigateBack();
      // wx.navigateTo({
      //   url: '/pages/trainingReport/trainingReport',
      //   success: function (res) { },
      //   fail: function (res) { },
      //   complete: function (res) { },
      // })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    that.setData({
      shoppingGuideId: shoppingGuideId
    });
    console.log(that.data.shoppingGuideId)
    that.getTrainerList();
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
  onUnload: function() {},

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