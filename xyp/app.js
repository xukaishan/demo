//app.js
const app = getApp()
const properties = require("/config.js");
const notice = require('/utils/notificationCenter.js')

var LNTUOEDomain = properties.LNTUOEDomain;
var ImageDomainURL = properties.ImageDomainURL;
var APPNUM = properties.APPNUM;

App({
    notice: require('/utils/notificationCenter.js'),

    globalData: {
        url: ImageDomainURL, //域名
        APPNUM: APPNUM,
        sharEntrance: '',

        //配置tabBar  
        tabBarForGuide: {
            "color": "#9E9E9E",
            "selectedColor": "#f00",
            "backgroundColor": "#fff",
            "borderStyle": "#ccc",
            "list": [{
                "pagePath": "/pages/index/index",
                "text": "主页",
                "iconPath": "/images/home-icon.png",
                "selectedIconPath": "/images/home-active.png",
                "selectedColor": "#4EDF80",
                active: false
            },
            {
                "pagePath": "/pages/Statistics/Statistics",
                "text": "统计",
                "iconPath": "/images/Statistics-icon.png",
                "selectedIconPath": "/images/Statistics-active.png",
                "selectedColor": "#4EDF80",
                active: false
            },
            {
                "pagePath": "/pages/clockManage/index",
                "text": "打卡",
                "iconPath": "/images/tabbar-guide-icon.png",
                "selectedIconPath": "/images/tabbar-guide-icon-active.png",
                "selectedColor": "#4EDF80",
                active: false
            },
            {
                "pagePath": "/pages/me/me",
                "text": "我的",
                "iconPath": "/images/me-icon.png",
                "selectedIconPath": "/images/me-active.png",
                "selectedColor": "#4EDF80",
                active: false
            }
            ],
            "position": "bottom"
        },

        tabBarForManager: {
            "color": "#9E9E9E",
            "selectedColor": "#f00",
            "backgroundColor": "#fff",
            "borderStyle": "#ccc",
            "list": [{
                "pagePath": "/pages/managersHome/managersHome",
                "text": "主页",
                "iconPath": "/images/home-icon.png",
                "selectedIconPath": "/images/home-active.png",
                "selectedColor": "#4EDF80",
                active: true
            },
            {
                "pagePath": "/pages/index/index",
                "text": "导购",
                "iconPath": "/images/tabbar-guide-icon.png",
                "selectedIconPath": "/images/tabbar-guide-icon-active.png",
                "selectedColor": "#4EDF80",
                active: false
            },
            {
                "pagePath": "/pages/Statistics/Statistics",
                "text": "统计",
                "iconPath": "/images/Statistics-icon.png",
                "selectedIconPath": "/images/Statistics-active.png",
                "selectedColor": "#4EDF80",
                active: false
            },
            {
                "pagePath": "/pages/me/me",
                "text": "我的",
                "iconPath": "/images/me-icon.png",
                "selectedIconPath": "/images/me-active.png",
                "selectedColor": "#4EDF80",
                active: false
            }
            ],
            "position": "bottom"
        },
    },

    onLaunch: function (options) {
        console.log("\n\n\n onLaunch \n\n\n")
        var that = this;

        that.updateApp(); //调用应用更新
        // let shoppingGuideId = wx.getStorageSync('shoppingGuideId')
        // if (options.scene != '1007') {
        //   that.resetHomePage()
        // }
    },

    onShow: function (options) {
        var that = this;

        that.globalData.sharEntrance = options.scene;
        that.updateApp();//调用应用更新
        that.requestUserInfo()
    },



    //其他页面会调用该接口
    //解密unionid
    jiemiunionid: function (encDataStr, ivStr, keyStr) {
        var that = this;
        that.sendAjax({
            url: '/wechat/decrypt',
            data: {
                "encDataStr": encDataStr,
                "ivStr": ivStr,
                "keyStr": keyStr
            },

            success: function (res) {
                var jsObject = JSON.parse(res.data);
                if (res.code == 200) {
                    console.log(jsObject)
                    console.log(jsObject.unionId)
                    wx.setStorageSync('unionid', jsObject.unionId); //解密成功保存unionid
                    wx.redirectTo({
                        url: '/pages/phoneInfo/phoneInfo?phone=' + that.getMobilePhoneNum(),
                    })
                } else {
                    wx.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                }
            },
            fail: function (res) {
                wx.showToast({
                    title: '调用解密接口失败',
                    icon: 'none'
                })
            }
        })
    },

    //获取用户信息
    requestUserInfo: function () {
        var that = this;

        that.sendAjax({
            url: 'guide/auth/info',
            data: {
                "mobilePhoneNum": that.getMobilePhoneNum(),
            },
            success: function (res) {
                console.log("\n\n\n 导购信息 \n" + JSON.stringify(res) + "\n\n\n");
                if (res.code == 200 && res.data != null) {
                    if ("status" in res.data) {
                        let status = res.data.status * 1
                        //用户离职退出登录
                        if (status == 2) {
                            wx.clearStorageSync()//清除所有缓存
                            wx.reLaunch({
                                url: '/pages/index/index',
                            })
                        }
                    }
                }
            },
        })
    },

    //validatedUserIdentity
    validatedUserIdentity: function (userIdentity) {
        if (!userIdentity || userIdentity < 0 || userIdentity > 5) {
            console.log("\n\n\n  validatedUserIdentity = " + userIdentity)
            userIdentity = 1
        }
        console.log("\n\n\n ousetside validatedUserIdentity = " + userIdentity)
        return userIdentity
        // return 2
    },

    //1 - 导购 2 - 培训师 3 - 代理商 4-管理员
    getUserIdentity: function () {
        var that = this
        var userIdentity = wx.getStorageSync('userIdentity')
        return that.validatedUserIdentity(userIdentity)
    },

    setUserIdentity: function (userIdentity) {
        var that = this
        wx.setStorage({
            key: 'userIdentity',
            data: that.validatedUserIdentity(userIdentity),
        })
    },

    validatedMobilePhoneNum: function (mobilePhoneNum) {
        if (!mobilePhoneNum || mobilePhoneNum.length != 11) {
            mobilePhoneNum = 11122223333
        }
        console.log("\n\n\n ousetside validatedMobilePhoneNum = " + mobilePhoneNum)
        return mobilePhoneNum
    },

    getMobilePhoneNum: function () {
        var that = this
        var mobilePhoneNum = wx.getStorageSync('mobilePhoneNum')
        return that.validatedMobilePhoneNum(mobilePhoneNum)
    },

    setMobilePhoneNum: function (mobilePhoneNum) {
        var that = this
        wx.setStorage({
            key: 'mobilePhoneNum',
            data: that.validatedMobilePhoneNum(mobilePhoneNum),
        })
    },

    resetHomePage: function () {
        var that = this
        let userIdentity = that.getUserIdentity()

        if (userIdentity == 1) {
            var tabBar = that.globalData.tabBarForGuide;

            wx.reLaunch({
                url: '/pages/index/index',
            })
        } else {

            tabBar = that.globalData.tabBarForManager;
            wx.reLaunch({
                url: '/pages/managersHome/managersHome',
            })
        }

    },

    //修改tabBar的active值  
    editTabBar: function () {
        var that = this
        var _curPageArr = getCurrentPages();
        var _curPage = _curPageArr[_curPageArr.length - 1];
        var _pagePath = _curPage.__route__;
        if (_pagePath.indexOf('/') != 0) {
            _pagePath = '/' + _pagePath;
        }

        var tabBar = that.globalData.tabBarForGuide;
        let userIdentity = that.getUserIdentity()

        if (userIdentity != 1) {
            tabBar = that.globalData.tabBarForManager;
        }

        for (var i = 0; i < tabBar.list.length; i++) {
            tabBar.list[i].active = false;
            if (tabBar.list[i].pagePath == _pagePath) {
                tabBar.list[i].active = true; //根据页面地址设置当前页面状态  
            }
        }
        _curPage.setData({
            tabBar: tabBar
        });
    },


    /**
     * ajax请求
     */
    sendAjax: function (param, addressUrl) {
        var that = this;
        let data = param.data || {}; //入参
        let header = param.header; //请求头
        let requestUrl; //地址
        if (addressUrl) {
            requestUrl = addressUrl + param.url; //自定义地址
        } else {
            requestUrl = LNTUOEDomain + param.url; //公用地址
        }

        console.log("param" + JSON.stringify(param))

        that.showLoading();
        // 判断是否是自己传入请求方式
        if (param.method) {
            if (param.method.toLowerCase() == 'post') {
                header = header || {
                    'content-type': 'application/json;'
                }
            }
            param.method = param.method.toUpperCase();
        }
        //Ajax请求
        wx.request({
            url: requestUrl,
            data: data,
            dataType: 'json',
            method: param.method || 'POST',
            header: header || {
                'content-type': 'application/json'
            },
            success: function (res) {
                that.hideLoading()
                if (res.statusCode && res.statusCode != 200) {
                    that.showModal({
                        content: '' + res.errMsg
                    });
                }
                typeof param.success == 'function' && param.success(res.data)
            },
            fail: function (res) {
                // that.showModal({
                //   content: '' + res.errMsg
                // });
                // typeof param.fail == 'function' && param.fail(res.data);
            },
            complete: function (res) {
                param.hideLoading || wx.hideLoading();
                typeof param.complete == 'function' && param.complete(res.data);
            }
        });
    },
    // 不需要加载提示的接口请求
    sendAjax1: function (param, addressUrl) {
        var that = this;
        let data = param.data || {}; //入参
        let header = param.header; //请求头
        let requestUrl; //地址
        if (addressUrl) {
            requestUrl = addressUrl + param.url; //自定义地址
        } else {
            requestUrl = LNTUOEDomain + param.url; //公用地址
        }
        // 判断是否是自己传入请求方式
        if (param.method) {
            if (param.method.toLowerCase() == 'post') {
                header = header || {
                    'content-type': 'application/json;'
                }
            }
            param.method = param.method.toUpperCase();
        }
        //Ajax请求
        wx.request({
            url: requestUrl,
            data: data,
            dataType: 'json',
            method: param.method || 'POST',
            header: header || {
                'content-type': 'application/json'
            },
            success: function (res) {
                that.hideLoading()
                if (res.statusCode && res.statusCode != 200) {
                    that.showModal({
                        content: '' + res.errMsg
                    });
                }
                typeof param.success == 'function' && param.success(res.data)
            },
            fail: function (res) {
                // that.showModal({
                //   content: '' + res.errMsg
                // });
                // typeof param.fail == 'function' && param.fail(res.data);
            },
            complete: function (res) {
                param.hideLoading || wx.hideLoading();
                typeof param.complete == 'function' && param.complete(res.data);
            }
        });
    },



    //打开loding 提示框
    showLoading: function () {
        wx.showLoading({
            mask: true,
            title: '加载中',
        })
    },
    //隐藏 loading 提示框
    hideLoading: function () {
        wx.hideLoading()
    },
    //隐藏消息提示框
    hideToast: function () {
        wx.hideToast();
    },


    //​显示模态弹窗
    showModal: function (param) {
        wx.showModal({
            title: param.title || '提示',
            content: param.content || '确定​显示模态弹窗',
            showCancel: param.showCancel || true,
            cancelText: param.cancelText || '取消',
            cancelColor: param.cancelColor || '#000000',
            confirmText: param.confirmText || '确定',
            confirmColor: param.confirmColor || '#3CC51F',
            success: function (res) {
                if (res.confirm) {
                    typeof param.confirm == 'function' && param.confirm(res);
                } else {
                    typeof param.cancel == 'function' && param.cancel(res);
                }
            },
            fail: function (res) {
                typeof param.fail == 'function' && param.fail(res);
            },
            complete: function (res) {
                typeof param.complete == 'function' && param.complete(res);
            }
        })
    },
    /**
     * 获取今日其起始时间
     */
    showToDay: function () {
        var Nowdate = new Date();
        var M = Number(Nowdate.getMonth()) + 1
        return Nowdate.getFullYear() + "-" + M + "-" + Nowdate.getDate();
    },
    /**
     * 获取今日结束时间
     */
    showTomorrow: function () {
        var tom = new Date();
        tom.setDate(tom.getDate() + 1);
        var M = Number(tom.getMonth()) + 1
        return tom.getFullYear() + "-" + M + "-" + tom.getDate();
    },
    /**
     * 获取本周起始时间
     */
    showWeekFirstDay: function () {
        var Nowdate = new Date();
        var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);
        var M = Number(WeekFirstDay.getMonth()) + 1
        return WeekFirstDay.getFullYear() + "-" + M + "-" + WeekFirstDay.getDate();
    },
    /**
     * 获取本周结束时间
     */
    showWeekLastDay: function () {
        var Nowdate = new Date();
        var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);
        var WeekLastDay = new Date((WeekFirstDay / 1000 + 6 * 86400) * 1000);
        var M = Number(WeekLastDay.getMonth()) + 1
        return WeekLastDay.getFullYear() + "-" + M + "-" + WeekLastDay.getDate();
    },
    /**
     * 获取本月开始时间
     */
    showMonthFirstDay: function () {
        var Nowdate = new Date();
        var MonthFirstDay = new Date(Nowdate.getYear(), Nowdate.getMonth(), 1);
        var M = Number(MonthFirstDay.getMonth()) + 1
        return Nowdate.getFullYear() + "-" + M + "-" + MonthFirstDay.getDate();
    },
    /**
     * 获取本月最后一天
     */
    showMonthLastDay: function () {
        var Nowdate = new Date();
        var MonthNextFirstDay = new Date(Nowdate.getYear(), Nowdate.getMonth() + 1, 1);
        var MonthLastDay = new Date(MonthNextFirstDay - 86400000);
        var M = Number(MonthLastDay.getMonth()) + 1
        return Nowdate.getFullYear() + "-" + M + "-" + MonthLastDay.getDate();
    },
    /**
     * 获取当前今日，本周，本月日期
     */
    days: function (num, type) {
        var dataTime = {
            startDay: null,
            endDay: null
        }
        var i = " 00:00:00";
        var c = " 23:59:59"
        if (num == 1) {
            dataTime.startDay = this.showToDay() + i;
            dataTime.endDay = this.showTomorrow() + i;
        } else if (num == 2) {
            if (type) {
                dataTime.startDay = this.getDays(-6) + i;
                dataTime.endDay = this.getDays(0) + c;
            } else {
                dataTime.startDay = this.showWeekFirstDay() + i;
                dataTime.endDay = this.showWeekLastDay() + c;
            }
        } else if (num == 3) {
            if (type) {
                dataTime.startDay = this.getDays(-30) + i;
                dataTime.endDay = this.getDays(0) + c;
            } else {
                dataTime.startDay = this.showMonthFirstDay() + i;
                dataTime.endDay = this.showMonthLastDay() + c;
            }
        }
        return dataTime;
    },
    getDays: function (day) {
        var today = new Date();
        var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
        today.setTime(targetday_milliseconds); //注意，这行是关键代码　　
        var tYear = today.getFullYear();
        var tMonth = today.getMonth();
        var tDate = today.getDate();
        tMonth = this.doHandleMonth(tMonth + 1);
        tDate = this.doHandleMonth(tDate);
        return tYear + "-" + tMonth + "-" + tDate;
    },
    doHandleMonth: function (month) {
        var m = month;
        if (month.toString().length == 1) {
            m = "0" + month;
        }
        return m;
    },
    /**
     * 版本更新
     */
    updateApp: function () {
        const updateManager = wx.getUpdateManager();
        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            if (res.hasUpdate) {
                wx.showLoading({
                    title: '更新下载中...',
                })
            }
        })
        updateManager.onUpdateReady(function () {
            wx.hideLoading();
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })

        })
        updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.hideLoading();
            wx.showToast({
                title: '下载失败...',
                icon: "none"
            });
        })
    },
})