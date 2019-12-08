// pages/echarts/echarts.js
var app = getApp();
import * as echarts from '../../component/ec-canvas/echarts';
let chart=null;
var barChart=null;
var colorList = [
    '#3BC26D',
    '#70c0fd',
    '#fa93a6',
  ];
Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: function (canvas, width, height) {
        barChart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(barChart);
        return barChart;
      }
    },
  },
/**
 * 获取图标数据
 */
  echartData: function () {
    var that = this;

    var shoppingGuideId = wx.getStorageSync('shoppingGuideId');
    app.sendAjax({
      url: 'customer/statistics/chart',
      data: {
        "shoppingGuideId": shoppingGuideId
      },
      success: function (res) {
        if (res.code == "200") {
          console.log(JSON.stringify(res) +"获取图标数据")
          // that.setData({
          //   statistics: res.data
          // })
          var data = res.data;
          var dataName = res.data.categories;//数据x轴的标签
          var dataSet=[];//渲染的人数
          for (var i = 0; i < res.data.series.data.length;i++){
            dataSet.push(res.data.series.data[i].y);
          }
          barChart.setOption({
            title: {
              text: '顾客统计分析',
              x: 'center',
              top: "5%",
              textStyle: {    //图例文字的样式
                color: "#434343"
              }
            },
            color: colorList,
            legend: {
              top: '15%',
              right: '3%',
              itemWidth: 20,
              itemHeight: 8,
              data: dataName,
              textStyle: {    //图例文字的样式
                fontSize: 12,
                color: "#999999"
              }
            },
            tooltip: {
              show: true,
              trigger: 'item',
              formatter: "{c}"
            },
            toolbox: {
              show: true,
              feature: {
                mark: {
                  show: true
                },

              }
            },
            grid: {
              left: '2%',
              right: '2%',
              bottom: '3%',
              height: '75%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                axisLine: {
                  lineStyle: {
                    type: 'solid',
                    color: '#999999',//左边线的颜色
                    width: '1'//坐标线的宽度
                  }
                },
                axisLabel: {
                  interval: 0,
                  show: true,
                  splitNumber: 15,

                  textStyle: {
                    //fontFamily: "微软雅黑",
                    fontSize: 10,
                    color: "#000"
                  },

                },

                data: dataName,

                axisTick: {
                  show: false,
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '单位：人',
                max: '700',
                min: '0',
                nameTextStyle: {
                  color: '#999999'
                },
                splitLine: {  //分割线
                  show: true,
                  // color:"#fff",
                  lineStyle: {
                    color: '#999999'
                  }
                },
                axisLine: {
                  lineStyle: {
                    type: 'solid',
                    color: '#999999',//左边线的颜色
                    width: '1'//坐标线的宽度
                  }
                },
                axisLabel: {
                  type: 'solid',
                  color: '#999999',//左边线的颜色
                  width: '1'//坐标线的宽度
                },
                axisTick: {
                  show: false,
                  alignWithLabel: true
                }
              },

            ],
            series: [
              {
                name: '',
                type: 'bar',
                barWidth: 30,//柱图宽度
                data: dataSet,
                itemStyle: {
                  normal: {
                    color: function (params) {
                      // build a color map as your need.
                      var colorList = [
                        '#3BC26D',
                        '#70c0fd',
                        '#fa93a6',
                      ];
                      return colorList[params.dataIndex]
                    },
                    label: {
                      show: true,
                      position: 'top',
                      formatter: '{c}人'
                    }
                  }
                }
              },

            ]
          });
        } else {
          console.log('获取图表数据')
        }
      },
      fail: function (res) { }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    
    // this.setData({
    //   ec:{
    //     onInit: initChart // 3、将数据放入到里面
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this;
    setTimeout(function () {
      // 获取 chart 实例的方式
      that.echartData();
    }, 500);
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