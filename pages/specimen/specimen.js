"use strict";
const app = getApp();
var constant = require('../../utils/constant.js');
var util = require('../../utils/util.js');

Page({
    data: {
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
        boxList: ['2019第一盒'],
        visibleBox: false,
        boxName: ''
    },


    addBox(e) {
        this.setData({
            visibleBox: true,
        });
    },
    onBoxNameChange(e) {
        this.setData({
            boxName: e.detail.value,
        })
    },
    onBoxNameClear() {
        this.setData({
            name: '',
        })
    },
    okAddBox() {
        var that = this;
        if (that.data.boxName.length == 0) {
            wx.showToast({
                icon: 'none',
                title: '请输入标本盒名',
            })
            return
        }
        this.setData({
            visibleBox: false
        })
        wx.showLoading({
            title: '新增标本盒...',
        })
        wx.hideLoading()
    },
    onBoxClose(e) {
        this.setData({
            boxName: ''
        })
    },
    closeBox(e) {
        this.setData({
            visibleBox: false
        })
    },

    onLoad: function(options) {
        this.initData()
    },

    initData(){
        
    }
});