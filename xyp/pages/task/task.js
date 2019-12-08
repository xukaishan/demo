// pages/echarts/echarts.js
var app = getApp();
import * as echarts from '../../component/ec-canvas/echarts';
let chart = null;
var barChart = null;
var colorList = [
  '#3BC26D',
  '#70c0fd',
  '#fa93a6',
];
Page({
  onShareAppMessage: function(res) {
    return {
      title: 'ECharts',
      path: '/pages/index/index',
      success: function() {},
      fail: function() {}
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: function(canvas, width, height) {
        barChart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(barChart);
        return barChart;
      }
    },
    showDelet: 'hiddenDelet',
    items: [],
    startX: 0, //开始坐标
    startY: 0,
    tab: 1, //导航tab切换
    totalTasks: 0,
    totalTerminals: 0,
    trainingTaskType: 0,
    currentTasks: 0,
    currentTerminals: 0,
    trainingNumber: 0,
    trainingTaskYear: '',
    trainingTaskMonth: '',
    trainingRecordEntityList: [],
    percentage: ''
  },
  /**
   * 获取图标数据
   */
  echartData: function() {
    var that = this;
    if (that.data.totalTerminals > 0) {
      barChart.setOption({
        legend: {
          right: '18%',
          top: '30%',
          orient: 'vertical',
          itemWidth: 15,
          // x: 'right',
          // y:'bottom',
          data: ['总终端数 ', '覆盖终端 ']
        },
        series: [{
          name: '覆盖终端',
          type: 'pie',
          radius: '68%',
          center: ['40%', '50%'],
          clockwise: false,
          data: [{
            value: that.data.totalTerminals,
            name: '总终端数 '
          }, {
            value: that.data.currentTerminals,
            name: '覆盖终端 '
          }],
          label: {
            normal: {
              show: false,
              textStyle: {
                color: '#999',
                fontSize: 14,
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              borderWidth: 4,
              borderColor: '#ffffff',
            },
            emphasis: {
              borderWidth: 0,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }],
        color: [
          '#F4736E',
          '#FDD158',
        ],
        backgroundColor: '#fff'
      });
    }
  },
  /**
   * 删除动画事件
   */
  openDelet: function() {
    console.log("删除");
    let that = this;
    that.setData({
      showDelet: 'showDelet'
    })
  },
  /**

* 计算滑动角度

* @param {Object} start 起点坐标

* @param {Object} end 终点坐标

*/

  angle: function(start, end) {

    var _X = end.X - start.X,

      _Y = end.Y - start.Y

    //返回角度 /Math.atan()返回数字的反正切值

    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);

  },
  /**
   * 滑动事件
   */
  touchstart: function(e) {
    this.data.trainingRecordEntityList.forEach(function(v, i) {

      if (v.isTouchMove) //只操作为true的

        v.isTouchMove = false;

    })

    this.setData({

      startX: e.changedTouches[0].clientX,

      startY: e.changedTouches[0].clientY,

      trainingRecordEntityList: this.data.trainingRecordEntityList

    })
  },
  //滑动事件处理

  touchmove: function(e) {
    console.info('滑动处理')
    var that = this,

      index = e.currentTarget.dataset.index, //当前索引

      startX = that.data.startX, //开始X坐标

      startY = that.data.startY, //开始Y坐标

      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标

      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标

      //获取滑动角度

      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });

    that.data.trainingRecordEntityList.forEach(function(v, i) {

      v.isTouchMove = false

      //滑动超过30度角 return

      if (Math.abs(angle) > 30) return;

      if (i == index) {

        if (touchMoveX > startX) //右滑

          v.isTouchMove = false

        else //左滑

          v.isTouchMove = true

      }

    })

    //更新数据

    that.setData({

      trainingRecordEntityList: that.data.trainingRecordEntityList

    })
    // console.info(that.data.trainingRecordEntityList);
  },
  /**
   * tab切换
   */
  clickTab: function(e) {
    console.info(e);
    let that = this;
    if (that.data.tab === e.target.dataset.index) {
      return
    } else {
      that.clearTaskData();
      that.setData({
        tab: e.target.dataset.index
      })
      console.info(that.data.tab);
      // that.echartData();
      that.getTasks();
    }
  },
  //获取本月任务
  getTasks: function() {
    let that = this;
    let shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    // let shoppingGuideId = "ba7e6be9-0d74-4fbf-97be-95374e0f596b";
    let url = "rest/trainingTasks/currentMonthTask/" + shoppingGuideId + "/" + that.data.tab;
    console.log(url);
    app.sendAjax({
      url: url,
      method: 'get',
      success: function(res) {
        console.log(JSON.stringify(res) + '获取成功')
        if (res.respCode == "0") {
          let data = res.data;
          that.setData({
            totalTasks: data.totalTasks,
            totalTerminals: data.totalTerminals,
            trainingTaskType: data.trainingTaskType,
            currentTasks: data.currentTasks,
            currentTerminals: data.currentTerminals,
            trainingNumber: data.trainingNumber,
            trainingTaskYear: data.trainingTaskYear,
            trainingTaskMonth: data.trainingTaskMonth,
            trainingRecordEntityList: data.trainingRecordEntityList,
            percentage: Math.round(data.currentTasks / (data.totalTasks) * 10000) / 100.00 + "%"
          })
          that.echartData();
          that.setTaskRecord();
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  //清理数据
  clearTaskData: function() {
    let that = this;
    that.setData({
      totalTasks: 0,
      totalTerminals: 0,
      trainingTaskType: 0,
      currentTasks: 0,
      currentTerminals: 0,
      trainingNumber: 0,
      trainingRecordEntityList: [],
      percentage: "0%"
    })
  },
  //设置任务记录
  setTaskRecord: function() {
    let that = this;
    let list = that.data.trainingRecordEntityList;
    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        list[i].isTouchMove = false //默认隐藏删除
      }
      this.setData({
        trainingRecordEntityList: list
      });
    }
  },
  //删除任务记录
  deleteTaskRecord: function(e) {
    let that = this;
    console.log(e.currentTarget.dataset);
    let dataSet = e.currentTarget.dataset;
    app.sendAjax({
      url: "rest/trainingRecord/" + dataSet.id,
      method: 'delete',
      success: function(res) {
        console.log(JSON.stringify(res) + '获取成功')
        if (res.respCode == "0") {
          console.log("删除成功");
        }
        that.deleteTaskRecordList(dataSet.index);
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  //删除任务记录
  deleteTaskRecordList: function(index) {
    let that = this;
    let list = that.data.trainingRecordEntityList;
    if (list.length > 0) {
      list.splice(index, 1);
      that.setData({
        trainingRecordEntityList: list
      });
    }
  },
  //培训记录详情
  trainingRecordDetail:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/trainingRecordDetail/trainingRecorddetail?id='+id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    //获取本月任务
    that.getTasks();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    // setTimeout(function() {
    // 获取 chart 实例的方式
    // that.echartData();
    // }, 500);
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