let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取当前地址信息
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取当前用户信息
   this.getUserDetail();
  },
   /**
 * 获取当前用户信息
 */
getUserDetail: function () {
  let _this = this;
  App._post_form('/api/zhibo/getZhiboList', {
      start:0,
      limit:20
  }, function (result) {
    _this.setData(result.data);
  });
},

})