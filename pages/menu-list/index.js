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
  onLoad: function (e) {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/category/all',
      success: function (res) {
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].id == e.id) {
              that.setData({
                categorie: res.data.data[i]
              });
            }
          }
        }
      }
    })
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/list',
      data: {
        categoryId: e.id
      },
      success: function (res) {
        var goods = [];
        for (var i = 0; i < res.data.data.length; i++) {
          goods.push(res.data.data[i]);
        }
        that.setData({
          goods: goods,
        });
      }
    })
  }

})
