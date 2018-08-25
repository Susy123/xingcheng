var app = getApp();
Page({
  data: {
    autoplay: true,
    interval: 6000,
    duration: 500,
    favicon: {},
    goodsDetail: {},
    shopCarInfo:{},
    //propertyChildIds: {},
    //propertyChildNames: {},
    prices:{},
  },
  
  onLoad: function () {
    this.onShow();
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        });
      }
    })
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/config/get-value',
      data: {
        key: 'HotName'
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            HotName: res.data.data
          });
        }
      }
    })
    setTimeout(function () {
      wx.request({
        url: 'https://api.it120.cc/' + app.globalData.subDomain + '/banner/list',
        data: {
          key: 'mallName',
          type: 'newcoupons'
        },
        success: function (res) {
          if (res.data.code == 0) {
            wx.request({
              url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/fetch',
              data: {
                id: res.data.data[0].remark,//优惠券id
                token: app.globalData.token,
                detect: true
              },
              success: function (res) {
                
                that.setData({
                  detect: res.data.code
                });
              }
            });
            that.setData({
              newcoupons: res.data.data
            });
          }
        }
      })
    }, 1000)
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/list',
      data: {
        recommendStatus: 1
      },
      success: function (res) {
        that.setData({
          goods: [],
          loadingMoreHidden: true
        });
        var goods = [];
        var ids = []
        var favicon = that.data.favicon
        for (var i = 0; i < res.data.data.length; i++) {
          goods.push(res.data.data[i]);
          ids.push(res.data.data[i].id)
          favicon[res.data.data[i].id] = 0
          that.setgoods(res.data.data[i].id)
        }
        that.setData({
          goods: goods,
          favicon: favicon,
        });
        setTimeout(function () {
          that.setids(ids)
        }, 1000
        )
      }
    })
  },
  onShow: function () {
    var that=this
    wx.getStorage({
      key: 'shopCarInfo',
      success: function (res) {
        
        if(res.data){
          that.data.shopCarInfo=res.data
          
          if (res.data.shopNum > 0) {
            wx.showTabBarRedDot({
              index: 2,
            })
          } else {
            wx.hideTabBarRedDot({
              index: 2,
            })
          } 

        }else {
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
  setgoods:function(e){
    var that=this
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/detail',
      data: {
        id: e
      },
      success: function (res) {
        
        var goodsDetail=that.data.goodsDetail;
        goodsDetail[e]= res.data.data
        
        if (res.data.data.properties) {
          
          var id = res.data.data.properties[0].id
          var name = res.data.data.properties[0].name
          var childs = res.data.data.properties[0].childsCurGoods;
          var cid = childs[0].id
          var cname = childs[0].name
          var propertyChildIds = id + ":" + cid;
          that.getgg(propertyChildIds, e)
        }
        
        that.setData({
          goodsDetail: goodsDetail,
         
        });
      
      }
    })
  },
  getHotTap: function (e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },
  setids: function (e) {
    var that=this
    var favicon = that.data.favicon
    for (var i = 0; i < e.length; i++) {
      that.getfav(e[i])
    }
  },
  getCouponsTap: function (e) {
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/fetch',
      data: {
        id: e.currentTarget.dataset.id,
        token: app.globalData.token
      },
      success: function (res) {
        
        if (res.data.code == 0) {
          wx.showToast({
            title: '领取成功', 
            icon: 'success',
            image: '../../images/Coupons-icon-o.png',
            duration: 2000
          });
        }else{
          wx.showToast({
            title: '已经领取过了',
            icon: 'success',
            image: '../../images/Coupons-icon-f.png',
            duration: 2000
          });
        }
      }
    })
  },
  getfav: function (e) {
    
    var that = this;
    
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/fav/list',
      data: {
        //nameLike: this.data.goodsDetail.basicInfo.name,
        token: app.globalData.token
      },
      success: function (res) {
        
        var favicon = that.data.favicon
        if (res.data.code == 0 && res.data.data.length) {
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].goodsId == e) {
              
              favicon[e]=1
            }else{
              favicon[e] = 0
            }

          }
          
          that.setData({
            favicon: favicon
          });
        }
      }
    })
  },
  
  fav: function (e) {
   
    var that = this;
    
    var fid = e.currentTarget.dataset.id;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/fav/add',
      data: {
        goodsId: fid,
        token: app.globalData.token
      },
      success: function (res) {
        var favicon = that.data.favicon
        if (res.data.code == 0) {
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            image: '../../images/Cool-love-o.png',
            duration: 2000
          })
          favicon[fid]=1
          that.setData({
            favicon: favicon
          });
        }
      }
    })
  },
  del: function (e) {
    
    var that = this;
   
    var fid = e.currentTarget.dataset.id;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/fav/delete',
      data: {
        goodsId: fid,
        token: app.globalData.token
      },
      success: function (res) {
        var favicon = that.data.favicon
        if (res.data.code == 0) {
          wx.showToast({
            title: '取消收藏',
            icon: 'success',
            image: '../../images/Cool-love.png',
            duration: 2000
          })
          favicon[fid]=0
          that.setData({
            favicon: favicon
          });
        }
      }
    })
  },
 
  addShopCar: function (e) {
    var gid = e.currentTarget.dataset.id
    //组建购物车
    var shopCarInfo = this.bulidShopCarInfo(gid);
    
    this.setData({
      shopCarInfo: shopCarInfo,
      //shopNum: shopCarInfo.shopNum
    });
    // 写入本地存储
    wx.setStorage({
      key: "shopCarInfo",
      data: shopCarInfo
    })
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      duration: 2000
    })
    wx.showTabBarRedDot({
      index: 2,
    })
  },
  bulidShopCarInfo: function (e) {
    
    var shopCarInfo = this.data.shopCarInfo;
    if (!shopCarInfo.shopList){
      shopCarInfo.shopList = []
    }
    var shopCarMap = {};
    shopCarMap.goodsId = this.data.goodsDetail[e].basicInfo.id;
    shopCarMap.pic = this.data.goodsDetail[e].basicInfo.pic;
    shopCarMap.name = this.data.goodsDetail[e].basicInfo.name;
    
    if (!this.data.goodsDetail[e].properties){
      var id=''
      var name = ''
      var childs = ''
    }else{
      var id = this.data.goodsDetail[e].properties[0].id
      var name = this.data.goodsDetail[e].properties[0].name
      var childs = this.data.goodsDetail[e].properties[0].childsCurGoods;
    }
    if (!childs[0]){
      var cid =''
      var cname = ''
    }else{
      var cid = childs[0].id
      var cname = childs[0].name//
    }
  
    var aid=''
    var aname=''
    if (id!=''){
      aid=id + ":" + cid
      aname = name + ":" + cname
    }
    shopCarMap.propertyChildIds = aid;
    
    shopCarMap.label = aname;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = 1;
    shopCarMap.logisticsType = this.data.goodsDetail[e].basicInfo.logisticsId;
    shopCarMap.logistics = this.data.goodsDetail[e].logistics;
    if (this.data.goodsDetail[e].basicInfo.minPrice > 0) {
      shopCarMap.price = this.data.goodsDetail[e].basicInfo.minPrice
    } else {
      shopCarMap.price = this.data.goodsDetail[e].basicInfo.originalPrice
    }
   
    if (this.data.goodsDetail[e].properties){
      shopCarMap.price = this.data.prices[e]
    }
   
    shopCarMap.weight = this.data.goodsDetail[e].basicInfo.weight;
    shopCarInfo.shopList.push(shopCarMap);
    return shopCarInfo;
   
  },
  getgg: function (ids,id){
    var that=this
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/price',
      data: {
        goodsId: id,
        propertyChildIds: ids
      },
      success: function (res) {
        var prices = that.data.prices
        prices[id] = res.data.data.price
        that.setData({
          prices: prices,
         
        });
      }
    })
  },
})
