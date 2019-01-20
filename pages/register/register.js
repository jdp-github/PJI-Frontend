"use strict";
import {
  $wuxSelect,
  $wuxToast,
  $wuxLoading
} from '../../miniprogram_npm/wux-weapp/index'

var app = getApp();
var constant = require('../../utils/constant.js');
const isTel = (value) => !/^1[34578]\d{9}$/.test(value);

Page({
  data: {
    name: '',
    telValue: '',
    email: '',
    centerObjList: [],
    centValueList: [],
    centerValue: '',
    centerIndex: '',
    roleObjList: [],
    roleValueList: [],
    roleValue: '',
    roleIndex: '',
    requestReason: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.showLoading()
    // 中心列表
    wx.request({
      url: constant.basePath,
      data: {
        service: 'Center.GetCenterList'
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log("Center.GetCenterList:" + JSON.stringify(res))
        that.hideLoading()
        if (res.data.data.code == constant.response_success) {
          that.setData({
            centerObjList: res.data.data.list
          })

          for (var i = 0, len = that.data.centerObjList.length; i < len; i++) {
            that.data.centValueList[i] = that.data.centerObjList[i].name
          }
          that.setData({
            centValueList: that.data.centValueList
          })
        }
      },
      fail(res) {
        that.hideLoading()
      }
    })
    // 角色列表
    wx.request({
      url: constant.basePath,
      data: {
        service: 'Center.GetCenterRole'
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log("Center.GetCenterRole:" + JSON.stringify(res))
        that.hideLoading()
        if (res.data.data.code == constant.response_success) {
          that.setData({
            roleObjList: res.data.data.list
          })
          console.log(JSON.stringify(that.data.roleObjList))
          for (var i = 0, len = that.data.roleObjList.length; i < len; i++) {
            that.data.roleValueList[i] = that.data.roleObjList[i].name
          }
          that.setData({
            roleValueList: that.data.roleValueList
          })
        }
      },
      fail(res) {
        that.hideLoading()
      }
    })
  },

  onCenterClick() {
    $wuxSelect('#wux-center').open({
      value: this.data.centerValue,
      options: this.data.centValueList,
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            centerValue: value,
            centerIndex: index,
          })
        }
      },
    });
  },
  onRoleClick() {
    $wuxSelect('#wux-role').open({
      value: this.data.roleValue,
      options: this.data.roleValueList,
      onConfirm: (value, index, options) => {
        if (index !== -1) {
          this.setData({
            roleValue: value,
            roleIndex: index,
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
  onReasonFocus() {
    $wuxSelect('#wux-center').close();
    $wuxSelect('#wux-role').close();
  },

  onRegisterClick() {
    if (this.data.name.length == 0) {
      this.showToast("请输入姓名")
      return
    }
    if (this.data.telValue.length == 0) {
      this.showToast("请输入电话")
      return
    }
    if (this.data.telError) {
      this.showToast("请输入正确的电话")
      return
    }
    if (this.data.centerValue.length == 0) {
      this.showToast("请选择所属中心")
      return
    }
    if (this.data.roleValue.length == 0) {
      this.showToast("请选择中心角色")
      return
    }

    this.register()
  },

  register() {
    var that = this
    wx.showLoading({
      title: '提交申请中...',
    })

    wx.request({
      url: constant.basePath,
      data: {
        service: 'Staff.Apply',
        avatar: app.globalData.avatarUrl,
        name: that.data.name,
        phone: that.data.telValue,
        email: that.data.email,
        center_id: that.data.centerObjList[that.data.centerIndex].id,
        role_id: that.data.roleObjList[that.data.roleIndex].id,
        apply_reason: that.data.requestReason,
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log("Staff.Apply:" + JSON.stringify(res))
        wx.hideLoading()
        console.log(JSON.stringify(res))
        if (res.data.data.code == constant.response_success) {
          that.showToast('申请提交成功，需上级审批，请耐心等待')
          wx.navigateBack({
            delta: 2
          })

        } else {
          that.showToast(res.data.data.msg)
        }
      },
      fail(res) {
        wx.hideLoading()
      }
    })
  },

  showToast(msg) {
    $wuxToast().show({
      duration: 1500,
      color: '#fff',
      text: msg
    })
  },

  showLoading() {
    this.$wuxLoading = $wuxLoading()
    this.$wuxLoading.show({
      text: '数据加载中',
    })
  },

  hideLoading() {
    setTimeout(() => {
      this.$wuxLoading.hide()
    }, 1500)
  }
});