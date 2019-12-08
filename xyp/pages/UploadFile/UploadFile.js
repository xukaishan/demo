// pages/UploadFile/UploadFile.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageDomainURL: app.globalData.url,
    hasUploadFiles: [],
    isUpload:true
  },
  /**
   * 选择上传类型
   */
  slectUpdata() {
    let that = this;
    that.updataImg();
  },
  /**
   * 上传图片
   */
  updataImg() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let tempFilePaths = res.tempFilePaths
        // 上传文件
        wx.uploadFile({
          url: app.globalData.url + '/ossUpload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {},
          success(res) {
            let data = JSON.parse(res.data)
            var hasUploadFiles = that.data.hasUploadFiles
            if (hasUploadFiles == null) {
              hasUploadFiles = []
            }
            let imgUrl = data.msg
            hasUploadFiles.push(imgUrl)

            that.setData({
              hasUploadFiles: hasUploadFiles
            })
            
            //通知提交页面上传成功，或者
            let userInfo = {
              state: true,
              imgUrl: {"appendixUrl": imgUrl}
            }
            app.notice.post('TrainingReportUploadFileCompletionNotification', {
              userInfo
            })
          }
        })

      }
    })
  },
  
  /**
   * 上传视频
   */
  updataVideo() {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        console.log(res.tempFilePath)
        wx.uploadFile({
          url: app.globalData.url + '/ossUpload', //仅为示例，非真实的接口地址
          filePath: res.tempFilePath[0],
          name: 'file',
          formData: {},
          success(res) {
            const data = res.data
            console.log(res)
            //do something
          }
        })
      }
    })
  },
  /**
   * 删除单个图片
   */
  deleteData(e) {
    var that = this
    let dataset = e.currentTarget.dataset
    let idx = dataset.idx

    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success(res) {
        if (res.confirm) {
          var hasUploadFiles = that.data.hasUploadFiles
          if (hasUploadFiles != null && hasUploadFiles.length > 0) {
            hasUploadFiles.splice(idx, 1)
            that.setData({
              hasUploadFiles: hasUploadFiles
            })
            let notification = {
              state: true,
              index: idx
            }
            app.notice.post('TrainingReportFileRemoveCompletionNotification', {
              notification
            })
          }
        }
      }
    })
  },
  postImgs:function(){
    wx.navigateBack();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that =this;
    if (options.appendixs){
      let array=options.appendixs.split(",");
      that.setData({
        hasUploadFiles: array,
        isUpload:false
      })
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