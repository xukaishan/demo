// pages/materialDetails/materialDetails.js
let app = getApp();
let WxParse = require('../../wxParse/wxParse.js');
// let util = require("/utils/util.js");
let util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoUrl: null,
    trackStartTimestamp: 0,
    id: '',
    imgheadurl: app.globalData.url,
    playData: 0,
    openid: null,
    userNames: null,
    userAvatars: null,
    unid: '',
    shareid: '',
    imgUrlList: null,
    indicatorDots: true,
    autoplay: true,
    suppliesType: 0,
    isHiddenGraphTextTitle: 1,
    suppliesVideoList: null,
    suppliesVideoContentList: null,
    suppliesId:null,
    suppliesName:null,
  },


  /**
   * 开始播放
   */
  openPlay() {
    let that = this;
    that.setData({
      playData: 1
    })
    if (that.data.trackStartTimestamp == 0) {
      that.setData({
        trackStartTimestamp: util.millisecondTimestamp(),
      })
    }
  },
  /**
   * 调用上传视频浏览时长
   */
  browseTacking(isCreate) {
    var that = this;
    that.setData({
      playData: 0
    })

    let shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    app.sendAjax1({
      url: 'supplies/browse',
      data: {
        "id": isCreate ? "": that.data.id,
        "shoppingGuideId": shoppingGuideId,
        "suppliesId": that.data.suppliesId,
        "suppliesName": that.data.suppliesName,
        "trackStartTimestamp": that.data.trackStartTimestamp,
        "trackEndTimestamp": util.millisecondTimestamp(),
      },
      success: function(res) {
        if (res.code == "200") {
          console.log('----------' + JSON.stringify(res))
          console.info(res);
          that.setData({
            id: res.data.id,
          })
        } else {
          console.log('数据失败' + JSON.stringify(res))
        }
      },
      fail: function(res) {
        console.log('数据失败' + JSON.stringify(res))
      }
    })
  },

  
  /**
   * 查询视频页面详情
   */
  queryInfo(id) {
    wx.showLoading()
    var that = this;
    app.sendAjax({
      url: 'supplies/info',
      data: {
        "suppliesId": id,
      },
      success: function(res) {
        console.info('---------supplies info ----------\n' + JSON.stringify(res));

        let suppliesType = res.data.suppliesType * 1;
        that.setData({
          suppliesType: suppliesType,
          suppliesId: res.data.suppliesId,
          suppliesName: res.data.suppliesName,
        })

        switch (suppliesType) {
          case 1:
            {
              that.setData({
                videoUrl: res.data.suppliesVideoUrl,
                operavideoDesc: res.data.suppliesVideoDesc,
                id: id,
                isHiddenGraphTextTitle: res.data.showContent,
                suppliesVideoList: res.data.suppliesVideoList,
              })

              for (let i = 0; i < that.data.suppliesVideoList.length; i++) {
                WxParse.wxParse('suppliesVideoContent' + i, 'html', that.data.suppliesVideoList[i].suppliesVideoContent, that);
                if (i === that.data.suppliesVideoList.length - 1) {
                  WxParse.wxParseTemArray("suppliesVideoContentList", 'suppliesVideoContent', that.data.suppliesVideoList.length, that)
                }
              }
            }
            break;
          case 2:
            {
              that.setData({
                operavideoDesc: res.data.suppliesVideoDesc,
                id: id,
                isHiddenGraphTextTitle: res.data.showContent,
              })

              console.log('---------res.data.suppliesContent')
              console.info(res.data.suppliesContent);

              let article = res.data.suppliesContent;
              WxParse.wxParse('article', 'html', article, that);
            }
            break;
          case 3:
            {
              that.setData({
                h5Url: res.data.h5LinkUrl,
              })
            }
            break;

          default:
            break;
        }
        wx.hideLoading();
      },
      fail: function(res) {}
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    wx.setNavigationBarTitle ({
      title: options.suppliesName,
    })
    console.info(options);
    var that = this;

    this.queryInfo(options.aimid)
    that.setData({
      trackStartTimestamp: util.millisecondTimestamp(),
      id: '',
      suppliesId: options.aimid,
      suppliesName:options.suppliesName,
    })
    that.browseTacking(true);
  },
  /**


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
    console.log('browseTacking')
    let that = this;
    that.browseTacking(false);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log('onUnload')
    //返回按钮，或者返回手势调用
    let that = this;

    that.browseTacking(false);
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