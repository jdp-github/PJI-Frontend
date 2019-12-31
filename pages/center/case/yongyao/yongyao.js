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
        according_to: 0,
        according_to_picker: ['请选择', '药敏指导', '经验用药'],
        drug: '',
        way: 0,
        wayPicker: ['请选择', '静脉', '口服', '局部灌洗'],
        dose: '',
        frequency: 0,
        frequencyPicker: ["请选择", "1/日", "2/日", "3/日", "1/12h"],
        start_time: '请选择日期',
        end_time: '请选择日期',
        end_time_state: 1,
        end_time_state_value: 'pencil',
        side_effect: 0,
        side_effect_picker: ['无', '有'],
        side_effect_state: 1,
        side_effect_state_value: 'pencil',
        remark: '',
        remark_state: 1,
        remark_state_value: 'pencil'
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
            [type]: e.detail.value,
        })
    },

    onInput(e) {
        let type = e.currentTarget.dataset.type
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
        } else if (style == "date") {
            this.setData({
                [param]: '请选择日期'
            })
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
        if (!this.data.isCreate) { // 编辑
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
                openid: app.globalData.openid,
                type: 4
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
            addAvatar: info.medication_creator_avatar,
            updateAvatarArr: this.makeUpdateAvatar(info.medication_editor_list),
            approveAvatar: info.medication_auditor_avatar,
        });

        // 基本数据
        this.setData({
            according_to: parseInt(info.according_to),
            drug: info.drug,
            way: parseInt(info.way),
            dose: info.dose,
            frequency: parseInt(info.frequency),
            start_time: this.getDefaultDate(info.start_time),
            end_time: this.getDefaultDate(info.end_time),
            side_effect: parseInt(info.side_effect),
            remark: info.remark
        })
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
            avatarList[i] = avatarObjList[i].medication_editor_avatar
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
                type: 4
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
                service: 'Case.EditCaseMedication',
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
                console.log("Case.EditCaseMedication:" + JSON.stringify(res))
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
        if (this.data.according_to == 0) {
            this.showToast("请选择用药依据")
            return false;
        }
        if (this.data.drug.length == 0) {
            this.showToast("请填写药物名称")
            return false;
        }
        if (this.data.way == 0) {
            this.showToast("请选择途径")
            return false;
        }
        if (this.data.dose.length == 0) {
            this.showToast("请填写剂量")
            return false;
        }
        if (this.data.frequency == 0) {
            this.showToast("请选择频次")
            return false;
        }
        if (this.data.start_time == '请选择日期') {
            this.showToast("请选择本方案开始时间")
            return false;
        }
        if (this.data.end_time_state == 1 && this.data.end_time == '请选择日期') {
            this.showToast("请选择本方案终止时间")
            return false;
        }
        if (this.data.remark_state == 1 && this.data.remark.length == 0) {
            this.showToast("请填写备注")
            return false;
        }

        return true
    },

    makeFiled() {
        let field_state = []
        field_state.push(this.makeFiledObj("end_time"));
        field_state.push(this.makeFiledObj("side_effect"));
        field_state.push(this.makeFiledObj("remark"));

        let filedStr = JSON.stringify(field_state)
        console.log("用药state：" + filedStr)
        return filedStr
    },

    makeFiledObj(filedName) {
        return {
            field_name: filedName,
            type: 4,
            state: this.data[filedName + "_state"]
        }
    },

    makeData() {
        let that = this
        var jsonData = {
            according_to: that.data.according_to,
            drug: that.data.drug,
            way: that.data.way,
            dose: that.data.dose,
            frequency: that.data.frequency,
            start_time: that.makeDefaultDate(that.data.start_time),
            end_time: that.makeDefaultDate(that.data.end_time),
            side_effect: that.data.side_effect,
            remark: that.data.remark,
        }
        console.log("用药：" + JSON.stringify(jsonData))
        return JSON.stringify(jsonData)
    },

    makeDefaultDate(date) {
        if (date == "请选择日期") {
            return 0
        } else {
            return new Date(date).getTime() / 1000
        }
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
                type: 4,
                state: that.data.caseInfo.medication_state == 2 ? 2 : 1
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
                type: 4
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
        }, 1000);
    },
    // -------- 提示框 end -------- //

    // -------- 模态对话框 start -------- //
    showModal: function(e, errMessage = '') {
        let that = this
        if (e.currentTarget) {
            this.setData({
                modalName: e.currentTarget.dataset.target,
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

});