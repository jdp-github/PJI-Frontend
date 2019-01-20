import * as echarts from '../../ec-canvas/echarts';

import {
  $wuxSelect
} from '../../miniprogram_npm/wux-weapp/index'

var app = getApp();
var constant = require('../../utils/constant.js');

let infectChart = null;
let typeChart = null;
let finishChart = null;

function initFinishChart(canvas, width, height) {
  finishChart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(finishChart);

  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['已审核', '未审核', '未完成']
    },
    grid: {
      left: '3%',
      right: '8%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    }],
    yAxis: [{
      type: 'value'
    }],
    series: [{
        name: '已审核',
        type: 'bar',
        stack: 'total',
        label: {
          normal: {
            show: true,
            position: 'insideTop'
          }
        },
        data: [320, 332, 301, 334, 390, 330]
      },
      {
        name: '未审核',
        type: 'bar',
        stack: 'total',
        label: {
          normal: {
            show: true,
            position: 'insideTop'
          }
        },
        data: [120, 132, 101, 134, 90, 230]
      },
      {
        name: '未完成',
        type: 'bar',
        stack: 'total',
        label: {
          normal: {
            show: true,
            position: 'insideTop'
          }
        },
        data: [220, 182, 191, 234, 290, 330]
      },
    ]
  };

  finishChart.setOption(option);
  return finishChart;
}

function initInfectChart(canvas, width, height) {
  infectChart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(infectChart);

  var option = {
    color: ['#ef473a', '#91c7ae'],
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      x: 'left',
      data: ['感染', '非感染']
    },
    series: [{
      name: '感染/非感染',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
          position: 'center',
          formatter: '{b} \n {c} ({d}%)',

        },
        emphasis: {
          show: true,
          textStyle: {
            fontSize: '14',
            fontWeight: '300',
          }
        },
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data: [{
          value: 335,
          name: '感染'
        },
        {
          value: 310,
          name: '非感染'
        },
      ]
    }]
  };

  infectChart.setOption(option);
  return infectChart;
}

function initTypeChart(canvas, width, height) {
  typeChart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(typeChart);

  var option = {
    color: ['#334b5c', '#de9325'],
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      x: 'left',
      data: ['置换术后', '占位器']
    },
    series: [{
      name: '置换术后/占位器',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
          position: 'center',
          formatter: '{b} \n {c} ({d}%)',

        },
        emphasis: {
          show: true,
          textStyle: {
            fontSize: '14',
            fontWeight: '300',
          }
        },
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data: [{
          value: 40,
          name: '置换术后'
        },
        {
          value: 310,
          name: '占位器'
        },
      ]
    }]
  };

  typeChart.setOption(option);
  return typeChart;
}

Page({
  data: {
    // 中心相关
    centerObjList: [],
    centValueList: [],
    centerValue: '',
    centerIndex: '',
    infectEc: {
      onInit: initInfectChart,
    },
    typeEc: {
      onInit: initTypeChart,
    },
    finishEc: {
      onInit: initFinishChart,
    }
  },

  onCenterClick() {
    $wuxSelect('#wux-center').open({
      value: this.data.centerValue,
      options: this.data.centValueList,
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            centerValue: value,
            centerIndex: index,
          })
        }
        this.requestChats()
      },
    });
  },

  onLoad: function(options) {
    this.initData()
  },

  initData() {
    this.requestCenterList()
  },

  // 中心列表
  requestCenterList() {
    wx.showLoading({
      title: '请求数据中...',
    })
    var that = this

    wx.request({
      url: constant.basePath,
      data: {
        service: 'Center.GetCenterList'
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        wx.hideLoading()
        console.log("Center.GetCenterList:" + JSON.stringify(res))
        if (res.data.data.code == constant.response_success) {
          that.setData({
            centerObjList: res.data.data.list
          })

          for (var i = 0, len = that.data.centerObjList.length; i < len; i++) {
            that.data.centValueList[i] = that.data.centerObjList[i].name
          }
          that.setData({
            centValueList: that.data.centValueList
          })
        }
      },
      fail(res) {
        wx.hideLoading()
      }
    })
  },
  requestChats() {
    wx.showLoading({
      title: '请求数据中...',
    })
    var that = this

    wx.request({
      url: constant.basePath,
      data: {
        service: 'Statistics.GetCharts',
        center_id: that.data.centerObjList[that.data.centerIndex].id
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        wx.hideLoading()
        console.log("Statistics.GetCharts:" + JSON.stringify(res))
        if (res.data.data.code == constant.response_success) {
          
        }
      },
      fail(res) {
        wx.hideLoading()
      }
    })
  }
});