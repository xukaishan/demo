const app = getApp();
const util = require('../../utils/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    array: ['男', '女'],
    index: 1,
    arraywd: ['网点一', '网点二'],
    indexwd: 0,
    date: '请选择日期',
    region: ['', '', '请选择地区'],
    identity: '教育顾问',
    showCity: false,
    showDot: false,
    isupdate: false,
    city1: null,
    city2: null,
    city3: null,
    cityindex1: 0,
    cityindex2: 0,
    cityindex3: 0,
    cityName1: null,
    cityName2: null,
    cityName3: null,
    cityName: "请选择",
    clickDot:0,
    codes: null,
    dotName: null,
    dotName1: "请选择",
    dotCode: null,
  },
  //打开网点
  openDot: function () {
    var that = this;
    that.setData({
      showDot: true
    })
    that.dot();
  },
  //确定网点
  suerDot: function () {
    if (this.data.dotName!=null){
      this.setData({
        dotName1: this.data.dotName
      })
    }
    this.closeDot();
  },
  //关闭网点
  closeDot: function () {
    var that = this;
    that.setData({
      showDot: false
    })
  },
  //选择网点名称
  clickDot: function (e) {
    console.info(e);
    if (this.data.clickDot === e.target.dataset.index) {
      this.setData({
        dotName: e.target.dataset.name
      })
      return false;
    } else {
      this.setData({
        clickDot: e.target.dataset.index,
        dotCode: e.target.dataset.code,
        dotName: e.target.dataset.name

      })
    }
  },
  //调用查询网点
  dot: function () {
    var that = this;
    app.sendAjax({
      url: 'common/terminal/list',
      data: {
        "fullAddressIds": that.data.codes
      },
      success: function (res) {
        console.log(JSON.stringify(res));
        var arr = []
        for (var i = 0; i < res.data.length; i++) {
          arr.push(res.data[i].shopName)
        }
        that.setData({
          arraywd: res.data,
          dotName1: res.data[0].shopName,
          dotCode: res.data[0].terminalId
        })
      },
      fail: function (res) {

      }
    })
  },
  //确定城市
  suercity: function () {
    console.info(this.data.cityName1 + this.data.cityName2 + this.data.cityName3)
    var name = this.data.cityName1 + "-" + this.data.cityName2 + "-" + this.data.cityName3
    this.setData({
      cityName: name
    })
    console.info(this.data.codes)
    this.closeCitys();
    this.dot(this.data.codes)
  },
  //打开城市
  openCitys: function () {
    this.setData({
      showCity: true,
      cityindex1: 0,
    })
    this.openCity(0);
    console.info(this.data.showCity)
  },
  //关闭城市
  closeCitys: function () {
    this.setData({
      showCity: false,
      city1: null,
      city2: null,
      city3: null,
    })
  },
  //选择
  clickTab: function (e) {
    console.info(e);
    if (this.data.cityindex1 === e.target.dataset.index) {
      this.openCity1(e.target.dataset.current);
      return false;
    } else {
      this.setData({
        cityindex1: e.target.dataset.index,
        cityindex2: 0,
        cityindex3: 0,
        city2: null,
        city3: null,
        codes: e.target.dataset.code,
        cityName1: e.target.dataset.name
      })
    }
    this.openCity1(e.target.dataset.current);
  },
  clickTab1: function (e) {
    console.info(e);
    if (this.data.cityindex2 === e.target.dataset.index) {
      this.openCity2(e.target.dataset.current);
      return false;
    } else {
      this.setData({
        cityindex2: e.target.dataset.index,
        cityindex3: 0,
        city3: null,
        codes: e.target.dataset.code,
        cityName2: e.target.dataset.name

      })
    }
    this.openCity2(e.target.dataset.current);
  },
  clickTab2: function (e) {
    console.info(e);
    if (this.data.cityindex3 === e.target.dataset.index) {
      return false;
    } else {
      this.setData({
        cityindex3: e.target.dataset.index,
        codes: e.target.dataset.code,
        cityName3: e.target.dataset.name

      })
    }
  },
  // 获取省
  openCity: function (code) {
    var that = this;
    app.sendAjax({
      url: 'common/region/list',
      data: {
        "parentId": code
      },
      success: function (res) {
        console.log(JSON.stringify(res));
        that.setData({
          city1: res.data,
          codes: res.data[0].fullPath,
          cityName1: res.data[0].regionName
        })
      },
      fail: function (res) {

      }
    })
  },
  // 获取城市
  openCity1: function (code) {
    var that = this;
    app.sendAjax({
      url: 'common/region/list',
      data: {
        "parentId": code
      },
      success: function (res) {
        console.log(JSON.stringify(res));
        that.setData({
          city2: res.data,
          codes: res.data[0].fullPath,
          cityName2: res.data[0].regionName
        })
      },
      fail: function (res) {

      }
    })
  },

  // 获取城区
  openCity2: function (code) {
    var that = this;
    app.sendAjax({
      url: 'common/region/list',
      data: {
        "parentId": code
      },
      success: function (res) {
        console.log(JSON.stringify(res));
        that.setData({
          city3: res.data,
          codes: res.data[0].fullPath,
          cityName3: res.data[0].regionName
        })
      },
      fail: function (res) {

      }
    })
  },


  openIndex: function () {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  //选头像
  selectimg: function () {
    var that = this;
    
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        wx.showLoading({
          mask: true
        });
        console.log(res.tempFilePaths[0]);
        var imgurl = res.tempFilePaths[0]
        wx.compressImage({
          src: imgurl, // 图片路径
          quality: 60, // 压缩质量
          success(res) {
            console.log(res.tempFilePath);
            wx.uploadFile({
              url: app.globalData.url + '/ossUpload',
              filePath: res.tempFilePath,
              name: 'file',
              formData: {
                'user': 'test'
              },
              success(res) {
                console.log(res);
                var json = JSON.parse(res.data);
                console.log(json);
                if (json.code == 200) {
                  //上传成功 输出图片路径
                  console.log(json.msg);
                  that.setData({
                    headimg: app.globalData.url+json.msg
                  })
                } else {
                  wx.showToast({
                    title: '上传失败',
                    icon: 'none'
                  })
                }
              },
              complete: function () {
                wx.hideLoading();
              }
            })
          },
          fail(res) {
            console.log(res);
            wx.hideLoading();
          }
        })
      }
    })
  },
  //选男女
  pickChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      index: e.detail.value,
    })
  },
  //选入职时间
  bindDateChange: function (e) {
    console.log(e.detail);
    this.setData({
      date: e.detail.value
    })
  },
  //选城市
  bindRegionChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  //选网点
  pickChangewd: function (e) {
    console.log(e.detail.value)
    this.setData({
      indexwd: e.detail.value,
    })
  },
  //上传本人图片
  myphoto: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        //给服务器传入用户填写的信息
        wx.showLoading({
          mask: true
        });
        console.log(res);
        console.log(res.tempFilePaths[0]);
        var imgurl = res.tempFilePaths[0]
        wx.compressImage({
          src: imgurl, // 图片路径
          quality: 60, // 压缩质量
          success(res) {
            console.log(res.tempFilePath);
            wx.uploadFile({
              url: app.globalData.url + '/ossUpload',
              filePath: res.tempFilePath,
              name: 'file',
              formData: {
                'user': 'test'
              },
              success(res) {
                console.log(res);
                var json = JSON.parse(res.data);
                console.log(json);
                if (json.code == 200) {
                  //上传成功 输出图片路径
                  console.log(json.msg);
                  that.setData({
                    myphoto: app.globalData.url+json.msg
                  })
                } else {
                  wx.showToast({
                    title: '上传失败',
                    icon: 'none'
                  })
                }
              },
              complete: function () {
                wx.hideLoading();
              }
            })
          },
          fail(res) {
            console.log(res);
            wx.hideLoading();
          }
        })

      }
    })
  },

  //获取输入的姓名
  getname: function (e) {
    console.log(e.detail.value)
    this.setData({
      name: e.detail.value
    })
  },
  //this.data.index为男女
  //获取手机号
  getphone: function (e) {
    console.log(e.detail.value)
    this.setData({
      phone: e.detail.value
    })
  },
  //this.data.date为入职时间
  //this.data.region为省市区(数组)
  //获取身份
  // identity: function(e) {
  //   console.log(e.detail.value)
  //   this.setData({
  //     identity: e.detail.value
  //   })
  // },
  // //获取详细地址
  // getaddr: function(e) {
  //   console.log(e.detail.value)
  //   this.setData({
  //     addr: e.detail.value
  //   })
  // },
  //调用地图选择详细地址
  selectaddr: function () {
    var that = this
    util.requestUserLocationAuthorization(function (res) {
      if (res.isFirstUserLocationAuthorization) {
        that.selectAddressAfterAuthorization();
      }
      else {
        if (res.hasAuthorization) {
          that.selectAddressAfterAuthorization();
        }
      }
    })
 
  },

