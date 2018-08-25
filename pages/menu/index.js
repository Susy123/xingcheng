var app = getApp();
Page({
  data: {
    
  },
  onShow: function () {
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
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/statistics',
      data: { token: app.globalData.token },
      success: (res) => {
        if (res.data.code == 0) {
          if (res.data.data.count_id_no_pay > 0) {
            wx.showTabBarRedDot({
              index: 3,
            })
          } else {
            wx.hideTabBarRedDot({
              index: 3,
            })
          }
        }
      }
    })
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/category/all',
      success: function (res) {
        var categories = [];
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].level == 1) {
              categories.push(res.data.data[i]);
            }
          }
        }
        that.setData({
          categories: categories,
          activeCategoryId: categories[0].id,
          
        });
        that.getGoodsList(categories[0].id);
      }
    })
  },
  getGoodsList: function (categoryId) {
    if (categoryId == 0) {
      categoryId = "";
    }
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/category/all',
      success: function (res) {
        var categoriesdict={}

       
        var categorieslist = [];
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            if (categoryId != '') {
              if (res.data.data[i].pid == categoryId) {
                categorieslist.push(res.data.data[i]);
                
              }
            } else {
              //categorieslist.push(res.data.data[i]);
              if (res.data.data[i].pid != 0) {
                categorieslist.push(res.data.data[i]);
              }
            }
          }
        }
       
        categoriesdict[categoryId] = categorieslist
        /**/
        //console.log(categorieslist)
        that.setData({
          categorieslist: categorieslist,
          categoriesdict: categoriesdict
        });
      }
    })
  },
  tabClick: function (e) {
    this.setData({
      activeCategoryId: e.currentTarget.id
    });
    this.getGoodsList(this.data.activeCategoryId);
  },
  levelClick: function (e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: "/pages/menu-list/index?id=" + e.currentTarget.dataset.id
    })
  }
})