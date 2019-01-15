"use strict";
import {
    $wuxSelect,
    $wuxCalendar,
} from '../../../miniprogram_npm/wux-weapp/index'

const app = getApp();
var constant = require('../../../utils/constant.js');
var util = require('../../../utils/util.js');

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
        sexList: ['男', '女'],
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
        typeList: ['置换术后', '占位器'],
        type: '置换术后',
        typeIndex: 0,
        // 部位 1髋，2膝
        partList: ['髋', '膝'],
        part: '髋',
        partIndex: 0,
        // 病征出现时长 TODO
        duration_symptoms: '',
        duration_symptoms_unit_list: ['天', '月'],
        duration_symptoms_unit_value: '',
        duration_symptoms_unit_index: 0,
        duration_symptoms_prop_list: ['急性', '慢性'],
        duration_symptoms_prop_value: '',
        duration_symptoms_prop_index: 0,
        // 诊断
        diagnose: '',
        // 是否合并自身免疫性疾病 1是，2否
        is_merge_disease_list: ['是', '否'],
        is_merge_disease_value: '是',
        is_merge_disease_index: 0,
        // 其他伴随疾病
        other_concomitant_diseases: '',
        // 近期是否应用抗生素。1是，2否
        is_used_antibiotics_list: ['是', '否'],
        is_used_antibiotics_value: '是',
        is_used_antibiotics_index: 0,
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
        sious_list: ['有', '无'],
        sious_value: '',
        sious_index: 0,
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
        is_rinse_list: ['是', '否'],
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
        var that = this
        this.setData({
            currentStep: ++this.data.currentStep,
        });
        if (this.data.currentStep > 2) {
            this.setData({
                currentStep: 2,
            });
            wx.showModal({
                title: '确定提交病历?',
                success(res) {
                    if (res.confirm) {
                        if (that.data.caseId.length > 0) { // 更改
                            that.editCase()
                        } else { // 新增
                            that.addCase()
                        }
                    }
                }
            })
        }
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
            options: this.data.sexList,
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
            options: this.data.typeList,
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
            options: this.data.partList,
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
    // 症状出现时长单位。1：天，2：月
    onClickDurationUnit: function() {
        $wuxSelect('#selectDurationUnit').open({
            duration_symptoms_unit_value: this.data.duration_symptoms_unit_value,
            options: this.data.duration_symptoms_unit_list,
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        duration_symptoms_unit_value: value,
                        duration_symptoms_unit_index: index,
                    })
                }
            },
        });
    },
    // 症状出现时长性质。1急性，2慢性
    onClickUnrationProp: function() {
        $wuxSelect('#selectDurationProp').open({
            duration_symptoms_prop_value: this.data.duration_symptoms_prop_value,
            options: this.data.duration_symptoms_prop_list,
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        duration_symptoms_prop_value: value,
                        duration_symptoms_prop_index: index,
                    })
                }
            },
        });
    },
    // 是否合并自身免疫性疾病。1是，2否
    onClickMerge: function() {
        $wuxSelect('#selectMerge').open({
            is_merge_disease_value: this.data.is_merge_disease_value,
            options: this.data.is_merge_disease_list,
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        is_merge_disease_value: value,
                        is_merge_disease_index: index,
                    })
                }
            },
        });
    },
    // 近期是否应用抗生素。1是，2否
    onClickAntibiotic: function() {
        $wuxSelect('#selectAntibiotic').open({
            is_used_antibiotics_value: this.data.is_used_antibiotics_value,
            options: this.data.is_used_antibiotics_list,
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        is_used_antibiotics_value: value,
                        is_used_antibiotics_index: index,
                    })
                }
            },
        });
    },
    // 窦道。1有，2无
    onClickSinusTract: function() {
        $wuxSelect('#selectSinusTract').open({
            sious_value: this.data.sious_value,
            options: this.data.sious_list,
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        sious_value: value,
                        sious_index: index,
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
            options: this.data.is_rinse_list,
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
        if (caseId.length > 0) {
            this.requestCaseInfo(caseId)
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
                var caseInfo = res.data.data.info
                // that.initViewByData(caseInfo)
            },
            fail(res) {
                wx.hideLoading()
            }
        })
    },

    initViewByData(caseInfo) {
        // 第一页
        this.setData({
            center_name: caseInfo.center_name,
            patient_name: caseInfo.patient_name,
            case_no: caseInfo.case_no,
            create_time: [util.formatTime(caseInfo.create_time, 'Y-M-D')],
            sex: this.data.sexList[caseInfo.sex - 1],
            age: caseInfo.age,
            height: caseInfo.height,
            weight: caseInfo.weight,
            bmi: caseInfo.bmi,
            type: this.data.typeList[caseInfo.type - 1],
            part: this.data.partList[caseInfo.part - 1],
            medical_history: caseInfo.medical_history,
            duration_symptoms: caseInfo.duration_symptoms,
            duration_symptoms_unit_value: caseInfo.duration_symptoms_unit,
            duration_symptoms_prop_value: caseInfo.duration_symptoms_prop,
            diagnose: caseInfo.diagnose,
            is_merge_disease_value: this.data.is_merge_disease_list[caseInfo.is_merge_disease - 1],
            other_concomitant_diseases: caseInfo.other_concomitant_diseases,
            is_used_antibiotics_value: this.data.is_used_antibiotics_list[caseInfo.is_used_antibiotics - 1],
            telphone1: caseInfo.telphone1,
            telphone2: caseInfo.telphone2,
            special_matter: caseInfo.special_matter
        })
        this.setData({
            // 第二页
            sious_value: this.data.sious_list[caseInfo.sious - 1],
            preoperative_esr: caseInfo.preoperative_esr,
            normal_crp: caseInfo.normal_crp,
            preoperative_crp: caseInfo.preoperative_crp,
            le_testpaper_stoste_value: this.data.le_testpaper_stoste_list[caseInfo.le_testpaper_stoste - 1],
            le_testpaper_centrifugal_value: this.data.le_testpaper_centrifugal_list[caseInfo.le_testpaper_centrifugal - 1],
            joint_fluid_leukocyte: caseInfo.joint_fluid_leukocyte,
            neutrophils_percent: caseInfo.neutrophils_percent,
            culture_result1: caseInfo.culture_result1,
            culture_result2: caseInfo.culture_result2,
            culture_result3: caseInfo.culture_result3,
            pathologyValue: this.data.pathologyList[caseInfo.pathology - 1],
            msisValue: this.data.msisList[caseInfo.msis - 1],
            final_disposal_value: this.data.final_disposal_list[caseInfo.final_disposal - 1]
        })
        // 第三页
        this.setData({
            puncture_date: [util.formatTime(caseInfo.puncture_date, 'Y-M-D')],
            middle_joint_fluid: caseInfo.middle_joint_fluid,
            is_rinse_value: this.data.is_rinse_list[caseInfo.is_rinse - 1],
            rinse_fluid_volume: caseInfo.rinse_fluid_volume,
            culture_bottle_fluid_volume: caseInfo.culture_bottle_fluid_volume,
            germ_name: caseInfo.germ_name,
            ngs_volume: caseInfo.ngs_volume,
            ngs_result: caseInfo.ngs_result,
            operation_date: [util.formatTime(caseInfo.operation_date, 'Y-M-D')],
            tissue_ngs_result: caseInfo.tissue_ngs_result,
            ultrasonic_degradation_result: caseInfo.ultrasonic_degradation_result,
            ultrasonic_degradation_ngs_result: caseInfo.ultrasonic_degradation_ngs_result,
        })
    },

    editCase() {
        if (!this.isValueRight()) {
            return
        }
        var that = this
        wx.showLoading({
            title: '更改病历中...',
        })
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.EditCase',
                openid: app.globalData.openid,
                case_id: that.data.caseId,
                json_data: that.makeJsonData()
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                // console.log(JSON.stringify(res))
                wx.hideLoading()
                if (res.data.data.code == constant.response_success) {
                    that.reloadPrePage()
                    wx.navigateBack({
                        delta: 1
                    })
                }
                // TODO jidp
                wx.showToast({
                    title: res.data.data.msg,
                })
            },
            fail(res) {
                wx.hideLoading()
            }
        })
    },
    addCase() {
        if (!this.isValueRight()) {
            return
        }

        var that = this
        wx.showLoading({
            title: '新增病历中...',
        })
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.CreateCase',
                openid: app.globalData.openid,
                json_data: that.makeJsonData()
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                // console.log(JSON.stringify(res))
                wx.hideLoading()
                if (res.data.data.code == constant.response_success) {
                    that.reloadPrePage()
                    wx.navigateBack({
                        delta: 1
                    })
                }
                // TODO jidp
                wx.showToast({
                    title: res.data.data.msg,
                })
            },
            fail(res) {
                wx.hideLoading()
            }
        })
    },

    isValueRight() {
        if (this.data.center_name.length <= 0) {
            wx.showToast({
                icon: 'none',
                title: '请选择所属中心',
            })
            return false
        }
        if (this.data.patient_name.length <= 0) {
            wx.showToast({
                icon: 'none',
                title: '请填写患者姓名',
            })
            return false
        }
        return true
    },


    reloadPrePage() {
        var pages = getCurrentPages();
        if (pages.length > 1) {
            //上一个页面实例对象
            var prePage = pages[pages.length - 2];
            //关键在这里
            prePage.initData()
        }
    },

    makeJsonData() {
        var that = this
        var caseObj = {
            "center_id": app.globalData.centerId,
            "patient_name": that.data.patient_name,
            "case_no": that.data.case_no,
            "create_time": new Date(that.data.create_time[0]).getTime,
            "special_matter": that.data.special_matter,
            "sex": that.data.sexIndex + 1,
            "age": that.data.age,
            "height": that.data.height,
            "weight": that.data.weight,
            "bmi": that.data.bmi,
            "type": that.data.typeIndex + 1,
            "part": that.data.partIndex + 1,
            "medical_history": that.data.medical_history,
            "duration_symptoms": that.data.duration_symptoms,
            "duration_symptoms_unit": that.data.duration_symptoms_unit_index + 1,
            "duration_symptoms_prop": that.data.duration_symptoms_prop_index + 1,
            "diagnose": that.data.diagnose,
            "is_merge_disease": that.data.is_merge_disease_index + 1,
            "other_concomitant_diseases": that.data.other_concomitant_diseases,
            "is_used_antibiotics": that.data.is_used_antibiotics_index + 1,
            "telphone1": that.data.telphone1,
            "telphone2": that.data.telphone2,
            "sious": that.data.sious_index + 1,
            "preoperative_esr": that.data.preoperative_esr,
            "normal_crp": that.data.normal_crp,
            "preoperative_crp": that.data.preoperative_crp,
            "le_testpaper_stoste": that.data.le_testpaper_stoste_index + 1,
            "le_testpaper_centrifugal": that.data.le_testpaper_centrifugal_index + 1,
            "joint_fluid_leukocyte": that.data.joint_fluid_leukocyte,
            "neutrophils_percent": that.data.neutrophils_percent,
            "culture_result1": that.data.culture_result1,
            "culture_result2": that.data.culture_result2,
            "culture_result3": that.data.culture_result3,
            "pathology": that.data.pathologyIndex + 1,
            "msis": that.data.msisIndex + 1,
            "final_disposal": that.data.final_disposal_index + 1,
            "puncture_date": new Date(that.data.puncture_date[0]).getTime,
            "middle_joint_fluid": that.data.middle_joint_fluid,
            "is_rinse": that.data.is_rinse_index + 1,
            "rinse_fluid_volume": that.data.rinse_fluid_volume,
            "culture_bottle_fluid_volume": that.data.culture_bottle_fluid_volume,
            "germ_name": that.data.germ_name,
            "ngs_volume": that.data.ngs_volume,
            "ngs_result": that.data.ngs_result,
            "operation_date": new Date(that.data.operation_date[0]).getTime,
            "tissue_ngs_result": that.data.tissue_ngs_result,
            "ultrasonic_degradation_result": that.data.ultrasonic_degradation_result,
            "ultrasonic_degradation_ngs_result": that.data.ultrasonic_degradation_ngs_result
        }

        return JSON.stringify(caseObj)
    }
});