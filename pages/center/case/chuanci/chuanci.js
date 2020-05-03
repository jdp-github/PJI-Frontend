'use strict';

let constant = require('../../../../utils/constant.js');
let util = require('../../../../utils/util.js');
let regeneratorRuntime = require('../../../../lib/regenerator-runtime/runtime');

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
        itemId: '',
        isCreate: false,
        isEdit: false,
        caseInfo: {},
        addAvatar: '',
        updateAvatarArr: [],
        approveAvatar: '',
        // -------- 公用信息 end -------- //

        // -------- 基本情况 begin -------- //
        base_info: false,
        puncture_date: '请选择日期',
        puncture_date_state: 1,
        puncture_type: 0,
        puncture_type_picker: ['请选择', '置换术后', '翻修术后', '占位器术后', '初次', '其他'],
        puncture_type_state: 1,
        puncture_desc: '',
        puncture_desc_state: 1,
        last_operation_duration: '',
        // 症状出现时长（周）
        symptoms_duration: '',
        // 性质
        properties: '',
        antibiotic_history: 0,
        antibiotic_history_state: 1,
        antibiotic_history_picker: ['请选择', '无', '已停2周以上', '2周内有使用', '1周内有使用', '3天内有使用用', '持续服用中'],
        immuno_history: 0,
        immuno_history_state: 1,
        immuno_history_picker: ['请选择', '无', '已停2周以上', '2周内有使用', '1周内有使用', '3天内有使用用', '持续服用中'],
        // 弹出框
        is_heat: 0,
        is_erythema: 0,
        is_swelling: 0,
        is_fever: 0,
        is_pain: 0,
        is_sinus: 0,
        exterior_pics: [],
        // -------- 基本情况 end -------- //

        // -------- 检查化验 begin -------- //
        assay_check: false,
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
        joint_fluid_desc: '',
        joint_fluid_desc_state: 1,
        joint_fluid_desc_pic: [],
        rinse_fluid_volume: '',
        rinse_fluid_volume_state: 1,
        rinse_lavage_volume: '',
        rinse_lavage_volume_state: 1,
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
        joint_fluid_wbc_state_value: 'pencil',
        sious_throat_swabs1: '',
        sious_throat_swabs1_state: 1,
        sious_throat_swabs1_state_value: 'pencil',
        sious_throat_swabs1_pic: [],
        sious_throat_swabs2: '',
        sious_throat_swabs2_state: 1,
        sious_throat_swabs2_state_value: 'pencil',
        sious_throat_swabs2_pic: [],
        sious_throat_swabs3: '',
        sious_throat_swabs3_state: 1,
        sious_throat_swabs3_state_value: 'pencil',
        sious_throat_swabs3_pic: [],
        culture_type: 0,
        culture_type_state: 1,
        culture_type_picker: ["请选择", "灌洗液", "混合液", "未送检"],
        culture_bottle_fluid_volume: '',
        culture_bottle_fluid_volume_state: 1,
        culture_bottle_fluid_volume_state_value: 'pencil',
        aerobic_result: '',
        aerobic_result_state: 1,
        aerobic_result_state_value: 'pencil',
        aerobic_result_pic: [],
        anaerobic_result: '',
        anaerobic_result_state: 1,
        anaerobic_result_state_value: 'pencil',
        anaerobic_result_pic: [],
        ngs_type: 0,
        ngs_type_state: 1,
        ngs_type_picker: ["请选择", "关节液", "灌洗液", "混合液", "未送检"],
        ngs_fluid_volume: '',
        ngs_fluid_volume_state: 1,
        ngs_fluid_volume_state_value: 'pencil',
        ngs_result: '',
        ngs_result_state: 1,
        ngs_result_state_value: 'pencil',
        other_check: '',
        other_check_state: 1,
        // -------- 检查化验 end -------- //

        // -------- 穿刺小结 begin -------- //
        puncture_summary: false,
        present_result: 0,
        present_result_state: 1,
        present_result_state_value: 'pencil',
        present_result_picker: ["请选择", "已能明确感染", "已能排除感染", "暂不能确定"],
        thistime_result: '',
        thistime_result_state: 1,
        is_remain_sample: 1,
        is_remain_sample_state: 1,
        is_remain_sample_picker: ["请选择", "否", "是"],
        bein_info: {},
        bein_relate_msg: '暂无可关联手术',
        bein_relate_list: [],
        follow_info: {},
        follow_relate_msg: '暂无可关联随访',
        follow_relate_list: [],
        relateList: [],
        relateType: '',
        sample_desc: [],
        saveMsg: '',
        // -------- 穿刺小结 end -------- //

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

    onBaseDelaySwitchChange: function(e) {
        this.setData({
            base_info: e.detail.value
        });
        let state = this.data.base_info ? 2 : 1
        this.setData({
            puncture_date: '请选择日期',
            puncture_date_state: state,
            puncture_type: 0,
            puncture_type_state: state,
            puncture_desc: '',
            puncture_desc_state: state,
            last_operation_duration: '',
            symptoms_duration: '',
            properties: '',
            antibiotic_history: 0,
            antibiotic_history_state: state,
            immuno_history: 0,
            immuno_history_state: state,
        })
    },
    onCheckDelaySwitchChange: function(e) {
        this.setData({
            assay_check: e.detail.value
        });
        let state = this.data.assay_check ? 2 : 1
        let stateValue = this.data.assay_check ? "clock-o" : "pencil"
        this.setData({
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
            joint_fluid_desc: '',
            joint_fluid_desc_pic: [],
            joint_fluid_desc_state: state,
            joint_fluid_desc_state_value: stateValue,
            rinse_fluid_volume: '',
            rinse_fluid_volume_state: state,
            rinse_fluid_volume_state_value: stateValue,
            rinse_lavage_volume: '',
            rinse_lavage_volume_state: state,
            rinse_lavage_volume_state_value: stateValue,
            le_testpaper_stoste: 0,
            le_testpaper_stoste_pic: [],
            le_testpaper_stoste_state: state,
            le_testpaper_stoste_state_value: stateValue,
            le_testpaper_centrifugal: 0,
            le_testpaper_centrifugal_pic: [],
            le_testpaper_centrifugal_state: state,
            le_testpaper_centrifugal_state_value: stateValue,
            joint_fluid_wbc: '',
            joint_fluid_wbc_state: state,
            joint_fluid_wbc_state_value: stateValue,
            pmn: '',
            pmn_state: state,
            pmn_state_value: stateValue,
            sious_throat_swabs1: '',
            sious_throat_swabs1_pic: [],
            sious_throat_swabs1_state: state,
            sious_throat_swabs1_state_value: stateValue,
            sious_throat_swabs2: '',
            sious_throat_swabs2_pic: [],
            sious_throat_swabs2_state: state,
            sious_throat_swabs2_state_value: stateValue,
            sious_throat_swabs3: '',
            sious_throat_swabs3_pic: [],
            sious_throat_swabs3_state: state,
            sious_throat_swabs3_state_value: stateValue,
            culture_type: 0,
            culture_type_state: state,
            culture_type_state_value: stateValue,
            culture_bottle_fluid_volume: '',
            culture_bottle_fluid_volume_state: state,
            culture_bottle_fluid_volume_state_value: stateValue,
            aerobic_result: '',
            aerobic_result_state: state,
            aerobic_result_state_value: stateValue,
            anaerobic_result: '',
            anaerobic_result_state: state,
            anaerobic_result_state_value: stateValue,
            ngs_type: 0,
            ngs_type_state: state,
            ngs_type_state_value: stateValue,
            ngs_fluid_volume: '',
            ngs_fluid_volume_state: state,
            ngs_fluid_volume_state_value: stateValue,
            ngs_result: '',
            ngs_result_state: state,
            ngs_result_state_value: stateValue,
            other_check: '',
            other_check_state: state,
            other_check_state_value: stateValue,
        })
    },

    // onPuncture_summarySwitchChange: function(e) {
    //     this.setData({
    //         puncture_summary: e.detail.value
    //     });

    //     let state = this.data.puncture_summary ? 2 : 1
    //     let stateValue = this.data.assay_check ? "clock-o" : "pencil"
    //     this.setData({
    //         present_result: 0,
    //         present_result_state: state,
    //         present_result_state_value: stateValue,
    //         thistime_result: '',
    //         thistime_result_state: state,
    //         is_remain_sample: 1,
    //         is_remain_sample_state: state,
    //     })
    // },

    onPickerChange(e) {
        let type = e.currentTarget.dataset.type
        this.setData({
            [type]: parseInt(e.detail.value)
        })
    },
    // <= 21天 或者 <= 3周是急性
    onDateChange(e) {
        let type = e.currentTarget.dataset.type
        this.setData({
            [type]: e.detail.value,
            last_operation_duration: util.getIntervalMonth(new Date(), new Date(e.detail.value)),
            symptoms_duration: util.getIntervalDay(new Date(e.detail.value), new Date()),
            properties: this.data.symptoms_duration <= 21 ? '急性' : '慢性'
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
            [type]: parseInt(e.detail.value)
        })
    },

    // 标本存放情况
    onSpecimenDesc: function(e) {
        if (this.data.sample_desc.length > 0) {
            wx.navigateTo({
                url: '../../../center/specimen/detail/detail?boxId=' + this.data.sample_desc[0].box_id + '&centerId=' + this.data.centerId + "&caseId=" + this.data.caseId + "&boxUse=" + this.data.sample_desc[0].uses
            })
        }
    },
    onShowDrawer() {
        if (!this.data.base_info) {
            this.setData({
                modalName: "DrawerModalR"
            })
            this.assignPic(this.data.exterior_pics, true)
        }
    },
    onCloseDrawer() {
        this.setData({
            modalName: null
        })
    },

    onRelateClick(e) {
        if (!this.data.base_info) {
            let type = e.currentTarget.dataset.type
            this.setData({
                modalName: "RelateDrawerModalR",
                relateType: type,
                relateList: type == 3 ? this.data.bein_relate_list : this.data.follow_relate_list
            })
        }
    },

    saveRelate() {
        this.setData({
            modalName: ""
        })
    },

    getRelateList(type) {
        let relateList = type == 3 ? JSON.parse(this.data.bein_info) : JSON.parse(this.data.follow_info)
        for (let i = 0, len = relateList.length; i < len; i++) {
            let relateInfo = relateList[i];
            // relateInfo.date_time = util.formatTime(relateInfo.date_time, 'Y-M-D');
            this.data.relateList.forEach(item => {
                relateInfo.isSelected = item.item_id == relateInfo.item_id
            })
        }

        let msg = ''
        if (type == 3) {
            if (relateList.length == 0) {
                msg = '暂无可关联手术'
            } else {
                msg = '点击查看'
            }
            this.setData({
                bein_relate_msg: msg,
                bein_relate_list: relateList
            })
        } else if (type == 5) {
            if (relateList.length == 0) {
                msg = '暂无可关联随访'
            } else {
                msg = '点击查看'
            }
            this.setData({
                follow_relate_msg: msg,
                follow_relate_list: relateList
            })
        }
    },

    gotoRelate(e) {
        let itemInfo = e.currentTarget.dataset.item;
        if (this.data.relateType == 3) {
            wx.navigateTo({
                url: '../../case/shoushu/shoushu?centerId=' + this.data.centerId + "&centerName=''" + "&caseId=" + this.data.caseId + "&itemId=" + itemInfo.item_id
            });
        } else if (this.data.relateType == 5) {
            wx.navigateTo({
                url: '../../case/followup/followup?centerId=' + this.data.centerId + "&centerName=''" + "&caseId=" + this.data.caseId + "&itemId=" + itemInfo.item_id
            });
        }
    },

    onLoad: function(options) {
        this.loadProgress();
        this.setData({
            isAdmin: app.globalData.is_admin == '1',
            centerId: options.centerId ? options.centerId : '',
            centerName: options.centerName ? options.centerName : '',
            caseId: options.caseId,
            itemId: options.itemId,
            isCreate: options.itemId == 0,
        });

        this.init()
        this.completeProgress();
    },

    init() {
        if (!this.data.isCreate) {
            this.requestCaseInfo();
        } else { // 新建
            this.setData({
                addAvatar: app.globalData.avatarUrl,
            })
        }
    },

    requestCaseInfo() {
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.GetCaseInfo',
                case_id: that.data.caseId,
                item_id: that.data.itemId,
                openid: app.globalData.openid,
                type: 2
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.GetCaseInfo:" + JSON.stringify(res))
                that.hideLoading();
                if (res.data.data.code == 0) {
                    // 基本信息
                    that.initViewByData(res.data.data.info)
                    // 状态
                    res.data.data.field_state.forEach(item => {
                        that.setData({
                            [item.field_name + "_state"]: item.state,
                            [item.field_name + "_state_value"]: item.state == 0 ? "ban" : item.state == 1 ? "pencil" : "clock-o"
                        })
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

    initViewByData(info) {
        this.setData({
            caseInfo: info,
            addAvatar: info.puncture_creator_avatar,
            updateAvatarArr: this.makeUpdateAvatar(info.puncture_editor_list),
            approveAvatar: info.puncture_auditor_avatar,
        });

        // 基本数据
        this.setData({
            base_info: info.base_info == 1,
            puncture_date: this.getDefaultDate(info.puncture_date),
            puncture_type: info.puncture_type,
            puncture_desc: info.puncture_desc,
            last_operation_duration: this.getDefaultNum(info.last_operation_duration),
            symptoms_duration: this.getDefaultNum(info.symptoms_duration),
            properties: info.properties,
            antibiotic_history: info.antibiotic_history,
            immuno_history: info.immuno_history,
            is_heat: parseInt(info.is_heat),
            is_erythema: parseInt(info.is_erythema),
            is_swelling: parseInt(info.is_swelling),
            is_fever: parseInt(info.is_fever),
            is_pain: parseInt(info.is_pain),
            is_sinus: parseInt(info.is_sinus),
            exterior_pics: this.getImgArr(info.exterior_pics),

            assay_check: info.assay_check == 1,
            esr: this.getDefaultNum(info.esr),
            crp: this.getDefaultNum(info.crp),
            conver_crp: this.getDefaultNum(info.conver_crp),
            il6: this.getDefaultNum(info.il6),
            dimer: this.getDefaultNum(info.dimer),
            fibrinogen: this.getDefaultNum(info.fibrinogen),
            joint_fluid_desc: info.joint_fluid_desc,
            joint_fluid_desc_pic: this.getImgArr(info.joint_fluid_desc_pics),
            rinse_fluid_volume: this.getDefaultNum(info.rinse_fluid_volume),
            rinse_lavage_volume: this.getDefaultNum(info.rinse_lavage_volume),
            le_testpaper_stoste: info.le_testpaper_stoste,
            le_testpaper_stoste_pic: this.getImgArr(info.le_testpaper_stoste_pics),
            le_testpaper_centrifugal: info.le_testpaper_centrifugal,
            le_testpaper_centrifugal_pic: this.getImgArr(info.le_testpaper_centrifugal_pics),
            joint_fluid_wbc: this.getDefaultNum(info.joint_fluid_wbc),
            pmn: this.getDefaultNum(info.pmn),
            sious_throat_swabs1: info.sious_throat_swabs1,
            sious_throat_swabs1_pic: this.getImgArr(info.sious_throat_swabs1_pic),
            sious_throat_swabs2: info.sious_throat_swabs2,
            sious_throat_swabs2_pic: this.getImgArr(info.sious_throat_swabs2_pic),
            sious_throat_swabs3: info.sious_throat_swabs3,
            sious_throat_swabs3_pic: this.getImgArr(info.sious_throat_swabs3_pic),
            culture_type: info.culture_type,
            culture_bottle_fluid_volume: this.getDefaultNum(info.culture_bottle_fluid_volume),
            aerobic_result: info.aerobic_result,
            aerobic_result_pic: this.getImgArr(info.aerobic_result_pic),
            anaerobic_result: info.anaerobic_result,
            anaerobic_result_pic: this.getImgArr(info.anaerobic_result_pic),
            ngs_type: info.ngs_type,
            ngs_fluid_volume: this.getDefaultNum(info.ngs_fluid_volume),
            ngs_result: info.ngs_result,
            other_check: info.other_check,

            puncture_summary: info.puncture_summary == 1,
            present_result: info.present_result,
            thistime_result: info.thistime_result,
            is_remain_sample: info.sample_deposit.length > 0 ? 2 : 1,
            puncture_creator: info.puncture_creator,
            puncture_auditor: info.puncture_auditor,
            puncture_progress: info.puncture_progress,
            puncture_state: info.puncture_state,
            bein_info: info.bein_info,
            follow_info: info.follow_info,
            // 已存标本
            sample_desc: info.sample_deposit
        })

        // 标本存放情况
        this.setData({
            saveMsg: this.getSpecimenInfo(this.data.sample_desc)
        });
        // 关联
        if (this.data.bein_info.length > 0) {
            this.getRelateList(3)
        }
        if (this.data.follow_info.length > 0) {
            this.getRelateList(5)
        }

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

    getSpecimenInfo(specimenArr) {
        let specimenMap = new Map()
        for (let i = 0; i < specimenArr.length; i++) {
            let box_name = specimenArr[i].box_name
            if (!specimenMap.has(box_name)) {
                specimenMap.set(box_name, [specimenArr[i].number])
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

    makeUpdateAvatar(avatarObjList) {
        var avatarList = [];
        var avatarLen = avatarObjList.length;
        for (var i = 0; i < avatarLen; i++) {
            avatarList[i] = avatarObjList[i].puncture_editor_avatar
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
                type: 2
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
                service: 'Case.EditCasePuncture',
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
                console.log("Case.EditCasePuncture:" + JSON.stringify(res))
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
        if (!this.data.base_info) {
            if (this.data.puncture_date_state == 1 && this.data.puncture_date == "请选择日期") {
                this.showToast("请选择穿刺日期")
                return false;
            }
            if (this.data.puncture_type_state == 1 && this.data.puncture_type == 0) {
                this.showToast("请选择穿刺类型")
                return false;
            }
            if (this.data.puncture_desc_state == 1 && this.data.puncture_desc.length == 0) {
                this.showToast("请填写简要病史")
                return false;
            }
            if (this.data.antibiotic_history_state == 1 && this.data.antibiotic_history == 0) {
                this.showToast("请选择抗生素使用史")
                return false;
            }
            if (this.data.immuno_history_state == 1 && this.data.immuno_history == 0) {
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
        }
        if (!this.data.assay_check) {
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
            if (this.data.joint_fluid_desc.length == 0) {
                this.showToast("请填写关节液描述")
                return false;
            }
            if (this.data.rinse_fluid_volume.length == 0) {
                this.showToast("请填写抽出关节液总量")
                return false;
            }
            if (this.data.rinse_lavage_volume.length == 0) {
                this.showToast("请填写抽出灌洗液总量")
                return false;
            }
            if (this.data.le_testpaper_stoste == 0) {
                this.showToast("请选择LE试纸（离心前）")
                return false;
            }
            if (this.data.le_testpaper_centrifugal == 0) {
                this.showToast("请选择LE试纸（离心后）")
                return false;
            }
            if (this.data.joint_fluid_wbc_state == 1 && this.data.joint_fluid_wbc.length == 0) {
                this.showToast("请填写关节液WBC")
                return false;
            }
            if (this.data.pmn_state == 1 && this.data.pmn.length == 0) {
                this.showToast("请填写PMN%")
                return false;
            }
            if (this.data.sious_throat_swabs1_state == 1 && this.data.sious_throat_swabs1.length == 0) {
                this.showToast("请填写窦道咽拭子1")
                return false;
            }
            if (this.data.sious_throat_swabs2_state == 1 && this.data.sious_throat_swabs2.length == 0) {
                this.showToast("请填写窦道咽拭子2")
                return false;
            }
            if (this.data.sious_throat_swabs3_state == 1 && this.data.sious_throat_swabs3.length == 0) {
                this.showToast("请填写窦道咽拭子3")
                return false;
            }
            if (this.data.culture_type == 0) {
                this.showToast("请选择打入每个培养瓶液体性质")
                return false;
            }
            if (this.data.culture_bottle_fluid_volume_state == 1 && this.data.culture_bottle_fluid_volume.length == 0) {
                this.showToast("请填写打入每个培养瓶液体量")
                return false;
            }
            if (this.data.aerobic_result_state == 1 && this.data.aerobic_result.length == 0) {
                this.showToast("请填写本次需氧+真菌培养结果")
                return false;
            }
            if (this.data.anaerobic_result_state == 1 && this.data.anaerobic_result.length == 0) {
                this.showToast("请填写本次厌氧结果")
                return false;
            }
            if (this.data.ngs_type == 0) {
                this.showToast("请选择送检NGS液体性质")
                return false;
            }
            if (this.data.ngs_fluid_volume_state == 1 && this.data.ngs_fluid_volume.length == 0) {
                this.showToast("请填写送检NGS液体量")
                return false;
            }
            if (this.data.ngs_result_state == 1 && this.data.ngs_result.length == 0) {
                this.showToast("请填写NGS结果")
                return false;
            }
            if (this.data.other_check.length == 0) {
                this.showToast("请填写其他检查")
                return false;
            }
        }
        if (!this.data.puncture_summary) {
            if (this.data.present_result_state == 1 && this.data.present_result == 0) {
                this.showToast("请选择目前诊断")
                return false;
            }
            if (this.data.thistime_result.length == 0) {
                this.showToast("请填写本次诊疗周期最终诊断")
                return false;
            }
        }

        return true
    },

    makeFiled() {
        let field_state = []
        field_state.push(this.makeFiledObj("puncture_date"));
        field_state.push(this.makeFiledObj("puncture_type"));
        field_state.push(this.makeFiledObj("puncture_desc"));
        field_state.push(this.makeFiledObj("antibiotic_history"));
        field_state.push(this.makeFiledObj("immuno_history"));

        field_state.push(this.makeFiledObj("esr"));
        field_state.push(this.makeFiledObj("crp"));
        field_state.push(this.makeFiledObj("il6"));
        field_state.push(this.makeFiledObj("dimer"));
        field_state.push(this.makeFiledObj("fibrinogen"));
        field_state.push(this.makeFiledObj("joint_fluid_desc"));
        field_state.push(this.makeFiledObj("rinse_fluid_volume"));
        field_state.push(this.makeFiledObj("rinse_lavage_volume"));
        field_state.push(this.makeFiledObj("le_testpaper_stoste"));
        field_state.push(this.makeFiledObj("le_testpaper_centrifugal"));
        field_state.push(this.makeFiledObj("joint_fluid_wbc"));
        field_state.push(this.makeFiledObj("pmn"));
        field_state.push(this.makeFiledObj("sious_throat_swabs1"));
        field_state.push(this.makeFiledObj("sious_throat_swabs2"));
        field_state.push(this.makeFiledObj("sious_throat_swabs3"));
        field_state.push(this.makeFiledObj("culture_type"));
        field_state.push(this.makeFiledObj("culture_bottle_fluid_volume"));
        field_state.push(this.makeFiledObj("aerobic_result"));
        field_state.push(this.makeFiledObj("anaerobic_result"));
        field_state.push(this.makeFiledObj("ngs_type"));
        field_state.push(this.makeFiledObj("ngs_fluid_volume"));
        field_state.push(this.makeFiledObj("ngs_result"));
        field_state.push(this.makeFiledObj("other_check"));

        field_state.push(this.makeFiledObj("present_result"));
        field_state.push(this.makeFiledObj("thistime_result"));
        field_state.push(this.makeFiledObj("is_remain_sample"));

        let filedStr = JSON.stringify(field_state)
        console.log("穿刺state：" + filedStr)
        return filedStr
    },

    makeFiledObj(filedName) {
        return {
            field_name: filedName,
            type: 2,
            state: this.data[filedName + "_state"]
        }
    },

    makeData() {
        let that = this
        var jsonData = {
            base_info: that.data.base_info ? "1" : "0",
            puncture_date: that.makeDefaultDate(that.data.puncture_date),
            puncture_type: that.data.puncture_type,
            puncture_desc: that.data.puncture_desc,
            last_operation_duration: that.makeDefaultNum(that.data.last_operation_duration),
            symptoms_duration: that.makeDefaultNum(that.data.symptoms_duration),
            properties: that.data.properties,
            antibiotic_history: that.data.antibiotic_history,
            immuno_history: that.data.immuno_history,
            is_heat: that.data.is_heat,
            is_erythema: that.data.is_erythema,
            is_swelling: that.data.is_swelling,
            is_fever: that.data.is_fever,
            is_pain: that.data.is_pain,
            is_sinus: that.data.is_sinus,
            exterior_pics: that.makePicJson(that.data.exterior_pics, true),

            assay_check: that.data.assay_check ? 1 : 0,
            esr: parseInt(this.makeDefaultValue(that.data.esr)),
            crp: parseFloat(this.makeDefaultValue(that.data.crp)),
            conver_crp: parseFloat(this.makeDefaultValue(that.data.conver_crp)),
            il6: parseFloat(this.makeDefaultValue(that.data.il6)),
            dimer: parseFloat(this.makeDefaultValue(that.data.dimer)),
            fibrinogen: parseFloat(this.makeDefaultValue(that.data.fibrinogen)),
            joint_fluid_desc: that.data.joint_fluid_desc,
            joint_fluid_desc_pics: that.makePicJson(that.data.joint_fluid_desc_pic),
            rinse_fluid_volume: parseFloat(this.makeDefaultValue(that.data.rinse_fluid_volume)),
            rinse_lavage_volume: parseFloat(this.makeDefaultValue(that.data.rinse_lavage_volume)),
            le_testpaper_stoste: that.data.le_testpaper_stoste,
            le_testpaper_stoste_pics: that.makePicJson(that.data.le_testpaper_stoste_pic),
            le_testpaper_centrifugal: that.data.le_testpaper_centrifugal,
            le_testpaper_centrifugal_pics: that.makePicJson(that.data.le_testpaper_centrifugal_pic),
            joint_fluid_wbc: parseInt(this.makeDefaultValue(that.data.joint_fluid_wbc)),
            pmn: parseFloat(this.makeDefaultValue(that.data.pmn)),
            sious_throat_swabs1: that.data.sious_throat_swabs1,
            sious_throat_swabs1_pic: that.makePicJson(that.data.sious_throat_swabs1_pic),
            sious_throat_swabs2: that.data.sious_throat_swabs2,
            sious_throat_swabs2_pic: that.makePicJson(that.data.sious_throat_swabs2_pic),
            sious_throat_swabs3: that.data.sious_throat_swabs3,
            sious_throat_swabs3_pic: that.makePicJson(that.data.sious_throat_swabs3_pic),
            culture_type: that.data.culture_type,
            culture_bottle_fluid_volume: parseFloat(this.makeDefaultValue(that.data.culture_bottle_fluid_volume)),
            aerobic_result: that.data.aerobic_result,
            aerobic_result_pic: that.makePicJson(that.data.aerobic_result_pic),
            anaerobic_result: that.data.anaerobic_result,
            anaerobic_result_pic: that.makePicJson(that.data.anaerobic_result_pic),
            ngs_type: that.data.ngs_type,
            ngs_fluid_volume: parseFloat(this.makeDefaultValue(that.data.ngs_fluid_volume)),
            ngs_result: that.data.ngs_result,
            other_check: that.data.other_check,

            puncture_summary: that.data.puncture_summary ? 1 : 0,
            present_result: that.data.present_result,
            thistime_result: that.data.thistime_result,
            is_remain_sample: that.data.is_remain_sample,
        }
        console.log("穿刺：" + JSON.stringify(jsonData))
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
                type: 2,
                state: that.data.caseInfo.puncture_state == 2 ? 2 : 1
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
                type: 2
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
            let pic1 = "",
                pic2 = "",
                pic3 = ""
            if (pics[0]) {
                if (pics[0].pic) {
                    pic1 = pics[0].pic
                } else if (pics[0].pic1) {
                    pic1 = pics[0].pic1
                } else {
                    pic1 = ""
                }
            }
            if (pics[1]) {
                if (pics[1].pic) {
                    pic2 = pics[1].pic
                } else if (pics[1].pic2) {
                    pic2 = pics[1].pic2
                } else {
                    pic2 = ""
                }
            }
            if (pics[2]) {
                if (pics[2].pic) {
                    pic3 = pics[2].pic
                } else if (pics[2].pic3) {
                    pic3 = pics[2].pic3
                } else {
                    pic3 = ""
                }
            }
            this.setData({
                pic1: pic1,
                pic2: pic2,
                pic3: pic3
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