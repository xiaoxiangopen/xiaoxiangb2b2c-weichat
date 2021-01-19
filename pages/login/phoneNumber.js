let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    session_key: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.session_key =options.session_key;
  },

  getPhoneNumber: function (e) {
    let _this = this;
    if ("getPhoneNumber:ok" != e.detail.errMsg){
      _this.navigateBack();
      return;
    }
    var iv = e.detail.iv;
    var encryptedData = e.detail.encryptedData;
    var session_key = this.data.session_key;
    var userId=wx.getStorageSync('user_id');
    // console.log(wx.getStorageSync('user_id'));
    // 发送用户信息
    App._post_form('/api/social_phone/getPhone'
    , {
      encryptedData: encryptedData,
      iv:iv,
      session_key:session_key,
      userId:userId
    }
    , function (result) {
      // wx.setStorageSync('token', result.data.token);
      // wx.setStorageSync('user_id', result.data.member.id);
      console.log(result);
      // 跳转回原页面
      _this.navigateBack();
    }
    , false
    , function () {
      wx.hideLoading();
    });
  },

  /**
   * 授权成功 跳转回原页面
   */
  navigateBack: function () {
    wx.navigateBack();
    let currentPage = wx.getStorageSync('currentPage');
    if(currentPage==''){
      wx.switchTab({
        url: '../../pages/profile/profile'
      });
    }else{
      // console.log('currentPage:'+currentPage.route);
      wx.switchTab({
        url: '../../' + currentPage.route
      });
    }
   
  },
})