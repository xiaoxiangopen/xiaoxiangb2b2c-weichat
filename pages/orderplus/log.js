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
    App._get('/api/member/member_deposit/log', {  }, function (result) {
      _this.setData(result.data);
      result.data.list.length && wx.pageScrollTo({
        scrollTop: 0
      });
    });
  },
 

});