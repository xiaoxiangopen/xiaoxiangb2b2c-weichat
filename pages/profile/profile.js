let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    member: {},
    shows:true,
    infoShows:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    // console.log('xx:'+wx.getStorageSync('user_id'));
    if(wx.getStorageSync('user_id')!=''){
      that.setData({
        shows:false,
        infoShows:true
      })
    }else{
      that.setData({
        shows:true,
        infoShows:false
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取当前用户信息
   this.getUserDetail();
  },
  
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

    let _this = this;
    var sh = _this.data.shows;
    _this.setData({
      shows: false
    })

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  /**
 * 获取当前用户信息
 */
  getUserDetail: function () {
    let _this = this;
    App._get('/api/member/index', {}, function (result) {
      _this.setData(result.data);
    });
  },

  /**
   * 订单导航跳转
   */
  onTargetOrder(e) {
    // 记录formid
    let urls = {
      all: '/pages/order/list?status=',
      payment: '/pages/order/list?status=PENDING_PAYMENT',
      received: '/pages/order/list?status=SHIPPED',
      shipped:'/pages/order/list?status=PENDING_SHIPMENT', 
      pending:'/pages/order/list?status=PENDING_REVIEW' 
    };
    // 转跳指定的页面
    wx.navigateTo({
      url: urls[e.currentTarget.dataset.type]
    })
  },

  /**
  * 菜单列表导航跳转
  */
  onTargetMenus(e) {
    // 记录formId
    // App.saveFormId(e.detail.formId);
    wx.navigateTo({
      url: '/' + e.currentTarget.dataset.url
    })
  },
  goUserDetail(e) {
    this.getUserDetail();
  },


goNav(){
  // console.log(wx.getStorageSync('user_id'));
  if(wx.getStorageSync('user_id')==''){
    let url = '../../pages/login/login';
    wx.navigateTo({
      url: url,
    })
  } 
},
  
})