"use strict";
const app = getApp();
var constant = require('../../../utils/constant.js');
var util = require('../../../utils/util.js');

const SORT_BY_NAME_ASC = 1
const SORT_BY_NAME_DESC = -1
const SORT_BY_DATE_ASC = 4
const SORT_BY_DATE_DESC = -4

Page({
  data: {
    isAdmin: 0,
    centerId: '',
    searchValue: '',
    sortType: SORT_BY_NAME_ASC,
    roleList: [],
    staffList: [],
    selectedStaff: {},
    visiblePeople: false,
    filterItems: [{
        type: 'sort',
        label: '姓名',
        value: 'name',
        groups: ['001'],
      },
      {
        type: 'sort',
        label: '授权日期',
        value: 'authorization_date',
        groups: ['004'],
      },
    ],
  },

  // ------------- filter begin ------------- //
  onFilterChange(e) {
    const checkedItems = e.detail.checkedItems;
    const params = {};

    checkedItems.forEach((n) => {
      if (n.checked) {
        if (n.value === 'name') {
          params.sort = n.value;
          params.order = n.sort === 1 ? SORT_BY_NAME_ASC : SORT_BY_NAME_DESC
        } else if (n.value === 'authorization_date') {
          params.sort = n.value;
          params.order = n.sort === 1 ? SORT_BY_DATE_ASC : SORT_BY_DATE_DESC
        }
        this.setData({
          sortType: params.order
        })
        this.requestCenterStaffList(this.data.searchValue, this.data.sortType)
      }
    });
  },

  onFilterOpen(e) {
    this.setData({
      pageStyle: 'height: 100%; overflow: hidden',
    })
  },
  onFilterClose(e) {
    this.setData({
      pageStyle: '',
    })
  },
  // ------------- filter end ------------- //

  // ------------- search begin ------------- //
  onSearchChange(e) {
    this.setData({
      searchValue: e.detail.value,
    //   sortType: SORT_BY_NAME_ASC
    })
    this.requestCenterStaffList(e.detail.value, this.data.sortType)
  },
  onSearchFocus(e) {},
  onSearchBlur(e) {},
  onSearchConfirm(e) {},
  onSearchClear(e) {
    this.setData({
      searchValue: '',
    //   sortType: SORT_BY_NAME_ASC
    });
    this.requestCenterStaffList(this.data.searchValue, this.data.sortType)
  },
  onSearchCancel(e) {
    this.onSearchClear()
  },
  // ------------- search end ------------- //

  // ------------- pop begin ------------- //
  operationBtn(e) {
    // console.log(e)
    this.setData({
      visiblePeople: true,
      selectedStaff: e.target.dataset.staff
    });
  },
  onPopClose(e) {
    this.setData({
      visiblePeople: false,
    });
  },
  onRoleChange(e) {
    this.setData({
      visiblePeople: false
    });
    var that = this
    wx.request({
      url: constant.basePath,
      data: {
        service: 'Center.EditCenterMember',
        openid: app.globalData.openid,
        member_id: that.data.selectedStaff.member_id,
        role_id: e.detail.value
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log("Center.EditCenterMember:" + JSON.stringify(res))
        wx.hideLoading()
        if (res.data.data.code == constant.response_success) {
          that.requestCenterStaffList(that.data.searchValue, that.data.sortType)
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.data.msg,
          })
        }
      },
      fail(res) {
        wx.hideLoading()
      }
    })
  },
  onDele(e) {
    this.setData({
      visiblePeople: false
    });
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定删除' + that.data.selectedStaff.staff_name + "?",
      success(res) {
        if (res.confirm) {
          that.deleStaff()
        } else if (res.cancel) {

        }
      }
    })
  },

  deleStaff() {
    var that = this
    wx.showLoading({
      title: '删除中...',
    })
    wx.request({
      url: constant.basePath,
      data: {
        service: 'Center.DeleteCenterMember',
        openid: app.globalData.openid,
        member_id: that.data.selectedStaff.member_id
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log("Center.DeleteCenterMember:" + JSON.stringify(res))
        wx.hideLoading()
        if (res.data.data.code == constant.response_success) {
          that.requestCenterStaffList(that.data.searchValue, that.data.sortType)
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.data.msg,
          })
        }
      },
      fail(res) {
        wx.hideLoading()
      }
    })
  },
  // ------------- pop end ------------- //

  onLoad: function(options) {
    this.setData({
      centerId: options.centerId,
      isAdmin: app.globalData.is_admin
    })
    this.initData();
  },

  onPullDownRefresh() {
    this.initData()
  },

  initData() {
    this.requestRoleList()
    this.requestCenterStaffList(this.data.searchValue, this.data.sortType)
  },

  // 角色列表
  requestRoleList() {
    var that = this
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
        if (res.data.data.code == constant.response_success) {
          that.setData({
            roleList: res.data.data.list
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.data.msg,
          })
        }

      },
      fail(res) {}
    })
  },

  // 中心人员
  requestCenterStaffList(searchValue, sortType) {
    // debugger
    var that = this
    wx.showLoading({
      title: '请求数据中...',
    })
    wx.request({
      url: constant.basePath,
      data: {
        service: 'Center.SearchCenterMember',
        center_id: that.data.centerId,
        keyword: searchValue,
        sort: sortType
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log("Center.SearchCenterMember:" + JSON.stringify(res))
        wx.hideLoading()
        wx.stopPullDownRefresh()
        if (res.data.data.code == constant.response_success) {
          for (var i = 0, len = res.data.data.list.length; i < len; i++) {
            var staff = res.data.data.list[i]
            staff.auth_time = util.formatTime(staff.auth_time, 'Y-M-D')
          }
          that.setData({
            staffList: res.data.data.list
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.data.msg,
          })
        }
      },
      fail(res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    })
  },

});