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
    let _this = this;
    // 商品id
    _this.data.roomId = options.roomId;
    _this.navigateBack();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
 
  },

  /**
   * 授权成功 跳转回原页面
   */
  navigateBack: function () {
    let _this = this;
    let roomId = _this.data.roomId;
    let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/zhibo/index', pid: 1 }))  ;
    _this.data.customParams=customParams;
    wx.navigateTo({
        url: 'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id='+roomId+'&custom_params='+customParams
    })
  },

})