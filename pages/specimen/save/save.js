"use strict";

import {
    $wuxSelect,
} from '../../../miniprogram_npm/wux-weapp/index'

const app = getApp();
var constant = require('../../../utils/constant.js');
var util = require('../../../utils/util.js');

Page({
    data: {
        value: '',
    },
    onChange(e) {
        console.log('onChange', e)
        this.setData({
            value: e.detail.value,
        })
    },
    onFocus(e) {
        console.log('onFocus', e)
    },
    onBlur(e) {
        console.log('onBlur', e)
    },
    onConfirm(e) {
        console.log('onConfirm', e)
    },
    onClear(e) {
        console.log('onClear', e)
        this.setData({
            value: '',
        })
    },
    onCancel(e) {
        console.log('onCancel', e)
    },
});