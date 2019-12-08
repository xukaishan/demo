// pages/Course/Course.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    showBtn: false,
    slect2: false,
    tab: 0,
    tab1: null,
    tab2: null,
    cityList: null,
    cityJson: null,
    cityActive1: 0,
    cityActive2: 0,
    cityActive3: 0,
    btnNum: 0,
    commodityList: null,
    slectBtn: [],
    citytxt2: null,
    citytxt3: null,
    tabData1:null,
    tabData2:null,
    tabData3:null,
    showDown: true,
    bottomTxt: '往下滑，查看更多~',
    statNum: 1,
    pageNum: null,//当前列表页数
    slectId:null,
    imgheadurl: app.globalData.url
  },

  openDetailist: function (e) {
    console.info('openDetailist \n' + e);

    let dataset = e.currentTarget.dataset;
    let item = dataset.item;
    wx.navigateTo({
      url: '/pages/trainingDetails/trainingDetails?url=' + item.videoUrl + '&share=' + item.share + '&content=' + item.trainingDataDesc + '&title=' + item.trainingDataName + '&dataid=' + item.trainingDataId,
    })
  },

  /**
   * 一级选择 tabData2: res.data[0].children,
            tabData3: res.data[0].children[0].children,
   */
  clickTab: function (e) {
    var that = this;
    that.setData({
      statNum: 1,
      bottomTxt: '往下滑，查看更多~',
      commodityList: [],
    })
    console.info(e)
    if (that.data.tab === e.target.dataset.current && e.target.dataset.last==0){
      if(that.data.showBtn){
        that.setData({
          showBtn: false
        })
      }else{
        that.setData({
          tabData2: that.data.tabData1[e.target.dataset.current].children,
          showBtn: true
        })
      }
    }else{
      that.setData({
        tabData2: null,
        showBtn: false,
        slect2: false
      })
      if (e.target.dataset.last == 0){
        that.setData({
          tabData2: that.data.tabData1[e.target.dataset.current].children,
          tab: e.target.dataset.current,
          showBtn: true
        })
      }else{
        that.setData({
          tabData2:null,
          tab: e.target.dataset.current,
          slectId: e.target.dataset.setid
        })
        that.videoList(e.target.dataset.setid);
      }
      console.info(JSON.stringify(that.data.tabData2)+"数据--------------------")
    }
  },
  /**
   * 二级选择
   */
  clickTab1:function(e){
    var that = this;
    console.info(e.target.dataset.current)
    if (that.data.tab1 === e.target.dataset.current && e.target.dataset.last == 0) {
      if (that.data.slect2) {
        that.setData({
          slect2: false
        })
      } else {
        that.setData({
          tabData3: that.data.tabData2[e.target.dataset.current].children,
          slect2: true
        })
      }
    } else {
      if (e.target.dataset.last == 0){
        that.setData({
          tabData3: that.data.tabData2[e.target.dataset.current].children,
          tab1: e.target.dataset.current,
          slect2: true
        })
      }else{
        that.setData({
          tab1: e.target.dataset.current,
          slectId: e.target.dataset.setid
        })
        that.videoList(e.target.dataset.setid);
      }
    }
  },
  /**
   * 三级选择
   */
  clickTab2: function (e) {
    var that = this;
    console.info(e.target.dataset.current)
    if (that.data.tab2 === e.target.dataset.current && e.target.dataset.last == 0) {
      if (that.data.slect2) {
        that.setData({
          slect2: false
        })
      } else {
        that.setData({
          slect2: true
        })
      }
    } else {
      if (e.target.dataset.last == 0) {
        that.setData({
          tabData3: that.data.tabData2[e.target.dataset.current].children,
          tab2: e.target.dataset.current,
          slect2: true
        })
      } else {
        that.setData({
          tab2: e.target.dataset.current,
          slectId: e.target.dataset.setid
        })
        that.videoList(e.target.dataset.setid);
      }
    }
  },
 
  /**
   * 获取TAB数据
   */
  tabDatas:function(num){
    var that = this;

    let shoppingGuideId = wx.getStorageSync('shoppingGuideId')

    app.sendAjax({
      url: 'trainingMaterials/cateroty/tree',
      data: {
        "parentId": num,
        "shoppingGuideId": shoppingGuideId,
      },
      success: function (res) {
        console.log(res);
        if (res.code == "200") {
          that.setData({
            tabData1: res.data,
          })
          if(res.data[0].last==1){
            that.videoList(res.data[0].id)
            that.setData({
              slectId: res.data[0].id,
            })
          }else{
            if (res.data[0].children[0].last==1){
              that.videoList(res.data[0].children[0].id)
              that.setData({
                slectId: res.data[0].children[0].id,
              })
            }else{
              if (res.data[0].children[0].children[0].last==1){
                that.videoList(res.data[0].children[0].children[0].id)
                that.setData({
                  slectId: res.data[0].children[0].children[0].id,
                })
              }
            }
          }
        } else {
          console.log('获取问题列表失败')
        }
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
    that.videoList(that.data.slectId, e.detail.value);
  },
  /**
     * 获取详情列表
     */
  videoList: function (id,val) {
    var that = this;
    let shoppingGuideId = wx.getStorageSync('shoppingGuideId')
    app.sendAjax({
      url: 'trainingMaterials/list',
      data: {
        "keyword": val||"",
        "page": that.data.statNum,
        "pageSize": 10,
        "trainingCategoryId": id,
        "shoppingGuideId": shoppingGuideId,
      },
      success: function (res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) + '获取视频列表')
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
          if (res.data.totalCount <= 10) {
            that.setData({
              bottomTxt: '暂无更多数据加载~'
            })
          }
          that.setData({
            commodityList: arr,
            pageNum: res.data.totalPage ,
            showBtn: false,
            slect2: false,
          })
        } else {
          console.log('获取视频列表失败')
        }
      },
      fail: function (res) { }
    })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.info(options)
    this.setData({
      id: options.id
    })
    // this.videoList(options.id);
    if(options.last==0){
      this.tabDatas(options.id);
    }else{
      this.setData({
        showDown:false
      })
      this.videoList(options.id);
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
      this.videoList(that.data.slectId);
    } else {
      that.setData({
        bottomTxt: '暂无更多数据加载~'
      })
      return false
    }
  },
})