// pages/trainingRecordDetail/trainingRecorddetail.js
const app = getApp()
const util = require('../../utils/util.js')
const moment = require('../../utils/moment.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    defaultTime: '01:30',
    time: '1时30分',
    realName: '',
    trainingTaskType: 0,
    trainingNumber: 0,
    trainingRecordTime: '',
    trainingContentType: null,
    trainingContent: '',
    trainingTerminal: '请选择培训终端',
    trainersName: '请选择培训人',
    appendixs:[]
  },
  //载入数据
  loadTrainingRecordDetail:function(id){
    let that=this
    app.sendAjax({
      url: 'rest/trainingRecord/'+id,
      method:"GET",
      success: function (res) {
        console.log(res);
        if (res.respCode == "0") {
          console.log(res);
          let data =res.data

          let trainingTaskType=''
          if (data.trainingTaskType=='1'){
            trainingTaskType='集中培训'
          } else if (data.trainingTaskType == '2'){
            trainingTaskType='点对点培训'
          } else if (data.trainingTaskType == '3'){
            trainingTaskType='微信/直播培训'
          }

          let trainingContentType=''
          if (data.trainingContentType=="1"){
            trainingContentType="总部要求"
          }else if(data.trainingContentType=="2"){
            trainingContentType="自行组织"
          }

          let duration=data.duration*60*1000
          var tempTime = moment.duration(duration);

          let relateList = []
          data.relateList.forEach((val)=>{
            relateList.push(val.appendixUrl)
          })
          that.setData({
            trainersName:data.realName,
            trainingTaskType: trainingTaskType,
            date: data.trainingRecordTime,
            trainingNumber: data.trainingNumber,
            trainingTerminal: data.terminalIds,
            trainingContent: data.trainingContent,
            trainingContentType: trainingContentType,
            time: tempTime.hours() +"时"+ tempTime.minutes()+"分",
            appendixs:relateList
          })
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
  },
  /**
   * 打开文件上传
   */
  upFile: function () {
    let that=this;
    wx.navigateTo({
      url: '/pages/UploadFile/UploadFile?appendixs=' + that.data.appendixs,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let that =this
    that.loadTrainingRecordDetail(options.id)
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