// pages/myEntry/myEntry.js

const app = getApp()
const moment = require('../../utils/moment.js')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageDomainURL: app.globalData.url,
    accessType:0, //进入页面类型 0 - 转化录入 1 - 转化记录列表进入
    optionsItem:null,
    proofImgs: [],
    selectedProducts: [],
    selectedCustomerItem: {
      "customer": {
        "customerNickName": "请选择粉丝"
      }
    },
    selectedProductItem: {
      "productName": "请选择机型"
    },
    maxDate: new Date(),
    buyTime: new Date(),
    buyTimeString: "请选择时间",
    phoneNumber: null,
    buyDesc:"",
    conversionResData:null,
  },
  /**
   * 打开机型选择页面
   */
  openSelectModel() {
    var that = this
    if (that.data.accessType == 0) {
      wx.navigateTo({
        url: '/pages/SelectModel/SelectModel',
      })
    }
  },
  /**
   * 打开粉丝列表
   */
  openFans() {
    var that = this
    if (that.data.accessType == 0) {
      wx.navigateTo({
        url: '/pages/customerNum/customerNum?accessType=1',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this

    console.log("options = " + JSON.stringify(options))
    
    if ("accessType" in options) {
      let accessType = options.accessType * 1
      let item = JSON.parse(options.item)
      console.log("options.item" + JSON.stringify(item))
      that.setData({
        accessType: accessType,
        optionsItem: item
      })
      wx.setNavigationBarTitle({
        title: '录入详情',
      })
      that.requestPurchaseConversionInfo()
    }
    else {
      that.registerNotifications()
    }
 
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    var that = this
    that.removeNotifications()
  },

  //注册监听上传附件成功通知,需要在onUnload注销通知
  registerNotifications() {
    var that = this
    //PurchaseConversionSelectedProductCompletionNotification
    app.notice.register('PurchaseConversionSelectedProductCompletionNotification', that.purchaseConversionSelectedProductCompletion, that)
    app.notice.register('CustomerNumSelectedItemCompletionNotification', that.customerNumSelectedItemCompletion, that)
  },

  //注销通知
  removeNotifications() {
    var that = this
    app.notice.remove("PurchaseConversionSelectedProductCompletionNotification", that.purchaseConversionSelectedProductCompletion)
    app.notice.remove("CustomerNumSelectedItemCompletionNotification", that.customerNumSelectedItemCompletion)
  },


  purchaseConversionSelectedProductCompletion: function(notification) {
    var that = this
    let userInfo = notification.userInfo
    let selectedProducts = userInfo.selectedProducts
    if (selectedProducts != null && selectedProducts.length > 0) {
      that.setData({
        selectedProductItem: selectedProducts[0],
        selectedProducts: selectedProducts
      })
    }
    console.log("userInfo = " + JSON.stringify(userInfo))
  },

  //监听
  customerNumSelectedItemCompletion: function(notification) {
    var that = this
    let userInfo = notification.userInfo
    let selectedCustomerItem = userInfo.selectedCustomerItem
    if (selectedCustomerItem != null) {
      that.setData({
        selectedCustomerItem: selectedCustomerItem,
      })
    }
    console.log("userInfo = " + JSON.stringify(selectedCustomerItem))
  },

  submit: function(options) {
    var that = this

    that.requestSubmitPurchaseConversion()
  },

  bindTextAreaBlur: function(e) {
    console.log(e.detail.value)
    var that = this
    that.setData({
      buyDesc: e.detail.value,
    })
  },

  bindlinechange: function(e) {
    console.log(e.detail.value)
    var that = this
    that.setData({
      buyDesc: e.detail.value,
    })
  },

  phoneNumberInput: function(e) {
    console.log(e.detail.value)
    var that = this
    that.setData({
      phoneNumber: e.detail.value,
    })
  },

  /**
   * 请求转发情况数据
   */
  requestSubmitPurchaseConversion: function() {
    var that = this
    let customer = that.data.selectedCustomerItem.customer
    let selectedCustomerItem = that.data.selectedCustomerItem
    let selectedProductItem = that.data.selectedProducts[0]
    let buyDesc = that.data.buyDesc
    let buyTime = that.data.buyTimeString
    let customerHeadImg = customer.customerAvatarUrl
    let customerMobilePhone = that.data.phoneNumber
    let customerNikeName = customer.customerNickName
    let customerOpenId = customer.openId ? customer.openId : selectedCustomerItem.customerOpenId
    let productIds = []
    if (selectedProductItem !=  null) {
      productIds = [selectedProductItem.productId]
    }
    let proofImgs = that.data.proofImgs
    let shoppingGuideId = wx.getStorageSync('shoppingGuideId');

    if (productIds == null || productIds.length == 0) {
      wx.showToast({
        title: '请选择机型',
        icon: "none"
      })
      return

    } else if (customer.customerNickName == "请选择粉丝") {
      wx.showToast({
        title: '请选择粉丝',
        icon: "none"
      })
      return 

    } else if (buyTime == "请选择时间") {
      wx.showToast({
        title: '请选择时间',
        icon: "none"
      })
    } else if (customerMobilePhone == null || customerMobilePhone.length == 0) {
      wx.showToast({
        title: '请输入手机号',
        icon: "none"
      })

      return
    }
    else if (customerMobilePhone > 0 && customerMobilePhone.length < 11) {
        wx.showToast({
          title: '手机号格式有误',
          icon: "none"
        })

      return
    } else if (proofImgs == null || proofImgs.length == 0) {
      wx.showToast({
        title: '请上传购买凭证',
        icon: "none"
      })
      return
    } else if (proofImgs.length < 4) {
      wx.showToast({
        title: '必须上传1张保卡、3张聊天记录才能提交哦',
        icon:"none"
      })
      return
    } else {

      app.sendAjax({
        url: 'rest/rePurchaseConversion',
        data: {
          "buyDesc": buyDesc,
          "buyTime": buyTime,
          "customerHeadImg": customerHeadImg,
          "customerMobilePhone": customerMobilePhone,
          "customerNikeName": customerNikeName,
          "customerOpenId": customerOpenId,
          "productIds": productIds,
          "proofImgs": proofImgs,
          "shoppingGuideId": shoppingGuideId,
        },
        success: function(res) {
          console.log("\n\n\n rest/rePurchaseConversion submit \n" + JSON.stringify(res))
          if (res.respCode == "r0001") {
            wx.showToast({
              title: '提交成功'
            })

            wx.navigateBack()
          }
          
        },
        fail: function(res) {}
      })
    }
  },
  /**
   * 请求转发情况数据
   */
  requestPurchaseConversionInfo: function() {
    var that = this
    let conversionId = that.data.optionsItem.id
    app.sendAjax({
      url: 'rest/rePurchaseConversion/' + conversionId,
      data: {},
      success: function(res) {
        console.log("\n\n\n rest/rePurchaseConversion \n" + JSON.stringify(res))
        let buyDate = new Date(moment(res.data.buyTime, moment.ISO_8601))
        let buyTimeString = util.dateFormat(that.dateFormatString(), buyDate)

        that.setData({
          conversionResData: res.data,
          buyTimeString: buyTimeString
        })
      },
      fail: function(res) {}
    })
  },

  /**
   * 上传图片
   */
  updataImg() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let tempFilePaths = res.tempFilePaths
        // 上传文件
        wx.uploadFile({
          url: app.globalData.url + '/ossUpload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {},
          success(res) {
            let data = JSON.parse(res.data)
            var proofImgs = that.data.proofImgs
            if (proofImgs == null) {
              proofImgs = []
            }
            let imgUrl = data.msg
            proofImgs.push(imgUrl)

            that.setData({
              proofImgs: proofImgs
            })

            let timer = setTimeout(function() {
              wx.pageScrollTo({
                scrollTop: 999999,
              })
            }, 0.33 * 1000);
            clearInterval(timer)
          }
        })

      }
    })
  },

  /**
   * 删除单个图片
   */
  deleteData(e) {
    var that = this
    let dataset = e.currentTarget.dataset
    let idx = dataset.idx

    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success(res) {
        if (res.confirm) {
          var proofImgs = that.data.proofImgs
          if (proofImgs != null && proofImgs.length > 0) {
            proofImgs.splice(idx, 1)
            that.setData({
              proofImgs: proofImgs
            })
          }
        }
      }
    })
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

  dateFormatString() {
    return "YYYY-mm-dd"
  },

  /**
   * 日期选择
   */
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail);
    var that = this

    var selectedDateStart = new Date(moment(e.detail.value, moment.ISO_8601))
    let isBefore = moment(that.data.maxDate).isBefore(selectedDateStart)
    let buyTimeString = e.detail.value
    if (isBefore) {
      wx.showToast({
        title: '不能超过当前时间',
      })

      selectedDateStart = new Date(moment(that.data.maxDate, moment.ISO_8601))
      buyTimeString = util.dateFormat(that.dateFormatString(), selectedDateStart)
    }

    that.setData({
      buyTime: selectedDateStart,
      buyTimeString: buyTimeString,
    })
  },

  addImageTap: function() {
    let that = this;
    that.updataImg();

  //   wx.showActionSheet({
  //     itemList: ['照片', '拍照'],
  //     success(res) {
  //       console.log(res.tapIndex)
  //       if (res.tapIndex == 0) {
  //         that.updataImg();
  //       } else {
  //         that.updataVideo();
  //       }
  //     },
  //     fail(res) {
  //       console.log(res.errMsg)
  //     }
  //   })
  // },
  }

})