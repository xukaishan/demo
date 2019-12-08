// pages/trainTerminal/trainTerminal.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    agentList: [],
    allSelected: false,
    checkList: [],
    allElection: false, //全选属性
    showTwoBox: false, //二级样式属性
    list1: [], //保存代理商数组
    list2: [], //保存终端数组
    showIndex:-1
  },
  /**
   * 获取代理商夹终端列表
   */
  getAgentList: function() {
    let that = this;
    let shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    // let url = "rest/agentController/agentList/" + shoppingGuideId;
    // console.log(url);
    app.sendAjax({
      url: "rest/agent/agentList",
      method: 'post',
      data: {
        "id": shoppingGuideId
        // "id":"ba7e6be9-0d74-4fbf-97be-95374e0f596b",
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      success: function(res) {
        console.log(JSON.stringify(res) + '获取成功')
        if (res.respCode == "0") {
          let data = res.data;
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              data[i].isSelected = false;
              if (data[i].terminalList.length > 0) {
                for (let j = 0; j < data[i].terminalList.length; j++) {
                  data[i].terminalList[j].isSelected = false;
                }
              }
            }
          }
          that.setData({
            agentList: data,
          })
          console.info(JSON.stringify(that.data.agentList));
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  search: function(e) {
    let that = this;
    let shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    // let url = "rest/agentController/agentList/" + shoppingGuideId;
    // console.log(url);
    app.sendAjax({
      url: "rest/agent/agentList",
      method: 'post',
      data: {
        "id": shoppingGuideId,
        "keyword": e.detail.value || ""
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      success: function(res) {
        console.log(JSON.stringify(res) + '获取成功')
        if (res.respCode == "0") {
          let data = res.data;
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              data[i].isSelected = false;
              if (data[i].terminalList.length > 0) {
                for (let j = 0; j < data[i].terminalList.length; j++) {
                  data[i].terminalList[j].isSelected = false;
                }
              }
            }
          }
          that.setData({
            agentList: data,
          })
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },

  /**
   * 选择样式，全选
   */
  clickSelection() {
    let that = this;
    if (that.data.allElection) {
      that.setData({
        allElection: false
      })
    } else {
      that.setData({
        allElection: true
      })
    }
    /**遍历数据修改状态 */
    let arr = that.data.agentList;
    arr.forEach(function(val) {
      val.isSelected = that.data.allElection;
      let i = val.terminalList;
      i.forEach(function(vals) {
        vals.isSelected = that.data.allElection;
      })
    })
    that.setData({
      agentList: arr
    })
    console.info(that.data.allElection + '全选')
  },
  /**
   * 选择第一级菜单
   */
  clickShowOne(e) {
    let that = this;
    let selected = e.currentTarget.dataset.isselected;
    let id = e.currentTarget.dataset.id;
    if (selected) {
      selected = false;
    } else {
      selected = true;
    }
    /**遍历数据修改状态 */
    let arr = that.data.agentList;
    arr.forEach(function(val) {
      if (val.id == id) {
        val.isSelected = selected;
        let i = val.terminalList;
        i.forEach(function(vals) {
          vals.isSelected = selected;
        })
      }
    })
    that.setData({
      agentList: arr
    })
  },
  /**
   * 选择二级菜单
   */
  clickshowTows(e) {
    let that = this;
    console.log(e);
    let selected = e.currentTarget.dataset.isselected;
    let id = e.currentTarget.dataset.id;
    if (selected) {
      selected = false;
    } else {
      selected = true;
    }
    /**遍历数据修改状态 */
    let arr = that.data.agentList;
    arr.forEach(function(val) {
      let i = val.terminalList;
      var flag = false;
      i.forEach(function(vals) {
        if (vals.id == id) {
          vals.isSelected = selected;
          if (selected){
            val.isSelected = true;
          }
        }
        if (vals.isSelected == true) {
          flag = flag | true;
        } else {
          flag = flag | false;
        }
      })
      val.isSelected = flag;
    })
    that.setData({
      agentList: arr
    })
  },
  /**
   * 保存选择完成的数据
   */
  saveData() {
    let that = this;
    let arr = that.data.agentList;
    let arr1 = [];
    let arr2 = [];
    let arrList='';
    let obj={};
    arr.forEach(function(val) {
      if (val.isSelected == true) {
        arr1.push(val.id);
      }
      val.terminalList.forEach(function(vals) {
        if (vals.isSelected == true) {
          arr2.push(val.id + "-" + vals.id)
          arrList += vals.name+','
        }
      })
    })
    console.info(arr1);
    console.info(arr2);
    console.info(arrList);
    obj.arr1 = arr1;
    obj.arr2 = arr2;
    obj.arrList = arrList;
    // 返回上一页携带参数
    app.notice.post('AgentTerminalSelectionValueChangedNotification', {
      obj
    })
    setTimeout(() => {
      wx.navigateBack({
        delta: 1 //想要返回的层级
      })
    }, 800)
  },
  /**
   * 点击展示二级菜单
   */
  clickShowTwo(e) {
    let that = this;
    console.info(e.currentTarget.dataset.index);
    if (that.data.showIndex == e.currentTarget.dataset.index) {
      that.setData({
        showIndex: -1
      })
      return false;
    } else {
      that.setData({
        showIndex :e.currentTarget.dataset.index
      })
    }
    console.info(that.data.showIndex + '二级菜单')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.getAgentList();
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