"use strict";
const app = getApp();
var constant = require('../../../utils/constant.js');

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
    staffTempList: [], // 存储数据，搜索清空是恢复数据用
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
      sortType: SORT_BY_NAME_ASC
    })
    this.requestCenterStaffList(e.detail.value, this.data.sortType)
  },
  onSearchFocus(e) {},
  onSearchBlur(e) {},
  onSearchConfirm(e) {},
  onSearchClear(e) {
    this.setData({
      searchValue: '',
      sortType: SORT_BY_NAME_ASC
    });
    this.requestCenterStaffList(this.data.searchValue, this.data.sortType)
  },
  onSearchCancel(e) {},
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
    // console.log(e)
    this.setData({
      visiblePeople: false,
    });
    wx.request({
      url: constant.basePath,
      data: {
        service: 'Center.EditCenterMember',
        openid: app.globalData.openid,
        member_id: that.data.selectedStaff.staff_id,
        role_id: e.detail.value
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        // console.log(JSON.stringify(res))
        wx.hideLoading()
        that.requestCenterStaffList(that.data.searchValue, that.data.sortType)
      },
      fail(res) {
        wx.hideLoading()
      }
    })
  },
  onDele(e) {
    this.setData({
      visiblePeople: false,
    });
    var that = this
    wx.showLoading({
      title: '删除中...',
    })
    wx.request({
      url: constant.basePath,
      data: {
        service: 'Center.DeleteCenterMember',
        openid: app.globalData.openid,
        member_id: that.data.selectedStaff.staff_id
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        // console.log(JSON.stringify(res))
        wx.hideLoading()
        that.requestCenterStaffList(that.data.searchValue, that.data.sortType)
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
    // this.initData();
    this.requestRoleList(this.data.searchValue, this.data.sortType)
    this.getUsers()
  },

  getUsers(params = {}) {
    wx.showLoading();
    this.setData({
      staffList: [{
          staff_avatar: "https://avatars3.githubusercontent.com/u/36479205?s=400&u=cb3d4cf7f58f5cfe4602199485cfec3b60527d08&v=4",
          staff_name: "李文浩",
          center: '骨头中心',
          role_name: '中心管理员',
          auth_time: "2018-12-24"
        },
        {
          staff_avatar: "https://avatars3.githubusercontent.com/u/36479205?s=400&u=cb3d4cf7f58f5cfe4602199485cfec3b60527d08&v=4",
          staff_name: "季大鹏",
          center: '骨头中心',
          role_name: '项目负责人',
          auth_time: "2018-12-24"
        }
      ]
    });
    wx.hideLoading();
  },

  initData() {
    this.requestRoleList()
    this.requestCenterStaffList()
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
        // console.log(JSON.stringify(res))
        that.setData({
          roleList: res.data.data.list
        })
      },
      fail(res) {}
    })
  },

  // 中心人员
  requestCenterStaffList(searchValue, sortType) {
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
        // console.log(JSON.stringify(res))
        wx.hideLoading()
        that.setData({
          staffList: res.data.data.list,
          // staffTempList: res.data.data.list
        })
      },
      fail(res) {
        wx.hideLoading()
      }
    })
  },

});