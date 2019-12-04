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

        // -------- image begin ----------- //
        showImageModal: false,
        modalImage: '',
        modalName: '',
        imageType: '',
        pic1: '',
        pic2: '',
        pic3: '',
        // -------- image begin ----------- //

        // -------- 公用信息 begin -------- //
        isCreate: '',
        centerId: '',
        centerName: '',
        caseId: '',
        itemId: '',
        isEdit: false,
        caseInfo: {},
        addAvatar: '',
        updateAvatarArr: [],
        approveAvatar: '',
        // -------- 公用信息 end -------- //

        // -------- 术前小结 begin -------- //
        operation_before_summary: false,
        hospitalized_date: '请选择日期',
        hospitalized_date_state: 1,
        antibiotic_history: 0,
        antibiotic_history_state: 1,
        antibiotic_history_picker: ['请选择', '无', '已停2周以上', '2周内有使用', '1周内有使用', '3天内有使用', '持续服用中'],
        immuno_history: 0,
        immuno_history_picker: ['请选择', '无', '已停2周以上', '2周内有使用', '1周内有使用', '3天内有使用', '持续服用中'],
        immuno_history_state: 1,
        // 弹出框
        is_heat: 0,
        is_erythema: 0,
        is_swelling: 0,
        is_fever: 0,
        is_pain: 0,
        is_sinus: 0,
        exterior_pics: [],
        esr: '',
        esr_state: 1,
        esr_state_value: 'pencil',
        crp: '',
        crp_state: 1,
        crp_state_value: 'pencil',
        conver_crp: '',
        il6: '',
        il6_state: 1,
        il6_state_value: 'pencil',
        dimer: '',
        dimer_state: 1,
        dimer_state_value: 'pencil',
        fibrinogen: '',
        fibrinogen_state: 1,
        fibrinogen_state_value: 'pencil',
        // -------- 术前小结 end -------- //

        // -------- 术中诊断 begin -------- //
        operation_during_check: false,
        operation_date: '请选择日期',
        operation_date_state: 1,
        culture_pus: 0,
        culture_pus_state: 1,
        culture_pus_picker: ['请选择', '是', '否'],
        culture_pus_pic: [],
        le_testpaper_stoste: 0,
        le_testpaper_stoste_state: 1,
        le_testpaper_stoste_picker: ['请选择', '500', '250', '75', '25', 'neg', '未测（血性关节液）', '未测（其他原因）'],
        le_testpaper_stoste_pic: [],
        le_testpaper_centrifugal: 0,
        le_testpaper_centrifugal_state: 1,
        le_testpaper_centrifugal_picker: ['请选择', '500', '250', '75', '25', 'neg', '未测'],
        le_testpaper_centrifugal_pic: [],
        joint_fluid_wbc: '',
        joint_fluid_wbc_state: 1,
        joint_fluid_wbc_state_value: 'pencil',
        pmn: '',
        pmn_state: 1,
        pmn_state_value: 'pencil',
        neutrophil: 0,
        neutrophil_state: 1,
        neutrophil_state_value: 'pencil',
        neutrophil_picker: ['请选择', '<5', '5-10', '>10'],
        tissue_culture1: '',
        tissue_culture1_state: 1,
        tissue_culture1_state_value: 'pencil',
        tissue_culture1_pic: [],
        tissue_culture2: '',
        tissue_culture2_state: 1,
        tissue_culture2_state_value: 'pencil',
        tissue_culture2_pic: [],
        tissue_culture3: '',
        tissue_culture3_state: 1,
        tissue_culture3_state_value: 'pencil',
        tissue_culture3_pic: [],
        tissue_culture4: '',
        tissue_culture4_state: 1,
        tissue_culture4_state_value: 'pencil',
        tissue_culture4_pic: [],
        tissue_culture5: '',
        tissue_culture5_state: 1,
        tissue_culture5_state_value: 'pencil',
        tissue_culture5_pic: [],
        tissue_mngs: '',
        tissue_mngs_state: 1,
        tissue_mngs_state_value: 'pencil',
        tissue_mngs_pic: [],
        joint_aerobic_result: '',
        joint_aerobic_result_state: 1,
        joint_aerobic_result_state_value: 'pencil',
        joint_aerobic_result_pic: [],
        joint_anaerobic_result: '',
        joint_anaerobic_result_state: 1,
        joint_anaerobic_result_state_value: 'pencil',
        joint_anaerobic_result_pic: [],
        joint_mngs_result: '',
        joint_mngs_result_state: 1,
        joint_mngs_result_state_value: 'pencil',
        joint_mngs_result_pic: [],
        splitting_aerobic_result: '',
        splitting_aerobic_result_state: 1,
        splitting_aerobic_result_state_value: 'pencil',
        splitting_aerobic_result_pic: [],
        splitting_anaerobic_result: '',
        splitting_anaerobic_result_state: 1,
        splitting_anaerobic_result_state_value: 'pencil',
        splitting_anaerobic_result_pic: [],
        splitting_mngs_result: '',
        splitting_mngs_result_state: 1,
        splitting_mngs_result_state_value: 'pencil',
        splitting_mngs_result_pic: [],
        // -------- 术中诊断 end -------- //

        // -------- 术中治疗 begin -------- //
        operation_during_treat: false,
        pro_doctor: '',
        pro_doctor_state: 1,
        narcosis_level: 0,
        narcosis_level_state: 1,
        narcosis_level_picker: ["请选择", "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", 'Ⅴ'],
        narcosis_type: 0,
        narcosis_type_state: 1,
        narcosis_type_picker: ["请选择", "全麻气管插管", "椎管内麻醉", "神经阻滞麻醉", "局麻+基础", "静脉麻醉", "其他"],
        operation: 0,
        operation_state: 1,
        operation_picker: ["请选择", "保留假体清创", "二期翻修（假体取出，占位器植入）", "二期翻修（占位器取出，假体再植入）", "二期翻修（占位器取出，占位器再植入）", "旷置", "截肢"],
        prosthesis: 0,
        prosthesis_state: 1,
        prosthesis_picker: ["请选择", "保留假体", "部分更换", "全部更换", "取出后未更换"],
        operation_duration: '',
        operation_duration_state: 1,
        haemorrhage_volume: '',
        haemorrhage_volume_state: 1,
        bone_cement_type: 0,
        bone_cement_type_state: 1,
        bone_cement_type_state_value: 'pencil',
        bone_cement_type_picker: ["请选择", "关节型", "静态占位器", "骨水泥串珠", "其他"],
        bone_cement_volume: '',
        bone_cement_volume_state: 1,
        bone_cement_volume_state_value: 'pencil',
        data_pic: [],
        data_pic_state: 1,
        data_pic_state_value: 'pencil',
        data_video: [],
        data_video_state: 1,
        data_video_state_value: 'pencil',
        // -------- 术中治疗 end -------- //

        // -------- 出院小结 start -------- //
        leave_hospital_date: '请选择日期',
        leave_hospital_date_state: 1,
        leave_hospital_date_state_value: "pencil",
        msis: 0,
        msis_state: 1,
        msis_picker: ['请选择', '感染', '非感染', '不能确定'],
        msis_state_value: "pencil",
        icm: 0,
        icm_state: 1,
        icm_picker: ['请选择', '感染', '非感染', '不能确定'],
        icm_state_value: "pencil",
        special_event: '',
        special_event_state: 1,
        special_event_state_value: "pencil",
        antibiotic_scene: 0,
        antibiotic_scene_state: 1,
        antibiotic_scene_state_value: "pencil",
        antibiotic_scene_picker: ['请选择', 'PJI单一菌', 'PJI多重感染', 'PJI菌培养阴性', '常规预防性应用', '不能明确诊断的预防性应用', '未用药'],
        germ_name: '',
        germ_name_state: 1,
        germ_name_state_value: "pencil",
        // -------- 出院小结 end -------- //

        // ------- 图片上传 start --------- //
        pic1: '',
        pic1Upload: '',
        pic2: '',
        pic2Upload: '',
        pic3: '',
        pic3Upload: '',
        pic4: '',
        pic4Upload: '',
        pic5: '',
        pic5Upload: '',
        pic6: '',
        pic6Upload: '',
        // ------- 图片上传 end  ---------- //
    },

    onOperation_before_summarySwitchChange: function(e) {
        this.setData({
            operation_before_summary: e.detail.value
        });
        let state = this.data.operation_before_summary ? 2 : 1
        let stateValue = this.data.operation_before_summary ? "clock-o" : "pencil"
        this.setData({
            hospitalized_date: '请选择日期',
            hospitalized_date_state: state,
            antibiotic_history: 0,
            antibiotic_history_state: state,
            immuno_history: 0,
            immuno_history_state: state,
            is_heat: 0,
            is_erythema: 0,
            is_swelling: 0,
            is_fever: 0,
            is_pain: 0,
            is_sinus: 0,
            exterior_pics: [],
            pic4: '',
            pic4Upload: '',
            pic5: '',
            pic5Upload: '',
            pic6: '',
            pic6Upload: '',
            esr: '',
            esr_state: state,
            esr_state_value: stateValue,
            crp: '',
            crp_state: state,
            crp_state_value: stateValue,
            conver_crp: '',
            il6: '',
            il6_state: state,
            il6_state_value: stateValue,
            dimer: '',
            dimer_state: state,
            dimer_state_value: stateValue,
            fibrinogen: '',
            fibrinogen_state: state,
            fibrinogen_state_value: stateValue,
        })
    },
    onOperation_during_checkSwitchChange(e) {
        this.setData({
            operation_during_check: e.detail.value
        });
        let state = this.data.operation_during_check ? 2 : 1
        let stateValue = this.data.operation_during_check ? "clock-o" : "pencil"
        this.setData({
            operation_date: '请选择日期',
            operation_date_state: state,
            culture_pus: 0,
            culture_pus_pic: [],
            culture_pus_state: state,
            le_testpaper_stoste: 0,
            le_testpaper_stoste_pic: [],
            le_testpaper_stoste_state: state,
            le_testpaper_centrifugal: 0,
            le_testpaper_centrifugal_pic: [],
            le_testpaper_centrifugal_state: state,
            joint_fluid_wbc: '',
            joint_fluid_wbc_state: state,
            joint_fluid_wbc_state_value: stateValue,
            pmn: '',
            pmn_state: state,
            pmn_state_value: stateValue,
            neutrophil: 0,
            neutrophil_state: state,
            neutrophil_state_value: stateValue,
            tissue_culture1: '',
            tissue_culture1_pic: [],
            tissue_culture1_state: state,
            tissue_culture1_state_value: stateValue,
            tissue_culture2: '',
            tissue_culture2_pic: [],
            tissue_culture2_state: state,
            tissue_culture2_state_value: stateValue,
            tissue_culture3: '',
            tissue_culture3_pic: [],
            tissue_culture3_state: state,
            tissue_culture3_state_value: stateValue,
            tissue_culture4: '',
            tissue_culture4_pic: [],
            tissue_culture4_state: state,
            tissue_culture4_state_value: stateValue,
            tissue_culture5: '',
            tissue_culture5_pic: [],
            tissue_culture5_state: state,
            tissue_culture5_state_value: stateValue,
            tissue_mngs: '',
            tissue_mngs_pic: [],
            tissue_mngs_state: state,
            tissue_mngs_state_value: stateValue,
            joint_aerobic_result: '',
            joint_aerobic_result_pic: [],
            joint_aerobic_result_state: state,
            joint_aerobic_result_state_value: stateValue,
            joint_anaerobic_result: '',
            joint_anaerobic_result_pic: [],
            joint_anaerobic_result_state: state,
            joint_anaerobic_result_state_value: stateValue,
            joint_mngs_result: '',
            joint_mngs_result_pic: [],
            joint_mngs_result_state: state,
            joint_mngs_result_state_value: stateValue,
            splitting_aerobic_result: '',
            splitting_aerobic_result_pic: [],
            splitting_aerobic_result_state: state,
            splitting_aerobic_result_state_value: stateValue,
            splitting_anaerobic_result: '',
            splitting_anaerobic_result_pic: [],
            splitting_anaerobic_result_state: state,
            splitting_anaerobic_result_state_value: stateValue,
            splitting_mngs_result: '',
            splitting_mngs_result_pic: [],
            splitting_mngs_result_state: state,
            splitting_mngs_result_state_value: stateValue,
        })
    },

    onOperation_during_treatSwitchChange(e) {
        this.setData({
            operation_during_treat: e.detail.value
        });
        let state = this.data.operation_during_treat ? 2 : 1
        let stateValue = this.data.operation_during_treat ? "clock-o" : "pencil"
        this.setData({
            pro_doctor: '',
            pro_doctor_state: state,
            narcosis_level: 0,
            narcosis_level_state: state,
            narcosis_type: 0,
            narcosis_type_state: state,
            operation: 0,
            operation_state: state,
            prosthesis: 0,
            prosthesis_state: state,
            operation_duration: '',
            operation_duration_state: state,
            haemorrhage_volume: '',
            haemorrhage_volume_state: state,
            bone_cement_type: 0,
            bone_cement_type_state: state,
            bone_cement_type_state_value: stateValue,
            bone_cement_volume: '',
            bone_cement_volume_state: state,
            bone_cement_volume_state_value: stateValue,
            data_pic: [],
            data_pic_state: state,
            data_pic_state_value: stateValue,
            data_video: [],
            data_video_state: state,
            data_video_state_value: stateValue,
        })
    },

    onLeave_summarySwitchChange(e) {
        this.setData({
            leave_summary: e.detail.value
        });
        let state = this.data.leave_summary ? 2 : 1
        let stateValue = this.data.leave_summary ? "clock-o" : "pencil"
        this.setData({
            leave_hospital_date: '请选择日期',
            leave_hospital_date_state: state,
            leave_hospital_date_state_value: stateValue,
            msis: 0,
            msis_state: state,
            msis_state_value: stateValue,
            icm: 0,
            icm_state: state,
            icm_state_value: stateValue,
            special_event: '',
            special_event_state: state,
            special_event_state_value: stateValue,
            antibiotic_scene: 0,
            antibiotic_scene_state: state,
            antibiotic_scene_state_value: stateValue,
            germ_name: '',
            germ_name_state: state,
            germ_name_state_value: stateValue,
        })
    },

    onPickerChange(e) {
        let type = e.currentTarget.dataset.type
        this.setData({
            [type]: parseInt(e.detail.value)
        })
    },
    onDateChange(e) {
        let type = e.currentTarget.dataset.type
        this.setData({
            [type]: e.detail.value
        })
    },
    onInput(e) {
        let type = e.currentTarget.dataset.type
        if (type == "crp") {
            this.setData({
                conver_crp: e.detail.value * 10
            })
        }
        this.setData({
            [type]: e.detail.value
        })
    },
    on3StateChange(e) {
        let state = e.currentTarget.dataset.state
        let type = e.currentTarget.dataset.type
        let style = e.currentTarget.dataset.style
        if (state == 0) {
            this.setData({
                [type]: 1,
                [type + "_value"]: "pencil"
            })
        } else if (state == 1) {
            this.setData({
                [type]: 2,
                [type + "_value"]: "clock-o"
            })
            this.setDefaultValue(type, style)
        } else if (state == 2) {
            this.setData({
                [type]: 0,
                [type + "_value"]: "ban"
            })
            this.setDefaultValue(type, style)
        }
    },
    on2StateChange(e) {
        let state = e.currentTarget.dataset.state
        let type = e.currentTarget.dataset.type
        let style = e.currentTarget.dataset.style
        if (state == 0) {
            this.setData({
                [type]: 1,
                [type + "_value"]: "pencil"
            })
        } else if (state == 1) {
            this.setData({
                [type]: 0,
                [type + "_value"]: "ban"
            })
            this.setDefaultValue(type, style)
        }
    },
    setDefaultValue(type, style) {
        let param = type.replace("_state", "")
        if (style == "input") {
            this.setData({
                [param]: ''
            })
        } else if (style == "picker") {
            this.setData({
                [param]: 0
            })
        } else if (style == "input_pic") {
            this.setData({
                [param]: '',
                [param + '_pic']: []
            })
        } else if (style == "pic") {
            this.setData({
                [param]: []
            })
        } else if (style == "date") {
            this.setData({
                [param]: "请选择日期"
            })
        }
    },
    onRadioChange(e) {
        let type = e.currentTarget.dataset.type
        this.setData({
            [type]: e.detail.value
        })
    },

    onShowDrawer() {
        if (!this.data.operation_before_summary) {
            this.setData({
                modalName: "DrawerModalR"
            })
            this.assignPic(this.data.exterior_pics, true)
        }
    },

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

        if (!this.data.isCreate) {
            this.requestCaseInfo();
        } else { // 新建
            this.setData({
                addAvatar: app.globalData.avatarUrl,
            })
        }
        this.completeProgress();
    },

    requestCaseInfo() {
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.GetCaseInfo',
                case_id: that.data.caseId,
                item_id: that.data.itemId,
                type: 3,
                openid: app.globalData.openid
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.GetCaseInfo:" + JSON.stringify(res))
                that.hideLoading();
                if (res.data.data.code == 0) {
                    // 基本数据
                    that.initViewByData(res.data.data.info)
                    // 状态
                    res.data.data.field_state.forEach(item => {
                        that.setData({
                            [item.field_name + "_state"]: item.state,
                            [item.field_name + "_state_value"]: item.state == 0 ? "ban" : item.state == 1 ? "pencil" : "clock-o"
                        })
                    })
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
            addAvatar: info.bein_creator_avatar,
            updateAvatarArr: this.makeUpdateAvatar(info.bein_editor_list),
            approveAvatar: info.bein_auditor_avatar,
        });

        this.setData({
            operation_before_summary: info.operation_before_summary == 1,
            hospitalized_date: this.getDefaultDate(info.hospitalized_date),
            antibiotic_history: info.antibiotic_history,
            immuno_history: info.immuno_history,
            is_heat: parseInt(info.is_heat),
            is_erythema: parseInt(info.is_erythema),
            is_swelling: parseInt(info.is_swelling),
            is_fever: parseInt(info.is_fever),
            is_pain: parseInt(info.is_pain),
            is_sinus: parseInt(info.is_sinus),
            exterior_pics: this.getImgArr(info.exterior_pics),
            esr: this.getDefaultNum(info.esr),
            crp: this.getDefaultNum(info.crp),
            conver_crp: this.getDefaultNum(info.conver_crp),
            il6: this.getDefaultNum(info.il6),
            dimer: this.getDefaultNum(info.dimer),
            fibrinogen: this.getDefaultNum(info.fibrinogen),

            operation_during_check: info.operation_during_check == 1,
            operation_date: this.getDefaultDate(info.operation_date),
            culture_pus: info.culture_pus,
            culture_pus_pic: this.getImgArr(info.culture_pus_pic),
            le_testpaper_stoste: info.le_testpaper_stoste,
            le_testpaper_stoste_pic: this.getImgArr(info.le_testpaper_stoste_pics),
            le_testpaper_centrifugal: info.le_testpaper_centrifugal,
            le_testpaper_stoste_pic: this.getImgArr(info.le_testpaper_centrifugal_pics),
            joint_fluid_wbc: this.getDefaultNum(info.joint_fluid_wbc),
            pmn: this.getDefaultNum(info.pmn),
            neutrophil: parseInt(info.neutrophil),
            tissue_culture1: info.tissue_culture1,
            tissue_culture1_pic: this.getImgArr(info.tissue_culture1_pic),
            tissue_culture2: info.tissue_culture2,
            tissue_culture2_pic: this.getImgArr(info.tissue_culture2_pic),
            tissue_culture3: info.tissue_culture3,
            tissue_culture3_pic: this.getImgArr(info.tissue_culture3_pic),
            tissue_culture4: info.tissue_culture4,
            tissue_culture4_pic: this.getImgArr(info.tissue_culture4_pic),
            tissue_culture5: info.tissue_culture5,
            tissue_culture5_pic: this.getImgArr(info.tissue_culture5_pic),
            tissue_mngs: info.tissue_mngs,
            tissue_mngs_pic: this.getImgArr(info.tissue_mngs_pic),
            joint_aerobic_result: info.joint_aerobic_result,
            joint_aerobic_result_pic: this.getImgArr(info.joint_aerobic_result_pic),
            joint_anaerobic_result: info.joint_anaerobic_result,
            joint_anaerobic_result_pic: this.getImgArr(info.joint_anaerobic_result_pic),
            joint_mngs_result: info.joint_mngs_result,
            joint_mngs_result_pic: this.getImgArr(info.joint_mngs_result_pic),
            splitting_aerobic_result: info.splitting_aerobic_result,
            splitting_aerobic_result_pic: this.getImgArr(info.splitting_aerobic_result_pic),
            splitting_anaerobic_result: info.splitting_anaerobic_result,
            splitting_anaerobic_result_pic: this.getImgArr(info.splitting_anaerobic_result_pic),
            splitting_mngs_result: info.splitting_mngs_result,
            splitting_mngs_result_pic: this.getImgArr(info.splitting_mngs_result_pic),

            operation_during_treat: info.operation_during_treat == 1,
            pro_doctor: info.pro_doctor,
            narcosis_level: parseInt(info.narcosis_level),
            narcosis_type: parseInt(info.narcosis_type),
            operation: parseInt(info.operation),
            prosthesis: parseInt(info.prosthesis),
            operation_duration: info.operation_duration,
            haemorrhage_volume: info.haemorrhage_volume,
            bone_cement_type: parseInt(info.bone_cement_type),
            bone_cement_volume: info.bone_cement_volume,
            data_pic: this.getImgArr(info.data_pic),
            data_video: this.getImgArr(info.data_video),

            leave_summary: info.leave_summary == 1,
            leave_hospital_date: this.getDefaultDate(info.leave_hospital_date),
            msis: parseInt(info.msis),
            icm: parseInt(info.icm),
            special_event: info.special_event,
            antibiotic_scene: parseInt(info.antibiotic_scene),
            germ_name: info.germ_name,
        })
    },

    getImgArr(jsonImg) {
        let myImgArr = []
        for (let key in jsonImg) {
            let imgObj = {}
            imgObj.pic = jsonImg[key];
            imgObj.picUpload = jsonImg[key].replace(constant.domain + "img/", "");
            myImgArr.push(imgObj)
        }
        return myImgArr;
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
        return value.length <= 0
    },

    getNumDisable(value) {
        return value <= 0
    },

    makeUpdateAvatar(avatarObjList) {
        var avatarList = [];
        var avatarLen = avatarObjList.length;
        for (var i = 0; i < avatarLen; i++) {
            avatarList[i] = avatarObjList[i].bein_editor_avatar
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
                type: 3
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
            return
        }

        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.EditCaseBein',
                case_id: that.data.caseId,
                item_id: that.data.itemId,
                openid: app.globalData.openid,
                json_data: that.makeData(),
                fields_state: that.makeFiled()
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.EditCaseBein:" + JSON.stringify(res))
                that.hideLoading();
                if (res.data.data.code == 0) {
                    that.showToast("提交成功")
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

    isValueRight() {
        if (!this.data.operation_before_summary) {
            if (this.data.hospitalized_date == "请选择日期") {
                this.showToast("请选择入院日期")
                return false;
            }
            if (this.data.antibiotic_history == 0) {
                this.showToast("请选择抗生素使用史")
                return false;
            }
            if (this.data.immuno_history == 0) {
                this.showToast("请选择免疫抑制剂使用史")
                return false;
            }
            if (this.data.is_heat.length == 0) {
                this.showToast("请选择病状体征中的发热")
                return false;
            }
            if (this.data.is_erythema.length == 0) {
                this.showToast("请选择病状体征中的皮肤发红")
                return false;
            }
            if (this.data.is_swelling.length == 0) {
                this.showToast("请选择病状体征中的积液/肿胀")
                return false;
            }
            if (this.data.is_fever.length == 0) {
                this.showToast("请选择病状体征中的局部皮温增高")
                return false;
            }
            if (this.data.is_pain.length == 0) {
                this.showToast("请选择病状体征中的疼痛")
                return false;
            }
            if (this.data.is_sinus.length == 0) {
                this.showToast("请选择病状体征中的与假体相通的窦道")
                return false;
            }
            if (this.data.esr_state == 1 && this.data.esr.length == 0) {
                this.showToast("请填写ESR")
                return false;
            }
            if (this.data.crp_state == 1 && this.data.crp.length == 0) {
                this.showToast("请填写CRP")
                return false;
            }
            if (this.data.il6_state == 1 && this.data.il6.length == 0) {
                this.showToast("请填写IL-6")
                return false;
            }
            if (this.data.dimer_state == 1 && this.data.dimer.length == 0) {
                this.showToast("请填写D-dimer")
                return false;
            }
            if (this.data.fibrinogen_state == 1 && this.data.fibrinogen.length == 0) {
                this.showToast("请填写Fibrinogen")
                return false;
            }
        }
        if (!this.data.operation_during_check) {
            if (this.data.operation_date == "请选择日期") {
                this.showToast("请选择手术日期")
                return false
            }
            if (this.data.culture_pus == 0) {
                this.showToast("请选择术中见脓")
                return false
            }
            if (this.data.le_testpaper_stoste == 0) {
                this.showToast("请选择术中LE试纸（离心前）")
                return false
            }
            if (this.data.le_testpaper_centrifugal == 0) {
                this.showToast("请选择术中LE试纸（离心后）")
                return false
            }
            if (this.data.joint_fluid_wbc_state == 1 && this.data.joint_fluid_wbc.length == 0) {
                this.showToast("请填写关节液WBC")
                return false;
            }
            if (this.data.pmn_state == 1 && this.data.pmn.length == 0) {
                this.showToast("请填写PMN%")
                return false;
            }
            if (this.data.neutrophil_state == 1 && this.data.neutrophil == 0) {
                this.showToast("请选择组织病理(中性粒细胞计数)")
                return false;
            }
            if (this.data.tissue_culture1_state == 1 && this.data.tissue_culture1.length == 0) {
                this.showToast("请填写术中组织培养1")
                return false;
            }
            if (this.data.tissue_culture2_state == 1 && this.data.tissue_culture2.length == 0) {
                this.showToast("请填写术中组织培养2")
                return false;
            }
            if (this.data.tissue_culture3_state == 1 && this.data.tissue_culture3.length == 0) {
                this.showToast("请填写术中组织培养3")
                return false;
            }
            if (this.data.tissue_culture4_state == 1 && this.data.tissue_culture4.length == 0) {
                this.showToast("请填写术中组织培养4")
                return false;
            }
            if (this.data.tissue_culture5_state == 1 && this.data.tissue_culture5.length == 0) {
                this.showToast("请填写术中组织培养5")
                return false;
            }

            if (this.data.tissue_mngs_state == 1 && this.data.tissue_mngs.length == 0) {
                this.showToast("请填写术中组织mNGS")
                return false;
            }
            if (this.datajoint_aerobic_result_state == 1 && this.data.joint_aerobic_result.length == 0) {
                this.showToast("请填写术中需氧+真菌培养结果")
                return false;
            }
            if (this.data.joint_anaerobic_result_state == 1 && this.data.joint_anaerobic_result.length == 0) {
                this.showToast("请填写术中厌氧培养结果")
                return false;
            }

            if (this.data.joint_mngs_result_state == 1 && this.data.joint_mngs_result.length == 0) {
                this.showToast("请填写术中厌氧培养结果")
                return false;
            }

            if (this.data.splitting_aerobic_result_state == 1 && this.data.splitting_aerobic_result.length == 0) {
                this.showToast("请填写超声裂解液需氧+真菌")
                return false;
            }
            if (this.data.splitting_anaerobic_result_state == 1 && this.data.splitting_anaerobic_result.length == 0) {
                this.showToast("请填写超声裂解液厌氧")
                return false;
            }
            if (this.data.splitting_mngs_result_state == 1 && this.data.splitting_mngs_result.length == 0) {
                this.showToast("请填写术中超声裂解液mNGS")
                return false;
            }
        }
        if (!this.data.operation_during_treat) {
            if (this.data.pro_doctor.length == 0) {
                this.showToast("请填写主刀医师")
                return false;
            }
            if (this.data.narcosis_level == 0) {
                this.showToast("请选择麻醉分级")
                return false;
            }
            if (this.data.narcosis_type == 0) {
                this.showToast("请选择麻醉方式")
                return false;
            }
            if (this.data.operation == 0) {
                this.showToast("请选择术式")
                return false;
            }
            if (this.data.prosthesis == 0) {
                this.showToast("请选择术中假体")
                return false;
            }
            if (this.data.operation_duration.length == 0) {
                this.showToast("请填写手术时长")
                return false;
            }
            if (this.data.haemorrhage_volume.length == 0) {
                this.showToast("请填写出血量")
                return false;
            }
            if (this.data.bone_cement_type_state == 1 && this.data.bone_cement_type == 0) {
                this.showToast("请选择骨水泥类型")
                return false;
            }
            if (this.data.bone_cement_volume_state == 1 && this.data.bone_cement_volume == 0) {
                this.showToast("请填写每40g骨水泥中，抗生素种类及含量")
                return false;
            }
        }
        if (!this.data.leave_summary) {
            if (this.data.leave_hospital_date == "请选择日期") {
                this.showToast("请选择出院日期")
                return false;
            }
            if (this.data.msis == 0) {
                this.showToast("请选择2014MSIS诊断标准")
                return false;
            }
            if (this.data.icm == 0) {
                this.showToast("请选择2018ICM新标准")
                return false;
            }
            if (this.data.special_event.length == 0) {
                this.showToast("请填写住院期间特殊事件")
                return false;
            }
            if (this.data.antibiotic_scene == 0) {
                this.showToast("请选择抗生素应用情景")
                return false;
            }
            if (this.data.germ_name.length == 0) {
                this.showToast("请填写细菌名称")
                return false;
            }
        }

        return true
    },

    makeFiled() {
        let field_state = []
        field_state.push(this.makeFiledObj("hospitalized_date"));
        field_state.push(this.makeFiledObj("antibiotic_history"));
        field_state.push(this.makeFiledObj("immuno_history"));
        field_state.push(this.makeFiledObj("esr"));
        field_state.push(this.makeFiledObj("crp"));
        field_state.push(this.makeFiledObj("il6"));
        field_state.push(this.makeFiledObj("dimer"));
        field_state.push(this.makeFiledObj("fibrinogen"));

        field_state.push(this.makeFiledObj("operation_date"));
        field_state.push(this.makeFiledObj("culture_pus"));
        field_state.push(this.makeFiledObj("le_testpaper_stoste"));
        field_state.push(this.makeFiledObj("le_testpaper_centrifugal"));
        field_state.push(this.makeFiledObj("joint_fluid_wbc"));
        field_state.push(this.makeFiledObj("pmn"));
        field_state.push(this.makeFiledObj("neutrophil"));
        field_state.push(this.makeFiledObj("tissue_culture1"));
        field_state.push(this.makeFiledObj("tissue_culture2"));
        field_state.push(this.makeFiledObj("tissue_culture3"));
        field_state.push(this.makeFiledObj("tissue_culture4"));
        field_state.push(this.makeFiledObj("tissue_culture5"));
        field_state.push(this.makeFiledObj("tissue_mngs"));
        field_state.push(this.makeFiledObj("joint_aerobic_result"));
        field_state.push(this.makeFiledObj("joint_anaerobic_result"));
        field_state.push(this.makeFiledObj("joint_mngs_result"));
        field_state.push(this.makeFiledObj("splitting_aerobic_result"));
        field_state.push(this.makeFiledObj("splitting_anaerobic_result"));
        field_state.push(this.makeFiledObj("splitting_mngs_result"));

        field_state.push(this.makeFiledObj("pro_doctor"));
        field_state.push(this.makeFiledObj("narcosis_level"));
        field_state.push(this.makeFiledObj("narcosis_type"));
        field_state.push(this.makeFiledObj("operation"));
        field_state.push(this.makeFiledObj("prosthesis"));
        field_state.push(this.makeFiledObj("prosthesis_label"));
        field_state.push(this.makeFiledObj("operation_duration"));
        field_state.push(this.makeFiledObj("haemorrhage_volume"));
        field_state.push(this.makeFiledObj("bone_cement_type"));
        field_state.push(this.makeFiledObj("bone_cement_volume"));
        field_state.push(this.makeFiledObj("data_pic"));
        field_state.push(this.makeFiledObj("data_video"));

        field_state.push(this.makeFiledObj("leave_hospital_date"));
        field_state.push(this.makeFiledObj("msis"));
        field_state.push(this.makeFiledObj("icm"));
        field_state.push(this.makeFiledObj("special_event"));
        field_state.push(this.makeFiledObj("antibiotic_scene"));
        field_state.push(this.makeFiledObj("germ_name"));

        let filedStr = JSON.stringify(field_state)
        console.log("手术state：" + filedStr)
        return filedStr
    },

    makeFiledObj(filedName) {
        return {
            field_name: filedName,
            type: 3,
            state: this.data[filedName + "_state"]
        }
    },

    makeData() {
        let that = this
        var jsonData = {
            operation_before_summary: that.data.operation_before_summary ? 1 : 0,
            hospitalized_date: that.makeDefaultDate(that.data.hospitalized_date),
            antibiotic_history: that.data.antibiotic_history,
            immuno_history: that.data.immuno_history,
            is_heat: that.data.is_heat,
            is_erythema: that.data.is_erythema,
            is_swelling: that.data.is_swelling,
            is_fever: that.data.is_fever,
            is_pain: that.data.is_pain,
            is_sinus: that.data.is_sinus,
            exterior_pics: that.makePicJson(that.data.exterior_pics, true),
            esr: parseInt(this.makeDefaultValue(that.data.esr)),
            crp: parseFloat(this.makeDefaultValue(that.data.crp)),
            conver_crp: parseFloat(this.makeDefaultValue(that.data.conver_crp)),
            il6: parseFloat(this.makeDefaultValue(that.data.il6)),
            dimer: parseFloat(this.makeDefaultValue(that.data.dimer)),
            fibrinogen: parseFloat(this.makeDefaultValue(that.data.fibrinogen)),

            operation_during_check: that.data.operation_during_check ? 1 : 0,
            operation_date: that.makeDefaultDate(that.data.operation_date),
            culture_pus: that.data.culture_pus,
            culture_pus_pic: that.makePicJson(that.data.culture_pus_pic),
            le_testpaper_stoste: that.data.le_testpaper_stoste,
            le_testpaper_stoste_pics: that.makePicJson(that.data.le_testpaper_stoste_pic),
            le_testpaper_centrifugal: that.data.le_testpaper_centrifugal,
            le_testpaper_centrifugal_pics: that.makePicJson(that.data.le_testpaper_centrifugal_pic),
            joint_fluid_wbc: parseInt(this.makeDefaultValue(that.data.joint_fluid_wbc)),
            pmn: parseFloat(this.makeDefaultValue(that.data.pmn)),
            neutrophil: that.data.neutrophil,
            tissue_culture1: that.data.tissue_culture1,
            tissue_culture1_pic: that.makePicJson(that.data.tissue_culture1_pic),
            tissue_culture2: that.data.tissue_culture2,
            tissue_culture2_pic: that.makePicJson(that.data.tissue_culture2_pic),
            tissue_culture3: that.data.tissue_culture3,
            tissue_culture3_pic: that.makePicJson(that.data.tissue_culture3_pic),
            tissue_culture4: that.data.tissue_culture4,
            tissue_culture4_pic: that.makePicJson(that.data.tissue_culture4_pic),
            tissue_culture5: that.data.tissue_culture5,
            tissue_culture5_pic: that.makePicJson(that.data.tissue_culture5_pic),
            tissue_mngs: that.data.tissue_mngs,
            tissue_mngs_pic: that.makePicJson(that.data.tissue_mngs_pic),
            joint_aerobic_result: that.data.joint_aerobic_result,
            joint_aerobic_result_pic: that.makePicJson(that.data.joint_aerobic_result_pic),
            joint_anaerobic_result: that.data.joint_anaerobic_result,
            joint_anaerobic_result_pic: that.makePicJson(that.data.joint_anaerobic_result_pic),
            joint_mngs_result: that.data.joint_mngs_result,
            joint_mngs_result_pic: that.makePicJson(that.data.joint_mngs_result_pic),
            splitting_aerobic_result: that.data.splitting_aerobic_result,
            splitting_aerobic_result_pic: that.makePicJson(that.data.splitting_aerobic_result_pic),
            splitting_anaerobic_result: that.data.splitting_anaerobic_result,
            splitting_anaerobic_result_pic: that.makePicJson(that.data.splitting_anaerobic_result_pic),
            splitting_mngs_result: that.data.splitting_mngs_result,
            splitting_mngs_result_pic: that.makePicJson(that.data.splitting_mngs_result_pic),

            operation_during_treat: that.data.operation_during_treat ? 1 : 0,
            pro_doctor: that.data.pro_doctor,
            narcosis_level: that.data.narcosis_level,
            narcosis_type: that.data.narcosis_type,
            operation: that.data.operation,
            prosthesis: that.data.prosthesis,
            operation_duration: that.makeDefaultNum(that.data.operation_duration),
            haemorrhage_volume: that.makeDefaultNum(that.data.haemorrhage_volume),
            bone_cement_type: that.data.bone_cement_type,
            bone_cement_volume: that.makeDefaultNum(that.data.bone_cement_volume),
            data_pic: that.makePicJson(that.data.data_pic),
            data_video: that.makePicJson(that.data.data_video),

            leave_summary: that.data.leave_summary ? 1 : 0,
            leave_hospital_date: that.makeDefaultDate(that.data.leave_hospital_date),
            msis: that.data.msis,
            icm: that.data.icm,
            special_event: that.data.special_event,
            antibiotic_scene: that.data.antibiotic_scene,
            germ_name: that.data.germ_name,
        }
        console.log("手术：" + JSON.stringify(jsonData))
        return JSON.stringify(jsonData)
    },

    makeDefaultNum(num) {
        return num.length > 0 ? num : 0
    },

    makeDefaultDate(date) {
        if (date == "请选择日期") {
            return 0
        } else {
            return new Date(date).getTime() / 1000
        }
    },

    makePicJson(picArr, isExtra) {
        let picObj = {};
        let offSet = isExtra ? 3 : 0
        if (picArr && picArr.length > 0) {
            for (let index = 0, length = picArr.length; index < length; index++) {
                let item = picArr[index]
                if (item) {
                    picObj["pic" + (index + offSet + 1) + "Upload"] = item["pic" + (index + offSet + 1) + "Upload"] ? item["pic" + (index + offSet + 1) + "Upload"] : item.picUpload
                }
            }
        }
        return JSON.stringify(picObj);
    },

    makeDefaultValue(value) {
        return value.length == 0 ? 0 : value
    },

    verify() {
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.Approve',
                case_id: that.data.caseId,
                item_id: that.data.itemId,
                openid: app.globalData.openid,
                type: 3,
                state: that.data.caseInfo.puncture.puncture_state == 2 ? 2 : 1
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
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
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.ClearWritingStatus',
                case_id: that.data.caseId,
                item_id: that.data.itemId,
                type: 3,
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
    },

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
        let that = this
        if (e.currentTarget) {
            this.setData({
                modalName: e.currentTarget.dataset.target,
                imageType: e.currentTarget.dataset.imgtype
            });
            that.assignPic(that.data[that.data.imageType])
        } else {
            this.setData({
                modalName: e,
                errMsg: errMessage
            });
        }
    },

    assignPic(pics, isExterior) {
        if (isExterior) {
            this.setData({
                pic4: pics[0] ? pics[0].pic : "",
                pic5: pics[1] ? pics[1].pic : "",
                pic6: pics[2] ? pics[2].pic : ""
            })
        } else {
            this.setData({
                pic1: pics[0] ? pics[0].pic : "",
                pic2: pics[1] ? pics[1].pic : "",
                pic3: pics[2] ? pics[2].pic : ""
            })
        }
    },

    showImageModal: function(e) {
        if (e.target.dataset.img && e.target.dataset.img != '') {
            this.setData({
                showImageModal: true,
                modalImage: e.target.dataset.img
            });
        }
    },
    hideModal: function(e) {
        this.setData({
            modalName: null
        });
    },
    hideImageModal: function(e) {
        this.setData({
            showImageModal: false,
        });
    },
    // -------- 模态对话框 end  -------- //

    // -------- 图片 start --------- //
    onChooseImage: function(e) {
        let that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                const tempFilePaths = res.tempFilePaths;
                that.uploadImg(e.target.dataset.le, tempFilePaths[0])
            }
        });
    },
    uploadImg(le, filePath) {
        let that = this;
        that.showLoading();
        wx.uploadFile({
            url: constant.basePath + "",
            filePath: filePath,
            name: "file",
            formData: {
                service: 'Common.Upload'
            },
            header: {
                "Content-Type": "multipart/form-data"
            },
            success(res) {
                that.hideLoading();
                let data = JSON.parse(res.data);
                if (data.data.code == 0) {
                    switch (le) {
                        case "11":
                            that.setData({
                                pic1: data.data.info.url,
                                pic1Upload: data.data.info.file,
                            });

                            that.setImage(0, {
                                pic1: data.data.info.url,
                                pic1Upload: data.data.info.file
                            })
                            break;
                        case "12":
                            that.setData({
                                pic2: data.data.info.url,
                                pic2Upload: data.data.info.file,
                            });
                            that.setImage(1, {
                                pic2: data.data.info.url,
                                pic2Upload: data.data.info.file
                            })
                            break;
                        case "13":
                            that.setData({
                                pic3: data.data.info.url,
                                pic3Upload: data.data.info.file,
                            });
                            that.setImage(2, {
                                pic3: data.data.info.url,
                                pic3Upload: data.data.info.file
                            })
                            break;
                        case "21":
                            that.setData({
                                pic4: data.data.info.url,
                                pic4Upload: data.data.info.file,
                            });
                            that.setImage(0, {
                                pic4: data.data.info.url,
                                pic4Upload: data.data.info.file
                            }, "extra")
                            break;
                        case "22":
                            that.setData({
                                pic5: data.data.info.url,
                                pic5Upload: data.data.info.file,
                            });
                            that.setImage(1, {
                                pic5: data.data.info.url,
                                pic5Upload: data.data.info.file
                            }, "extra")
                            break;
                        case "23":
                            that.setData({
                                pic6: data.data.info.url,
                                pic6Upload: data.data.info.file,
                            });
                            that.setImage(2, {
                                pic6: data.data.info.url,
                                pic6Upload: data.data.info.file
                            }, "extra")
                            break;
                    }
                } else {
                    that.showModal("ErrModal", data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },

    setImage(index, img, extra) {
        let that = this
        if (extra) {
            that.data.exterior_pics[index] = img
        } else {
            that.data[that.data.imageType][index] = img
        }
    },

    onRemovePic: function(e) {
        let that = this;
        switch (e.target.dataset.le) {
            case "11":
                that.setData({
                    pic1: '',
                });
                that.removePic(0)
                break;
            case "12":
                that.setData({
                    pic2: '',
                });
                that.removePic(1)
                break;
            case "13":
                that.setData({
                    pic3: '',
                });
                that.removePic(2)
                break;
            case "21":
                that.setData({
                    pic4: '',
                });
                that.removePic(0, "extra")
                break;
            case "22":
                that.setData({
                    pic5: '',
                });
                that.removePic(1, "extra")
                break;
            case "23":
                that.setData({
                    pic6: '',
                });
                that.removePic(2, "extra")
                break;
        }
    },
    removePic(index, extra) {
        let that = this
        if (extra) {
            that.data.exterior_pics[index] = null
        } else {
            that.data[that.data.imageType][index] = null
        }
    },
    // -------- 图片 end  ---------- //

});