selectAddressAfterAuthorization:function () {
  console.log(11);
  wx.showLoading({
    mask: true
  });
  var that = this;
  //获取用户地理位置
  //选择地址
  wx.chooseLocation({
    success: function (res) {
      console.log(res);
      that.setData({
        addr: res.address
      })
    },
    complete: function () {
      wx.hideLoading();
    }
  })
},

  //this.data.wangdian为网点
  //提交认证
  submit: function () {
    var that = this;
    console.log(that.data.arraywd[that.data.indexwd])
    if (!that.data.headimg) {
      //头像不能为空
      wx.showToast({
        title: '请选择头像',
        icon: 'none'
      })
      return false;
    } else if (!that.data.name) {
      //姓名不能为空
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return false;
    } else if (!that.data.phone) {
      //手机号码不能为空
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return false;
    } else if (that.data.date == '请选择日期') {
      //入职时间不能为空
      wx.showToast({
        title: '请选择入职时间',
        icon: 'none'
      })
      return false;
    } else if (that.data.cityName == '请选择' || that.data.cityName==null) {
      //省市区不能为空
      wx.showToast({
        title: '请选择省市区',
        icon: 'none'
      })
      return false;
    } else if (!that.data.identity) {
      //身份不能为空
      wx.showToast({
        title: '请输入身份',
        icon: 'none'
      })
      return false;
    } else if (that.data.dotCode == '' || that.data.dotCode == null){
      wx.showToast({
        title: '请选择网点',
        icon: 'none'
      })
      return false;
    }else if (!that.data.addr) {
      //地址不能为空
      wx.showToast({
        title: '请选择地址',
        icon: 'none'
      })
      return false;
    } else if (that.data.myphoto == 'https://youxuepai-wechat.oss-cn-beijing.aliyuncs.com/yxp/answers.jpg' || that.data.myphoto == undefined || that.data.myphoto == null || that.data.myphoto == '') {
      //本人终端图片不能为空
      wx.showToast({
        title: '请上传本人终端照片',
        icon: 'none'
      })
      return false;
    } else {
      var that = this;
      //给服务器传入用户填写的信息
      app.sendAjax({
        url: 'guide/auth/info',
        data: {
          "mobilePhoneNum": that.data.phone
        },
        success: function (res) {
          console.log(res);
          if (res.code == 200) {
            console.log(that.data.headimg);
            var json = JSON.stringify(res.data);
            var jsonstr = JSON.parse(json);
            console.log(jsonstr);
            console.log(jsonstr.guideAuthenticationId);
            app.sendAjax({
              url: 'guide/auth/first/submit',
              data: {
                "address": that.data.cityName, //城市
                "authImgUrl": that.data.myphoto, //图片
                "detailAddress": that.data.addr, //详细地址
                "fullAddressIds": that.data.codes,//地址全路径
                "guideAuthenticationId": jsonstr.guideAuthenticationId, //认证id
                "headImgUrl": that.data.headimg, //导购头像
                "joinTime": that.data.date, //入职时间
                "postion": that.data.identity, //职务身份
                "realName": that.data.name, //姓名
                "sex": that.data.index, //男女
                "terminalId":that.data.dotCode, //网点id
                "shoppingGuideId": wx.getStorageSync('shoppingGuideId') //导购id
              },
              success: function (res) {
                console.log(JSON.stringify(res)+'跳转index接口');
                if (res.code == 200) {
                  wx.setStorageSync('isfirst', true); //完成认证不再是第一次
                  console.log(res);
                  wx.redirectTo({
                    url: '/pages/code/code?showbtn=' + true,
                  })
                }
              },
              fail: function (res) {

              }
            })
          }
        },
        fail: function (res) {

        }
      })

    }
  },
/**
 * 获取当前用户的信息
 */
userInfo:function(phon){
  var that = this;
  app.sendAjax({
    url: 'guide/auth/info',
    data: {
      "mobilePhoneNum": phon
    },
    success: function (res) {
      // console.log(JSON.stringify(res));
      var info = res.data;
      console.info(info);
      // console.log(that.data.arraywd.indexOf(info.shopName));
      // that.setData({
      //   cityName: info.address,
      //   addr: info.detailAddress,
      //   dotName1: info.terminal.shopName,
      //   codes: info.fullAddressIds
      // })
      // wx.setStorageSync('terminalType ', res.data.terminal.terminalType);
    },
    fail: function (res) {

    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    console.log(wx.getStorageSync('headimg'));
    var that = this;
    that.userInfo(options.phone);
    var name;
    if (options.name) {
      name = options.name
    } else {
      name = ""
    }
    console.log(name);
    that.setData({
      phone: options.phone,
      headimg: wx.getStorageSync('headimg'),
      name: name
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})