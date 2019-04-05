'use strict';

let constant = require('../../../utils/constant.js');
let util = require('../../../utils/util.js');

const app = getApp();
const SORT_BY_NAME_ASC = 1;
const SORT_BY_NAME_DESC = -1;
const SORT_BY_CREATE_DATE_ASC = 2;
const SORT_BY_CREATE_DATE_DESC = -2;
const SORT_BY_UPDATE_DATE_ASC = 3;
const SORT_BY_UPDATE_DATE_DESC = -3;
const SORT_BY_LOCK_ASC = 4;
const SORT_BY_LOCK_DESC = -4;

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
        // 排序
        sortType: SORT_BY_NAME_ASC,
        filterItems: [{
                type: 'sort',
                label: '名称',
                value: 'name',
                groups: ['001'],
            },
            {
                type: 'sort',
                label: '启用时间',
                value: 'create_date',
                groups: ['002'],
            },
            {
                type: 'sort',
                label: '修改时间',
                value: 'update_date',
                groups: ['003'],
            },
            {
                type: 'sort',
                label: '锁定',
                value: 'lock',
                groups: ['004'],
            },
        ],
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
        this.setData({
            centerId: options.centerId
        });
        // 从病历页进来
        if (typeof(options.caseId) != "undefined") {
            this.setData({
                caseId: options.caseId,
                patient_name: options.patient_name
            });
        }
        this.requestBoxList(this.data.searchValue, this.data.sortType);
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
    onFilterChange: function(e) {
        const checkedItems = e.detail.checkedItems;
        const params = {};
        checkedItems.forEach((n) => {
            if (n.checked) {
                if (n.value === 'name') {
                    params.sort = n.value;
                    params.order = n.sort === 1 ? SORT_BY_NAME_ASC : SORT_BY_NAME_DESC
                } else if (n.value === 'create_date') {
                    params.sort = n.value;
                    params.order = n.sort === 1 ? SORT_BY_CREATE_DATE_ASC : SORT_BY_CREATE_DATE_DESC
                } else if (n.value === 'update_date') {
                    params.sort = n.value;
                    params.order = n.sort === 1 ? SORT_BY_UPDATE_DATE_ASC : SORT_BY_UPDATE_DATE_DESC
                } else if (n.value === 'lock') {
                    params.sort = n.value;
                    params.order = n.sort === 1 ? SORT_BY_LOCK_ASC : SORT_BY_LOCK_DESC
                }

                this.setData({
                    sortType: params.order
                });
                this.loadProgress();
                this.requestBoxList(this.data.searchValue, this.data.sortType);
            }
        });
    },
    onFilterOpen: function(e) {
        this.setData({
            pageStyle: 'height: 100%; overflow: hidden',
        });
    },
    onFilterClose: function(e) {
        this.setData({
            pageStyle: '',
        });
    },
    onSearchChange: function(e) {
        this.setData({
            searchValue: e.detail.value
        });
    },
    onSearch: function() {
        this.loadProgress();
        this.requestBoxList(this.data.searchValue, this.data.sortType);
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
        this.requestBoxList(this.data.searchValue, this.data.sortType);
    },
    requestBoxList: function(searchValue, sortType) {
        let that = this;
        wx.request({
            url: constant.basePath,
            data: {
                service: 'Sample.GetSampleBoxList',
                openid: app.globalData.openid,
                center_id: that.data.centerId,
                case_id: that.data.caseId,
                keyword: searchValue,
                sort: sortType
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
                    that.completeProgress();
                } else {
                    that.showToast(res.data.msg);
                }
            },
            fail(res) {
                that.completeProgress();
            }
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
                box_id: e.target.dataset.selecteditem.id
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
                    that.requestBoxList(that.data.searchValue, that.data.sortType);
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
                    that.requestBoxList(that.data.searchValue, that.data.sortType);
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
                    that.requestBoxList(that.data.searchValue, that.data.sortType);
                    that.setData({
                        boxName: '',
                        depositary: '',
                        boxUse: 1,
                        boxPicUrl: '',
                        boxPicUploud: ''
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