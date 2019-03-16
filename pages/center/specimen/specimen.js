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
        visibleBox: false
    },
    onLoad: function (options) {
        this.loadProgress();
        this.setData({
            centerId: options.centerId
        });
        // 从病历页进来
        if (typeof (options.caseId) != "undefined") {
            this.setData({
                caseId: options.caseId,
                patient_name: options.patient_name
            });
        }
        this.requestBoxList(this.data.searchValue, this.data.sortType);
    },
    loadProgress: function () {
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
    completeProgress: function () {
        this.setData({
            loadProgress: 100
        });
    },
    showToast: function (msg) {
        wx.showToast({
            icon: 'none',
            title: msg,
        });
    },
    showLoading: function () {
        this.setData({
            loadModal: true
        });
    },
    hideLoading: function () {
        setTimeout(() => {
            this.setData({
                loadModal: false
            });
        }, 1500);
    },
    showModal: function (modalName, msg = '') {
        this.setData({
            modalName: modalName,
            errMsg: msg
        });
    },
    hideModal: function (e) {
        this.setData({
            modalName: null
        });
    },
    onFilterChange: function (e) {
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
    onFilterOpen: function (e) {
        this.setData({
            pageStyle: 'height: 100%; overflow: hidden',
        });
    },
    onFilterClose: function (e) {
        this.setData({
            pageStyle: '',
        });
    },
    onSearchChange: function (e) {
        this.setData({
            searchValue: e.detail.value
        });
    },
    onSearch: function () {
        this.loadProgress();
        this.requestBoxList(this.data.searchValue, this.data.sortType);
    },
    requestBoxList: function (searchValue, sortType) {
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
                    that.showToast({
                        msg: res.data.data.msg,
                    });
                }
            },
            fail(res) {
                that.completeProgress();
            }
        });
    }
});