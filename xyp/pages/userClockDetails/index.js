Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: [
      {
        date: '2019-12-10'
      }, {
        date: '2019-12-22'
      },{
        date: '2019-12-24'
      },{
        date: '2020-01-01'
      }
    ],
    patch: [
      {
        date: '2019-12-01'
      }, {
        date: '2019-12-02'
      },{
        date: '2019-12-04'
      },{
        date: '2020-01-08'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
  * 日历是否被打开
  */
  bindselect(e) {
    console.log(e.detail.ischeck)
  },
  /**
   * 获取选择日期
   */
  bindgetdate(e) {
    let time = e.detail;
    console.log(time)

  }
})