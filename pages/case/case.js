"use strict";
const app = getApp();
var constant = require('../../utils/constant.js');

const SORT_BY_NAME_ASC = 1
const SORT_BY_NAME_DESC = -1
const SORT_BY_ID_ASC = 2
const SORT_BY_ID_DESC = -2
const SORT_BY_CREATE_DATE_ASC = 3
const SORT_BY_CREATE_DATE_DESC = -3
const SORT_BY_COMPLETE_ASC = 4
const SORT_BY_COMPLETE_DESC = -4
const SORT_BY_INFLECT_ASC = 5
const SORT_BY_INFLECT_DESC = -5

Page({
  data: {
    centerId: '',
    isAdmin: false,
    searchValue: '',
    sortType: SORT_BY_NAME_ASC,
    caseList: [],
    selectedCase: {},
    filterItems: [{
        type: 'sort',
        label: '姓名',
        value: 'name',
        groups: ['001'],
      },
      {
        type: 'sort',
        label: 'ID',
        value: 'id',
        groups: ['002'],
      },
      {
        type: 'sort',
        label: '建档日期',
        value: 'create_date',
        groups: ['003'],
      },
      {
        type: 'sort',
        label: '完成度',
        value: 'completeness',
        groups: ['004'],
      },
      {
        type: 'sort',
        label: '感染',
        value: 'infect',
        groups: ['005'],
      },
    ],
  },
  // -------- filter begin -------- //
  onFilterChange(e) {
    const checkedItems = e.detail.checkedItems;
    const params = {};

    checkedItems.forEach((n) => {
      if (n.checked) {
        if (n.value === 'name') {
          params.sort = n.value;
          params.order = n.sort === 1 ? SORT_BY_NAME_ASC : SORT_BY_NAME_DESC
        } else if (n.value === 'id') {
          params.sort = n.value;
          params.order = n.sort === 1 ? SORT_BY_ID_ASC : SORT_BY_ID_DESC
        } else if (n.value === 'create_date') {
          params.sort = n.value;
          params.order = n.sort === 1 ? SORT_BY_CREATE_DATE_ASC : SORT_BY_CREATE_DATE_DESC
        } else if (n.value === 'completeness') {
          params.sort = n.value;
          params.order = n.sort === 1 ? SORT_BY_COMPLETE_ASC : SORT_BY_COMPLETE_DESC
        } else if (n.value === 'infect') {
          params.sort = n.value;
          params.order = n.sort === 1 ? SORT_BY_INFLECT_ASC : SORT_BY_INFLECT_DESC
        }

        this.setData({
          sortType: params.order
        })
        this.requestCaseList(this.data.searchValue, this.data.sortType)
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
  // -------- filter end -------- //
  // -------- search begin -------- //
  onSearchChange(e) {
    this.setData({
      searchValue: e.detail.value,
      sortType: SORT_BY_NAME_ASC
    });
    this.requestCaseList(this.data.searchValue, this.data.sortType)
  },
  onSearchFocus(e) {},
  onSearchBlur(e) {},
  onSearchConfirm(e) {},
  onSearchClear(e) {
    this.setData({
      searchValue: '',
      sortType: SORT_BY_NAME_ASC
    });
    this.requestCaseList(this.data.searchValue, this.data.sortType)
  },
  onSearchCancel(e) {},
  // -------- search end -------- //

  onLoad: function(options) {
    this.setData({
      centerId: options.centerId,
      isAdmin: app.globalData.is_admin
    })
    this.initData()
    this.getCases();
  },
  getCases(params = {}) {
    wx.showLoading();
    this.setData({
      caseList: [{
          patient_name: "李文浩",
          case_no: 'Y1234567',
          create_time: '2018-12-24',
          progress: "100",
          state: 1,
          msis: 1,
          type: "置换术后",
        },
        {
          patient_name: "赵振阳",
          case_no: 'Y1234568',
          create_time: '2018-12-24',
          progress: "30",
          state: 2,
          msis: 3,
          type: "置换术后",
        }
      ]
    });
    wx.hideLoading();
  },

  initData() {
    // wx.showLoading({
    //   title: '请求数据中...',
    // })
    this.requestCaseList()
  },

  requestCaseList(searchValue, sortType) {
    var that = this
    wx.showLoading({
      title: '请求数据中...',
    })
    wx.request({
      url: constant.basePath,
      data: {
        service: 'Case.SearchCaseList',
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
          caseList: res.data.data.list
        })
      },
      fail(res) {
        wx.hideLoading()
      }
    })
  },

  onDele(e) {
    var seletedCase = e.target.dataset.selectedCase
    wx.showModal({
      title: '提示',
      content: '确定删除' + seletedCase.patient_name + "的病历?",
      success(res) {
        if (res.confirm) {
          this.deleCase(seletedCase.case_id)
        } else if (res.cancel) {

        }
      }
    })
  },

  deleCase(caseId) {
    var that = this
    wx.showLoading({
      title: '删除病历中...',
    })
    wx.request({
      url: constant.basePath,
      data: {
        service: 'Case.DeleteCase',
        openid: app.globalData.openid,
        case_id: caseId
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        // console.log(JSON.stringify(res))
        wx.hideLoading()
        that.requestCaseList(that.data.searchValue, that.data.sortType)
      },
      fail(res) {
        wx.hideLoading()
      }
    })
  },

  onApprove(e) {
    var that = this
    var selectedCase = e.target.dataset.selectedCase
    var isApprove = selectedCase.state == 2
    var title = isApprove ? '解锁中...' : '锁定病历中...'
    // 1审批，2解锁
    var type = isApprove ? 2 : 1
    wx.showLoading({
      title: title,
    })
    wx.request({
      url: constant.basePath,
      data: {
        service: 'Case.Approve',
        openid: app.globalData.openid,
        case_id: selectedCase.case_id,
        type: type
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        wx.hideLoading()
        that.requestCaseList(that.data.searchValue, that.data.sortType)
      },
      fail(res) {
        wx.hideLoading()
      }
    })
  },

  onItemClick(e) {
    wx.showLoading({
      title: '鉴权中...',
    })
    var selectedCase = e.target.dataset.selectedCase
    wx.request({
      url: constant.basePath,
      data: {
        service: 'Case.SetCaseWritingStaff',
        openid: app.globalData.openid,
        case_id: selectedCase.case_id
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        wx.hideLoading()
        if (res.data.data.code == 0) {
          wx.navigateTo({
            url: '/case/detail/detail?case_id=' + selectedCase.case_id
          })
        } else {
          wx.showToast({
            title: res.data.data.msg,
          })
        }
      },
      fail(res) {
        wx.hideLoading()
      }
    })
  },
  addCase() {
    wx.navigateTo({
      url: '/case/detail/detail?case_id=0'
    })
  }
});