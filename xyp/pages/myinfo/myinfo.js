var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['男', '女'],
    showCity: false,
    showDot: false,
    index: 1,
    arraywd: ['网点一', '网点二'],
    indexwd: 0,
    entryTime: '请选择日期',
    region: ['', '', '请选择地区'],
    customItem: '全部',
    postion: '教育顾问',
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
    cityName: null,
    codes: null,
    dotName: null,
    dotName1: null,
    clickDot: 0,
    dotCode: null,
    authState: null
  },
  //打开网点
  openDot: function () {
    var that = this;
    var codeAddress = that.data.codes;
    console.info(typeof (codeAddress));
    let arr = [];
    arr = codeAddress.split(",");
    console.info(arr.length)
    if (arr.length >= 3) {
      that.setData({
        showDot: true
      })
      that.dot();
    } else {
      that.openCitys();
    }

  },
  //确定网点
  suerDot: function () {
    if (this.data.dotName) {
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
    console.info(that.data.codes);
    app.sendAjax({
      url: 'common/terminal/list',
      data: {
        "fullAddressIds": that.data.codes
      },
      success: function (res) {
        console.log(JSON.stringify(res));
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
      cityName: name,
      clickDot: 0
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
  //用户编辑信息时显示提交按钮
  showbtn: function () {
    console.info(this.data.authState);
    if (this.data.authState == 1) {
      wx.showToast({
        title: '您的账号正在审核中,请等待耐心审核',
        icon: 'none'
      })
      return false;
    } else {
      if (this.data.isupdate) {
        this.updateinfo();
      } else {
        this.setData({
          isupdate: true
        })
      }
    }
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
                  wx.hideLoading();
                  //上传成功 输出图片路径
                  console.log(json.msg);
                  that.setData({
                    headimg: app.globalData.url + json.msg
                  })
                } else {
                  wx.showToast({
                    title: '上传失败',
                    icon: 'none'
                  })
                }
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
                    myphoto: app.globalData.url + json.msg
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
    var that = this;
    that.setData({
      name: e.detail.value
    })
  },
  //选男女
  pickChange: function (e) {
    console.log(e.detail.value)
    var that = this;
    that.setData({
      index: e.detail.value,
    })
  },
  //选城市
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var that = this;
    that.setData({
      region: e.detail.value
    })
  },
  //调用地图选择详细地址
  selectaddr: function () {
    var that = this;
    wx.showLoading({
      mask: true
    });
    //获取用户地理信息选择位置
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        that.setData({
          addr: res.address
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  //选入职时间
  bindDateChange: function (e) {
    console.log(e.detail);
    this.setData({
      entryTime: e.detail.value
    })
  },

  //选网点
  pickChangewd: function (e) {
    console.log(e.detail.value)
    var that = this;
    that.setData({
      indexwd: e.detail.value
    })
  },

  //提交修改的信息
  updateinfo: function () {
    var that = this;

    if (!that.data.headimg) {
      wx.showToast({
        title: '请选择头像',
      })
      return false;
    } else if (!that.data.name) {
      wx.showToast({
        title: '请输入姓名',
      })
      return false;
    } else if (!that.data.phone) {
      wx.showToast({
        title: '请输入手机号',
      })
      return false;
    }
    else if (that.data.entryTime == '请选择入职时间' || !that.data.entryTime) {
      wx.showToast({
        title: '请选择入职时间',
      })
      return ;
    }
    else if (that.data.cityName == '请选择' || that.data.cityName == null) {
      wx.showToast({
        title: '请选择省市区',
      })
      return false;
    } else if (that.data.dotCode == null || that.data.dotCode == '') {
      wx.showToast({
        title: '请选择网点',
      })
      return false;
    } else if (!that.data.addr) {
      //地址不能为空
      wx.showToast({
        title: '请选择地址',
      })
      return false;
    } else {

      console.log(that.data.region.join(','));
      console.log(that.data.addr);
      console.log(that.data.identity);
      console.log(that.data.arraywd[that.data.indexwd]);
      console.log(that.data.arraywd[that.data.indexwd]);

      app.sendAjax({
        url: '/guide/auth/info',
        data: {
          "mobilePhoneNum": that.data.phone
        },
        success: function (res) {
          if (res.code == 200) {
            var json = JSON.stringify(res.data);
            var jsonstr = JSON.parse(json);
            console.log(jsonstr);
            console.log(jsonstr.guideAuthenticationId);
            app.sendAjax({
              url: '/guide/auth/submit',
              data: {
                "address": that.data.cityName, //城市
                "authImgUrl": that.data.myphoto, //图片
                "detailAddress": that.data.addr, //详细地址
                "fullAddressIds": that.data.codes,//地址全路径
                "guideAuthenticationId": jsonstr.guideAuthenticationId, //认证id
                "headImgUrl": that.data.headimg, //导购头像
                "postion": that.data.identity, //职务身份
                "realName": that.data.name, //姓名
                "sex": that.data.index, //男女
                "terminalId": that.data.dotCode, //网点id
                "shoppingGuideId": wx.getStorageSync('shoppingGuideId'), //导购id
                "joinTime": that.data.entryTime,//入职时间
              },
              success: function (res) {
                console.log(res);
                if (res.code == 200) {
                  console.log(res);
                  //成功后隐藏按钮
                  setTimeout(function () {
                    wx.showToast({
                      title: '您已提交修改信息，请等待后台审核',
                      icon: 'none'
                    })
                  }, 1000)

                } else {
                  setTimeout(function () {
                    wx.showToast({
                      title: res.msg,
                      icon: 'none'
                    })
                  }, 1000)
                }
              },
              fail: function (res) {

              }
            })
          }
        },
        fail: function (res) { }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取个人信息
    var info = JSON.parse(options.info);
    var shopname = null;
    if ("terminal" in info && info.terminal) {
      shopname = info.terminal.shopName;
    }
    
    that.setData({
      headimg: info.shoppingGuide.headImgUrl,
      name: info.shoppingGuide.realName,
      index: info.shoppingGuide.sex,
      phone: info.shoppingGuide.mobilePhoneNum,
      cityName: info.address,
      addr: info.detailAddress,
      postion: info.postion,
      dotName1: shopname,
      codes: info.fullAddressIds,
      myphoto: info.authImgUrl,
      authState: info.authState,
      entryTime: (info.joinTime ? info.joinTime : '请选择入职时间'),
      dotCode:info.terminalId,
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