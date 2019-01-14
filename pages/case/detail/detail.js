"use strict";
import {
    $wuxSelect,
    $wuxCalendar,
} from '../../../miniprogram_npm/wux-weapp/index'

const app = getApp();
var constant = require('../../../utils/constant.js');

Page({
    data: {
        currentStep: 0,
        // 病例
        caseId: "",
        caseInfo: {},
        // ------------- 第一页 ------------- //
        // 中心相关
        centerObjList: [],
        centValueList: [],
        center_name: '',
        centerIndex: 0,
        // 姓名
        patient_name: '',
        // 病例号
        case_no: '',
        // 建档日期
        create_time: [],
        // 性别
        sex: '男',
        sexIndex: 0,
        // 年龄
        age: 0,
        // 身高
        height: 0,
        // 体重
        weight: 0,
        // BMI
        bmi: 0,
        // 类型 1置换术后，2占位器
        type: '置换术后',
        typeIndex: 0,
        // 部位 1髋，2膝
        part: '髋',
        partIndex: 0,
        // 病征出现时长 TODO
        duration_symptoms: '',
        // 诊断
        diagnose: '',
        // 是否合并自身免疫性疾病 1是，2否
        mergeIndex: 0,
        mergeValue: '是',
        // 其他伴随疾病
        other_concomitant_diseases: '',
        // 近期是否应用抗生素。1是，2否
        antibioticValue: '是',
        antibioticIndex: 0,
        // 联系电话1
        telphone1: '',
        // 联系电话2
        telphone2: '',
        // 特殊事项
        special_matter: '',
        // 简要病史
        medical_history: '',

        // ------------- 第二页 ------------- //
        // 窦道。1有，2无
        siousValue: '是',
        siousIndex: 0,
        // 术前ESR
        preoperative_esr: 0,
        // 标准化CRP
        normal_crp: 0,
        // 术前CRP
        preoperative_crp: 0,
        // LE试纸原液。1：未测，2：neg；25；75；250；500
        le_testpaper_stoste_list: ['未测', 'neg', '25', '75', '250', '500'],
        le_testpaper_stoste_value: '500',
        le_testpaper_stoste_index: 0,
        // LE试纸离心。1：未测，2：neg；25；75；250；500
        le_testpaper_centrifugal_list: ['未测', 'neg', '25', '75', '250', '500'],
        le_testpaper_centrifugal_value: '500',
        le_testpaper_centrifugal_index: 0,
        // 关节液白细胞计数
        joint_fluid_leukocyte: 0,
        // 中性粒细胞百分比
        neutrophils_percent: 0,
        // 1号组织培养结果
        culture_result1: '',
        // 2号组织培养结果
        culture_result2: '',
        // 3号组织培养结果
        culture_result3: '',
        // 病理 1：未测；2：小于5；3：5-10；4：大于10
        pathologyList: ['未测', '<5', '5-10', '>10'],
        pathologyValue: '<5',
        pathologyIndex: 0,
        // MSIS最终判定。1：不能确定；2：非感染；3：感染
        msisList: ['不能确定', '非感染', '感染'],
        msisValue: '感染',
        msisIndex: 0,
        // 最终处理。1：失访-不详；2未手术-门诊随访；3未手术-抗生素压制；4手术-清创换垫；5手术-假体植入；6手术-占位器植入
        final_disposal_list: ['失访-不详', '未手术-门诊随访', '未手术-抗生素压制', '手术-清创换垫', '手术-假体植入', '手术-占位器植入'],
        final_disposal_value: '手术-占位器植入',
        final_disposal_index: 0,

        // ------------- 第三页 ------------- //
        // 穿刺日期
        puncture_date: [],
        // 穿刺中关节液情况概述 & 是否稀释
        middle_joint_fluid: '',
        // 是否冲洗 1是，2否
        is_rinse_value: '是',
        is_rinse_index: 0,
        // 抽出关节液/冲洗液量
        rinse_fluid_volume: 0,
        // 打入培养瓶内液体量
        culture_bottle_fluid_volume: 0,
        // 细菌名称
        germ_name: '',
        // 送检NGS量
        ngs_volume: 0,
        // NGS结果
        tissue_ngs_result: '',
        // 手术日期
        operation_date: [],
        // 组织NGS结果
        tissue_ngs_result: '',
        // 超声裂解培养结果
        ultrasonic_degradation_result: '',
        // 超声裂解NGS结果
        ultrasonic_degradation_ngs_result: '',

        // 录入者
        write_staff_list: [],
        // 审核者
        auditor: '',
        auditor_name: '',
        auditor_avatar: '',


        // createDateValue: ['2018-12-24'],
        // punctureDateValue: ['2018-12-24'],
        // surgeryDateValue: ['2018-12-24'],
        // 特殊事项
        focusSpecialEvent: false,
        // 简要病史
        focusBriefHistory: false,
        // 穿刺中关节液情况概述 & 是否稀释
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
    // 所属中心
    onClickCenter: function() {
        $wuxSelect('#selectCenter').open({
            center_name: this.data.center_name,
            options: this.data.centValueList,
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        center_name: value,
                        centerIndex: index,
                    })
                }
            },
        });
    },
    // 性别 1男，2女
    onClickSex: function() {
        $wuxSelect('#selectSex').open({
            sex: this.data.sex,
            options: [
                '男',
                '女',
            ],
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        sex: value,
                        sexIndex: index,
                    })
                }
            },
        });
    },
    // 类型 1置换术后，2占位器
    onClickType: function() {
        $wuxSelect('#selectType').open({
            type: this.data.type,
            options: [
                '置换术后',
                '占位器',
            ],
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        type: value,
                        typeIndex: index,
                    })
                }
            },
        });
    },
    // 部位。1髋，2膝
    onClickPart: function() {
        $wuxSelect('#selectPart').open({
            part: this.data.part,
            options: [
                '髋',
                '膝',
            ],
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        part: value,
                        partIndex: index,
                    })
                }
            },
        });
    },
    // 是否合并自身免疫性疾病。1是，2否
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
                        mergeIndex: index,
                    })
                }
            },
        });
    },
    // 近期是否应用抗生素。1是，2否
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
                        antibioticIndex: index,
                    })
                }
            },
        });
    },
    // 窦道。1有，2无
    onClickSinusTract: function() {
        $wuxSelect('#selectSinusTract').open({
            siousValue: this.data.siousValue,
            options: [
                '是',
                '否',
            ],
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        siousValue: value,
                        siousIndex: index,
                    })
                }
            },
        });
    },
    // LE试纸原液。1：未测，2：neg；25；75；250；500
    onClickLePrev: function() {
        $wuxSelect('#selectLePrev').open({
            le_testpaper_stoste_value: this.data.le_testpaper_stoste_value,
            options: this.data.le_testpaper_stoste_list,
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        le_testpaper_stoste_value: value,
                        le_testpaper_stoste_index: index,
                    })
                }
            },
        });
    },
    // LE试纸离心。1：未测，2：neg；25；75；250；500
    onClickLeAfter: function() {
        $wuxSelect('#selectLeAfter').open({
            le_testpaper_centrifugal_value: this.data.le_testpaper_centrifugal_value,
            options: this.data.le_testpaper_centrifugal_list,
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        le_testpaper_centrifugal_value: value,
                        le_testpaper_centrifugal_index: index,
                    })
                }
            },
        });
    },
    // 病理。1：未测；2：小于5；3：5-10；4：大于10
    onClickPathology: function() {
        $wuxSelect('#selectPathology').open({
            pathologyValue: this.data.pathologyValue,
            options: this.data.pathologyList,
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        pathologyValue: value,
                        pathologyIndex: index,
                    })
                }
            },
        });
    },
    // MSIS最终判定。1：不能确定；2：非感染；3：感染
    onClickMSIS: function() {
        $wuxSelect('#selectMSIS').open({
            msisValue: this.data.msisValue,
            options: this.data.msisList,
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        msisValue: value,
                        msisIndex: index,
                    })
                }
            },
        });
    },
    // 最终处理。1：失访-不详；2未手术-门诊随访；3未手术-抗生素压制；4手术-清创换垫；5手术-假体植入；6手术-占位器植入
    onClickFinalHandle: function() {
        $wuxSelect('#selectFinalHandle').open({
            final_disposal_value: this.data.final_disposal_value,
            options: this.data.final_disposal_list,
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        final_disposal_value: value,
                        final_disposal_index: index,
                    })
                }
            },
        });
    },
    // 是否冲洗。1是，2否
    onClickFlush: function() {
        $wuxSelect('#selectFlush').open({
            is_rinse_value: this.data.is_rinse_value,
            options: [
                '是',
                '否',
            ],
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        is_rinse_value: value,
                        is_rinse_index: index,
                    })
                }
            },
        });
    },
    // 建档日期
    openCalendar: function() {
        $wuxCalendar("#createCalendar").open({
            value: this.data.create_time,
            onChange: (values, displayValues) => {
                this.setData({
                    create_time: displayValues,
                })
            },
        })
    },
    // 穿刺日期
    openPuncture: function() {
        $wuxCalendar("#createPuncture").open({
            puncture_date: this.data.puncture_date,
            onChange: (values, displayValues) => {
                this.setData({
                    puncture_date: displayValues,
                })
            },
        })
    },
    // 手术日期
    openSurgery: function() {
        $wuxCalendar("#createSurgery").open({
            value: this.data.operation_date,
            onChange: (values, displayValues) => {
                this.setData({
                    operation_date: displayValues,
                })
            },
        })
    },
    // 特殊事项
    onSpecialEventClick: function() {
        this.setData({
            focusSpecialEvent: true
        })
    },
    // 简要病史
    onBriefHistoryClick: function() {
        this.setData({
            focusBriefHistory: true
        })
    },
    // 穿刺中关节液情况概述 & 是否稀释
    onSynovialFluidClick: function() {
        this.setData({
            focusSynovialFluid: true
        })
    },

    onLoad: function(options) {
        this.requestCenterList()
        var caseId = options.case_id
        if (caseId != '0') { // 修改
            this.requestCaseInfo(caseId)
        } else { // 新增

        }
        this.setData({
            caseId: options.case_id,
        })
    },

    // 中心列表
    requestCenterList() {
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

            }
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
                that.setData({
                    caseInfo: res.data.data.info
                })
            },
            fail(res) {
                wx.hideLoading()
            }
        })
    }
});