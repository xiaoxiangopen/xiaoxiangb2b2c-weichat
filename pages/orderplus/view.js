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
    this.getOrderDetail(options.orderId);
  },

  /**
   * 获取订单详情
   */
  getOrderDetail: function (orderId) {
    let _this = this;
    App._get('/api/member/order/historyView', { orderId }, function (result) {
      _this.setData(result.data);
    });
  },


});