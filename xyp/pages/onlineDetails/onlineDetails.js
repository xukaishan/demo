// pages/onlineDetails/onlineDetails.js
const app = getApp();

let isWxParse = false
let WxParse = require('../../wxParse/wxParse.js');
let weRich = require('../../we-rich/we-rich.js');
let canvasHelper = require('../../utils/CanvasHelper.js')
let util = require('../../utils/util.js');
let canvasID = 'Poster_Canvas'

Page({

  /**
   * 页面的初始数据
   */
  data: {

    //common
    imgheadurl: app.globalData.url,
    billImgPreUrl: null,
    shareId: null,
    customerOpenId: null,
    userNames: null,
    userAvatars: null,
    customerProvince:null,
    customerCity:null,

    isDirectJumpContact: true,
    dataType: '',
    billId: '',
    billName: '',
    shoppingGuideId: '',
    likeType: 2, //1 已点赞、2未点赞

    // 海报
    showModo: false,
    canvasWidth: 0,
    canvasHeight: 0,
    marginLeft: 0,
    posterURLPath: '',
    myTimerr: null,
    isExpires: false, //是否过期 false为过期
    isLongPressTimeExpiresed: false,
    qrcodeLocation: 5, //二维码位置 1-左上 2-左下 3-居中 4-右上 5-右下

    //图文
    starTime: null,
    shareRecordId: null, //更新浏览数据id
    showUrl: false,
    unionId: '',
    txtImage: '', //图文
    htmlUrl: '', //H5链接
    userInfo: null,
    modalHidden: true,
    activityPic: '',
    alterPic: '',
    alertText: '',
    htmlTxt: '',

    floatWindowImgUrl: "",
    activityButtonPic: "",

    isRequestLiking: false,
  },

  touchStart: function() {
    var that = this;
    clearInterval(that.data.myTimer);
    that.data.myTimer = setInterval(function() {
      that.setData({
        isLongPressTimeExpiresed: true,
      })
      that.openShow();
    }, 300);
  },
  //请求订阅
  requestSubscribe:function(){
    var that = this;
    wx.requestSubscribeMessage({
      tmplIds: ['MKlOqgiTy4INEYfl5Vyjld-oVQFp-2Zm33CYRxdF1ao'],
      success(res) {
        console.log(res);
      },
      fail(res){
        console.log(res);
      },
      complete(res){}
    })
  },
  touchMove: function() {},

  touchEnd: function() {
    var that = this
    clearInterval(that.data.myTimer);
    if (that.data.time == false) {
      that.setData({
        isLongPressTimeExpiresed: false
      })
    }
  },

  guideCardTopTap: function() { //给一个极大值，保证点击到达底部
    wx.pageScrollTo({
      scrollTop: 999999,
    })
  },

  //点赞
  likeTap: function(event) {
    var that = this;

    let shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    let shareGuideShoppingGuideId = that.data.shoppingGuideId
    console.log("\n\n\nlikeTap shoppingGuideId = " + JSON.stringify(shoppingGuideId) + "\n\n\n")

    if (shoppingGuideId == null || shoppingGuideId != shareGuideShoppingGuideId) { //导购自己不能给自己点赞

      let dataset = event.currentTarget.dataset
      let toLikeType = (dataset.liketype == null || dataset.liketype * 1 == 2) ? 1 : 2;
      console.log("toLikeType" + toLikeType)
      that.requetLikeGuide(toLikeType);
    }
  },

  //浮动按钮点击
  floatTap: function(event) {
    var that = this;
    if (that.data.shareRecordId) { //以获取到浏览记录id
      that.addClickRecord(that.data.shareRecordId, 6, util.formatTime(new Date()));
    }
    console.log('floatTap')
    if (that.data.isDirectJumpContact) {
      var that = this;
      that.setData({
        modalHidden: false,
      })
    } else {
      wx.navigateTo({
        url: "/pages/onlinePoster/onlinePoster?activityPic=" + that.data.activityPic + '&alterPic=' + that.data.alterPic + '&alertText=' + that.data.alertText + '&shareRecordId=' + that.data.shareRecordId + '&billName' + that.data.txtImage.billName + '&activityButtonPic=' + that.data.activityButtonPic,
      })
    }
  },

  /**
   * 调用导购信息
   */
  requetShoppingGuideInfo: function() {
    wx.showLoading()
    var that = this;
    app.sendAjax({
      url: '/shoppingGuide/info',
      data: {
        "shoppingGuideId": that.data.shoppingGuideId
      },
      success: function(res) {
        console.log('shoppingGuide' + JSON.stringify(res));
        if (res.code == '200') {
          that.setData({
            userInfo: res.data,
          })
        }
        wx.hideLoading();
      },
      fail: function(res) {
        wx.hideLoading();
      }
    })
  },

  //
  requetShoppingGuideLikeStatus: function() {
    wx.showLoading()
    var that = this;

    let shoppingGuideId = that.data.shoppingGuideId;
    let customerOpenId = that.data.customerOpenId;

    //Validate Paramaters
    if (shoppingGuideId == null || shoppingGuideId.length == 0) {
      console.log("\ nshoppingGuideId 不能为null 或者 空\n")
    }
    if (customerOpenId == null || customerOpenId.length == 0) {
      console.log("\n customerOpenId 不能为null 或者 空\n")
    }

    app.sendAjax({
      url: '/billshare/getLikeStatus',
      data: {
        "shoppingGuideId": shoppingGuideId,
        "customerOpenId": customerOpenId,
      },
      success: function(res) {
        wx.hideLoading();

        console.log('\n\n requetShoppingGuideLikeStatus Response \n\n\n' + JSON.stringify(res));
        if (res.code == '200') {
          if ("data" in res) {
            that.setData({
              likeType: (res.data == null) ? 2 : res.data.likeType * 1,
            })
          } else {
            that.setData({
              likeType: 2
            })
          }

          console.log("\n\n\n likeType = " + that.data.likeType + "\n\n\n")
        }
      },
      fail: function(res) {
        wx.hideLoading();
      }
    })
  },
  /**
   * 调用点赞
   */
  requetLikeGuide: function(toLikeType) {
    var that = this;

    let isRequestLiking = that.data.isRequestLiking
    if (isRequestLiking) {
      return
    }

    wx.showLoading()

    that.setData({
      isRequestLiking: true
    })

    let shoppingGuideId = that.data.shoppingGuideId;
    let customerOpenId = that.data.customerOpenId;
    let shareRecordId = that.data.shareRecordId;

    //Validate Paramaters
    if (shoppingGuideId == null || shoppingGuideId.length == 0) {
      console.log("\ nshoppingGuideId 不能为null 或者 空\n")
    }
    if (customerOpenId == null || customerOpenId.length == 0) {
      console.log("\n customerOpenId 不能为null 或者 空\n")
    }

    if (shareRecordId == null || shareRecordId.length == 0) {
      console.log("\n shareRecordId 不能为null 或者 空\n")
    }

    app.sendAjax({
      url: '/billshare/likeGuide',
      data: {
        "shoppingGuideId": shoppingGuideId,
        "customerOpenId": customerOpenId,
        "shareRecordId": shareRecordId,
        "likeType": toLikeType,
      },
      success: function(res) {
        wx.hideLoading();
        console.log('\n\n requetLikeGuide Response \n' + JSON.stringify(res));

        that.setData({
          isRequestLiking: false
        })

        if (res.code == 200) {
          that.requetShoppingGuideInfo();
          that.requetShoppingGuideLikeStatus();
        } else {
          that.requetShoppingGuideInfo();
          that.requetShoppingGuideLikeStatus();
        }

      },
      fail: function(res) {
        that.setData({
          isRequestLiking: false
        })
        
        wx.hideLoading();
      }
    })
  },
  
  /**
   * 分享渲染数据
   */
  addInfo: function(id) {
    wx.showLoading();
    var that = this;
    app.sendAjax1({
      url: 'bill/info',
      data: {
        billId: id
      },
      success: function(res) {
        console.log("\n\n\n bill/info res" + JSON.stringify(res) + "\n\n\n");
        wx.hideLoading();
        if (res.code == '200') {
          that.setData({
            dataType: res.data.billType,
            billName: res.data.billName,
            billImgPreUrl: res.data.billImgPreUrl,
          })

          let billType = res.data.billType * 1;
          switch (billType) { //billType = 1 图文类型
            case 1:
              {
                let isDirectJumpContact = (res.data.activityPic == null || res.data.activityPic.length == 0) ? true : false

                that.requetShoppingGuideInfo();
                that.setData({
                  txtImage: res.data,
                  activityPic: res.data.activityPic,
                  alterPic: res.data.alterPic,
                  alertText: res.data.alertText,
                  activityButtonPic: res.data.activityButtonPic,
                  isDirectJumpContact: isDirectJumpContact,
                })

                //更新
                that.updateFloatWindowImgUrl()

                if (isWxParse) {
                  let article = res.data.billContent;
                  WxParse.wxParse('article', 'html', article, that);
                  console.log(JSON.stringify(article))
                } else {
                  // console.info('----------------------------------------' + res.data.billContent + '--------------------------------------')
                  let txt = res.data.billContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ')
                  var nodes = weRich.parse(txt);
                  that.setData({
                    htmlTxt: nodes
                  })
                  // console.info('----------------------------------------' + JSON.stringify(nodes) + '--------------------------------------')
                }
              }
              break;

            case 2:
              { //billType = 2 H5类型
                that.setData({
                  showUrl: true,
                  htmlUrl: res.data.h5LinkUrl,
                })
              }
              break;

            case 3:
              { //billType = 3 海报类型
                if (res.code == '200') {
                  console.log('res.data.isExpires = ' + res.data.isExpires);
                  that.setData({
                    isExpires: res.data.isExpires,
                    qrcodeLocation: res.data.qrcodeLocation
                  })
                  if (that.data.isExpires == false) {
                    that.requestQrcodeData(res);
                  }

                } else {
                  wx.showToast({
                    title: '获取海报地址失败' + JSON.stringify(res),
                  })
                }
              }
              break;

            default:
              break;
          }
        }
      },
      fail: function(res) {
        wx.hideLoading();
      }
    })
  },

  // windowLocation 悬浮窗显示位置: 1上 2左 3下 4右
  updateFloatWindowImgUrl() {
    var that = this
    let windowLocation = that.data.txtImage.windowLocation * 1
    var floatWindowPic = that.data.txtImage.floatWindowPic
    let isEmpty = (floatWindowPic == null || floatWindowPic.length == 0) ? true : false
    let floatWindowImgUrl = that.data.imgheadurl + floatWindowPic
    switch (windowLocation) {
      case 1:
        {
          if (isEmpty) {
            floatWindowImgUrl = "/images/float-top-bottom.png"
          }
        }
        break;

      case 2:
        {
          if (isEmpty) {
            floatWindowImgUrl = "/images/float-left.png"
          }
        }
        break;

      case 3:
        {
          if (isEmpty) {
            floatWindowImgUrl = "/images/float-top-bottom.png"
          }
        }
        break;

      case 4:
        {
          if (isEmpty) {
            floatWindowImgUrl = "/images/float-right.png"
          }
        }
        break;

      default:
        break;
    }

    that.setData({
      floatWindowImgUrl: floatWindowImgUrl
    })

  },

  //显示弹框
  modalReply: function() {
    this.setData({
      modalHidden: true,
    })
  },

  //隐藏弹框
  modalCandel: function() {
    this.setData({
      modalHidden: true,
    })
  },

  /**
   * 数据更新接口
   */
  updataAdd: function() {
    var that = this;
    let shareRecordId = that.data.shareRecordId;
    if (shareRecordId == null) {
      console.log('updataAdd shareRecordId is null');
      return;
    }

    app.sendAjax1({
      url: '/billshare/browse',
      data: {
        customerAvatarUrl: that.data.userAvatars,
        customerNickName: that.data.userNames,
        customerOpenId: that.data.customerOpenId,
        shareId: that.data.shareId,
        trackEndTimestamp: util.millisecondTimestamp(),
        trackStartTimestamp: that.data.starTime,
        shareRecordId: that.data.shareRecordId,
        unionId: that.data.unionId,
        city: that.data.city,
        province: that.data.province,
      },
      success: function(res) {
        if (res.code == "200") {
          console.log('\n\n 统计数据上传成功' + JSON.stringify(res) + '\n\n')
        } else {
          console.log('\n\n 统计数据上传失败' + JSON.stringify(res) + that.data.shareId) + '\n\n'
        }

        wx.hideLoading();
      },
      fail: function(res) {
        wx.hideLoading();
      }
    })
  },



  /**
   * 调用数据
   */
  add: function(url) {
    var that = this;

    app.sendAjax({
      url: '/billshare/browse',
      data: {
        customerAvatarUrl: that.data.userAvatars,
        customerNickName: that.data.userNames,
        customerOpenId: that.data.customerOpenId,
        shareId: that.data.shareId,
        trackEndTimestamp: util.millisecondTimestamp() + 1,
        trackStartTimestamp: that.data.starTime,
        unionId: that.data.unionId,
        city: that.data.city,
        province: that.data.province,
      },
      success: function(res) {
        wx.hideLoading();
        if (res.code == "200") {
          that.setData({
            shareRecordId: res.data.shareRecordId,
          })
          console.log('\n\n add: 初始化统计接口 \nshareRecordId = ' + that.data.shareRecordId + '\n\n')
        } else {
          console.log('\n\n add: 初始化统计失败 \n ' + JSON.stringify(res) + "\n\n")
        }
      },

      fail: function(res) {
        wx.hideLoading();
        console.log('add: 初始化统计失败' + JSON.stringify(res))
      }
    })
  },

  addClickRecord: function(shareRecordId, type, createdTime) {
    app.sendAjax1({
      url: '/billshare/uploadClickInfo',
      data: {
        shareRecordId: shareRecordId,
        type: type,
        createdTime: createdTime,
      },
      success: function(res) {
        console.log("新增点击记录结果：" + JSON.stringify(res))
      },
      fail: function(res) {
        console.log("新增点击记录结果：" + JSON.stringify(res))
      },
    });
  },

  callGuide: function(event) {
    var that = this;
    if (that.data.shareRecordId) { //以获取到浏览记录id
      that.addClickRecord(that.data.shareRecordId, 1, util.formatTime(new Date()));
    }
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.phonenumber,
      success: function() {},
      fail: function(res) {
        console.log("拨打电话失败！" + JSON.stringify(res))
      }
    })
  },

  contactWechat: function() {
    var that = this;
    if (that.data.shareRecordId) { //以获取到浏览记录id
      that.addClickRecord(that.data.shareRecordId, 2, util.formatTime(new Date()));
    }
    wx.navigateTo({
      url: '/pages/QRCode/QRCode?accesstype=' + 1 + '&shoppingGuideId=' + this.data.shoppingGuideId,
    })
  },

  addPhoneContact: function(event) {
    var that = this;
    let phonenumber = event.currentTarget.dataset.phonenumber;
    let realname = event.currentTarget.dataset.realname;
    let lastName = realname.substring(0, 1);
    let firstName = realname.substring(1, realname.length);
    // console.log('addPhoneContact ' + phonenumber + realname + lastName + firstName)

    if (that.data.shareRecordId) { //以获取到浏览记录id
      that.addClickRecord(that.data.shareRecordId, 4, util.formatTime(new Date()));
    }

    wx.addPhoneContact({
      firstName: firstName,
      lastName: lastName,
      mobilePhoneNumber: phonenumber,
      success: function() {

      },
      fail: function(res) {
        console.log("存入失败！" + JSON.stringify(res))
      }
    })
  },

  shareCard: function() {
    console.log("-------shareCard");
    var that = this;
    if (that.data.shareRecordId) { //以获取到浏览记录id
      that.addClickRecord(that.data.shareRecordId, 3, util.formatTime(new Date()));
    }
  },

  //保存弹窗
  openShow: function() {
    if (this.data.isLongPressTimeExpiresed == false) {
      return
    } else {
      this.setData({
        showModo: true
      })
    }
  },
  /**
   * 底部自定义取消弹窗
   */
  cancelModo: function() {
    this.setData({
      showModo: false
    })
  },

  /**
   * 保存canvas图片到相册
   */
  saveCanvasToPhotosAlbum() {
    let that = this;
    canvasHelper.saveImageToPhotosAlbum(canvasID, function(res) {
      if (res.success) {
        that.cancelModo();
      } else {
        wx.showToast({
          title: '保存海报失败',
        })
      }
    })
  },

  requestQrcodeData: function(res) {
    wx.showLoading();

    var that = this;
    let posterURLPath = this.data.imgheadurl + res.data.billImgUrl;

    console.log("\n\n\n requestQrcodeData 参数 开始 \n\n\n");
    console.log("\nshoppingGuideId = " + that.data.shoppingGuideId + "\nbillId = " + res.data.billId + "\nbillName = " + that.data.billName);
    console.log("\n\n\n requestQrcodeData 参数 结束 \n\n\n");

    app.sendAjax({
      url: 'bill/qrcode',
      data: {
        "billId": res.data.billId,
        "billName": res.data.billName,
        "shoppingGuideId": that.data.shoppingGuideId,
      },
      success: function(res) {
        console.log('requestQrcodeData ---------res------------\n' + JSON.stringify(res));
        wx.hideLoading();

        if (res.code == '200') {
          let data = {
            "posterURLPath": posterURLPath,
            "qrcodeURLPath": res.data.url
          }

          that.drawPoster(data);
        } else {
          console.log('API bill/qrcode request fail' + JSON.stringify(res));
          wx.showToast({
            title: '获取二维码失败' + JSON.stringify(res),
          })
        }
      },

      fail: function(res) {
        console.log('获取二维码失败' + JSON.stringify(res));
        wx.hideLoading();
        wx.showToast({
          title: '获取二维码失败' + JSON.stringify(res),
        })
      }
    })
  },

  drawPoster: function(data) {
    var string = data.posterURLPath;

    console.log("data.posterURLPath" + JSON.stringify(data.posterURLPath));

    if (!data.posterURLPath) {
      wx.showModal({
        title: '海报地址不能为空！',
      })
      return;
    }

    if (!data.qrcodeURLPath) {
      wx.showModal({
        title: '二维码地址不能为空！',
      })
      return;
    }

    console.log("----------drawPoster--------");

    var that = this
    wx.showLoading()
    wx.downloadFile({
      url: data.posterURLPath,
      success(res) {
        wx.hideLoading();
        console.log("----------downloadFileSuccess--------" + res.tempFilePath);
        wx.showLoading()
        let posterURLPath = res.tempFilePath
        wx.downloadFile({
          url: data.qrcodeURLPath,
          success(res) {
            wx.hideLoading();
            console.log(JSON.stringify(res))
            let qrcodeImageURLPath = res.tempFilePath
            if (res.statusCode === 200) {
              //二维码位置 1-左上 2-左下 3-居中 4-右上 5-右下
              let qrcodeLocation = that.data.qrcodeLocation
              canvasHelper.drawImageAspectHeightWithQrcodePosition(posterURLPath, qrcodeImageURLPath, qrcodeLocation, canvasID, function(res) {
                console.info(res);
                that.setData({
                  canvasWidth: res.canvasWidth,
                  canvasHeight: res.canvasHeight,
                  canvasMarginLeft: res.canvasMarginLeft,
                })
              })

            } else {
              wx.hideLoading();
              wx.showToast({
                title: '下载二维码失败' + JSON.stringify(res),
              })
            }
          }
        })
      },
      fail(res) {
        wx.hideLoading();
        wx.showToast({
          title: '下载二维码失败' + JSON.stringify(res),
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    console.log('page onlineDetails options' + JSON.stringify(options));

    wx.showShareMenu()

    var that = this;
    let shoppingGuideId = options.shoppingGuideId
    that.setData({
      shoppingGuideId: JSON.parse(JSON.stringify(shoppingGuideId)),
      starTime: util.millisecondTimestamp(),
      billId: options.aimid,
      billImgPreUrl: options.billImgPreUrl,
    })

    //
    if (app.globalData.sharEntrance != '1007') {
      console.info('非会话框进入1007')
      that.addInfo(options.aimid);
    }

    if (options.shareId && app.globalData.sharEntrance != '1008') {
      console.info('进入分享')

      let customerOpenId = wx.getStorageSync('openId');
      let userName = wx.getStorageSync('userName');
      let userAvatar = wx.getStorageSync('userAvatar');
      let unionid = wx.getStorageSync('unionid');
      let city = wx.getStorageSync('customer.city');
      let province = wx.getStorageSync('customer.province');

      console.log("\n\n\n city = " + city )
      console.log("\n\n\n province = " + province)


      that.setData({
        shareId: options.shareId,
        customerOpenId: customerOpenId,
        userNames: userName,
        userAvatars: userAvatar,
        unionId: unionid,
        city: city,
        province: province,
      })

      //userAvatar 不能作为必传项， 微信返回的URL存在空的情况
      if (customerOpenId && userName) {
        console.info("已授权调用提交数据")
        that.addInfo(options.aimid);
        that.add(options.url);
        that.requetShoppingGuideLikeStatus();
      } else {
        wx.redirectTo({
          url: '/pages/infoAuthorization/infoAuthorization?shareId=' + that.data.shareId + '&url=' + options.url + '&shoppingGuideId=' + that.data.shoppingGuideId + '&aimid=' + options.aimid + '&accessType=3',
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {
    console.info(app.globalData)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log('\n\n\n' + '---------------onHide -----------------')
    console.log('\n\n\n' + 'scene =' + app.globalData.sharEntrance + '\n\n\n')

    var that = this;
    if (app.globalData.sharEntrance == '1007' && app.globalData.sharEntrance != '1008') {
      console.log('indside ---------------onHide -----------------')
      that.updataAdd();
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  onShareAppMessage: function(res) {
    console.info(res)
    var that = this

    let billImgPreUrl = that.data.billImgPreUrl
    let imgheadurl = that.data.imgheadurl

    if (res.from === 'button') {
      let guideCardPreViewImageURL = "https://daogouapi.youxuepai.com/file/wechat/img/1127145233011guide_card_preview.png"

      return {
        title: "导购名片",
        path: 'pages/guideCard/guideCard?shareId=' + this.data.shareId + '&url=' + this.data.htmlUrl + '&shoppingGuideId=' + this.data.shoppingGuideId + '&aimid=' + this.data.billId + '&primaryKeyId=' + this.data.userInfo.shoppingGuide.id,
        imageUrl: guideCardPreViewImageURL,
        success: (res) => {
          console.log("转发成功", res);
        },
      }
    } else {

      var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
      var uuid = util.wxuuid();
      
      that.setData({
        "shareId": uuid
      });

      app.sendAjax({
        url: 'billshare/click',
        data: {
          "aimId": this.data.billId,
          "shareChannelId": this.data.channels,
          "shareId": uuid,
          "shareUserId": shoppingGuideId
        },
        success: function(res) {
          if (res.code == "200") {
            console.log(JSON.stringify(res) + '分享成功')
          } else {
            console.log(JSON.stringify(res) + '分享失败')
          }
        },
        fail: function(res) {}
      })

      return {
        title: this.data.billName,
        path: 'pages/onlineDetails/onlineDetails?shareId=' + this.data.shareId + '&url=' + this.data.htmlUrl + '&shoppingGuideId=' + this.data.shoppingGuideId + '&aimid=' + this.data.billId,
        imageUrl: imgheadurl + billImgPreUrl,
        success: (res) => {
          console.log("onlineDetails转发成功", res);
        },
      }
    }
  }
})