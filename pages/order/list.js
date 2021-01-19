let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: '',
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.status = options.status || '';
    this.setData({ status: this.data.status });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取订单列表
    this.getOrderList(this.data.status);
  },

  /**
   * 获取订单列表
   */
  getOrderList: function (status) {
    let _this = this;
    App._get('/api/member/order/list', { status }, function (result) {
      _this.setData(result.data);
      result.data.list.length && wx.pageScrollTo({
        scrollTop: 0
      });
    });
  },

  /**
   * 切换标签
   */
  bindHeaderTap: function (e) {
    this.setData({ status: e.target.dataset.type });
    // 获取订单列表
    this.getOrderList(e.target.dataset.type);
  },

  /**
   * 取消订单
   */
  cancelOrder: function (e) {
    let _this = this;
    let orderSn = e.currentTarget.dataset.id;
    wx.showModal({
      title: "提示",
      content: "确认取消订单？",
      success: function (o) {
        if (o.confirm) {
          App._post_form('/api/member/order/cancel', { orderSn }, function (result) {
            _this.getOrderList(_this.data.status);
          });
        }
      }
    });
  },

  /**
   * 确认收货
   */
  receipt: function (e) {
    let _this = this;
    let orderSn = e.currentTarget.dataset.id;
    wx.showModal({
      title: "提示",
      content: "确认收到商品？",
      success: function (o) {
        if (o.confirm) {
          App._post_form('/api/member/order/receive', { orderSn }, function (result) {
            _this.getOrderList(_this.data.status);
          });
        }
      }
    });
  },

  /**
   * 发起付款
   */
  payOrder: function (e) {
    let _this = this;
    let orderSn = e.currentTarget.dataset.id;

    // 显示loading
    wx.showLoading({ title: '正在处理...', });
    App._post_form('/api/member/order/payment', { orderSn }, function (result) {
      if (result.code === -10) {
        App.showError(result.msg);
        return false;
      }
      // 发起微信支付
      wx.requestPayment({
        timeStamp: result.data.timeStamp,
        nonceStr: result.data.nonceStr,
        package: result.data.packageValue,
        signType: result.data.signType,
        paySign: result.data.paySign,
        success: function (res) {
          // 跳转到已付款订单
          wx.navigateTo({
            url: '../order/view?orderSn=' + orderSn
          });
        },
        fail: function () {
          App.showError('订单未支付');
        },
      });
    });
  },

  /**
   * 跳转订单详情页
   */
  detail: function (e) {
    let orderSn = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../order/view?orderSn=' + orderSn
    });
  },



  /**
   * 余额支付
   */
  payAmount: function (e) {
    let _this = this;
    let orderId = e.currentTarget.dataset.id;
 
    wx.showModal({
      title: '提示',
      content: '确认使用余额付款?',
      success: function (res) {
          if (res.confirm) {
            App._post_form('/api/member/order/payAmount', { orderId }, function (result) {
              if (result.data.type != 1) {
                App.showError(result.data.msg);
                return false;
              }else{
                // 跳转到已付款订单
                wx.navigateTo({
                  url: '../order/view?orderSn=' + orderId
                });
              }
          
            });
          }
        }
      })

  },


  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }

});