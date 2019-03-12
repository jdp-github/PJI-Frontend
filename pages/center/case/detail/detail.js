'use strict';

let constant = require('../../../../utils/constant.js');
let util = require('../../../../utils/util.js');

const app = getApp();

Page({
    data: {
        loadProgress: 0,
        loadModal: false,
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        isAdmin: false,
        TabCur: 0,
        VerticalNavTop: 0,
        TabTitle: ['基本信息', '诊断性穿刺', '入院后信息', '关联标本'],
        ShowBasic: true,
        ShowDiagnose: false,
        ShowAdmission: false,
        ShowSpecimen: false,
        createDate: util.getNowFormatDate(new Date()),
        sex: 0,
        sexPicker: ['请选择', '男', '女'],
        tel2Disabled: true,
        part: 0,
        partPicker: ['请选择', '髋', '膝'],
        type: 0,
        typePicker: ['请选择', '置换术后', '占位器'],
        operationDateMultiArray: [
            ['单位'],
            ['天', '周', '月', '年'],
            ['1天', '2天', '3天', '4天', '5天', '6天', '7天', '8天', '9天', '10天', '11天', '12天', '13天', '14天', '15天', '16天', '17天', '18天', '19天', '20天', '21天', '22天', '23天', '24天', '25天', '26天', '27天', '28天', '29天', '30天', '31天']
        ],
        operationDateMultiIndex: [0, 0],
        operationDisabled: true,
        symptomDateMultiArray: [
            ['单位'],
            ['天', '周', '月', '年'],
            ['1天', '2天', '3天', '4天', '5天', '6天', '7天', '8天', '9天', '10天', '11天', '12天', '13天', '14天', '15天', '16天', '17天', '18天', '19天', '20天', '21天', '22天', '23天', '24天', '25天', '26天', '27天', '28天', '29天', '30天', '31天']
        ],
        symptomDateMultiIndex: [0, 0],
        symptomDisabled: true,
        ris: 0,
        risPicker: ['请选择', '否', '类风湿', '强制性脊柱炎', '其他 (请在备注中标明)'],
        antibiotic: 0,
        antibioticPicker: ['请选择', '是', '否']
    },
    onLoad: function (options) {
        this.loadProgress();
        this.setData({
            centerId: options.centerId ? options.centerId : '',
            centerName: options.centerName ? options.centerName : '',
            isAdmin: app.globalData.is_admin == '1'
        });
        this.completeProgress();
    },
    loadProgress: function () {
        if (this.data.loadProgress < 96) {
            this.setData({
                loadProgress: this.data.loadProgress + 3
            });
        }
        if (this.data.loadProgress < 100) {
            setTimeout(() => {
                this.loadProgress();
            }, 100);
        } else {
            this.setData({
                loadProgress: 0
            });
        }
    },
    completeProgress: function () {
        this.setData({
            loadProgress: 100
        });
    },
    showToast: function (msg) {
        wx.showToast({
            icon: 'none',
            title: msg,
        });
    },
    showLoading: function () {
        this.setData({
            loadModal: true
        });
    },
    hideLoading: function () {
        setTimeout(() => {
            this.setData({
                loadModal: false
            });
        }, 1500);
    },
    tabSelect: function (e) {
        let tabId = e.currentTarget.dataset.id;
        switch (tabId) {
            case 0:
                this.setData({
                    TabCur: tabId,
                    VerticalNavTop: (tabId - 1) * 50,
                    ShowBasic: true,
                    ShowDiagnose: false,
                    ShowAdmission: false,
                    ShowSpecimen: false
                });
                break;
            case 1:
                this.setData({
                    TabCur: tabId,
                    VerticalNavTop: (tabId - 1) * 50,
                    ShowBasic: false,
                    ShowDiagnose: true,
                    ShowAdmission: false,
                    ShowSpecimen: false
                });
                break;
            case 2:
                this.setData({
                    TabCur: tabId,
                    VerticalNavTop: (tabId - 1) * 50,
                    ShowBasic: false,
                    ShowDiagnose: false,
                    ShowAdmission: true,
                    ShowSpecimen: false
                });
                break;
            case 3:
                this.setData({
                    TabCur: tabId,
                    VerticalNavTop: (tabId - 1) * 50,
                    ShowBasic: false,
                    ShowDiagnose: false,
                    ShowAdmission: false,
                    ShowSpecimen: true
                });
                break;
        }
    },
    onCreateDateChange: function (e) {
        this.setData({
            createDate: e.detail.value
        });
    },
    onSexChange: function (e) {
        this.setData({
            sex: e.detail.value,
        });
    },
    onTel2SwitchChange: function (e) {
        this.setData({
            tel2Disabled: !e.detail.value
        });
    },
    onPartChange: function (e) {
        this.setData({
            part: e.detail.value,
        });
    },
    onTypeChange: function (e) {
        this.setData({
            type: e.detail.value,
        });
    },
    operationDateChange: function (e) {
        this.setData({
            operationDateMultiIndex: e.detail.value
        })
    },
    operationDateColumnChange: function (e) {
        let data = {
            operationDateMultiArray: this.data.operationDateMultiArray,
            operationDateMultiIndex: this.data.operationDateMultiIndex
        };
        data.operationDateMultiIndex[e.detail.column] = e.detail.value;
        switch (e.detail.column) {
            case 0:
                switch (data.operationDateMultiIndex[0]) {
                    case 0:
                        data.operationDateMultiArray[1] = ['天', '月', '年'];
                        data.operationDateMultiArray[2] = ['1天', '2天', '3天', '4天', '5天', '6天', '7天', '8天', '9天', '10天', '11天', '12天', '13天', '14天', '15天', '16天', '17天', '18天', '19天', '20天', '21天', '22天', '23天', '24天', '25天', '26天', '27天', '28天', '29天', '30天', '31天'];
                        break;
                }
                data.operationDateMultiIndex[1] = 0;
                data.operationDateMultiIndex[2] = 0;
                break;
            case 1:
                switch (data.operationDateMultiIndex[0]) {
                    case 0:
                        switch (data.operationDateMultiIndex[1]) {
                            case 0:
                                data.operationDateMultiArray[2] = ['1天', '2天', '3天', '4天', '5天', '6天', '7天', '8天', '9天', '10天', '11天', '12天', '13天', '14天', '15天', '16天', '17天', '18天', '19天', '20天', '21天', '22天', '23天', '24天', '25天', '26天', '27天', '28天', '29天', '30天', '31天'];
                                break;
                            case 1:
                                data.operationDateMultiArray[2] = ['1周', '2周', '3周', '4周'];
                                break;
                            case 2:
                                data.operationDateMultiArray[2] = ['1个月', '2个月', '3个月', '4个月', '5个月', '6个月', '7个月', '8个月', '9个月', '10个月', '11个月', '12个月'];
                                break;
                            case 3:
                                data.operationDateMultiArray[2] = ['1年', '2年', '3年', '4年', '5年', '6年', '7年', '8年', '9年', '10年'];
                                break;
                        }
                        break;
                }
                data.operationDateMultiIndex[2] = 0;
                break;
        }
        this.setData(data);
    },
    onOperationcSwitchChange: function (e) {
        this.setData({
            operationDisabled: !e.detail.value
        });
    },
    symptomDateChange: function (e) {
        this.setData({
            symptomDateMultiIndex: e.detail.value
        })
    },
    symptomDateColumnChange: function (e) {
        let data = {
            symptomDateMultiArray: this.data.symptomDateMultiArray,
            symptomDateMultiIndex: this.data.symptomDateMultiIndex
        };
        data.symptomDateMultiIndex[e.detail.column] = e.detail.value;
        switch (e.detail.column) {
            case 0:
                switch (data.symptomDateMultiIndex[0]) {
                    case 0:
                        data.symptomDateMultiArray[1] = ['天', '月', '年'];
                        data.symptomDateMultiArray[2] = ['1天', '2天', '3天', '4天', '5天', '6天', '7天', '8天', '9天', '10天', '11天', '12天', '13天', '14天', '15天', '16天', '17天', '18天', '19天', '20天', '21天', '22天', '23天', '24天', '25天', '26天', '27天', '28天', '29天', '30天', '31天'];
                        break;
                }
                data.symptomDateMultiIndex[1] = 0;
                data.symptomDateMultiIndex[2] = 0;
                break;
            case 1:
                switch (data.symptomDateMultiIndex[0]) {
                    case 0:
                        switch (data.symptomDateMultiIndex[1]) {
                            case 0:
                                data.symptomDateMultiArray[2] = ['1天', '2天', '3天', '4天', '5天', '6天', '7天', '8天', '9天', '10天', '11天', '12天', '13天', '14天', '15天', '16天', '17天', '18天', '19天', '20天', '21天', '22天', '23天', '24天', '25天', '26天', '27天', '28天', '29天', '30天', '31天'];
                                break;
                            case 1:
                                data.symptomDateMultiArray[2] = ['1周', '2周', '3周', '4周'];
                                break;
                            case 2:
                                data.symptomDateMultiArray[2] = ['1个月', '2个月', '3个月', '4个月', '5个月', '6个月', '7个月', '8个月', '9个月', '10个月', '11个月', '12个月'];
                                break;
                            case 3:
                                data.symptomDateMultiArray[2] = ['1年', '2年', '3年', '4年', '5年', '6年', '7年', '8年', '9年', '10年'];
                                break;
                        }
                        break;
                }
                data.symptomDateMultiIndex[2] = 0;
                break;
        }
        this.setData(data);
    },
    onSymptomSwitchChange: function (e) {
        this.setData({
            symptomDisabled: !e.detail.value
        });
    },
    onRisChange: function (e) {
        this.setData({
            ris: e.detail.value,
        });
    },
    onAntibioticChange: function (e) {
        this.setData({
            antibiotic: e.detail.value,
        });
    },
});