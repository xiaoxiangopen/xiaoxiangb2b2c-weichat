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
    this.getOrderList();
  },

  /**
   * 获取订单列表
   */
  getOrderList: function () {
    let _this = this;
    App._get('/api/member/order/historyList', {  }, function (result) {
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
   * 跳转订单详情页
   */
  detail: function (e) {
    let orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../orderplus/view?orderId=' + orderId
    });
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }

});