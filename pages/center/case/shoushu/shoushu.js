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
        centerId: '',
        centerName: '',
        caseId: '',
        isCreateCase: '',
        isLook: false,
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
        is_heat: '',
        is_erythema: '',
        is_swelling: '',
        is_fever: '',
        is_pain: '',
        is_sinus: '',
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
        msis: 0,
        msis_state: 1,
        msis_picker: ['请选择', '感染', '非感染', '不能确定'],
        icm: 0,
        icm_state: 1,
        icm_picker: ['请选择', '感染', '非感染', '不能确定'],
        special_event: '',
        special_event_state: 1,
        antibiotic_scene: 0,
        antibiotic_scene_state: 1,
        antibiotic_scene_picker: ['请选择', 'PJI单一菌', 'PJI多重感染', 'PJI菌培养阴性', '常规预防性应用', '不能明确诊断的预防性应用', '未用药'],
        germ_name: '',
        germ_name_state: 1,
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
        this.setData({
            hospitalized_date: '请选择日期',
            hospitalized_date_state: state,
            antibiotic_history: 0,
            antibiotic_history_state: state,
            immuno_history: 0,
            immuno_history_state: state,
            is_heat: '',
            is_erythema: '',
            is_swelling: '',
            is_fever: '',
            is_pain: '',
            is_sinus: '',
            exterior_pics: [],
            pic4: '',
            pic4Upload: '',
            pic5: '',
            pic5Upload: '',
            pic6: '',
            pic6Upload: '',
            esr: '',
            esr_state: state,
            crp: '',
            crp_state: state,
            conver_crp: '',
            il6: '',
            il6_state: state,
            dimer: '',
            dimer_state: state,
            fibrinogen: '',
            fibrinogen_state: state,
        })
    },
    onOperation_during_checkSwitchChange(e) {
        this.setData({
            operation_during_check: e.detail.value
        });
        let state = this.data.operation_during_check ? 2 : 1
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
            pmn: '',
            pmn_state: state,
            neutrophil: 0,
            neutrophil_state: state,
            tissue_culture1: '',
            tissue_culture1_pic: [],
            tissue_culture1_state: state,
            tissue_culture2: '',
            tissue_culture2_pic: [],
            tissue_culture2_state: state,
            tissue_culture3: '',
            tissue_culture3_pic: [],
            tissue_culture3_state: state,
            tissue_culture4: '',
            tissue_culture4_pic: [],
            tissue_culture4_state: state,
            tissue_culture5: '',
            tissue_culture5_pic: [],
            tissue_culture5_state: state,
            tissue_mngs: '',
            tissue_mngs_pic: [],
            tissue_mngs_state: state,
            joint_aerobic_result: '',
            joint_aerobic_result_pic: [],
            joint_aerobic_result_state: state,
            joint_anaerobic_result: '',
            joint_anaerobic_result_pic: [],
            joint_anaerobic_result_state: state,
            joint_mngs_result: '',
            joint_mngs_result_pic: [],
            joint_mngs_result_state: state,
            splitting_aerobic_result: '',
            splitting_aerobic_result_pic: [],
            splitting_aerobic_result_state: state,
            splitting_anaerobic_result: '',
            splitting_anaerobic_result_pic: [],
            splitting_anaerobic_result_state: state,
            splitting_mngs_result: '',
            splitting_mngs_result_pic: [],
            splitting_mngs_result_state: state,
        })
    },

    onOperation_during_treatSwitchChange(e) {
        this.setData({
            operation_during_treat: e.detail.value
        });
        let state = this.data.operation_during_treat ? 2 : 1
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
            bone_cement_volume: '',
            bone_cement_volume_state: state,
            data_pic: [],
            data_pic_state: state,
            data_video: [],
            data_video_state: state,
        })
    },

    onLeave_summarySwitchChange(e) {
        this.setData({
            leave_summary: e.detail.value
        });
        let state = this.data.leave_summary ? 2 : 1
        this.setData({
            leave_hospital_date: '请选择日期',
            leave_hospital_date_state: state,
            msis: 0,
            msis_state: state,
            icm: 0,
            icm_state: state,
            special_event: '',
            special_event_state: state,
            antibiotic_scene: 0,
            antibiotic_scene_state: state,
            germ_name: '',
            germ_name_state: state,
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
        }
    },
    onRadioChange(e) {
        let type = e.currentTarget.dataset.type
        this.setData({
            [type]: e.detail.value
        })
    },

    onShowDrawer() {
        if (!this.data.base_info) {
            this.setData({
                modalName: "DrawerModalR"
            })
        }
    },

    onLoad: function(options) {
        // this.loadProgress();
        // var caseId = options.case_id;
        // this.setData({
        //     centerId: options.centerId ? options.centerId : '',
        //     centerName: options.centerName ? options.centerName : '',
        //     isAdmin: app.globalData.is_admin == '1',
        //     caseId: caseId,
        //     isCreateCase: caseId.length <= 0,
        //     isLook: options.isLook ? options.isLook : false
        // });

        // if (!this.data.isCreateCase) {
        //     this.requestCaseInfo(caseId);
        //     this.setData({
        //         addAvatar: this.data.caseInfo.puncture.puncture_creator_avatar,
        //         updateAvatarArr: this.makeUpdateAvatar(this.data.caseInfo.puncture.puncture_editor_list),
        //         approveAvatar: this.data.caseInfo.puncture.puncture_auditor_avatar,
        //     })
        // } else {
        //     this.setData({
        //         addAvatar: app.globalData.avatarUrl
        //     })
        // }
        // this.completeProgress();
    },

    requestCaseInfo(caseId) {
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.GetCaseInfo',
                case_id: caseId,
                openid: app.globalData.openid
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.GetCaseInfo:" + JSON.stringify(res))
                that.hideLoading();
                if (res.data.data.code == 0) {
                    that.initViewByData(res.data.data)
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
            caseInfo: info
        });

        // 诊断性穿刺
        this.setData({
            chuangciDate: this.getDefaultDate(info.puncture.puncture_date),
            ccDateDisabled: this.getNumDisable(info.puncture.puncture_date),
            ccDescribe: info.puncture.puncture_desc,
            ccDescribeDisabeld: this.getValueDisable(info.puncture.puncture_desc),
            ccgjy: this.getDefaultNum(info.puncture.rinse_fluid_volume),
            ccgjyDisabled: this.getNumDisable(info.puncture.rinse_fluid_volume),
            ccgxy: this.getDefaultNum(info.puncture.rinse_lavage_volume),
            ccgxyDisabled: this.getNumDisable(info.puncture.rinse_lavage_volume),
            leIndex: info.puncture.le_testpaper_stoste,
            leDisabled: this.getNumDisable(info.puncture.le_testpaper_stoste),
            pic1: info.puncture.le_testpaper_pic.pic1Upload ? info.puncture.le_testpaper_pic.pic1Upload : '',
            pic1Upload: info.puncture.le_testpaper_pic_file.pic1Upload ? info.puncture.le_testpaper_pic_file.pic1Upload : '',
            pic2: info.puncture.le_testpaper_pic.pic2Upload ? info.puncture.le_testpaper_pic.pic2Upload : '',
            pic2Upload: info.puncture.le_testpaper_pic_file.pic2Upload ? info.puncture.le_testpaper_pic_file.pic2Upload : '',
            pic3: info.puncture.le_testpaper_pic.pic3Upload ? info.puncture.le_testpaper_pic.pic3Upload : '',
            pic3Upload: info.puncture.le_testpaper_pic_file.pic3Upload ? info.puncture.le_testpaper_pic_file.pic3Upload : '',
            leAfterIndex: info.puncture.le_testpaper_centrifugal,
            leAfterDisabled: this.getNumDisable(info.puncture.le_testpaper_centrifugal),
            pic4: info.puncture.le_testpaper_centr_pic.pic4Upload ? info.puncture.le_testpaper_centr_pic.pic4Upload : '',
            pic4Upload: info.puncture.le_testpaper_centr_pic_file.pic4Upload ? info.puncture.le_testpaper_centr_pic_file.pic4Upload : '',
            pic5: info.puncture.le_testpaper_centr_pic.pic5Upload ? info.puncture.le_testpaper_centr_pic.pic5Upload : '',
            pic5Upload: info.puncture.le_testpaper_centr_pic_file.pic5Upload ? info.puncture.le_testpaper_centr_pic_file.pic5Upload : '',
            pic6: info.puncture.le_testpaper_centr_pic.pic6Upload ? info.puncture.le_testpaper_centr_pic.pic6Upload : '',
            pic6Upload: info.puncture.le_testpaper_centr_pic_file.pic6Upload ? info.puncture.le_testpaper_centr_pic_file.pic6Upload : '',
            gjybxb: this.getDefaultNum(info.puncture.joint_fluid_leukocyte),
            gjybxbDisabled: this.getNumDisable(info.puncture.joint_fluid_leukocyte),
            gjyzx: this.getDefaultNum(info.puncture.neutrophils_percent),
            gjyzxDisabled: this.getNumDisable(info.puncture.neutrophils_percent),
            bcpysjIndex: info.puncture.culture_type,
            bcpysjDisabled: this.getNumDisable(info.puncture.culture_type),
            drgpyp: this.getDefaultNum(info.puncture.culture_bottle_fluid_volume),
            drgpypDisabled: this.getNumDisable(info.puncture.culture_bottle_fluid_volume),
            bcxyResult: info.puncture.aerobic_culture_result,
            bcxyResultDisabled: this.getValueDisable(info.puncture.aerobic_culture_result),
            bcxyLast: this.getDefaultNum(info.puncture.aerobic_culture_time),
            bcxyLastDisabled: this.getNumDisable(info.puncture.aerobic_culture_time),
            bcyyResult: info.puncture.anaerobic_culture_result,
            bcyyResultDisabled: this.getValueDisable(info.puncture.anaerobic_culture_result),
            bcyyLast: this.getDefaultNum(info.puncture.anaerobic_culture_time),
            bcyyLastDisabled: this.getNumDisable(info.puncture.anaerobic_culture_time),
            mNGSTypeIndex: info.puncture.mngs_type,
            mNGSTypeDisabled: this.getNumDisable(info.puncture.mngs_type),
            mNGSResult: info.puncture.joint_fluid_mngs_result,
            mNGSResultDisabled: this.getValueDisable(info.puncture.joint_fluid_mngs_result),
            sqSecondxy: info.puncture.puncture_aerobic_culture_result2,
            sqSecondxyDisabled: this.getValueDisable(info.puncture.puncture_aerobic_culture_result2),
            sqSecondyy: info.puncture.puncture_anaerobic_culture_result2,
            sqSecondyyDisabled: this.getValueDisable(info.puncture.puncture_anaerobic_culture_result2),
            sqThirdxy: info.puncture.puncture_aerobic_culture_result3,
            sqThirdxyDisabled: this.getValueDisable(info.puncture.puncture_aerobic_culture_result3),
            sqThirdyy: info.puncture.puncture_anaerobic_culture_result3,
            sqThirdyyDisabled: this.getValueDisable(info.puncture.puncture_anaerobic_culture_result3),
            // 已存标本
            sample_desc: info.puncture.sample_deposit,
            // 已取标本
            sample_used: info.puncture.sample_used,
            saveMsg: '',
            usedMsg: '',
        })

        // 标本存放情况
        this.setData({
            saveMsg: this.getSpecimenInfo(this.data.sample_desc)
        });
        // 标本取出情况
        this.setData({
            usedMsg: this.getSpecimenInfo(this.data.sample_used)
        });
    },

    getSpecimenInfo(specimenArr) {
        let specimenMap = new Map()
        for (let i = 0; i < specimenArr.length; i++) {
            let box_name = specimenArr[i].box_name
            if (!specimenMap.has(box_name)) {
                specimenMap.set(box_name, [])
            } else {
                specimenMap.get(box_name).push(specimenArr[i].number)
            }
        }

        let specimenMsg = '';
        specimenMap.forEach(function(value, key, map) {
            specimenMsg += "标本盒:" + key + ",标本序号:" + value + "   "
        });
        return specimenMsg
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
            if (avatarObjList[i].base_editor_avatar) {
                avatarList[i] = avatarObjList[i].base_editor_avatar
            } else if (avatarObjList[i].puncture_editor_avatar) {
                avatarList[i] = avatarObjList[i].puncture_editor_avatar
            } else if (avatarObjList[i].bein_editor_avatar) {
                avatarList[i] = avatarObjList[i].bein_editor_avatar
            }
        }
        return avatarList
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
                service: 'Case.CreateEditCasePuncture',
                case_id: that.data.caseId,
                openid: app.globalData.openid,
                json_data: that.makeData()
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.CreateEditCasePuncture:" + JSON.stringify(res))
                that.hideLoading();
                if (res.data.data.code == 0) {
                    that.showToast("提交成功")
                    var args = {
                        currentTarget: {
                            dataset: {
                                id: 2
                            }
                        }
                    }
                    that.tabSelect(args)
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
        if (!this.data.ccDateDisabled && this.data.chuangciDate == "请选择日期") {
            this.showToast("请选择穿刺日期")
            return false;
        }
        if (!this.data.ccDescribeDisabeld && this.data.ccDescribe.length == 0) {
            this.showToast("请填写穿刺描述")
            return false;
        }
        if (!this.data.ccgjyDisabled && this.data.ccgjy.length == 0) {
            this.showToast("请填写抽出关节液总量")
            return false;
        }
        if (!this.data.ccgxyDisabled && this.data.ccgxy.length == 0) {
            this.showToast("请填写抽出灌洗液总量")
            return false;
        }
        if (!this.data.leDisabled && this.data.leIndex == 0) {
            this.showToast("请选择LE试纸(原液)")
            return false;
        }
        if (!this.data.leAfterDisabled && this.data.leAfterIndex == 0) {
            this.showToast("请选择LE试纸(离心后)")
            return false;
        }
        if (!this.data.gjybxbDisabled && this.data.gjybxb.length == 0) {
            this.showToast("请填写关节液白细胞计数")
            return false;
        }
        if (!this.data.gjyzxDisabled && this.data.gjyzx.length == 0) {
            this.showToast("请填写关节液中心粒细胞百分比")
            return false;
        }
        if (!this.data.bcpysjDisabled && this.data.bcpysjIndex == 0) {
            this.showToast("请选择本次培养送检类型")
            return false;
        }
        if (!this.data.drgpypDisabled && this.data.drgpyp.length == 0) {
            this.showToast("请填写打入各培养瓶量")
            return false;
        }
        if (!this.data.bcxyResultDisabled && this.data.bcxyResult.length == 0) {
            this.showToast("请填写本次需氧+真菌培养结果")
            return false;
        }
        if (!this.data.bcxyLastDisabled && this.data.bcxyLast.length == 0) {
            this.showToast("请填写本次需氧+真菌培养时长")
            return false;
        }
        if (!this.data.bcyyResultDisabled && this.data.bcyyResult.length == 0) {
            this.showToast("请填写本次厌氧培养结果")
            return false;
        }
        if (!this.data.bcyyLastDisabled && this.data.bcyyLast.length == 0) {
            this.showToast("请填写本次厌氧培养时长")
            return false;
        }
        if (!this.data.mNGSTypeDisabled && this.data.mNGSTypeIndex == 0) {
            this.showToast("请选择mNGS送检类型")
            return false;
        }
        if (!this.data.mNGSResultDisabled && this.data.mNGSResult.length == 0) {
            this.showToast("请填写关节液/冲洗液mNGS结果")
            return false;
        }
        if (!this.data.sqSecondxyDisabled && this.data.sqSecondxy.length == 0) {
            this.showToast("术前第2次穿刺需氧+真菌培养结果")
            return false;
        }
        if (!this.data.sqSecondyyDisabled && this.data.sqSecondyy.length == 0) {
            this.showToast("术前第2次穿刺厌氧培养结果")
            return false;
        }
        if (!this.data.sqThirdxyDisabled && this.data.sqThirdxy.length == 0) {
            this.showToast("术前第3次穿刺需氧+真菌培养结果")
            return false;
        }
        if (!this.data.sqThirdyyDisabled && this.data.sqThirdyy.length == 0) {
            this.showToast("术前第3次穿刺厌氧培养结果")
            return false;
        }

        return true
    },

    makeData() {
        let that = this
        var lePic = {
            pic1Upload: that.data.pic1Upload,
            pic2Upload: that.data.pic2Upload,
            pic3Upload: that.data.pic3Upload,
        }
        var leCentrPic = {
            pic4Upload: that.data.pic4Upload,
            pic5Upload: that.data.pic5Upload,
            pic6Upload: that.data.pic6Upload,
        }
        var jsonData = {
            puncture_date: that.data.ccDateDisabled ? 0 : new Date(that.data.chuangciDate).getTime() / 1000,
            puncture_desc: that.data.ccDescribe,
            rinse_fluid_volume: parseFloat(this.getDefaultValue(that.data.ccgjy)),
            rinse_lavage_volume: parseFloat(this.getDefaultValue(that.data.ccgxy)),
            le_testpaper_stoste: parseInt(this.getDefaultValue(that.data.leIndex)),
            le_testpaper_pic: JSON.stringify(lePic),
            le_testpaper_centrifugal: parseInt(this.getDefaultValue(that.data.leAfterIndex)),
            le_testpaper_centr_pic: JSON.stringify(leCentrPic),
            joint_fluid_leukocyte: parseInt(this.getDefaultValue(that.data.gjybxb)),
            neutrophils_percent: parseFloat(this.getDefaultValue(that.data.gjyzx)),
            culture_type: parseInt(this.getDefaultValue(that.data.bcpysjIndex)),
            culture_bottle_fluid_volume: parseFloat(this.getDefaultValue(that.data.drgpyp)),
            aerobic_culture_result: that.data.bcxyResult,
            aerobic_culture_time: parseInt(this.getDefaultValue(that.data.bcxyLast)),
            anaerobic_culture_result: that.data.bcyyResult,
            anaerobic_culture_time: parseInt(this.getDefaultValue(that.data.bcyyLast)),
            mngs_type: parseInt(that.data.mNGSTypeIndex),
            joint_fluid_mngs_result: that.data.mNGSResult,
            puncture_aerobic_culture_result2: that.data.sqSecondxy,
            puncture_anaerobic_culture_result2: that.data.sqSecondyy,
            puncture_aerobic_culture_result3: that.data.sqThirdxy,
            puncture_anaerobic_culture_result3: that.data.sqThirdyy,
        }
        console.log("穿刺：" + JSON.stringify(jsonData))
        return JSON.stringify(jsonData)
    },

    getDefaultValue(value) {
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
                openid: app.globalData.openid,
                type: 2,
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
        if (this.data.isLook) {
            return
        }
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.ClearWritingStatus',
                case_id: that.data.caseId,
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

    assignPic(pics) {
        this.setData({
            pic1: pics[0] ? pics[0].pic1 : "",
            pic2: pics[1] ? pics[1].pic2: "",
            pic3: pics[2] ? pics[2].pic3 : ""
        })
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
                                pic3: data.data.info.url,
                                pic3Upload: data.data.info.file
                            }, "extra")
                            break;
                        case "22":
                            that.setData({
                                pic5: data.data.info.url,
                                pic5Upload: data.data.info.file,
                            });
                            that.setImage(1, {
                                pic3: data.data.info.url,
                                pic3Upload: data.data.info.file
                            }, "extra")
                            break;
                        case "23":
                            that.setData({
                                pic6: data.data.info.url,
                                pic6Upload: data.data.info.file,
                            });
                            that.setImage(2, {
                                pic3: data.data.info.url,
                                pic3Upload: data.data.info.file
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