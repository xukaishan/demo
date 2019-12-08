// pages/Recommend/Recommend.js
var util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab1: 0,
    tab2: 999,
    tab3: 999,
    tabs: '',
    commodityList: null,
    channels: '', //渠道ID
    shopId: '', //产品id
    shareId: '',
    url: null,
    bottomTxt: '往下滑，查看更多~',
    page: 1,
    pageNum: null,
    statNum: 1,
    imgheadurl: app.globalData.url,
    showTabSon: false,
    categorySon: null,
    showTab2: false,//二级有三级展示页面
    category3: [],
    suboptions2: false, //二级没有三级
    showSon: false,
    originalCategory: [],
    category: [],
    categoryName: [],
    index: 0,//下标
    slectTab2: [],
    slectTab3: [],
    nameArrs: ''
  },
  
  /**
   * 关闭tab
   */
  closeTab() {
    var that = this;
    that.setData({
      showTab2: false,
      showSon: false,
      suboptions2: false,
      nameArrs: '',
      slectTab3: [],
      slectTab2: []
    })
  },
  /**
   * 获取分享渠道
   */
  shareChannel: function () {
    var that = this;
    app.sendAjax({
      url: 'billshare/channel',
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
    var that = this;
    let dataset = e.currentTarget.dataset;
    let item = dataset.item

    let billId = item.billId
    let url = item.h5LinkUrl
    let billName = item.billName
    let billImgPreUrl = item.billImgPreUrl
    let shoppingGuideId = wx.getStorageSync('shoppingGuideId');
   
    that.setNew(dataset.product);

    wx.navigateTo({
      url: '/pages/onlineDetails/onlineDetails?url=' + url + '&aimid=' + billId + '&shareChannelid=' + this.data.channels + '&current=true' + '&shoppingGuideId=' + shoppingGuideId + '&billImgPreUrl=' + billImgPreUrl,
    })
  },
  /**
   * 切换一级菜单名字
   */
  tabName: function (name) {
    console.info(name)
    let that = this;
    let names = name;
    if (name[name.length - 1] === ',') {
      names = name.substring(0, name.length - 1);
    }
    let arr = that.data.categoryName;
    arr[that.data.index].categoryName = names;
    console.info(JSON.stringify(arr));
    that.setData({
      categoryName: arr
    })
  },
  /**
   * 点击箭头加载二级
   */
  openshowTab2: function (e) {
    let that = this;
    let arr = [];
    // that.setData({
    //   commodityList: []
    // })
    if (that.data.tab1 != e.target.dataset.index) {
      arr.push(e.target.dataset.current)
      that.setData({
        nameArrs: e.target.dataset.name,
        tab1: e.target.dataset.index,
        index: e.target.dataset.index,
        categoryName: that.data.category,
        tab: arr,
      })
    }
    if (e.target.dataset.level == true) {
      if (that.data.showSon == false) {
        that.category2(e.target.dataset.current);
      }
      else {
        that.setData({
          showTab2: false,
          showSon: false,
          suboptions2: false,
          slectTab3: [],
          slectTab2: []
        })
      }
    }
    // that.productList(that.data.tab);
  },
  /**
   * 切换资源选项
   */
  clickTab: function (e) {
    var that = this;
    if (this.data.tab1 === e.target.dataset.index) {
      console.info(that.data.suboptions2)
      return false;
    }
    else {
      let arr = [];
      arr.push(e.target.dataset.current)
      that.setData({
        tab: arr,
        nameArrs: e.target.dataset.name,
        tab1: e.target.dataset.index,
        index: e.target.dataset.index,
        categoryName: that.data.category,
        tab2: 999,
        category3: [],
        statNum: 1,
        bottomTxt: '往下滑，查看更多~',
        commodityList: [],
        showTab2: false,
        showSon: false,
        suboptions2: false
        // showTabSon: true,
      })
      console.log(that.data.tab);
      that.productList(that.data.tab);
      // that.tabSon(that.data.tab)
    }
  },
  /**
   * 二级tab选项
   */
  clickTab2(e) {
    var that = this;
    console.info(e);
    if (this.data.tab2 === e.target.dataset.index) {
      that.category3(e.target.dataset.current)
      return false;
    }
    else {
      let arr = [];
      arr.push(e.target.dataset.current)
      that.setData({
        tab: arr,
        tab2: e.target.dataset.index,
        tab3: 999,
        statNum: 1,
        nameArrs: e.target.dataset.name,
        bottomTxt: '往下滑，查看更多~',
        // commodityList: [],
        category3: []
      })
      that.category3(e.target.dataset.current)
    }

    // that.tabName(e.target.dataset.name);
    // that.productList(that.data.tab);

  },
  /**
   * 二级没有三级tab选项
   */
  clickTabs2(e) {
    var that = this;
    let index = e.target.dataset.index;
    console.info(this.data.slectTab2);
    if (!this.data.slectTab2[index].data) {
      this.data.slectTab2[index].data = true;
      let arr = this.data.slectTab2;
      that.setData({
        slectTab2: arr
      })
    } else {
      this.data.slectTab2[index].data = false;
      let arr = this.data.slectTab2;
      that.setData({
        slectTab2: arr
      })
    }
  },
  /**
  * 三级tab选项
  */
  clickTab3(e) {
    var that = this;
    let index = e.target.dataset.index;
    console.info(this.data.slectTab3);
    if (!this.data.slectTab3[index].data) {
      this.data.slectTab3[index].data = true;
      let arr = this.data.slectTab3;
      that.setData({
        slectTab3: arr
      })
    } else {
      this.data.slectTab3[index].data = false;
      let arr = this.data.slectTab3;
      that.setData({
        slectTab3: arr
      })
    }
  },
  /**
   * 确定选择
   */
  suerQuery: function () {
    let that = this;
    let arr = [];
    let nameArr = '';
    console.info(that.data.nameArrs);
    if (that.data.nameArrs == '') {
      that.setData({
        nameArrs: that.data.category[that.data.index].categoryName
      })
    }
    that.data.slectTab2.forEach(function (val) {
      if (val.data == true) {
        arr.push(val.id);
        nameArr += val.categoryName + ','
      }
    })
    that.data.slectTab3.forEach(function (val) {
      if (val.data == true) {
        arr.push(val.id);
        nameArr += val.categoryName + ','
      }
    })
    if (arr.length > 0) {
      that.setData({
        nameArrs: '',
        tab: arr,
        statNum: 1,
        bottomTxt: '往下滑，查看更多~',
        commodityList: [],
        nameArrs: nameArr
      })
      that.productList(that.data.tab);
    } else if (that.data.tab.length > 0) {
      that.setData({
        statNum: 1,
        bottomTxt: '往下滑，查看更多~',
        commodityList: [],
      })
      that.productList(that.data.tab);
    }
    console.info(that.data.tab + '-----------------------------tab')
    that.tabName(that.data.nameArrs);
    that.closeTab();
  },
  /**
   * 重置
   */
  reset: function () {
    let that = this;
    let data1 = [];
    let data2 = [];
    let arr = [];

    that.data.slectTab2.forEach(function (val) {
      val.data = false
      data1.push(val)
    })
    that.data.slectTab3.forEach(function (val) {
      val.data = false
      data2.push(val)
    })
    arr.push(that.data.originalCategory[0].id);

    that.setData({
      slectTab2: data1,
      slectTab3: data2,
      statNum: 1,
      bottomTxt: '往下滑，查看更多~',
      commodityList: [],
      categoryName: that.data.category,
      tab: arr,
      nameArrs: that.data.originalCategory[0].categoryName
    })
    console.log('that.data.nameArrs' + that.data.nameArrs);
    that.tabName(that.data.nameArrs);
    that.productList(that.data.tab);
  },
  /**
   * 获取产品分类
   */
  category: function () {
    let that = this;
    app.sendAjax({
      url: 'bill/category',
      success: function (res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) + '获取产品分类');
          that.productList(res.data.categoryList[0].categoryId); //用于默认加载第一个选项卡的数据
          if (res.data.categoryList && res.data.categoryList.length > 3) {
            that.setData({
              boxShow: false
            })
          } else {
            that.setData({
              boxShow: true
            })
          }

          var tabs = [];
          tabs.push(res.data.categoryList[0].id)

          that.setData({
            tab: tabs,
            nameArrs: res.data.categoryList[0].categoryName,
            originalCategory: util.copyobj(res.data.categoryList),
            category: res.data.categoryList,
            categoryName: res.data.categoryList
          })

          that.productList(that.data.tab);
          // that.tabSon(res.data[0].id);
        } else {
          console.log('获取产品分类失败')
        }
      },
      fail: function (res) { }
    })
  },
  /**
   * 获取二级产品分类
   */
  category2: function (id) {
    var that = this;

    app.sendAjax({
      url: 'bill/category',
      // method: 'get',
      data: {
        "id": id,
        "page": 0,
        "pageSize": 0
      },
      success: function (res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) + '获取二级产品分类');

          if (res.data.level == true) {
            that.setData({
              category2: res.data.categoryList,
              showTab2: true,
              showSon: true
            })
          }
          else {
            that.setData({
              slectTab2: res.data.categoryList,
              suboptions2: true,
              showSon: true
            })
          }

        } else {
          console.log('获取产品分类失败')
        }
      },
      fail: function (res) { }
    })
  },
  /**
   * 获取三级产品分类
   */
  category3: function (id) {
    var that = this;

    app.sendAjax({
      url: 'bill/category',
      // method: 'get',
      data: {
        "id": id,
        "page": 0,
        "pageSize": 0
      },
      success: function (res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) + '获取二级产品分类');
          that.setData({
            slectTab3: res.data.categoryList,
          })
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
    var shopping = wx.getStorageSync('shoppingGuideId');
    console.info(shopping);
    app.sendAjax({
      url: 'bill/isNew',
      data: {
        "isNew": 0,
        "billId": id,
        "shoppingGuideId": shopping
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
    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');

    console.info('----------产品资源列表参数----------')
    console.info('categoryId = ' + id + ' \nkeyword = ' + val + '  \npage = ' + that.data.statNum + ' \nshoppingGuideId = ' + shoppingGuideId);
    console.info('----------产品资源列表参数----------')

    app.sendAjax({
      url: 'bill/list',
      data: {
        "categoryId": id,
        "keyword": val ? val : "",
        "page": that.data.statNum,
        'shoppingGuideId': shoppingGuideId,
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
          console.info('res.data.totalCount' + res.data.totalCount)

          if (res.data.totalCount <= 10) {
            that.setData({
              bottomTxt: '暂无更多数据加载~'
            })
          }
          that.setData({
            pageNum: res.data.totalPage,
            commodityList: arr
          })

        } 
        else {
          console.log('----------获取产品资源列表失败-----------' + JSON.stringify(res))
        }
      },
      fail: function (res) { }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    wx.hideShareMenu();
    var that = this;
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
    var that = this;
    that.setData({
      commodityList: [],
      statNum: 1,
      bottomTxt: '往下滑，查看更多~'
    })
    console.info(that.data.tab + 'tab选项');

    if (that.data.tab) {
      that.productList(that.data.tab);
    } else {
      that.category();
    }
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
    console.info("------------------------------------下拉调用")
    var that = this;
    console.info(that.data.statNum);
    if (that.data.pageNum > that.data.statNum) {
      var i = that.data.statNum + 1;
      that.setData({
        statNum: i,
        bottomTxt: '往下滑，查看更多~'
      })
      that.productList(that.data.tab);
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
    var that = this;
    let dataset = res.target.dataset
    let item = dataset.item
   
    let billId = item.billId
    let url = item.h5LinkUrl
    let billName = item.billName
    let billImgPreUrl = item.billImgPreUrl

    let imgheadurl = that.data.imgheadurl
    let page = that.data.page
    let channels = that.data.channels
    let shareId = util.wxuuid();
    let shoppingGuideId = wx.getStorageSync('shoppingGuideId');
  
    console.log('\n\n\n-------------用户增值模块onShareAppMessage开始-------------------');
    console.log('\n\n\nshareRes = \n' + JSON.stringify(res) + "\n\n\n");
    console.log('billId = ' + billId);
    console.log('channels = ' + channels);
    console.log('shareId = ' + shareId);
    console.log('shoppingGuideId = ' + shoppingGuideId);
    console.log('-------------onShareAppMessage结束-------------------\n\n\n');

    app.sendAjax({
      url: 'billshare/click',
      data: {
        "aimId": billId,
        "shareChannelId": channels,
        "shareId": shareId,
        "shareUserId": shoppingGuideId
      },
      success: function (res) {
        let shareMsg = (res.code == "200") ? "分享成功" : "分享失败"
        console.log('\n\n\n' + shareMsg + '\n\n\n') 
      },
      fail: function (res) { }
    })

    if (res.from === 'button') {
      return {
        title: billName,
        path: '/pages/onlineDetails/onlineDetails?url=' + url + '&aimid=' + billId + '&shareChannelid=' + channels + '&page=' + page + '&shoppingGuideId=' + shoppingGuideId + '&shareId=' + shareId,
        imageUrl: imgheadurl + billImgPreUrl,
        success: (res) => {
          console.log("转发成功", res);
        },
      }
    }
  }
})