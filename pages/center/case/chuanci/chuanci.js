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
        is_heat: '',
        is_erythema: '',
        is_swelling: '',
        is_fever: '',
        is_pain: '',
        is_sinus: '',
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
        is_remain_sample: 0,
        is_remain_sample_state: 1,
        is_remain_sample_picker: ["请选择", "否", "是"],
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
        this.setData({
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
            joint_fluid_desc: '',
            joint_fluid_desc_pic: [],
            joint_fluid_desc_state: state,
            rinse_fluid_volume: '',
            rinse_fluid_volume_state: state,
            rinse_lavage_volume: '',
            rinse_lavage_volume_state: state,
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
            sious_throat_swabs1: '',
            sious_throat_swabs1_pic: [],
            sious_throat_swabs1_state: state,
            sious_throat_swabs2: '',
            sious_throat_swabs2_pic: [],
            sious_throat_swabs2_state: state,
            sious_throat_swabs3: '',
            sious_throat_swabs3_pic: [],
            sious_throat_swabs3_state: state,
            culture_type: 0,
            culture_type_state: state,
            culture_bottle_fluid_volume: '',
            culture_bottle_fluid_volume_state: state,
            aerobic_result: '',
            aerobic_result_state: state,
            anaerobic_result: '',
            anaerobic_result_state: state,
            ngs_type: 0,
            ngs_type_state: state,
            ngs_fluid_volume: '',
            ngs_fluid_volume_state: state,
            ngs_result: '',
            ngs_result_state: state,
            other_check: '',
            other_check_state: state,
        })
    },

    onPuncture_summarySwitchChange: function(e) {
        this.setData({
            puncture_summary: e.detail.value
        });

        let state = this.data.puncture_summary ? 2 : 1
        this.setData({
            present_result: 0,
            present_result_state: state,
            thistime_result: '',
            thistime_result_state: state,
            is_remain_sample: 0,
            is_remain_sample_state: state,
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

    // 标本存放情况
    onSpecimenDesc: function(e) {
        // if (this.data.sample_desc.length > 0) {
        //     wx.navigateTo({
        //         url: '../../specimen/detail/detail?boxId=' + this.data.sample_desc[0].box_id + '&centerId=' + this.data.centerId + "&caseId=" + this.data.caseId + "&boxUse=" + this.data.sample_desc[0].uses
        //     })
        // }
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
            pic2: pics[1] ? pics[1].pic2 : "",
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