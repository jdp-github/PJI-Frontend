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
        itemId: '',
        isCreate: false,
        isEdit: false,
        caseInfo: {},
        addAvatar: '',
        updateAvatarArr: [],
        approveAvatar: '',
        // -------- 公用信息 end -------- //

        // -------- 基本情况 begin -------- //
        follow_date: '请选择日期',
        purpose: 0,
        purpose_picker: ['请选择', '针对诊断性穿刺', '针对手术治疗'],
        puncture_info: '',
        relateList: [],
        relateSelect: false,
        patient_desc: '',
        patient_desc_state: 1,
        patient_desc_state_value: 'pencil',

        this_followup_check: false,
        exterior: '',
        exterior_pic: [],
        exterior_state: 1,
        exterior_state_value: 'pencil',
        assay_result: '',
        assay_result_pic: [],
        assay_result_state: 1,
        assay_result_state_value: 'pencil',
        check_result: '',
        check_result_pic: [],
        check_result_state: 1,
        check_result_state_value: 'pencil',
        diagnose: 0,
        diagnose_picker: ['请选择', '感染', '非感染', '暂不能确定'],
        diagnose_state: 1,
        diagnose_state_value: 'pencil',
        plan: 0,
        plan_picker: ["请选择", "观察随访", "口服抗生素压制", "诊断性穿刺", "入院手术治疗", "其他"],
        remark: '',
        remark_state: 0,

        // ------- 图片上传 start --------- //
        pic1: '',
        pic1Upload: '',
        pic2: '',
        pic2Upload: '',
        pic3: '',
        pic3Upload: '',
        // ------- 图片上传 end  ---------- //
    },

    onThis_followup_checkChange(e) {
        this.setData({
            this_followup_check: e.detail.value
        })
        let state = this.data.this_followup_check ? 2 : 1
        let stateValue = this.data.this_followup_check ? "clock-o" : "pencil"
        this.setData({
            exterior_state: state,
            exterior_state_value: stateValue,
            assay_result_state: state,
            assay_result_state_value: stateValue,
            check_result_state: state,
            check_result_state_value: stateValue,
            remark_state: state,
        })
    },

    onPickerChange(e) {
        let type = e.currentTarget.dataset.type
        this.setData({
            [type]: parseInt(e.detail.value)
        })
        if (type == "purpose") {
            this.requestRelateList()
        }
    },

    onDateChange(e) {
        let type = e.currentTarget.dataset.type
        this.setData({
            [type]: e.detail.value,
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

    onShowDrawer() {
        if (!this.data.base_info) {
            this.setData({
                modalName: "DrawerModalR"
            })
        }
    },

    onRelateClick() {
        if (!this.data.base_info) {
            this.setData({
                modalName: "RelateDrawerModalR"
            })
        }
    },

    saveRelate() {
        this.setData({
            modalName: ""
        })
    },

    requestRelateList() {
        if (this.data.purpose == 0) {
            return
        }
        let that = this;
        let type = that.data.purpose == 1 ? 2 : 3
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Case.GetCaseItems',
                case_id: that.data.caseId,
                type: type,
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Case.GetCaseItems:" + JSON.stringify(res))
                if (res.data.data.code == constant.response_success) {
                    for (let i = 0, len = res.data.data.list.length; i < len; i++) {
                        let relateInfo = res.data.data.list[i];
                        relateInfo.date_time = util.formatTime(relateInfo.date_time, 'Y-M-D');
                        that.data.relateList.forEach(item => {
                            relateInfo.isSelected = item.item_id == relateInfo.item_id
                        })
                        if (that.data.puncture_info) {
                            let parseList = JSON.parse(that.data.puncture_info)
                            parseList.forEach(item => {
                                relateInfo.isSelected = item.item_id == relateInfo.item_id
                            })
                        }
                    }
                    that.setData({
                        relateList: res.data.data.list
                    });
                    that.getRelateSelecFlag(that.data.relateList)
                } else {
                    that.showToast(res.data.data.msg);
                }
            }
        });
    },

    onRelateItemClick(e) {
        let relateInfo = e.currentTarget.dataset.item;
        for (let i = 0, length = this.data.relateList.length; i < length; i++) {
            if (relateInfo.item_id == this.data.relateList[i].item_id) {
                this.data.relateList[i].isSelected = !this.data.relateList[i].isSelected
            }
        }

        this.setData({
            relateList: this.data.relateList,
        });
        this.getRelateSelecFlag(this.data.relateList)
    },

    getRelateSelecFlag(relateList) {
        for (let i = 0, length = relateList.length; i < length; i++) {
            if (relateList[i].isSelected) {
                this.setData({
                    relateSelect: true
                })
                return
            }
        }

        this.setData({
            relateSelect: false
        })
    },

    gotoRelate(e) {
        let itemInfo = e.currentTarget.dataset.item;
        if (this.data.purpose == 1) {
            wx.navigateTo({
                url: '../../case/chuanci/chuanci?centerId=' + this.data.centerId + "&centerName=''" + "&caseId=" + this.data.caseId + "&itemId=" + itemInfo.item_id
            });
        } else if (this.data.purpose == 2) {
            wx.navigateTo({
                url: '../../case/shoushu/shoushu?centerId=' + this.data.centerId + "&centerName=''" + "&caseId=" + this.data.caseId + "&itemId=" + itemInfo.item_id
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
                type: 5
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
            addAvatar: info.follow_creator_avatar,
            updateAvatarArr: this.makeUpdateAvatar(info.follow_editor_list),
            approveAvatar: info.follow_auditor_avatar,
        });

        // 基本数据
        this.setData({
            follow_date: this.getDefaultDate(info.follow_date),
            purpose: info.purpose,
            puncture_info: info.puncture_info,
            patient_desc: info.patient_desc,
            exterior: info.exterior,
            exterior_pic: this.getImgArr(info.exterior_pic),
            assay_result: info.assay_result,
            assay_result_pic: this.getImgArr(info.assay_result_pic),
            check_result: info.check_result,
            check_result_pic: this.getImgArr(info.check_result_pic),
            diagnose: info.diagnose,
            plan: info.plan,
            remark: info.remark,
        })

        this.requestRelateList()
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
            avatarList[i] = avatarObjList[i].follow_editor_avatar
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
                type: 5
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
                service: 'Case.EditCaseFollowup',
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
                console.log("Case.EditCaseFollowup:" + JSON.stringify(res))
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
        if (this.data.follow_date == "请选择日期") {
            this.showToast("请选择门诊时间")
            return false;
        }
        if (this.data.purpose == 0) {
            this.showToast("请选择本次复诊目的")
            return false;
        }
        if (this.data.patient_desc_state == 1 && this.data.patient_desc.length == 0) {
            this.showToast("请填写患者主诉")
            return false;
        }
        if (this.data.diagnose_state == 1 && this.data.diagnose == 0) {
            this.showToast("请选择目前诊断")
            return false;
        }
        if (this.data.plan == 0) {
            this.showToast("请选择下一步计划")
            return false;
        }
        if (!this.data.this_followup_check) {
            if (this.data.exterior_state == 1 && this.data.exterior.length == 0) {
                this.showToast("请填写外观状态")
                return false;
            }
            if (this.data.assay_result_state == 1 && this.data.assay_result.length == 0) {
                this.showToast("请填写新增化验结果")
                return false;
            }
            if (this.data.check_result_state == 1 && this.data.check_result.length == 0) {
                this.showToast("请填写新增检查结果")
                return false;
            }

            if (this.data.remark.length == 0) {
                this.showToast("请填写备注")
                return false;
            }
        }


        return true
    },

    makeFiled() {
        let field_state = []
        field_state.push(this.makeFiledObj("patient_desc"));
        field_state.push(this.makeFiledObj("exterior"));
        field_state.push(this.makeFiledObj("assay_result"));
        field_state.push(this.makeFiledObj("check_result"));
        field_state.push(this.makeFiledObj("diagnose"));

        let filedStr = JSON.stringify(field_state)
        console.log("随访state：" + filedStr)
        return filedStr
    },

    makeFiledObj(filedName) {
        return {
            field_name: filedName,
            type: 5,
            state: this.data[filedName + "_state"]
        }
    },

    makeData() {
        let that = this
        var jsonData = {
            follow_date: that.makeDefaultDate(that.data.follow_date),
            purpose: that.data.purpose,
            puncture_info: that.data.purpose == 1 ? that.makeRelateInfo() : '',
            bein_info: that.data.purpose == 2 ? that.makeRelateInfo() : '',
            patient_desc: that.data.patient_desc,
            exterior: that.data.exterior,
            exterior_pic: that.makePicJson(that.data.exterior_pic),
            assay_result: that.data.assay_result,
            assay_result_pic: that.makePicJson(that.data.assay_result_pic),
            check_result: that.data.check_result,
            check_result_pic: that.makePicJson(that.data.check_result_pic),
            diagnose: that.data.diagnose,
            plan: that.data.plan,
            remark: that.data.remark,
        }
        console.log("随访：" + JSON.stringify(jsonData))
        return JSON.stringify(jsonData)
    },

    makeRelateInfo() {
        let select = []
        this.data.relateList.forEach(item => {
            if (item.isSelected) {
                select.push(item)
            }
        })
        return JSON.stringify(select)
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
                type: 5,
                state: that.data.caseInfo.follow_state == 2 ? 2 : 1
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
                type: 5
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