// pages/Recommend/Recommend.js
const util = require('../../utils/util.js')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    commodityList: null,
    shareChannelId: '', //渠道ID
    url: null,
    bottomTxt: '往下滑，查看更多~',
    page: 1,
    pageNum: null,
    statNum: 1,
    imgheadurl: app.globalData.url,

    categoriesLevel_1: null,
    categoriesLevel_2: null,
    categoriesLevel_3: null,
    shouldNavigationBarScroll: true,
    shouldShowDropMenu: false,

    selectedIndexForCategoriesLevel_1: 0,
  },

  /**
   * 关闭tab
   */
  closeTab() {
    var that = this;
    that.setData({
      shouldShowDropMenu: false,
      categoriesLevel_2: null,
      categoriesLevel_3: null,
    })
  },

  /**
   * 获取分享渠道
   */
  shareChannel: function() {
    wx.showLoading();
    var that = this;
    app.sendAjax({
      url: 'share/channel',
      method: 'get',
      success: function(res) {
        wx.hideLoading();
        if (res.code == "200") {
          console.log(JSON.stringify(res) + '获取分享渠道');
          that.setData({
            shareChannelId: res.data[0].shareChannelId
          })
        } else {
          wx.hideLoading();
          console.log('获取分享渠道失败')
        }
      },
      fail: function(res) {
        wx.hideLoading();
      }
    })
  },

  /**
   * 打开web页面
   */
  openWeb: function(event) {
    console.log("openWeb")

    let dataset = event.currentTarget.dataset;
    let item = dataset.item;
    this.requestUpdateNewTag(item.suppliesId);

    wx.navigateTo({
      url: '/pages/materialDetails/materialDetails?url=' + item.h5LinkUrl + '&aimid=' + item.suppliesId + '&shareChannelId=' + this.data.shareChannelId + '&current=true' + '&suppliesName=' + item.suppliesName,
    })
  },


  /**
   * 点击箭头加载二级
   */
  dropMenuArrowClick: function(event) {
    var that = this;
    let dataset = event.currentTarget.dataset
    let item = dataset.item

    if (!item.selected) {
      that.clickTabLevel_1(event)
    }

    if (that.data.shouldShowDropMenu == false) {
      that.requestCategoriesWithLevel(2, item.id)
    }

    that.setData({
      shouldShowDropMenu: !that.data.shouldShowDropMenu
    })
  },

  /**
   * 一级切换
   */
  clickTabLevel_1: function(event) {
    var that = this;

    if (that.data.shouldShowDropMenu) { that.closeTab }

    let dataset = event.currentTarget.dataset;
    let selectedItem = dataset.item;

    if (!selectedItem.selected) {
      let index = that.data.selectedIndexForCategoriesLevel_1
      let previesSelectedItem = that.data.categoriesLevel_1[index]

      previesSelectedItem.selected = false
      selectedItem.selected = true;

      let previesSelectedItemForUpdate = 'categoriesLevel_1[' + previesSelectedItem.index + ']'
      let selectedItemForUpdate = 'categoriesLevel_1[' + selectedItem.index + ']'

      that.setData({
        selectedIndexForCategoriesLevel_1: selectedItem.index,
        [previesSelectedItemForUpdate]: previesSelectedItem,
        [selectedItemForUpdate]: selectedItem,
      })

      let isUpdate = true;
      that.productList(isUpdate);
    }
  },

  /**
   * 二级切换
   */
  clickTabLevel_2: function(event) {
    console.log('clickTabLevel_2')

    var that = this;

    let dataset = event.currentTarget.dataset;
    let selectedItem = dataset.item;
    console.log(JSON.stringify(selectedItem))
    if (!selectedItem.selected) {
      let categories = that.data.categoriesLevel_2
      categories.forEach(function(item, index) {
        index == selectedItem.index ? item.selected = true : item.selected = false
      })

      // console.log()
      that.setData({
        categoriesLevel_2: categories
      })

      that.requestCategoriesWithLevel(3, selectedItem.id)
    }
  },

  /**
   * 三级切换
   */
  clickTabLevel_3: function(event) {
    var that = this;
    let dataset = event.currentTarget.dataset;
    let selectedItem = dataset.item;

    let index = selectedItem.index;
    let originalItem = 'categoriesLevel_3[' + index + ']'

    selectedItem.selected = !selectedItem.selected;

    that.setData({
      [originalItem]: selectedItem
    })
  },


  connectFilteredInfoWithCategories: function(categories) {
    let filteredCategoryIds = []
    let filteredCategoryNames = ''

    categories.forEach(function(item) {
      if (item.selected == true) {
        filteredCategoryIds.push(item.id)
        filteredCategoryNames += item.categoryName + ','
      }
    })
    let length = filteredCategoryNames.length
    filteredCategoryNames = filteredCategoryNames.slice(0, length - 1)

    return [filteredCategoryIds, filteredCategoryNames]
  },

  /**
   * 确定选择
   */
  suerQuery: function() {
    var that = this;
    let filteredCategoryIds = []
    let filteredCategoryNames = ''

    let info = that.connectFilteredInfoWithCategories(that.data.categoriesLevel_3)
    filteredCategoryIds = info[0]
    filteredCategoryNames += info[1]

    //TODO 纯二级 筛选结果
    
    // if (filteredCategoryNames.length == 0) {
    //   let info = that.connectFilteredInfoWithCategories(that.data.categoriesLevel_2)
    //   filteredCategoryIds.push(info[0])
    //   filteredCategoryNames += info[1]
    // }

    if (filteredCategoryNames.length > 0) {
      let index = that.data.selectedIndexForCategoriesLevel_1;
      let previousFilteredCategoryNames = 'categoriesLevel_1[' + index + '].filteredCategoryNames'
      let previousFilteredCategoryIds = 'categoriesLevel_1[' + index + '].filteredCategoryIds'

      that.setData({
        [previousFilteredCategoryNames]: filteredCategoryNames,
        [previousFilteredCategoryIds]: filteredCategoryIds,
      })

      // console.log("\n\n\n categoriesLevel_1\n" + JSON.stringify(that.data.categoriesLevel_1) + "\n\n\n");
    }

    that.productList(true)
    that.closeTab();
  },

  /**
   * 重置
   */
  reset: function() {
    var that = this
    console.log("\n\n\n reset \n\n")

    that.data.categoriesLevel_3.forEach(function(item, index) {
      if (item.selected) {
        let previousItemSelected = 'categoriesLevel_3[' + index + '].selected'
        that.setData({
          [previousItemSelected]: false
        })
      }
    })

    that.data.categoriesLevel_1.forEach(function(item, index) {
      let previousFilteredCategoryNames = 'categoriesLevel_1[' + index + '].filteredCategoryNames'
      let previousFilteredCategoryIds = 'categoriesLevel_1[' + index + '].filteredCategoryIds'

      that.setData({
        [previousFilteredCategoryNames]: item.categoryName,
        [previousFilteredCategoryIds]: [item.id],
      })
    })

    that.productList(true)
  },

  /**
   * 获取产品分类
   */
  requestCategoriesWithLevel: function(categoryLevel, id) {
    wx.showLoading();
    var that = this;
    app.sendAjax({
      url: 'supplies/category',
      data: {
        "id": id,
        "page": 0,
        "pageSize": 0
      },
      success: function(res) {
        console.log("\n\n\n supplies/category \n" + JSON.stringify(res) + "\n\n\n")

        if (res.code == "200") {
          let shouldNavigationBarScroll = (categories != null && categories.length > 3) ? true : false;
          var categories = res.data.categoryList
          
          categories.forEach(function(item, index) {
            item.selected = false //新增selected标记选择状态
            item.index = index //新增Index标记当前分类顺序
            if (categoryLevel == 1) { //一级分类新增部分
              console.log("\n categoryLevel = " + categoryLevel)
              item.filteredCategoryIds = [item.id] //新增filteredCategoryIds用于记录筛选结果ID
              item.filteredCategoryNames = item.categoryName //新增用于记录筛选结果标题
            }
          })

          var firstItem = categories[0];
          firstItem.selected = true;

          switch (categoryLevel) {
            case 1:
              { //一级分类

                that.setData({
                  selectedIndexForCategoriesLevel_1: 0,
                  shouldNavigationBarScroll: shouldNavigationBarScroll,
                  categoriesLevel_1: categories,
                })

                that.productList(true);
              }
              break;

            case 2:
              {
                that.setData({
                  categoriesLevel_2: categories,
                })
                that.requestCategoriesWithLevel(3, firstItem.id)
              }
              break;
            case 3:
              {
                firstItem.selected = false;
                that.setData({
                  categoriesLevel_3: categories,
                })

              }
              break;

            default:
              break;
          }

          wx.hideLoading()
        } else {
          wx.hideLoading()
          console.log('获取产品分类失败') + JSON.stringify(res);
        }
      },
      fail: function(res) {
        console.log('request fail' + JSON.stringify(res));
        wx.hideLoading()
      }
    })
  },

  /**
   * 设置是否上新
   */
  requestUpdateNewTag: function(suppliesId) {
    let shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    app.sendAjax({
      url: 'supplies/isNew',
      data: {
        "isNew": 0,
        "suppliesId": suppliesId,
        "shoppingGuideId": shoppingGuideId
      },
      success: function(res) {
        console.log((res.code == "200") ? 'requestUpdateNewTag success' : JSON.stringify(res) + ' requestUpdateNewTag fail')
      },
      fail: function(res) {
        console.log(JSON.stringify(res) + ' requestUpdateNewTag fail')
      }
    })
  },

  /**
   * 搜索
   */
  search: function(event) {
    console.info(event.detail.value)
    var that = this;
    that.productList(that.data.tab, event.detail.value);
  },

  /**
   * 获取产品资源列表
   */
  productList: function(isUpdate, keyword) {
    wx.showLoading();
    var that = this;
    if (isUpdate) {
      that.setData({
        statNum: 1,
        bottomTxt: '往下滑，查看更多~',
        commodityList: []
      })
    }

    let shoppingGuideId = wx.getStorageSync('shoppingGuideId')
    let index = that.data.selectedIndexForCategoriesLevel_1
    let selectedItem = that.data.categoriesLevel_1[index]
    let filteredCategoryIds = selectedItem.filteredCategoryIds

    if (shoppingGuideId == null || shoppingGuideId.length == 0) {
      console.log("shoppingGuideId can not be null or empty")
    } else {
      console.log("\n" + shoppingGuideId + "\n")
    }
    if (index == null) {
      console.log("index can not be null")
    } else {
      console.log("\n" + index + "\n")
    }
    if (filteredCategoryIds == null || filteredCategoryIds.length == 0) {
      console.log("filteredCategoryIds can not be null or empty")
    } else {
      console.log("\n filteredCategoryIds = " + filteredCategoryIds + "\n")
      console.info(filteredCategoryIds)
    }


    app.sendAjax({
      url: 'supplies/list',
      data: {
        "categoryId": filteredCategoryIds,
        "keyword": keyword || "",
        "page": that.data.statNum,
        'shoppingGuideId': shoppingGuideId,
        "pageSize": 10
      },
      success: function(res) {
        if (res.code == "200") {
          console.log('获取产品资源列表' + JSON.stringify(res))
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

          wx.hideLoading();

        } else {
          console.log('\n\n ----------获取产品资源列表失败-----------' + JSON.stringify(res))
          wx.hideLoading();
        }
      },
      fail: function(res) {
        console.log('\n\n 获取产品资源列表失败' + JSON.stringify(res))
        wx.hideLoading();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    wx.hideShareMenu();

    this.shareChannel(); //分享渠道
    this.requestCategoriesWithLevel(1);
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
    if (this.data.categoriesLevel_1 != null && this.data.categoriesLevel_1.length > 0) {
      this.productList(true);
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
      that.productList(that.data.tab);
    } else {
      that.setData({
        bottomTxt: '暂无更多数据加载~'
      })
      return false
    }
  },

})