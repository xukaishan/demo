// pages/Course/Course.js
var util = require('../../utils/md5.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBtn: false,
    tab: null,
    cityList: null,
    cityJson: null,
    cityActive1: 0,
    cityActive2: 0,
    cityActive3: null,
    btnNum: 0,
    commodityList: 20,
    slectBtn: [],
    citytxt1: null,
    citytxt2: null,
    citytxt3: null,
    province: null, //省
    city: null, //市
    area: null, //区
    cityNum: null,//选择地区的编号
    region: "区域",
    sessionId:null
  },
  /**
   * 获取地区
   */
  oderCity: function() {
    var that = this;
    app.sendAjax({
      url: 'noaheduapi/api/arear/selectArear',
      data: {},
      success: function(res) {
        if (res.code == "309") {
          // console.log(JSON.stringify(res) + '获取地区列表')
          that.setData({
            cityJson: res.resp
          })
          that.provinces();
        } else {
          console.log('获取地区列表失败')
        }
      },
      fail: function(res) {}
    }, 'http://www.noahedu.com/')
  },
  /**
   * 一级选择
   */
  clickTab: function(e) {
    var that = this;
    if (e.target.dataset.current === '1') {
      that.setData({
        slectBtn: ['所有年级', '小学', '初中', '高中'],
        btnNum: 0,
        cityList: 1
      })
    } else if (e.target.dataset.current === "2") {
      that.setData({
        slectBtn: ['全部', '语文', '数学', '英语', '物理', '化学', '生物', '思想品德'],
        btnNum: 0,
        cityList: 1
      })
    } else {
      that.setData({
        // slectBtn: ['全部', '语文', '数学', '英语', '物理', '化学', '生物', '思想品德'],
        // btnNum: 0,
        cityList: 2
      })
    }
    
    if (this.data.tab === e.target.dataset.current) {

      if (this.data.showBtn == true) {
        that.setData({
          tab: null,
          showBtn: false
        })
      } else {
        that.setData({
          tab: e.target.dataset.current,
          showBtn: true
        })
      }

    } else {
      that.setData({
        tab: e.target.dataset.current,
        showBtn: true
      })
    }
  },
  /**
   * 二级选择
   */
  clickBtnNum: function(e) {
    var that = this;
    if (this.data.btnNum === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        btnNum: e.target.dataset.current,
        // citytxt2: cityJson[e.target.dataset.current]
      })
    }
  },
  /**
   * 城市选择
   */
  citySlect: function(e) {
    console.info(e)
    var that = this;
    if (that.data.cityActive1 === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        cityActive1: e.target.dataset.current,
        citytxt1: e.target.dataset.name,
        cityActive2: 0,
        cityActive3: null,
      })
      that.citys(e.target.dataset.fatherid);
    }
  },
  citySlect1: function(e) {
    var that = this;
    if (that.data.cityActive2 === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        cityActive2: e.target.dataset.current,
        citytxt2: e.target.dataset.name,
        cityActive3: null,
      })
      that.areas(e.target.dataset.fatherid);
    }
  },
  citySlect2: function(e) {
    var that = this;
    if (that.data.cityActive3 === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        cityActive3: e.target.dataset.current,
        citytxt3: e.target.dataset.name,
        cityNum: e.target.dataset.fatherid
      })
    }
    var dz = that.data.citytxt1 + that.data.citytxt2 + that.data.citytxt3;
    console.info(dz);
    console.info(that.data.cityNum);
    that.setData({
      cityActive3: e.target.dataset.current,
      citytxt3: e.target.dataset.name,
      showBtn: false,
      region: dz
    })
  },
  /**
   * 获取省
   */
  provinces: function() {
    var that = this;
    var list = [];
    var txt = null;
    for (var i = 0; i < that.data.cityJson.length; i++) {
      if (that.data.cityJson[i].father == 0) {
        list.push(that.data.cityJson[i]);
      }
    }
    txt = list[0].areaname;
    that.setData({
      province: list,
      citytxt1: txt
    })
    that.citys(110000)
  },
  /**
   * 获取市
   */
  citys: function(areaid) {
    var that = this;
    var list = [];
    var txt = null;
    for (var i = 0; i < that.data.cityJson.length; i++) {
      if (that.data.cityJson[i].father == areaid) {
        list.push(that.data.cityJson[i]);
      }
    }
    txt = list[0].areaname;
    that.setData({
      city: list,
      citytxt2: txt
    })
    this.areas(that.data.city[0].areaid)
  },
  /**
   * 获取区
   */
  areas: function(areaid) {
    var that = this;
    var list = [];
    for (var i = 0; i < that.data.cityJson.length; i++) {
      if (that.data.cityJson[i].father == areaid) {
        list.push(that.data.cityJson[i]);
      }
    }
    that.setData({
      area: list
    })
  },
  /**
   * 调用登录接口获取权限
   */
  loginUser: function() {
    var that = this;
    var mm = util.hexMD5(123456); 
    app.sendAjax({
      url: 'ext/getCookie?url=http://sales.noahedu.com/sale/userLogin?username=nbsy&password=e10adc3949ba59abbe56e057f20f883e&devicecode=717BE7B6-E6E0-4073-BCB3-4E6B140A8451&version=3.6.3&flag=1',
      method: 'get',
      success: function (res) {
        if(res){
          var date = res.substr(0, res.length - 1);
          that.setData({
            sessionId: date
          })
          console.info(date+'第三方登录接口调用成功');
          that.subject();
        }
      },
      fail: function (res) { }
    })
  },
  /**
   * 年级科目获取
   */
  subject: function() {
    var that = this;
    var mm = util.hexMD5(123456);
    app.sendAjax({
      url: 'ext/send?url=http://sales.noahedu.com/sale/textbook/gradeInfo',
      method: 'get',
      success: function (res) {
        if (res) {
          console.info(JSON.stringify(res));
        }
      },
      fail: function (res) { }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.oderCity();
    this.loginUser();

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