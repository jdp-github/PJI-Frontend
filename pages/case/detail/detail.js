"use strict";
import {
  $wuxSelect,
  $wuxCalendar,
} from '../../../miniprogram_npm/wux-weapp/index'

const app = getApp();
var constant = require('../../../utils/constant.js');

Page({
  data: {
    caseId: "",
    caseInfo: {},
    currentStep: 0,
    centerValue: '血液中心',
    centerTitle: '血液中心',
    sexValue: '男',
    sexTitle: '男',
    typeValue: '置换术后',
    typeTitle: '置换术后',
    partValue: '髋',
    partTitle: '髋',
    mergeValue: '是',
    mergeTitle: '是',
    antibioticValue: '是',
    antibioticTitle: '是',
    sinusTractValue: '是',
    sinusTractTitle: '是',
    lePrevValue: '500',
    lePrevTitle: '500',
    leAfterValue: '500',
    leAfterTitle: '500',
    pathologyValue: '<5',
    pathologyTitle: '<5',
    msisValue: '感染',
    msisTitle: '感染',
    finalHandleValue: '手术-占位器植入',
    finalHandleTitle: '手术-占位器植入',
    flushValue: '是',
    flushTitle: '是',
    createDateValue: ['2018-12-24'],
    punctureDateValue: ['2018-12-24'],
    surgeryDateValue: ['2018-12-24'],
    focusSpecialEvent: false,
    focusBriefHistory: false,
    focusSynovialFluid: false,
  },
  onNextStep: function() {
    this.setData({
      currentStep: this.data.currentStep + 1 > 2 ? 2 : this.data.currentStep + 1,
    });
  },
  onPrevStep: function() {
    this.setData({
      currentStep: this.data.currentStep - 1 > 0 ? this.data.currentStep - 1 : 0,
    });
  },
  onClickCenter: function() {
    $wuxSelect('#selectCenter').open({
      centerValue: this.data.centerValue,
      options: [
        '血液中心',
        '骨头中心',
        '透视中心',
      ],
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            centerValue: value,
            centerTitle: options[index],
          })
        }
      },
    });
  },
  onClickSex: function() {
    $wuxSelect('#selectSex').open({
      centerValue: this.data.centerValue,
      options: [
        '男',
        '女',
      ],
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            sexValue: value,
            sexTitle: options[index],
          })
        }
      },
    });
  },
  onClickType: function() {
    $wuxSelect('#selectType').open({
      typeValue: this.data.typeValue,
      options: [
        '置换术后',
        '占位器',
      ],
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            typeValue: value,
            typeTitle: options[index],
          })
        }
      },
    });
  },
  onClickPart: function() {
    $wuxSelect('#selectPart').open({
      partValue: this.data.partValue,
      options: [
        '髋',
        '膝',
      ],
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            partValue: value,
            partTitle: options[index],
          })
        }
      },
    });
  },
  onClickMerge: function() {
    $wuxSelect('#selectMerge').open({
      mergeValue: this.data.mergeValue,
      options: [
        '是',
        '否',
      ],
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            mergeValue: value,
            mergeTitle: options[index],
          })
        }
      },
    });
  },
  onClickAntibiotic: function() {
    $wuxSelect('#selectAntibiotic').open({
      antibioticValue: this.data.antibioticValue,
      options: [
        '是',
        '否',
      ],
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            antibioticValue: value,
            antibioticTitle: options[index],
          })
        }
      },
    });
  },
  onClickSinusTract: function() {
    $wuxSelect('#selectSinusTract').open({
      sinusTractValue: this.data.sinusTractValue,
      options: [
        '是',
        '否',
      ],
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            sinusTractValue: value,
            sinusTractTitle: options[index],
          })
        }
      },
    });
  },
  onClickLePrev: function() {
    $wuxSelect('#selectLePrev').open({
      lePrevValue: this.data.lePrevValue,
      options: [
        '500',
        '250',
        '75',
        '25',
        'neg.',
        '未测',
        '有干扰'
      ],
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            lePrevValue: value,
            lePrevTitle: options[index],
          })
        }
      },
    });
  },
  onClickLeAfter: function() {
    $wuxSelect('#selectLeAfter').open({
      leAfterValue: this.data.leAfterValue,
      options: [
        '500',
        '250',
        '75',
        '25',
        'neg.',
        '未测',
        '有干扰'
      ],
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            leAfterValue: value,
            leAfterTitle: options[index],
          })
        }
      },
    });
  },
  onClickPathology: function() {
    $wuxSelect('#selectPathology').open({
      pathologyValue: this.data.pathologyValue,
      options: [
        '<5',
        '5-10',
        '>10',
        '未测'
      ],
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            pathologyValue: value,
            pathologyTitle: options[index],
          })
        }
      },
    });
  },
  onClickMSIS: function() {
    $wuxSelect('#selectMSIS').open({
      msisValue: this.data.msisValue,
      options: [
        '感染',
        '非感染',
        '不能确定'
      ],
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            msisValue: value,
            msisTitle: options[index],
          })
        }
      },
    });
  },
  onClickFinalHandle: function() {
    $wuxSelect('#selectFinalHandle').open({
      finalHandleValue: this.data.finalHandleValue,
      options: [
        '手术-占位器植入',
        '手术-假体植入',
        '手术-清创换垫',
        '未手术-抗生素压制',
        '未手术-门诊随访',
        '失访-不详'
      ],
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            finalHandleValue: value,
            finalHandleTitle: options[index],
          })
        }
      },
    });
  },
  onClickFlush: function() {
    $wuxSelect('#selectFlush').open({
      flushValue: this.data.flushValue,
      options: [
        '是',
        '否',
      ],
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            flushValue: value,
            flushTitle: options[index],
          })
        }
      },
    });
  },
  openCalendar: function() {
    $wuxCalendar("#createCalendar").open({
      value: this.data.createDateValue,
      onChange: (values, displayValues) => {
        this.setData({
          createDateValue: displayValues,
        })
      },
    })
  },
  openPuncture: function() {
    $wuxCalendar("#createPuncture").open({
      value: this.data.punctureDateValue,
      onChange: (values, displayValues) => {
        this.setData({
          punctureDateValue: displayValues,
        })
      },
    })
  },
  openSurgery: function() {
    $wuxCalendar("#createSurgery").open({
      value: this.data.punctureDateValue,
      onChange: (values, displayValues) => {
        this.setData({
          surgeryDateValue: displayValues,
        })
      },
    })
  },
  onSpecialEventClick: function() {
    this.setData({
      focusSpecialEvent: true
    })
  },
  onBriefHistoryClick: function() {
    this.setData({
      focusBriefHistory: true
    })
  },
  onSynovialFluidClick: function() {
    this.setData({
      focusSynovialFluid: true
    })
  },

  onLoad: function(options) {
    var caseId = options.case_id
    if (caseId != '0') { // 修改
      this.requestCaseInfo(caseId)
    } else { // 新增

    }
    this.setData({
      caseId: options.case_id,
    })
  },

  requestCaseInfo(caseId) {
    var that = this
    wx.showLoading({
      title: '请求数据中...',
    })
    wx.request({
      url: constant.basePath,
      data: {
        service: 'Case.GetCaseInfo',
        case_id: caseId
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        wx.hideLoading()

      },
      fail(res) {
        wx.hideLoading()
      }
    })
  }
});