//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
  },

  toDetailsTap: function (e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },
  onShow: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/fav/list',
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            favList: res.data.data,
            loadingMoreHidden: true
          });
        } else if (res.data.code == 404) {
          that.setData({
            favList: null,
            loadingMoreHidden: false
          });
        }
      }
    })
  }
})