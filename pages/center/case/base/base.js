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
        // -------- modal begin ----------- //
        modalName: '',
        errMsg: '',
        // -------- modal end ------------- //

        // -------- 公用信息 begin -------- //
        isCreate: false,
        isEdit: false,
        caseId: '',
        caseInfo: {},
        itemId: '',
        addAvatar: '',
        updateAvatarArr: [],
        approveAvatar: '',
        // -------- 公用信息 end -------- //
        centerId: '',
        centerName: '',
        name: '',
        caseNO: "",
        side: 0,
        sidePicker: ["请选择", "左侧", "右侧"],
        part: 0,
        partPicker: ["请选择", "髋", "膝"],
        createDate: '',
        sex: 0,
        sexPicker: ['请选择', '男', '女'],
        age: '',
        height: '',
        weight: '',
        bmi: '',
        chiefDoc: '',
        tel1: '',
        tel2: '',
        tel2Disabled: true,
        // 病例类型
        type: 0,
        typePicker: ['请选择', '置换术后', '占位器术后', '初次', '其他内置物', '翻修术后'],
        // 简要病史
        medical_history: '',
        // 初次置换时间
        first_displace_time: util.getNowFormatDate(),
        // 初次置换原因
        first_displace_reason: 0,
        first_displace_reason_picker: ['请选择', '骨关节炎', '股骨头坏死', '类风湿性关节炎直性脊柱炎', '先天性髋关节发育不良', '其他'],
        // 是否本院手术病例
        is_hospital_operation: 0,
        is_hospital_operation_picker: ['请选择', '是', '否'],
        // 末次手术日期
        last_operation_date: util.getNowFormatDate(),
        // 已翻修次数
        repair_count: 0,
        repair_count_picker: ["请选择", "1", "2", "3", "4", "5", "6", "7", "8", "9", ],
        // 本次症状出现日期
        duration_symptoms_date: util.getNowFormatDate(),
        // 本次发病可能诱因
        this_time_cause: '',
        // 弹出框
        is_rheumatism: 0,
        is_rheumatoid: 0,
        is_as: 0,
        is_spa: 0,
        is_psa: 0,
        is_gout: 0,
        is_cancer: 0,
        cure_state: 0,
        radiotherapy: 0,
        radiotherapy_picker: ['请选择', '1月内', '3月内', '半年内', '1年内', '1年以上'],
        chemotherapy: 0,
        glycuresis: 0,
        hypertension: 0,
        cvd: 0,
        chd: 0,
        ledvt: 0,
        pud: 0,
        copd: 0,
        abnormal_heart: 0,
        abnormal_liver: 0,
        abnormal_renal: 0,
        abnormal_thyroid: 0,
        anemia: 0,
        is_smoke: 0,
        is_drink: 0,
        is_drink_picker: ['请选择', '少量', '中量', '大量', '已戒3月以上'],
        other_disease: '',
        score: '',
        remark: '',
    },

    // -------- 基本信息事件 begin -------- //
    onCreateDateChange: function(e) {
        this.setData({
            createDate: e.detail.value
        });
    },
    onSexChange: function(e) {
        this.setData({
            sex: parseInt(e.detail.value)
        });
    },
    onAgeInput: function(e) {
        this.setData({
            age: e.detail.value,
        });
    },
    onHeightInput: function(e) {
        this.setData({
            height: e.detail.value
        });
        if (this.data.weight != 0 && this.data.height != 0) {
            var calcBMI = this.data.weight / (this.data.height * this.data.height)
            this.setData({
                bmi: calcBMI.toFixed(2)
            })
        }
    },
    onWeightInput: function(e) {
        this.setData({
            weight: e.detail.value
        });
        if (this.data.weight != 0 && this.data.height != 0) {
            var calcBMI = this.data.weight / (this.data.height * this.data.height)
            this.setData({
                bmi: calcBMI.toFixed(2)
            })
        }
    },
    onChiefDocInput: function(e) {
        this.setData({
            chiefDoc: e.detail.value
        });
    },
    onTel1Input: function(e) {
        this.setData({
            tel1: e.detail.value
        });
    },
    onTel2Input: function(e) {
        this.setData({
            tel2: e.detail.value
        });
    },
    onTel2SwitchChange: function(e) {
        this.setData({
            tel2Disabled: !e.detail.value
        });
        if (this.data.tel2Disabled) {
            this.setData({
                tel2: ''
            });
        }
    },
    onTypeChange: function(e) {
        this.setData({
            type: parseInt(e.detail.value),
        });
    },
    onMedical_historyInput: function(e) {
        this.setData({
            medical_history: e.detail.value
        });
    },
    onFirst_displace_timeChange(e) {
        this.setData({
            first_displace_time: e.detail.value,
        });
    },
    onFirst_displace_reasonChange(e) {
        this.setData({
            first_displace_reason: parseInt(e.detail.value),
        });
    },
    onIs_hospital_operationChange(e) {
        this.setData({
            is_hospital_operation: parseInt(e.detail.value),
        });
    },
    onLast_operation_dateChange: function(e) {
        this.setData({
            last_operation_date: e.detail.value
        });
    },
    onRepair_countChange(e) {
        this.setData({
            repair_count: parseInt(e.detail.value)
        });
    },
    onDuration_symptoms_dateChange(e) {
        this.setData({
            duration_symptoms_date: e.detail.value
        });
    },
    onThis_time_causeInput(e) {
        this.setData({
            this_time_cause: e.detail.value
        });
    },
    onShowDrawer() {
        this.setData({
            modalName: "DrawerModalR"
        })
    },
    onCloseDrawer() {
        this.setData({
            modalName: null
        })
    },
    radioChange(e) {
        let param = e.currentTarget.dataset.type
        this.setData({
            [param]: parseInt(e.detail.value)
        })
    },
    onRadiotherapyChange: function(e) {
        this.setData({
            radiotherapy: parseInt(e.detail.value),
        });
    },
    onChemotherapyChange(e) {
        this.setData({
            chemotherapy: parseInt(e.detail.value),
        });
    },
    onIs_smokeChange: function(e) {
        this.setData({
            is_smoke: parseInt(e.detail.value),
        });
    },
    onIs_drinkChange: function(e) {
        this.setData({
            is_drink: parseInt(e.detail.value),
        });
    },
    onRadiotherapyChange: function(e) {
        this.setData({
            radiotherapy: parseInt(e.detail.value),
        });
    },
    onOther_diseaseInput: function(e) {
        this.setData({
            other_disease: e.detail.value
        });
    },
    onScoreInput: function(e) {
        this.setData({
            score: e.detail.value
        });
    },
    onRemarkInput: function(e) {
        this.setData({
            remark: e.detail.value
        });
    },
    // -------- 基本信息事件 end -------- //

    // -------- 提示框 begin -------- //
    loadProgress: function() {
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
    completeProgress: function() {
        this.setData({
            loadProgress: 100
        });
    },
    showToast: function(msg) {
        wx.showToast({
            icon: 'none',
            title: msg,
        });
    },
    showLoading: function() {
        this.setData({
            loadModal: true
        });
    },
    hideLoading: function() {
        setTimeout(() => {
            this.setData({
                loadModal: false
            });
        }, 1500);
    },
    // -------- 提示框 end -------- //

    // -------- 模态对话框 start -------- //
    showModal: function(e, errMessage = '') {
        if (e.currentTarget) {
            this.setData({
                modalName: e.currentTarget.dataset.target
            });
        } else {
            this.setData({
                modalName: e,
                errMsg: errMessage
            });
        }
    },
    hideModal: function(e) {
        this.setData({
            modalName: null
        });
    },
    // -------- 模态对话框 end  -------- //

    onLoad: function(options) {
        this.loadProgress();
        this.setData({
            isAdmin: app.globalData.is_admin == '1',
            centerId: options.centerId,
            centerName: options.centerName,
            caseId: options.caseId,
            itemId: options.itemId,
            isCreate: options.itemId == 0,
        });
        this.requestCaseInfo(this.data.caseId)
        this.setData({
            addAvatar: app.globalData.avatarUrl
        })
        this.completeProgress();
    },

    requestCaseInfo(caseId) {
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.GetCaseInfo',
                case_id: caseId,
                item_id: that.data.itemId,
                type: 1,
                openid: app.globalData.openid
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.GetCaseInfo:" + JSON.stringify(res))
                that.hideLoading();
                if (res.data.data.code == 0) {
                    that.initViewByData(res.data.data.info)
                } else {
                    that.showModal("ErrModal", res.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },
    initViewByData(info) {
        this.setData({
            caseInfo: info,
            addAvatar: info.base_creator_avatar,
            updateAvatarArr: this.makeUpdateAvatar(info.base_editor_list),
            approveAvatar: info.base_auditor_avatar,
        });
        // 基本信息
        this.setData({
            centerName: this.data.centerName,
            name: info.patient_name,
            caseNO: info.case_no,
            side: parseInt(info.side),
            part: parseInt(info.part),
            createDate: this.data.isCreate ? util.getNowFormatDate() : util.formatTime(info.create_time, 'Y-M-D'),
            sex: parseInt(info.sex),
            age: this.getDefaultNum(info.age),
            height: this.getDefaultNum(info.height),
            weight: this.getDefaultNum(info.weight),
            bmi: this.getDefaultNum(info.bmi),
            chiefDoc: info.pro_doctor,
            tel1: info.telphone1,
            tel2: info.telphone2,
            tel2Disabled: this.getValueDisable(info.telphone2),
            medical_history: info.medical_history,

            first_displace_time: this.data.isCreate ? util.getNowFormatDate() : util.formatTime(info.first_displace_time, 'Y-M-D'),
            first_displace_reason: parseInt(info.first_displace_reason ? info.first_displace_reason : 0),
            is_hospital_operation: info.is_hospital_operation,
            last_operation_date: this.data.isCreate ? util.getNowFormatDate() : util.formatTime(info.last_operation_date, 'Y-M-D'),
            repair_count: info.repair_count,
            duration_symptoms_date: this.data.isCreate ? util.getNowFormatDate() : util.formatTime(info.duration_symptoms_date, 'Y-M-D'),
            this_time_cause: info.this_time_cause,

            is_rheumatism: info.is_rheumatism,
            is_rheumatoid: info.is_rheumatoid,
            is_as: info.is_as,
            is_spa: info.is_spa,
            is_psa: info.is_psa,
            is_gout: info.is_gout,
            is_cancer: info.is_cancer,
            cure_state: info.cure_state,
            radiotherapy: info.radiotherapy,
            chemotherapy: info.chemotherapy,
            glycuresis: info.glycuresis,
            hypertension: info.hypertension,
            cvd: info.cvd,
            chd: info.chd,
            ledvt: info.ledvt,
            pud: info.pud,
            copd: info.copd,
            abnormal_heart: info.abnormal_heart,
            abnormal_liver: info.abnormal_liver,
            abnormal_renal: info.abnormal_renal,
            abnormal_thyroid: info.abnormal_thyroid,
            anemia: info.anemia,
            is_smoke: info.is_smoke,
            is_drink: info.is_drink,
            other_disease: info.other_disease,
            score: info.score,
            remark: info.remark,

            addAvatar: info.base_creator_avatar,
            updateAvatarArr: this.makeUpdateAvatar(info.base_editor_list),
            approveAvatar: info.base_auditor_avatar,
            isBaseLock: info.is_lock
        })
    },

    getDefaultNum(num) {
        return num > 0 ? num : ""
    },

    getDefaultDate(date) {
        var dateValue = "请选择日期"
        if (date != null && date != 0) {
            dateValue = util.formatTime(date, 'Y-M-D')
        }
        return dateValue
    },

    getValueDisable(value) {
        return value ? value.length <= 0 : false
    },


    makeUpdateAvatar(avatarObjList) {
        var avatarList = [];
        var avatarLen = avatarObjList.length;
        for (var i = 0; i < avatarLen; i++) {
            avatarList[i] = avatarObjList[i].base_editor_avatar
        }
        return avatarList
    },

    onSetCaseWrite: function(e) {
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.SetCaseWritingStaff',
                openid: app.globalData.openid,
                case_id: that.data.caseId,
                item_id: that.data.itemId,
                type: 1
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.data.data.code == 0) {
                    that.setData({
                        isEdit: true
                    })
                } else {
                    that.showModal("ErrModal", res.data.data.msg);
                }
                that.hideLoading();
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },

    submit() {
        if (!this.isValueRight()) {
            return;
        }

        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.EditCaseBase',
                case_id: that.data.caseId,
                item_id: that.data.itemId,
                openid: app.globalData.openid,
                json_data: that.makeBasicData(),
                fields_state: "{}",
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.EditCaseBase:" + JSON.stringify(res))
                that.hideLoading();
                if (res.data.data.code == 0) {
                    that.setData({
                        caseId: res.data.data.info.case_id
                    })
                    that.showToast("提交成功")
                    wx.redirectTo({
                        url: '../timeline/timeline?centerId=' + that.data.centerId + "&centerName=" + that.data.centerName + "&caseInfo=" + that.makeCaseInfo()
                    });
                } else {
                    that.showModal("ErrModal", res.data.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },

    makeCaseInfo() {
        let caseInfo = {
            case_id: this.data.caseId,
            case_no: this.data.caseInfo.case_no,
            patient_name: this.data.caseInfo.patient_name,
            side_name: this.data.sidePicker[this.data.caseInfo.side],
            part_name: this.data.partPicker[this.data.caseInfo.part],
        }

        return JSON.stringify(caseInfo)
    },

    makeBasicData() {
        let that = this;
        var jsonData = {
            center_id: that.data.centerId,
            patient_name: that.data.name,
            case_no: that.data.caseNO,
            side: parseInt(that.data.side),
            part: parseInt(that.data.part),
            create_time: new Date(that.data.createDate).getTime() / 1000,
            sex: that.data.sex,
            age: parseInt(that.data.age),
            height: parseFloat(that.data.height),
            weight: parseFloat(that.data.weight),
            bmi: parseFloat(that.data.bmi),
            pro_doctor: that.data.chiefDoc,
            telphone1: that.data.tel1,
            telphone2: that.data.tel2,
            type: parseInt(that.data.type),
            medical_history: that.data.medical_history,
            first_displace_time: new Date(that.data.first_displace_time).getTime() / 1000,
            first_displace_reason: that.data.first_displace_reason,
            is_hospital_operation: parseInt(that.data.is_hospital_operation),
            last_operation_date: new Date(that.data.last_operation_date).getTime() / 1000,
            repair_count: parseInt(that.data.repair_count),
            duration_symptoms_date: new Date(that.data.duration_symptoms_date).getTime() / 1000,
            this_time_cause: that.data.this_time_cause,
            is_rheumatism: parseInt(that.data.is_rheumatism),
            is_rheumatoid: parseInt(that.data.is_rheumatoid),
            is_as: parseInt(that.data.is_as),
            is_spa: parseInt(that.data.is_spa),
            is_psa: parseInt(that.data.is_psa),
            is_gout: parseInt(that.data.is_gout),
            is_cancer: parseInt(that.data.is_cancer),
            cure_state: parseInt(that.data.cure_state),
            radiotherapy: parseInt(that.data.radiotherapy),
            chemotherapy: parseInt(that.data.chemotherapy),
            glycuresis: parseInt(that.data.glycuresis),
            hypertension: parseInt(that.data.hypertension),
            cvd: parseInt(that.data.cvd),
            chd: parseInt(that.data.chd),
            ledvt: parseInt(that.data.ledvt),
            pud: parseInt(that.data.pud),
            copd: parseInt(that.data.copd),
            abnormal_heart: parseInt(that.data.abnormal_heart),
            abnormal_liver: parseInt(that.data.abnormal_liver),
            abnormal_renal: parseInt(that.data.abnormal_renal),
            abnormal_thyroid: parseInt(that.data.abnormal_thyroid),
            anemia: parseInt(that.data.anemia),
            is_smoke: parseInt(that.data.is_smoke),
            is_drink: parseInt(that.data.is_drink),
            other_disease: that.data.other_disease,
            score: that.data.score,
            remark: that.data.remark,
        }
        console.log("基本信息：" + JSON.stringify(jsonData))
        return JSON.stringify(jsonData)
    },

    isValueRight() {
        if (this.data.sex == 0) {
            this.showToast("请选择性别")
            return false;
        }
        if (this.data.age.length <= 0) {
            this.showToast("请填写年龄")
            return false;
        }
        if (this.data.height.length <= 0) {
            this.showToast("请填写身高")
            return false;
        }
        if (this.data.weight.length <= 0) {
            this.showToast("请填写体重")
            return false;
        }
        if (this.data.chiefDoc.length <= 0) {
            this.showToast("请填写主诊医师")
            return false;
        }
        if (this.data.tel1.length <= 0) {
            this.showToast("请填写联系电话1")
            return false;
        }
        if (!this.data.tel2Disabled && this.data.tel2.length == 0) {
            this.showToast("请填写联系电话2")
            return false;
        }
        if (this.data.type == 0) {
            this.showToast("请选择病例类型")
            return false;
        }
        if (this.data.medical_history.length == 0) {
            this.showToast("请填写简要病史")
            return false;
        }
        if (this.data.first_displace_reason == 0) {
            this.showToast("请选择初次置换原因")
            return false;
        }
        if (this.data.is_hospital_operation == 0) {
            this.showToast("请选择是否本院手术病例")
            return false;
        }
        if (this.data.repair_count == 0) {
            this.showToast("请选择已翻修次数")
            return false;
        }
        if (this.data.this_time_cause.length == 0) {
            this.showToast("请填写本次发病可能诱因")
            return false;
        }
        if (this.data.is_rheumatism.length == 0) {
            this.showToast("请选择病状体征中的风湿免疫性疾病")
            return false;
        }
        if (this.data.is_rheumatoid.length == 0) {
            this.showToast("请选择病状体征中的类风湿")
            return false;
        }
        if (this.data.is_as.length == 0) {
            this.showToast("请选择病状体征中的强直性脊柱炎")
            return false;
        }
        if (this.data.is_spa.length == 0) {
            this.showToast("请选择病状体征中的脊柱关节病")
            return false;
        }
        if (this.data.is_psa.length == 0) {
            this.showToast("请选择病状体征中的银屑病性关节炎")
            return false;
        }
        if (this.data.is_gout.length == 0) {
            this.showToast("请选择病状体征中的痛风")
            return false;
        }
        if (this.data.is_cancer.length == 0) {
            this.showToast("请选择病状体征中的恶性肿瘤病史")
            return false;
        }
        if (this.data.cure_state.length == 0) {
            this.showToast("请选择病状体征中的治愈情况")
            return false;
        }
        if (this.data.radiotherapy == 0) {
            this.showToast("请选择病状体征中的放疗病史")
            return false;
        }
        if (this.data.chemotherapy == 0) {
            this.showToast("请选择病状体征中的化疗病史")
            return false;
        }
        if (this.data.glycuresis.length == 0) {
            this.showToast("请选择病状体征中的糖尿病")
            return false;
        }
        if (this.data.hypertension.length == 0) {
            this.showToast("请选择病状体征中的高血压")
            return false;
        }
        if (this.data.cvd.length == 0) {
            this.showToast("请选择病状体征中的脑血管病")
            return false;
        }
        if (this.data.chd.length == 0) {
            this.showToast("请选择病状体征中的冠心病")
            return false;
        }
        if (this.data.ledvt.length == 0) {
            this.showToast("请选择病状体征中的下肢静脉血栓")
            return false;
        }
        if (this.data.pud.length == 0) {
            this.showToast("请选择病状体征中的消化性溃疡病")
            return false;
        }
        if (this.data.copd.length == 0) {
            this.showToast("请选择病状体征中的慢性肺阻病")
            return false;
        }
        if (this.data.abnormal_heart.length == 0) {
            this.showToast("请选择病状体征中的心功能异常")
            return false;
        }
        if (this.data.abnormal_liver.length == 0) {
            this.showToast("请选择病状体征中的肝功能异常")
            return false;
        }
        if (this.data.abnormal_renal.length == 0) {
            this.showToast("请选择病状体征中的病状体征中的肾功能异常")
            return false;
        }
        if (this.data.abnormal_thyroid.length == 0) {
            this.showToast("请选择病状体征中的甲状腺功能异常")
            return false;
        }
        if (this.data.anemia.length == 0) {
            this.showToast("请选择病状体征中的贫血")
            return false;
        }
        if (this.data.is_smoke == 0) {
            this.showToast("请选择病状体征中的吸烟史")
            return false;
        }
        if (this.data.is_drink == 0) {
            this.showToast("请选择病状体征中的饮酒史")
            return false;
        }
        if (this.data.other_disease.length == 0) {
            this.showToast("请填写病状体征中的其他疾病")
            return false;
        }
        if (this.data.remark.length == 0) {
            this.showToast("请填写病状体征中的备注")
            return false;
        }

        return true;
    },

    verify() {
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.Approve',
                case_id: that.data.caseId,
                openid: app.globalData.openid,
                item_id: that.data.itemId,
                type: 1,
                state: that.data.caseInfo.base_state == 2 ? 2 : 1
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.Approve:" + JSON.stringify(res))
                that.hideLoading();
                if (res.data.data.code == 0) {
                    that.reloadPrePage()
                    wx.navigateBack({
                        delta: 1
                    })
                } else {
                    that.showModal("ErrModal", res.data.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
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

    onUnload() {
        if (!this.data.isEdit) {
            return
        }
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.ClearWritingStatus',
                case_id: that.data.caseId,
                item_id: that.data.itemId,
                type:1
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                that.hideLoading();
                if (res.data.data.code == 0) {
                    // that.reloadPrePage()
                    // wx.navigateBack({
                    //     delta: 1
                    // })
                } else {
                    that.showModal("ErrModal", res.data.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    }
});