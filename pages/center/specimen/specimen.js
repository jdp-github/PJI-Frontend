'use strict';

let constant = require('../../../utils/constant.js');
let util = require('../../../utils/util.js');

const app = getApp();

Page({
    data: {
        loadProgress: 0,
        loadModal: false,
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        hidden: true,
        isAdmin: false,
        // 中心相关
        centerId: '',
        // 病历号
        caseId: '',
        // 患者姓名
        patient_name: '',
        // 搜索关键词
        searchValue: '',
        createYearIndex: 0,
        createYearPicker: [],
        boxType: 1,
        boxTypePicker: ['全部标本盒', '常规存储盒', '送检标本盒'],

        boxList: [],
        // 新增标本盒名
        boxName: '',
        // 新增标本盒存放点
        depositary: '',
        boxUse: 1,
        boxPicUrl: '',
        boxPicUploud: '',
        // 新增标本盒备注
        comment: ''
    },
    radioChange(e) {
        console.log(e.detail.value)
        this.setData({
            boxUse: e.detail.value
        })
    },
    boxTypePickerChange(e) {
        this.setData({
            boxType: e.detail.value
        })
        this.requestBoxList(this.data.searchValue);
    },
    createYearChange(e) {
        this.setData({
            createYearIndex: e.detail.value,
        })
        this.requestBoxList(this.data.searchValue);
    },
    onChooseImage: function(e) {
        let that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                const tempFilePaths = res.tempFilePaths;
                that.uploadImg(tempFilePaths[0])
            }
        });
    },
    uploadImg(filePath) {
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
                    that.setData({
                        boxPicUrl: data.data.info.url,
                        boxPicUploud: data.data.info.file
                    });
                } else {
                    that.showModal("ErrModal", data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },
    onRemovePic() {
        this.setData({
            boxPicUrl: '',
            boxPicUploud: ''
        })
    },
    onLoad: function(options) {
        this.loadProgress();

        let yearList = []
        for (let i = 2000; i <= 2050; i++) {
            yearList.push(i)
        }
        yearList.unshift('全部')
        this.setData({
            centerId: options.centerId,
            createYearPicker: yearList,
            createYearIndex: yearList.indexOf(new Date().getFullYear())
        });
        // 从病历页进来
        if (typeof(options.caseId) != "undefined") {
            this.setData({
                caseId: options.caseId,
                patient_name: options.patient_name
            });
        }
        this.requestBoxList(this.data.searchValue);
        this.completeProgress()
    },
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
    showModal(e) {
        this.setData({
            modalName: e.currentTarget.dataset.target
        })
    },
    hideModal(e) {
        this.setData({
            modalName: null
        })
    },
    onSearchChange: function(e) {
        this.setData({
            searchValue: e.detail.value
        });
    },
    onSearch: function() {
        this.loadProgress();
        this.requestBoxList(this.data.searchValue);
        this.completeProgress();
    },
    ListTouchStart: function(e) {
        this.setData({
            ListTouchStart: e.touches[0].pageX
        });
    },
    ListTouchMove: function(e) {
        this.setData({
            ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
        });
    },
    ListTouchEnd: function(e) {
        if (this.data.ListTouchDirection == 'left') {
            this.setData({
                modalName: e.currentTarget.dataset.target
            });
        } else {
            this.setData({
                modalName: null
            });
        }
        this.setData({
            ListTouchDirection: null
        });
    },
    onRefresh() {
        this.loadProgress();
        this.requestBoxList(this.data.searchValue);
        this.completeProgress()
    },
    requestBoxList: function(searchValue, isFirstTime) {
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.GetSampleBoxList',
                openid: app.globalData.openid,
                center_id: that.data.centerId,
                case_id: that.data.caseId,
                keyword: searchValue,
                sort: 1,
                uses: that.data.boxType,
                year: that.data.createYearPicker[that.data.createYearIndex] == '全部' ? 0 : that.data.createYearPicker[that.data.createYearIndex]
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                if (res.data.data.code == constant.response_success) {
                    for (let i = 0, len = res.data.data.list.length; i < len; i++) {
                        let box = res.data.data.list[i];
                        if (box.ctime > 0) {
                            box.ctime = util.formatTime(box.ctime, 'Y-M-D')
                        }
                        if (box.utime > 0) {
                            box.utime = util.formatTime(box.utime, 'Y-M-D')
                        }
                    }
                    that.setData({
                        boxList: res.data.data.list
                    });
                } else {
                    that.showToast(res.data.msg);
                }
            },
            fail(res) {}
        });
    },
    cancelAddBox: function(e) {
        this.setData({
            modalName: '',
            depositary: ''
        });
    },
    onItemClick: function(e) {
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.SetWritingStaff',
                openid: app.globalData.openid,
                box_id: e.currentTarget.dataset.selecteditem.id
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Sample.SetWritingStaff:" + JSON.stringify(res))
                that.hideLoading();
                if (res.data.data.code == constant.response_success) {
                    wx.navigateTo({
                        url: '../../center/specimen/detail/detail?boxId=' + e.currentTarget.dataset.selecteditem.id + '&centerId=' + that.data.centerId + "&caseId=" + that.data.caseId + "&boxUse=" + e.currentTarget.dataset.selecteditem.uses
                    });
                } else {
                    that.showToast(res.data.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },
    onInput: function(e) {
        if (e.target.dataset.prop == "boxName") {
            this.setData({
                boxName: e.detail.value
            });
        } else if (e.target.dataset.prop == "depositary") {
            this.setData({
                depositary: e.detail.value
            });
        } else if (e.target.dataset.prop == "comment") {
            this.setData({
                comment: e.detail.value
            });
        }
    },
    onItemDelete: function(e) {
        let that = this;
        let selectedItem = e.target.dataset.selecteditem;
        wx.showModal({
            title: '提示',
            content: '确定删除 [' + selectedItem.name + "] ?",
            success(res) {
                if (res.confirm) {
                    that.deleteBox(selectedItem.id)
                } else if (res.cancel) {}
            }
        });
    },
    deleteBox: function(boxId) {
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.DeleteSampleBox',
                openid: app.globalData.openid,
                box_id: boxId
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                that.hideLoading();
                if (res.data.data.code == constant.response_success) {
                    that.loadProgress();
                    that.requestBoxList(that.data.searchValue);
                    that.completeProgress();
                } else {
                    that.showToast(res.data.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },
    onItemLockOrUnlock: function(e) {
        let box = e.target.dataset.selecteditem;
        let that = this;
        that.showLoading();
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.SetLock',
                openid: app.globalData.openid,
                box_id: box.id,
                type: box.is_lock == 0 ? 1 : 0
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                that.hideLoading();
                if (res.data.data.code == constant.response_success) {
                    that.loadProgress();
                    that.requestBoxList(that.data.searchValue);
                    that.completeProgress();
                } else {
                    that.showToast(res.data.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },
    okAddBox: function() {
        let that = this;
        if (that.data.boxName.length == 0) {
            that.showToast('请输入标本盒名称');
            return
        }
        if (that.data.depositary.length == 0) {
            that.showToast('请输入标本盒存放地点');
            return
        }
        if (that.data.comment.length == 0) {
            that.showToast('请输入标本盒备注');
            return
        }

        that.showLoading();
        that.setData({
            modalName: ''
        });
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.CreateSampleBox',
                openid: app.globalData.openid,
                center_id: that.data.centerId,
                name: that.data.boxName,
                depositary: that.data.depositary,
                uses: parseInt(that.data.boxUse),
                image: that.data.boxPicUploud,
                remark: that.data.comment
            },
            header: {
                'content-type': 'application/json'
            },
            success(res) {
                console.log("Sample.CreateSampleBox:" + JSON.stringify(res))
                that.hideLoading();
                if (res.data.data.code == constant.response_success) {
                    that.loadProgress();
                    that.requestBoxList(that.data.searchValue);
                    that.completeProgress()
                    that.setData({
                        boxName: '',
                        depositary: '',
                        boxUse: 1,
                        boxPicUrl: '',
                        boxPicUploud: '',
                        comment: ''
                    })
                } else {
                    that.showToast(res.data.data.msg);
                }
            },
            fail(res) {
                that.hideLoading();
            }
        });
    },
});