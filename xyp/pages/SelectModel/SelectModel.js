// pages/SelectModel/SelectModel.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showNav: 0, //分类切换
    allSelected: false,
    checkList: [],
    allElection: false, //全选属性
    showTwoBox: false, //二级样式属性
    showIndex: -1,

    categories: [],

    products: [],
    previousProductItemSelectedIndex: -1,
  },

  clickNavTab(e) {
    var that = this;
    console.info(e.currentTarget.dataset.index);
    if (that.data.showNav == e.currentTarget.dataset.index) {
      return
    } else {
      that.setData({
        showNav: e.currentTarget.dataset.index
      })

      console.log("showNav" + that.data.showNav)
    }
  },
  /**
   * 获取机型列表
   */
  getProductList: function() {
    var that = this;
    let shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    app.sendAjax({
      url: "rest/product/list",
      method: 'GET',
      data: {
        "id": shoppingGuideId
      },
      success: function(res) {
        console.log(JSON.stringify(res) + '获取成功')
        if (res.respCode == "0") {
          let data = res.data;
          that.setData({
            categories: data,
          })
          that.updateProducts()
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },

  updateProducts: function() {
    var that = this
    var categories = that.data.categories
    var products = []

    for (var i = 0; i < categories.length; i++) {
      let categoryItem = categories[i]
      let categoryProducts = categoryItem.productEntityList
      for (var j = 0; j < categoryProducts.length; j++) {
        let productItem = categoryProducts[j]
        products.push(productItem)
      }
    }

    that.setData({
      products: products,
    })
  },

  search: function(e) {
    let that = this;
    let shoppingGuideId = wx.getStorageSync('shoppingGuideId');
  },

  //保存选中的数据
  sureTap: function(e) {
    var that = this

    console.log("sureTap")
    //机型
    if (that.data.showNav == 0) {
      console.log(" inside sureTap")

      var products = that.data.products
      var selectedProducts = []

      //获取选中的分类
      for (var i = 0; i < products.length; i++) {
        let productItem = products[i]
        if (productItem.isSelected) {
          selectedProducts.push(productItem)
        }
      }

      //如果选择不为空，更新机型列表
      if (selectedProducts.length > 0) {
        let userInfo = {
          state: true,
          selectedProducts: selectedProducts
        }
        app.notice.post('PurchaseConversionSelectedProductCompletionNotification', {
          userInfo
        })
      }
     
      wx.navigateBack()

    } else {
      //分类
      var categories = that.data.categories
      var products = []

      //获取选中的分类
      for (var i = 0; i < categories.length; i++) {
        let categoryItem = categories[i]
        if (categoryItem.isSelected) {
          let categoryProducts = categoryItem.productEntityList
          for (var j = 0; j < categoryProducts.length; j++) {
            let productItem = categoryProducts[j]
            products.push(productItem)
          }
        }
      }
      //如果选择不为空，更新机型列表
      if (products.length > 0) {
        that.setData({
          showNav: 0,
          products: products,
        })
      }
      else {
        wx.showToast({
          title: '请选择品类',
        })
      }
    }
  },

  /**
   * 选择样式，全选
   */
  clickSelection() {
    let that = this;
    let allElection = !that.data.allElection
    that.setData({
      allElection: allElection
    })

    that.updateCategoriesAllSelection(allElection)
  },

  updateCategoriesAllSelection: function(isSelected) {
    var that = this
    var categories = that.data.categories

    for (var i = 0; i < categories.length; i++) {
      let categoryItem = categories[i]
      categoryItem.isSelected = isSelected
    }

    console.log("isSelected" + isSelected)
    that.setData({
      categories: categories
    })
    console.log("isSelected" + JSON.stringify(that.data.categories[0]))
  },

  updateCategoriesItemSelection: function(isSelected, index) {
    var that = this
    var categories = that.data.categories

    if (index < 0 || index >= categories.length) {
      return
    }

    var item = categories[index]
    item.isSelected = isSelected

    that.setData({
      categories: categories,
    })

  },

  updateProductsItemSelection: function(isSelected, index) {
    var that = this
    var products = that.data.products

    if (index < 0 || index >= products.length) {
      return
    }

    var previousSelectedItem = null
    let previousProductItemSelectedIndex = that.data.previousProductItemSelectedIndex
    if (previousProductItemSelectedIndex >= 0 && previousProductItemSelectedIndex < products.length) {
      previousSelectedItem = products[previousProductItemSelectedIndex]
      previousSelectedItem.isSelected = false
    }

    var item = products[index]
    item.isSelected = isSelected

    that.setData({
      products: products,
      previousProductItemSelectedIndex: index
    })
    // console.log("isSelected" + JSON.stringify(that.data.categories[index]))
  },


  categoryItemTap: function(e) {
    var that = this
    let dataset = e.currentTarget.dataset
    let index = dataset.index
    let item = dataset.item

    that.updateCategoriesItemSelection(!item.isSelected, index)
  },

  /**
   * 选择第一级菜单
   */
  productItemTap(e) {
    var that = this
    let dataset = e.currentTarget.dataset
    let index = dataset.index
    let item = dataset.item

    that.updateProductsItemSelection(!item.isSelected, index)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    that.getProductList()
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