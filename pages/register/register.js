"use strict";
import { $wuxSelect } from '../../miniprogram_npm/wux-weapp/index'

const isTel = (value) => !/^1[34578]\d{9}$/.test(value);

Page({
    data: {
        centerValue: '',
        centerTitle: '',
        roleValue: '',
        roleTitle: '',
    },
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
    onTelClear() {
        this.setData({
            TelError: true,
            telValue: '',
        })
    },
});


