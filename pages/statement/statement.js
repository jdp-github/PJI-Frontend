import * as echarts from '../../ec-canvas/echarts';

import {
  $wuxSelect
} from '../../miniprogram_npm/wux-weapp/index';

let app = getApp();
let constant = require('../../utils/constant.js');

var infectChart = null;
var typeChart = null;
var finishChart = null;

function initFinishChart(canvas, width, height) {
  let pages = getCurrentPages();
  let currentPage = pages[pages.length - 1];

  finishChart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(finishChart);

  let option = {
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
      data: currentPage.data.finished_list.months
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
            show: false,
            position: 'insideTop'
          }
        },
      },
      {
        name: '未审核',
        type: 'bar',
        stack: 'total',
        label: {
          normal: {
            show: false,
            position: 'insideTop'
          }
        },
      },
      {
        name: '未完成',
        type: 'bar',
        stack: 'total',
        label: {
          normal: {
            show: false,
            position: 'insideTop'
          }
        },
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

  let option = {
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

  let option = {
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
    // 图表数据
    finished_list: [],
    infect_list: [],
    type_list: [],
    infectEc: {
      onInit: initInfectChart,
    },
    typeEc: {
      onInit: initTypeChart,
    },
    finishEc: {
      onInit: initFinishChart,
    },
    show: false
  },

  onCenterClick() {
    this.setData({
      show: false
    });
    $wuxSelect('#wux-center').open({
      value: this.data.centerValue,
      options: this.data.centValueList,
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            centerValue: value,
            centerIndex: index,
            show: true,
          });
        }
        if (value == "全部") {
          this.requestChats(true);
        } else {
          this.requestChats(false);
        }
      },
    });
  },

  onLoad: function(options) {
    this.initData();
  },

  initData() {
    this.requestCenterList();
  },

  // 中心列表
  requestCenterList() {
    wx.showLoading({
      title: '请求数据中...',
    });
    let that = this;

    wx.request({
      url: constant.basePath,
      data: {
        service: 'Center.GetCenterList'
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        wx.hideLoading();
        if (res.data.data.code == constant.response_success) {
          that.setData({
            centerObjList: res.data.data.list
          });

          for (var i = 0, len = that.data.centerObjList.length; i < len; i++) {
            that.data.centValueList[i] = that.data.centerObjList[i].name
          }
          that.data.centValueList.push('全部');
          that.setData({
            centValueList: that.data.centValueList
          });
        }
      },
      fail(res) {
        wx.hideLoading();
      }
    })
  },
  requestChats(all) {
    wx.showLoading({
      title: '请求数据中...',
    });
    let that = this;

    wx.request({
      url: constant.basePath,
      data: {
        service: 'Statistics.GetCharts',
        center_id: all ? "" : that.data.centerObjList[that.data.centerIndex].id
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log("Statistics.GetCharts:" + JSON.stringify(res))
        setTimeout(function() {}, 2000);
        wx.hideLoading();
        if (res.data.data.code == constant.response_success) {
          that.setData({
            finished_list: res.data.data.finished_list,
            infect_list: res.data.data.infect_list,
            type_list: res.data.data.type_list
          });
          let finishOption = finishChart.getOption();
          let infectOption = infectChart.getOption();
          let typeOption = typeChart.getOption();
          finishOption.series[0].data = res.data.data.finished_list.approve;
          finishOption.series[1].data = res.data.data.finished_list.notapprove;
          finishOption.series[2].data = res.data.data.finished_list.notcomplete;
          finishChart.setOption(finishOption);
          infectOption.series[0].data = [{
              value: res.data.data.infect_list.infect,
              name: '感染'
            },
            {
              value: res.data.data.infect_list.notinfect,
              name: '非感染'
            },
          ];
          infectChart.setOption(infectOption);
          typeOption.series[0].data = [{
              value: res.data.data.type_list.displace,
              name: '置换术后'
            },
            {
              value: res.data.data.type_list.seize,
              name: '占位器'
            },
          ];
          typeChart.setOption(typeOption)
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.data.msg,
          });
        }
      },
      fail(res) {
        wx.hideLoading();
      }
    });
  }
});