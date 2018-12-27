"use strict";
import {
    $wuxSelect,
    $wuxToast
} from '../../miniprogram_npm/wux-weapp/index'

const isTel = (value) => !/^1[34578]\d{9}$/.test(value);

Page({
    data: {
        // 工单号
        workOrderNO: 'sss',
        name: '',
        telValue: '',
        email: '',
        centerValue: '',
        centerTitle: '',
        roleValue: '',
        roleTitle: '',
        requestReason: ''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {},
    onCenterClick() {
        $wuxSelect('#wux-center').open({
            value: this.data.centerValue,
            options: [
                '中心1',
                '中心2',
                '中心3',
            ],
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        centerValue: value,
                        centerTitle: options[index],
                    })
                }
            },
        });
    },
    onRoleClick() {
        $wuxSelect('#wux-role').open({
            value: this.data.roleValue,
            options: [
                '中心负责人',
                "项目负责人",
                '研究员',
            ],
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        roleValue: value,
                        roleTitle: options[index],
                    })
                }
            },
        });
    },

    onTelChange(e) {
        this.setData({
            telError: isTel(e.detail.value),
            telValue: e.detail.value,
        })
    },

    onTelError() {
        wx.showModal({
            title: '请输入合法的电话号码',
            showCancel: !1,
        })
    },

    onNameChange(e) {
        this.setData({
            name: e.detail.value,
        })
    },

    onNameClear() {
        this.setData({
            name: '',
        })
    },
    onTelClear() {
        this.setData({
            telError: true,
            telValue: '',
        })
    },

    onEMailChange(e) {
        this.setData({
            email: e.detail.value,
        })
    },

    onEMailClear() {
        this.setData({
            email: '',
        })
    },

    onReasonChange(e) {
        this.setData({
            requestReason: e.detail.value,
        })
    },
    onReasonClear() {
        this.setData({
            requestReason: '',
        })
    },

    onCommitClick() {
        // if (this.data.name.length == 0) {
        //     this.showToast("请输入姓名")
        //     return
        // }
        // if (this.data.telValue.length == 0) {
        //     this.showToast("请输入电话")
        //     return
        // }
        // if (this.data.telError) {
        //     this.showToast("请输入正确的电话")
        //     return
        // }
        // if (this.data.centerValue.length == 0) {
        //     this.showToast("请选择所属中心")
        //     return
        // }
        // if (this.data.roleValue.length == 0) {
        //     this.showToast("请选择中心角色")
        //     return
        // }

        wx.navigateBack({
            delta: 2
        })
        // console.log(this.data.name + ":" + this.data.telValue + ":" + this.data.email + ":" + this.data.requestReason)
    },

    showToast(msg) {
        $wuxToast().show({
            duration: 1500,
            color: '#fff',
            text: msg
        })
    }
});