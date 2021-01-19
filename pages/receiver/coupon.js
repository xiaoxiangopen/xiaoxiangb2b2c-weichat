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
    // 获取优惠券
    this.getAddressList();
  },

  /**
   * 获取优惠券
   */
  getAddressList: function () {
    let _this = this;
    App._get('/api/member/receiver/couponList', {}, function (result) {
      _this.setData(result.data);
    });
  },
/**
   * 设置选择的优惠券
   */
  setDefault: function (e) {
    let _this = this;
    // console.log('res.target:'+e.detail.value);
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length-2];//上一页面
    prevPage.setData({//直接给上移页面赋值
      code:e.detail.value
    });
    _this.data.options.from === 'flow' && wx.navigateBack({
      delta:1
    });
    return false;
  },


});