let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderSn: null,
    order: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.orderSn = options.orderSn;
    this.getOrderDetail(options.orderSn);
  },

  /**
   * 获取订单详情
   */
  getOrderDetail: function (orderSn) {
    let _this = this;
    App._get('/api/member/order/view', { orderSn }, function (result) {
      _this.setData(result.data);
    });
  },

  /**
   * 跳转到商品详情
   */
  goodsDetail: function (e) {
    let goods_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../product/detail?productId=' + goods_id
    });
  },

  /**
   * 取消订单
   */
  cancel: function (e) {
    let _this = this;
    let orderSn = _this.data.orderSn;
    wx.showModal({
      title: "提示",
      content: "确认取消订单？",
      success: function (o) {
        if (o.confirm) {
          App._post_form('/api/member/order/cancel', { orderSn }, function (result) {
            wx.navigateBack();
          });
        }
      }
    });
  },

  /**
   * 发起付款
   */
  payment: function (e) {
    let _this = this;
    let orderSn = _this.data.orderSn;

    // 显示loading
    wx.showLoading({ title: '正在处理...', });
    App._post_form('/api/member/order/payment', { orderSn }, function (result) {
      if (result.status === 500) {
        App.showError(result.message);
        return false;
      }
      console.log(result);
      
      // 发起微信支付
      wx.requestPayment({
        timeStamp: result.data.timeStamp,
        nonceStr: result.data.nonceStr,
        package: result.data.packageValue,
        signType: result.data.signType,
        paySign: result.data.paySign,
        success: function (res) {
          _this.getOrderDetail(orderSn);
        },
        fail: function () {
          App.showError('订单未支付');
        },
      });
    });
  },

  /**
   * 确认收货
   */
  receive: function (e) {
    let _this = this;
    let orderSn = _this.data.orderSn;
    wx.showModal({
      title: "提示",
      content: "确认收到商品？",
      success: function (o) {
        if (o.confirm) {
          App._post_form('/api/member/order/receive', { orderSn }, function (result) {
            _this.getOrderDetail(orderSn);
          });
        }
      }
    });
  },


});