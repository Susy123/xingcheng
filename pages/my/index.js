var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');

Page({
	data: {
    aboutShow: true,
    tabClass: ["", "", "", "", ""]
  },
  
  onLoad: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/notice/list',
      data: {
        type: 'about'
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            about: res.data.data.dataList[0]
          });
        }
      }
    })
	},	
  onShow: function () {
    var that = this;
    // that.getUserInfo();
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/statistics',
      data: { token: app.globalData.token },
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 0) {
          var tabClass = that.data.tabClass;
          if (res.data.data.count_id_no_pay > 0) {
            tabClass[0] = "red-dot",
            wx.showTabBarRedDot({
              index: 3,
            })
          } else {
            tabClass[0] = "",
            wx.hideTabBarRedDot({
              index: 3,
            })
          }
          if (res.data.data.count_id_no_transfer > 0) {
            tabClass[1] = "red-dot"
          } else {
            tabClass[1] = ""
          }
          if (res.data.data.count_id_no_confirm > 0) {
            tabClass[2] = "red-dot"
          } else {
            tabClass[2] = ""
          }
          if (res.data.data.count_id_no_reputation > 0) {
            tabClass[3] = "red-dot"
          } else {
            tabClass[3] = ""
          }
          if (res.data.data.count_id_success > 0) {
            //tabClass[4] = "red-dot"
          } else {
            //tabClass[4] = ""
          }

          that.setData({
            tabClass: tabClass,
          });
        }
      }
    })

    wx.getStorage({
      key: 'shopCarInfo',
      success: function (res) {
        if (res.data.shopNum > 0) {
          wx.showTabBarRedDot({
            index: 2,
          })
        } else {
          wx.hideTabBarRedDot({
            index: 2,
          })
        }
      }
    })
  },
  getAbout: function(e){
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/notice/detail',
      data: {
        id: e.currentTarget.dataset.id
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            aboutShow: false,
            aboutCon: res.data.data
          });
          WxParse.wxParse('article', 'html', res.data.data.content, that, 5);
        }
      }
    })
  },
  close: function () {
    var that = this;
    that.setData({
      aboutShow: true
    });
  },
  getUserInfo: function (cb) {
    var that = this
    wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            that.setData({
              userInfo: res.userInfo
            });
          }
        })
      }
    })
  },
  goorderlist(e) {
    var id = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: "/pages/order-list/index?currentType=" + id
    })
  }

})