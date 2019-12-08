// pages/trainingReport/trainingReport.js

const app = getApp()
const moment = require('../../utils/moment.js')
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['集中培训', '点对点培训', '微信/直播培训'],
    array2: ['总部要求', '自行组织'],
    index: 0,
    date: '',
    defaultTime: [1,3],
    customTime:[[],[]],
    time:'1时30分',
    trainers: [],
    realName: '',
    trainingTaskType: 0,
    trainingNumber: 0,
    terminalIds: [],
    agentIds: [],
    trainingRecordTime: moment(new Date()).format('YYYY-MM-DD'),
    trainingContentType: null,
    contentTypeSelectIndex: 0,
    trainingContent: '',
    duration:90,
    appendixs: [],
    trainingTerminal: '请选择培训终端',
    trainersName: '请选择培训人',
    maxDate: new Date(),
    startDate: moment(new Date()).startOf('month').format('YYYY-MM-DD'),
    endDate: moment(new Date()).format('YYYY-MM-DD')
  },

  //自定义时间
  initCustomTime:function(){
    let that =this
    for(let i=0;i<24;i++){
      that.data.customTime[0].push(i)
    }
    for (let i = 0; i <7; i++) {
      that.data.customTime[1].push(i*10)
    }
    that.setData({
      customTime:that.data.customTime
    })
  },
  /**
   * 打开培训人
   */
  openTrainee: function() {
    wx.navigateTo({
      url: '/pages/Trainee/Trainee',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 打开培训培训终端
   */
  openTrainTerminal: function() {
    wx.navigateTo({
      url: '/pages/trainTerminal/trainTerminal',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 选择培训类型
   */
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      index: e.detail.value,
      trainingTaskType: parseInt(e.detail.value) + 1
    })
  },
  /**
   * 选择内容类型
   */
  bindTypeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      contentTypeSelectIndex: parseInt(e.detail.value)
    })
  },

  dateFormatString() {
    return "YYYY-mm-dd"
  },
  /**
   * 获取日期
   */
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)

    var that = this

    that.setData({
      date: e.detail.value,
      trainingRecordTime: e.detail.value
    })
  },

  /**
   * 获取当前日期
   */
  today: function() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },

  /**
   * 获取时间
   */
  bindTimeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    let time = e.detail.value;
    let hour = this.data.customTime[0][time[0]];
    let mins = this.data.customTime[1][time[1]];
    let timeStr=''
    if(hour==0){
      timeStr = mins + '分'
    }else{
      timeStr=hour + '时' + mins + '分'
    }
    this.setData({
      time: timeStr,
      duration: parseFloat(hour) * 60 + parseFloat(mins)
    })
  },
  /**
   * 打开文件上传
   */
  upFile: function() {
    wx.navigateTo({
      url: '/pages/UploadFile/UploadFile',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //保存培训人数
  saveTrainNumber: function(e) {
    console.log(e.detail.value)
    let that = this;
    that.setData({
      trainingNumber: e.detail.value
    })
  },
  //保存培训内容
  saveConent: function(e) {
    console.log(e.detail.value)
    let that = this;
    that.setData({
      trainingContent: e.detail.value
    })
  },
  //提交修改的信息
  postTrainingReport: function() {
    var that = this;
    var content = that.data.trainingContent

    if (that.data.trainers.length == 0) {
      //培训人不能为空
      wx.showToast({
        title: '请选择培训人',
        icon: 'none'
      })
      return false;
    }
    else if (!that.data.trainingNumber) {
      //培训时长不能为空
      wx.showToast({
        title: '请输入培训人数',
        icon: 'none'
      })
      return false;
    } else if (that.data.terminalIds.length == 0 || that.data.agentIds.length == 0) {
      //培训终端不能为空
      wx.showToast({
        title: '请选择培训终端',
        icon: 'none'
      })
      return false;
    } else if (that.data.appendixs.length == 0) {
      wx.showToast({
        title: '请上传附件',
        icon: 'none'
      })
      return false;
    }
    else if (content > 200) {
      //内容校验
      wx.showToast({
        title: '培训内容不能超过200字',
        icon: 'none'
      })
      return false;
    } else {

      app.sendAjax({
        url: 'rest/trainingRecord',
        data: {
          "trainers": that.data.trainers, //培训人
          "trainerId": that.data.trainers[0].shoppingGuideId,
          "realName": that.data.trainers[0].realName,
          "trainingTaskType": that.data.trainingTaskType, //培训类型
          "trainingRecordTime": that.data.trainingRecordTime, //培训日期
          "duration": that.data.duration, //培训时长
          "trainingNumber": that.data.trainingNumber, //培训人数
          "agentIds": that.data.agentIds, //培训代理商
          "terminalIds": that.data.terminalIds, //培训终端
          "appendixs": that.data.appendixs, //附件
          "trainingContentType": (that.data.contentTypeSelectIndex + 1), //内容类型
          "trainingContent": content //培训内容
        },
        success: function(res) {
          console.log(res);
          if (res.respCode == "0") {
            console.log(res);
            setTimeout(function() {
              wx.showToast({
                title: '提交成功',
                icon: 'none'
              })
            }, 1000)
            wx.navigateBack({
            })

          } else {
            setTimeout(function() {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
            }, 1000)
          }
        },
        fail: function(res) {

        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.info(this.today());
    let that = this;
    that.initCustomTime()
    //注册监听上传附件成功通知,需要在onUnload注销通知
    that.registerNotifications()
    that.setData({
      date: that.today()
    })
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
    //TrainingReportFileRemoveNotification
    app.notice.register('TrainingReportUploadFileCompletionNotification', that.trainingReportUploadFileCompletion, that)
    app.notice.register('TrainingReportFileRemoveCompletionNotification', that.trainingReportFileRemoveCompletion, that)
    // TrainnerSelectionValueChangedNotification
    app.notice.register('TrainnerSelectionValueChangedNotification', that.trainnerSelectionValueChanged, that)
    app.notice.register('AgentTerminalSelectionValueChangedNotification', that.agentTerminalSelectionValueChanged, that)
  },

  //注销通知
  removeNotifications() {
    var that = this
    app.notice.remove("TrainingReportUploadFileCompletionNotification", that.trainingReportUploadFileCompletion)
    app.notice.remove("TrainingReportFileRemoveCompletionNotification", that.trainingReportFileRemoveCompletion)
    app.notice.remove('TrainnerSelectionValueChangedNotification', that.trainnerSelectionValueChanged)
    app.notice.remove('AgentTerminalSelectionValueChangedNotification', that.agentTerminalSelectionValueChanged)
  },

  //监听上传附件成功回调
  trainingReportUploadFileCompletion: function(notification) {
    var that = this
    let userInfo = notification.userInfo
    let state = userInfo.state
    let imgUrl = userInfo.imgUrl
    if (that.data.appendixs == null) {
      appendixs = []
    }
    that.data.appendixs.push(imgUrl)
    that.setData({
      appendixs: that.data.appendixs
    })
  },

  trainingReportFileRemoveCompletion: function(notification) {
    var that = this
    let state = notification.state
    let idx = notification.index
    var appendixs = that.data.appendixs
    if (appendixs != null && appendixs.length > 0) {
      appendixs.splice(idx, 1)
      that.setData({
        appendixs: appendixs
      })
    }
  },

  //培训师选择item变动
  trainnerSelectionValueChanged: function(notification) {
    var that = this
    let userInfo = notification.userInfo
    userInfo.forEach(function(val) {
      that.data.trainers.push({
        'shoppingGuideId': val.shoppingGuideId,
        'realName': val.realName
      })
    })
    console.log(userInfo)
    that.setData({
      trainers: that.data.trainers,
      trainersName: userInfo[0].realName
    })
  },

  //代理商终端选择变动通知
  agentTerminalSelectionValueChanged: function(notification) {
    var that = this
    let obj = notification.obj;
    console.log(obj)
    that.setData({
      agentIds: obj.arr1,
      terminalIds: obj.arr2,
      trainingTerminal: obj.arrList
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
    // var pages = getCurrentPages();
    // var currPage = pages[pages.length - 1];
    // if (currPage.data.predata) {
    //   this.setData({
    //     trainingTerminal: currPage.data.predata.arrList,
    //     agentIds: currPage.data.predata.arr1,
    //     terminalIds: currPage.data.predata.arr2
    //   })
    // }
    // if (currPage.data.trainers.length) {
    //   this.setData({
    //     trainersName: currPage.data.trainers[0].realName
    //   })
    // }
    // console.info(currPage.data.predata);
    // console.info(currPage.data.trainers);
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