"use strict";
import {
    $wuxSelect,
    $wuxCalendar,
} from '../../../miniprogram_npm/wux-weapp/index'

Page({
    data: {
        currentStep: 0,
        centerValue: '血液中心',
        centerTitle: '血液中心',
        sexValue: '男',
        sexTitle: '男',
        createDateValue: ['2018-12-24'],
    },
    onNextStep: function() {
        this.setData({
            currentStep: this.data.currentStep + 1 > 2 ? 2 : this.data.currentStep + 1,
        });
    },
    onPrevStep: function() {
        this.setData({
            currentStep: this.data.currentStep - 1 > 0 ? this.data.currentStep - 1 : 0,
        });
    },
    onClickCenter: function() {
        $wuxSelect('#selectCenter').open({
            centerValue: this.data.centerValue,
            options: [
                '血液中心',
                '骨头中心',
                '透视中心',
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
    onClickSex: function() {
        $wuxSelect('#selectSex').open({
            centerValue: this.data.centerValue,
            options: [
                '男',
                '女',
            ],
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        sexValue: value,
                        sexTitle: options[index],
                    })
                }
            },
        });
    },
    openCalendar: function() {
        $wuxCalendar("#createCalendar").open({
            value: this.data.createDateValue,
            onChange: (values, displayValues) => {
                this.setData({
                    createDateValue: displayValues,
                })
            },
        })
    }
});