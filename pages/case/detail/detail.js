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
        typeValue: '置换术后',
        typeTitle: '置换术后',
        partValue: '髋',
        partTitle: '髋',
        mergeValue: '是',
        mergeTitle: '是',
        antibioticValue: '是',
        antibioticTitle: '是',
        createDateValue: ['2018-12-24'],
        focusSpecialEvent: false,
        focusBriefHistory: false,
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
    onClickType: function() {
        $wuxSelect('#selectType').open({
            typeValue: this.data.typeValue,
            options: [
                '置换术后',
                '占位器',
            ],
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        typeValue: value,
                        typeTitle: options[index],
                    })
                }
            },
        });
    },
    onClickPart: function() {
        $wuxSelect('#selectPart').open({
            partValue: this.data.partValue,
            options: [
                '髋',
                '膝',
            ],
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        partValue: value,
                        partTitle: options[index],
                    })
                }
            },
        });
    },
    onClickMerge: function() {
        $wuxSelect('#selectMerge').open({
            mergeValue: this.data.mergeValue,
            options: [
                '是',
                '否',
            ],
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        mergeValue: value,
                        mergeTitle: options[index],
                    })
                }
            },
        });
    },
    onClickAntibiotic: function() {
        $wuxSelect('#selectAntibiotic').open({
            antibioticValue: this.data.antibioticValue,
            options: [
                '是',
                '否',
            ],
            onConfirm: (value, index, options) => {
                if (index !== -1) {
                    this.setData({
                        antibioticValue: value,
                        antibioticTitle: options[index],
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
    },
    onSpecialEventClick: function() {
        this.setData({
            focusSpecialEvent: true
        })
    },
    onBriefHistoryClick: function() {
        this.setData({
            focusBriefHistory: true
        })
    }
});