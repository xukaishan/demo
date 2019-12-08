// pages/editLabel/editLabel.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: null,
    labelshow: [], //已关联的标签
    label1: [], //购买状态
    label2: [], //年级
    label3: [], //多选
    showClose: false,
    edit: '编辑',
    addShow: false,
    addLabel: null,
    arrId: [],
    arrUserLabel: [], //删除的关系标签
    addArrUserLabel: [] //添加的关系标签
  },
  /**
   * 获取输入框的值
   */
  inpVal: function(e) {
    var that = this;
    console.info(e.detail.value);
    that.setData({
      addLabel: e.detail.value
    })
  },
  /**
   * 查询所有顾客的标签
   */
  labelAll: function() {
    var that = this;
    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    app.sendAjax({
      url: 'tag/list2',
      data: {
        "shoppingGuideId": shoppingGuideId,
        "customerId": that.data.userId
      },
      success: function(res) {
        console.log(res);
        if (res.code == "200") {
          console.info(JSON.stringify(res.data) + '获取标签');
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].tagType == 1) {
              that.setData({
                label1: res.data[i].tagList
              })
            } else if (res.data[i].tagType == 2) {
              that.setData({
                label2: res.data[i].tagList
              })
            } else {
              that.setData({
                label3: res.data[i].tagList
              })
            }
          }

          var arrLabel = [];
          for (var i = 0; i < res.data.length; i++) {
            // if (res.data[i].choosed == 1) {
            //   arrLabel.push(res.data[i])
            // }
            for (var a = 0; a < res.data[i].tagList.length; a++) {
              if (res.data[i].tagList[a].choosed == 1) {
                arrLabel.push(res.data[i].tagList[a])
              }
            }
          }
          that.setData({
            labelshow: arrLabel
          })
          console.info(that.data.label1)
          if (that.data.label1[0].customerTagId==null && that.data.label1[1].customerTagId==null) {
            that.showBtn();
          }
        } else {
          console.log('获取标签失败')
        }
      },
      fail: function(res) {}
    })
  },
  /**
   * 点击删除单个标签
   */
  clearLabel: function(e) {
    var that = this;
    console.info(e);
    console.info(e.target.dataset.current);
    var newLabel = that.data.label3;
    that.data.arrId.push(e.target.dataset.tagid);
    newLabel.splice(e.target.dataset.current, 1);
    console.info(newLabel);
    that.setData({
      label3: newLabel
    })
  },
  /**
   * 点击编辑
   */
  edit: function() {
    var that = this;
    if (that.data.showClose == false) {

      that.setData({
        showClose: true,
        edit: '完成'
      })
    } else {
      console.info(that.data.arrId)
      app.sendAjax({
        url: 'tag/delete',
        data: {
          "tagIds": that.data.arrId
        },
        success: function(res) {
          console.log(res);
          if (res.code == "200") {
            console.info(JSON.stringify(res.data) + '编辑完成')
            wx.showToast({
              title: '编辑完成',
              icon: 'none'
            })
          } else {
            console.log('编辑完成失败')
          }
        },
        fail: function(res) {}
      })
      that.setData({
        showClose: false,
        edit: '编辑'
      })
    }
  },
  /**
   * 穿梭框添加标签
   */
  addUserLabel: function(e) {
    var that = this;
    var arr = [];
    console.info(e.target.dataset.choosed);
    console.info(e);
    if (e.target.dataset.choosed == 0) {
      arr.push(e.target.dataset.name);
      var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
      app.sendAjax({
        url: 'customer/tag/add',
        data: {
          "customerId": that.data.userId,
          "customerTagNames": arr,
          "shoppingGuideId": shoppingGuideId
        },
        success: function(res) {
          console.log(res);
          if (res.code == "200") {
            console.info(JSON.stringify(res.data) + '添加标签')
            that.labelAll();
          } else {
            console.log('添加标签失败')
          }
        },
        fail: function(res) {}
      })
    }else{
      arr.push(e.target.dataset.customertagid);
      app.sendAjax({
        url: 'customer/tag/delete',
        data: {
          "customerTagIds": arr
        },
        success: function (res) {
          console.log(res);
          if (res.code == "200") {
            console.info(JSON.stringify(res.data) + '删除标签')
            that.labelAll();
          } else {
            console.log('删除标签失败')
          }
        },
        fail: function (res) { }
      })
    }

  },
  /**
   * 单选添加删除
   */
  singleElection:function(e){
    var that = this;
    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    var arr = [];
    var deletes=[];
    if (e.target.dataset.type==1){
      console.info(this.data.label1);
      for(var i=0;i<that.data.label1.length;i++){
        console.info(that.data.label1[i].customerTagId);
        if (that.data.label1[i].customerTagId!=null){
          deletes.push(that.data.label1[i].customerTagId);
        }
      }
    }else{
      for (var y = 0; y < that.data.label2.length; y++) {
        if (that.data.label2[y].customerTagId!=null){
          deletes.push(that.data.label2[y].customerTagId);
        }
      }
    }
    console.info(e);
    arr.push(e.target.dataset.name);
    app.sendAjax({
      url: 'customer/tag/add2',
      data: {
        "customerId": that.data.userId,
        "addTagNames": arr,
        "deleteTagIds": deletes,
        "shoppingGuideId": shoppingGuideId
      },
      success: function (res) {
        console.log(res);
        if (res.code == "200") {
          console.info(JSON.stringify(res.data) + '单选删除标签')
          that.labelAll();
        } else {
          console.log('单选删除标签失败')
        }
      },
      fail: function (res) { }
    })
  },

  /**
   * 弹窗选择
   */
  showMo:function(name){
    var that = this;
    var arr = [];
    var deletes = [];
    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    for (var i = 0; i < that.data.label1.length; i++) {
      console.info(that.data.label1[i].customerTagId);
      if (that.data.label1[i].customerTagId != null) {
        deletes.push(that.data.label1[i].customerTagId);
      }
    }
    arr.push(name)
    app.sendAjax({
      url: 'customer/tag/add2',
      data: {
        "customerId": that.data.userId,
        "addTagNames": arr,
        "deleteTagIds": deletes,
        "shoppingGuideId": shoppingGuideId
      },
      success: function (res) {
        console.log(res);
        if (res.code == "200") {
          console.info(JSON.stringify(res.data) + '单选删除标签')
          that.labelAll();
        } else {
          console.log('单选删除标签失败')
        }
      },
      fail: function (res) { }
    })
  },
  /**
   * 穿梭框删除标签
   */
  deletUserLabel: function(e) {
    if (e.target.dataset.name == "已购买" || e.target.dataset.name == "未购买"){
      wx.showModal({
        title: '温馨提示',
        content: '您好，已购买和未购买不能取消，只能切换哦！',
        showCancel:false,
        confirmText:'知道了',
        confirmColor:'#000',
        success(res) {
          return false;
        }
      })
    }else{
      var that = this;
      var arr = [];
      console.info(e);
      arr.push(e.target.dataset.customertagid);
      app.sendAjax({
        url: 'customer/tag/delete',
        data: {
          "customerTagIds": arr
        },
        success: function (res) {
          console.log(res);
          if (res.code == "200") {
            console.info(JSON.stringify(res.data) + '删除标签')
            that.labelAll();
          } else {
            console.log('删除标签失败')
          }
        },
        fail: function (res) { }
      })
    }
    
  },
  /**
   * 确定删除或增加
   */
  sure: function() {

  },
  /**
   * 打开添加标签
   */
  openAddLabel: function() {
    var that = this;
    if (that.data.showClose == true) {
      that.setData({
        addShow: true
      })
    } else {
      wx.showToast({
        title: '你未选择编辑',
        icon: 'none'
      })
      return false;
    }
  },
  /**
   * 确定添加标签
   */
  suerAddLabel: function() {
    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    var that = this;
    if (that.data.addLabel) {
      // var arr= that.data.label;
      // arr.push(that.data.addLabel);
      // that.setData({
      //   label: arr
      // })
      app.sendAjax({
        url: 'tag/add',
        data: {
          "shoppingGuideId": shoppingGuideId,
          "tagName": that.data.addLabel,
          "tagType":3
        },
        success: function(res) {
          console.log(res);
          if (res.code == "200") {
            console.info(JSON.stringify(res.data) + '添加标签')
            that.closeAddLabel();
            that.labelAll();
          } else {
            console.log('添加标签失败');
          }
        },
        fail: function(res) {}
      })
      
    } else {
      wx.showToast({
        title: '你还未输入标签',
        icon: 'none'
      })
    }
  },
  /**
   * 弹窗
   */
  showBtn:function(){
    var that=this;
    wx.showModal({
      title: '温馨提示',
      content: '您好，已购买和未购买必须选择一个哦！',
      cancelText: '未购买',
      confirmText: '已购买',
      cancelColor: '#000',
      confirmColor: '#000',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.showMo('已购买')
        } else if (res.cancel) {
          that.showMo('未购买')
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 关闭添加标签
   */
  closeAddLabel: function() {
    var that = this;
    that.setData({
      addShow: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.info(options.id + '顾客id')
    var that = this;
    that.setData({
      userId: options.id
    })
    that.labelAll();
    
    
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
  onUnload: function () {
    
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