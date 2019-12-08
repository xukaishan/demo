// miniprogram/pages/index/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 800,
    imgheadurl: app.globalData.url,
    isLogined: false,
    templateList:[],
    templateRecord:[],
  },

  /**
   * 获取轮播
   */
  banner: function () {
    var that = this;
    app.sendAjax({
      url: 'carousel/list',
      data: {
        "carouselCategoryCode": "home"
      },
      success: function (res) {
        wx.stopPullDownRefresh();

        console.log(res);
        if (res.code == "200") {
          that.setData({
            imgUrls: res.data
          })
        } else {
          console.log('获取轮播失败')
        }
        
      },
      fail: function (res) {
        wx.stopPullDownRefresh();
      }
    })
  },
  /**
   * 打开web页面
   */
  openWeb: function (e) {
    // console.log('-------openWeb---');
    // console.info(e.currentTarget.dataset);

    let carouseltype = e.currentTarget.dataset.carouseltype * 1;
    switch (carouseltype) {
      case 1: {
        break;
      }

      case 2: {
        wx.navigateTo({
          url: '/pages/webs/webs?h5url=' + e.currentTarget.dataset.url,
        })
        break;
      }

      case 3: {
        break;
      }

      case 4: {
        wx.navigateTo({
          url: '/pages/onlineDetails/onlineDetails?aimid=' + e.currentTarget.dataset.refmodule + '&accessType=2',
        })
        break;
      }
      //操作视频
      case 5: {
        app.sendAjax({
          url: 'operavideo/info',
          data: {
            "operavideoId": e.currentTarget.dataset.refmodule,
          },
          success: function (res) {
            console.log(res)
            wx.navigateTo({
              url: '/pages/operationDetails/operationDetails?url=' + res.data.h5LinkUrl + '&aimid=' + res.data.operavideoId + '&shareChannelid=' + this.data.channels + '&current=true&videoId=' + res.data.operavideoId + '&operavideotype=' + res.data.operavideoType,
            })
          },
          fail: function (res) {

          }
        })
        break;
      }
      //资源链接
      case 6: {
        console.log(e)
        console.log(e.currentTarget.dataset.refmodule)
        app.sendAjax({
          url: 'product/info',
          data: {
            "productId": e.currentTarget.dataset.refmodule,
          },
          success: function (res) {
            console.log(res)
            wx.navigateTo({
              url: '/pages/web/web?url=' + res.data.h5LinkUrl + '&aimid=' + res.data.productId + '&shareChannelid=' + this.data.shareChannelId + '&current=true' + '&productname=' + res.data.productName ,
            })
          },
          fail: function (res) { 

          }
        })
        break;
      }
      //物料库
      case 7: {
        app.sendAjax({
          url: 'supplies/info',
          data: {
            "suppliesId": e.currentTarget.dataset.refmodule,
          },
          success: function (res) {
            console.log(res)
            wx.navigateTo({
              url: '/pages/materialDetails/materialDetails?url=' + res.data.h5LinkUrl + '&aimid=' + res.data.suppliesId + '&shareChannelId=' + this.data.shareChannelId + '&current=true' + '&suppliesName=' + res.data.suppliesName,
            })
          },
          fail: function (res) {

          }
        })
        break;
      }
      //培训视频
      case 8: {
        app.sendAjax({
          url: 'trainingMaterials/info',
          data: {
            "trainingDataId": e.currentTarget.dataset.refmodule,
          },
          success: function (res) {
            console.log(res)
            wx.navigateTo({
              url: '/pages/trainingDetails/trainingDetails?url=' + res.data.videoUrl + '&share=' + res.data.share + '&content=' + res.data.trainingDataDesc + '&title=' + res.data.trainingDataName + '&dataid=' + res.data.trainingDataId,
            })
          },
          fail: function (res) {

          }
        })
        break;
      }
    }
  },
  //获取模板集合
  getMessageTemplate: function () {
    var that = this;
    app.sendAjax({
      url: 'subscribeMessage/getTemplateList',
      method: 'post',
      success: function (res) {
        // console.log(res)
        if (res.code == "200") {
          console.log(res)
          if(res.data.length > 0){
            var templates = res.data;
            that.data.templateList = [];
            for(var i in templates){
              that.data.templateList.push(templates[i].templateId);
            }
            // console.log(that.data.templateList)
          }
        } else {
          // console.log('获取分享渠道失败')
        }
      },
      fail: function (res) { }
    })
  },

  //请求订阅
  requestSubscribe: function (customerOpenId) {
    console.log("\n\n\n\nrequestSubscribe")
    console.log("用户id:"+customerOpenId)
    var that = this;
    var tmplIds = that.data.templateList;
    console.log(tmplIds)
    console.log("模板id的长度为:" + that.data.templateList.length)
    if(that.data.templateList.length <=0){
      return;
    }
    wx.requestSubscribeMessage({
      tmplIds: tmplIds,
      success(res) {
        that.data.templateRecord = [];
        for(var i in tmplIds){
          if (!res[tmplIds[i]]){
            continue;
          }
          var entity = {
            "status": res[tmplIds[i]],
            "templateId":tmplIds[i]
          };
          that.data.templateRecord.push(entity)
          that.saveSubscribeMessageRecord(customerOpenId);
          // if ('accept' === res[tmplIds[i]]){//同意订阅
          //   //保存订阅记录
          //   saveSubscribeMessageRecord(customerOpenId, tmplIds[i]);
          // }
        }
      },
      fail(res) {
        console.log(res);
      },
      complete(res) {
        console.log(res);
      }
    })

  },
  //保存订阅消息记录
  saveSubscribeMessageRecord: function (customerOpenId){
    var that = this;
    console.log(that.data.templateRecord)
    console.log(customerOpenId)
    var recordList = that.data.templateRecord;
    if (customerOpenId && that.data.templateRecord.length>0){
      app.sendAjax({
        url: 'subscribeMessage/uploadCustomerSubscribeRecord',
        data: {
          "customerId": customerOpenId,
          "templateList": recordList
        },
        success: function (res) {
          console.log(res)
        },
        fail: function (res) {

        }
      })
    }
  },

  //打开产品推荐
  openRecommend: function () {
    var that = this;
    var customerOpenId = wx.getStorageSync('openId');
    console.log(customerOpenId)
    if(customerOpenId){
      console.log("申请订阅")
      that.requestSubscribe(customerOpenId);
    }
    wx.navigateTo({
      url: '/pages/Recommend/Recommend',
    })
  },

  //打开操作视频
  operationalVideo: function () {
    wx.navigateTo({
      url: '/pages/operationalVideo/operationalVideo',
    })
  },
  /**
   * 打开内容链接
   */
  contentLinks: function () {
    wx.navigateTo({
      url: '/pages/contentLinks/contentLinks',
    })
  },
  //打开培训资料库
  openTrain: function () {
    wx.navigateTo({
      url: '/pages/train/train',
    })
  },

  //打助销库
  auxiliarySales: function () {
    wx.navigateTo({
      url: '/pages/auxiliarySales/auxiliarySales',
    })
  },
  /**
   * 打开公告
   */
  openNotice: function () {
    wx.navigateTo({
      url: '/pages/Notice/Notice',
    })
  },
  /**
   * 打开在线教育内容
   */
  openOnlineEducation() {
    wx.navigateTo({
      url: '/pages/onlineEducation/onlineEducation',
    })
  },
  
  /**
   * 验证openId是否为空
   */
  loginOpenId: function () {
    var that = this;
    app.sendAjax({
      url: 'guide/verify/mobilePhone',
      data: {
        "mobilePhoneNum": app.getMobilePhoneNum()
      },
      success: function (res) {
        console.info(JSON.stringify(res));
        if (res.code == 401) {
          wx.redirectTo({
            url: '/pages/userAuthorization/userAuthorization',
          })
        } else {
          return false;
        }
      },
      fail: function (res) {

      }
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabBar();//添加tabBar数据  

    var that = this
    let shoppingGuideId = wx.getStorageSync('shoppingGuideId')
    if (shoppingGuideId) {
      that.banner();

      //导购登录才获取订阅模板
      // that.getMessageTemplate();
    }
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
    //验证是否第一次
    var that = this
    let shoppingGuideId = wx.getStorageSync('shoppingGuideId')
    console.log('shoppingGuideId' + shoppingGuideId)
    if (!shoppingGuideId) {
      console.log('not Logined' + shoppingGuideId)
      that.setData({
        isLogined: false,
      })
    }
    else {
      console.log('has Logined' + shoppingGuideId)
      that.setData({
        isLogined: true,
      })

      if (that.data.imgUrls.length <= 0) {
        that.banner();
      }
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
    // console.log('---------onPullDownRefresh-----');
    this.data.isLogined ? this.banner() : wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})