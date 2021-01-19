let App = getApp();

Page({
  data: {
    list: [],
    defaultId: null,
  },

  onLoad: function (options) {
    // 当前页面参数
    this.data.options = options;
  },

  onShow: function () {
    // 获取收货地址列表
    this.getAddressList();
  },

  /**
   * 获取收货地址列表
   */
  getAddressList: function () {
    let _this = this;
    App._get('/api/member/receiver/list', {}, function (result) {
      _this.setData(result.data);
    });
  },

  /**
   * 添加新地址
   */
  createAddress: function () {
    wx.navigateTo({
      url: './add'
    });
  },

  /**
   * 编辑地址
   */
  editAddress: function (e) {
    wx.navigateTo({
      url: "./edit?receiverId=" + e.currentTarget.dataset.id
    });
  },

  /**
   * 移除收货地址
   */
  removeAddress: function (e) {
    let _this = this,
      receiverId = e.currentTarget.dataset.id;
    wx.showModal({
      title: "提示",
      content: "您确定要移除当前收货地址吗?",
      success: function (o) {
        o.confirm && App._post_form('/api/member/receiver/delete', {
          receiverId
        }, function (result) {
          _this.getAddressList();
        });
      }
    });
  },

  /**
   * 设置为默认地址
   */
  setDefault: function (e) {
    let _this = this,
      receiverId = e.detail.value;
    _this.setData({
      defaultId: parseInt(receiverId)
    });
    App._post_form('/api/member/receiver/update_default', {
       receiverId
    }, function (result) {
      _this.data.options.from === 'flow' && wx.navigateBack();
    });
    return false;
  },

});