// pages/Recommend/Recommend.js
var util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab2: 0,
    tab3: 0,
    commodityList: null,
    category: null,
    channels: '', //渠道ID
    shopId: '', //产品id
    shareid: '',
    url: null,
    bottomTxt: '往下滑，查看更多~',
    page: 1,
    pageNum: null,
    statNum: 1,
    imgheadurl: app.globalData.url,
    showTabSon: false,
    categorySon: null
  },
  /**
   * 获取分享渠道
   */
  shareChannel: function () {
    var that = this;
    app.sendAjax({
      url: 'share/channel',
      method: 'get',
      success: function (res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) + '获取分享渠道');
          var id = res.data[0].shareChannelId;
          that.setData({
            channels: id
          })
        } else {
          console.log('获取分享渠道失败')
        }
      },
      fail: function (res) { }
    })
  },
  /**
   * 打开web页面
   */
  openWeb: function (e) {
    console.log(e.currentTarget.dataset.url)
    this.setNew(e.target.dataset.product);
    wx.navigateTo({
      url: '/pages/web/web?url=' + e.currentTarget.dataset.url + '&aimid=' + e.target.dataset.product + '&shareChannelid=' + this.data.channels + '&current=true',
    })
  },
  /**
   * 切换资源选项
   */
  clickTab: function (e) {
    var that = this;
    that.setData({

    })
    if (this.data.tab === e.target.dataset.current) {
      if (that.data.showTabSon == true) {
        that.setData({
          showTabSon: false
        })
      } else {
        that.setData({
          showTabSon: true
        })
      }
      return false;
    } else {
      that.setData({
        tab: e.target.dataset.current,
        tab2: e.target.dataset.index,
        showTabSon: true,
      })
      console.log(that.data.tab);
      // that.productList(that.data.tab);
      that.tabSon(that.data.tab)
    }
  },
  /**
   * 切换资源选项2
   */
  clickTab1: function (e) {
    console.info(e)
    var that = this;
    that.setData({

    })
    if (this.data.tab3 === e.target.dataset.index) {
      return false;
    } else {
      that.setData({
        tab3: e.target.dataset.index,
        statNum: 1,
        bottomTxt: '往下滑，查看更多~',
        commodityList: []
      })
      console.log(that.data.tab);
      that.productList(e.target.dataset.current);
    }
    that.setData({
      showTabSon: false,
    })
  },
  /**
   * 获取子tab选项内容
   */
  tabSon: function (id) {
    var that = this;
    app.sendAjax({
      url: 'content/category',
      // method: 'get',
      data: {
        'id': id
      },
      success: function (res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) + '获取产品子分类');
          that.setData({
            categorySon: res.data,
            commodityList: []
          })
          console.info(res.data)
          if (res.data.length > 0) {
            that.productList(res.data[0].id);
          }
        } else {
          console.log('获取产品分类失败')
        }
      },
      fail: function (res) { }
    })
  },
  /**
   * 获取产品分类
   */
  category: function () {
    var that = this;

    app.sendAjax({
      url: 'content/category',
      // method: 'get',
      data: {

      },
      success: function (res) {
        console.info(JSON.stringify(res));
        if (res.code == "200") {
          // console.log(JSON.stringify(res) + '获取产品分类');
          // console.log(res.data.h5LinkUrl);
          // console.log(res.data[0].categoryId);
          // that.productList(res.data[0].categoryId); //用于默认加载第一个选项卡的数据
          that.setData({
            category: res.data
          })
          that.tabSon(res.data[0].id);
        } else {
          console.log('获取产品分类失败')
        }
      },
      fail: function (res) { }
    })
  },
  /**
   * 设置是否上新
   */
  setNew: function (id) {
    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    console.info(shopping);
    app.sendAjax({
      url: 'content/isNew',
      data: {
        "isNew": 0,
        "productId": id,
        "shoppingGuideId": shoppingGuideId
      },
      success: function (res) {
        console.info(res);
      },
      fail: function (res) { }
    })
  },
  /**
   * 搜索
   */
  search: function (e) {
    console.info(e.detail.value)
    var that = this;
    that.setData({
      statNum: 1,
      bottomTxt: '往下滑，查看更多~',
      commodityList: []
    })
    that.productList(that.data.tab, e.detail.value);
  },
  /**
   * 获取产品资源列表
   */
  productList: function (id, val) {
    var that = this;
    var shopping = wx.getStorageSync('shoppingGuideId');
    console.info(id);
    console.info(val);
    console.info(that.data.statNum)
    app.sendAjax({
      url: 'content/list',
      data: {
        "categoryId": id,
        "keyword": val || "",
        "page": that.data.statNum,
        "pageSize": 10,
        'shoppingGuideId': shopping,
        "pageSize": 10
      },
      success: function (res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) + '获取产品资源列表')
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
          console.info(res.data.totalCount)
          if (res.data.totalCount <= 10) {
            that.setData({
              bottomTxt: '暂无更多数据加载~'
            })
          }
          that.setData({
            commodityList: arr
          })

        } else {
          console.log('获取产品资源列表失败')
        }
      },
      fail: function (res) { }
    })
  },
  /**
   * 点击分享
   */
  shareClick: function (e) {
    var id = e.target.dataset.product;
    var url = e.currentTarget.dataset.url;
    this.setData({
      shopId: id,
      url: url
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    wx.hideShareMenu();
    var that = this;
    that.category();
    that.shareChannel(); //分享渠道
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
      this.shareLinks(that.data.dateDays.startDay, that.data.dateDays.endDay);
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
  onShareAppMessage: function (res) {
    console.info(res)
    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    var that = this;
    var uuid = util.wxuuid();
    console.log('-------------shareId-------------------');
    console.log(uuid);
    console.log('-------------shareId-------------------');

    app.sendAjax({
      url: 'share/click',
      data: {
        "aimId": res.target.dataset.product,
        "shareChannelId": this.data.channels,
        "shareId": uuid,
        "shareUserId": shoppingGuideId
      },
      success: function (res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) + '分享成功')
        }
      },
      fail: function (res) { }
    })
    // this.shares();
    // console.info(this.data.shareid, this.data.url);
    if (res.from === 'button') {
      return {
        title: res.target.dataset.name,
        path: '/pages/web/web?url=' + res.target.dataset.url + '&aimid=' + res.target.dataset.product + '&shareChannelid=' + this.data.channels + '&page=' + that.data.page + '&shoppingGuideId=' + shoppingGuideId + '&shareId=' + uuid,
        imageUrl: that.data.imgheadurl + res.target.dataset.img,
        success: (res) => {
          console.log("转发成功", res);
        },
      }

    }

  }
})