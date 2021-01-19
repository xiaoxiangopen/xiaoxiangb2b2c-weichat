let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartItems: [], // 商品列表
    quantity: 0,
    effectivePrice: 0,
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
    this.getCartList();
  },

  /**
   * 获取购物车列表
   */
  getCartList: function () {
    let _this = this;
    App._get('/api/cart/get_current', {}, function (result) {
      _this.setData(result.data);
    });
  },

  /**
   * 递增指定的商品数量
   */
  addCount: function (e) {
    let _this = this,
      index = e.currentTarget.dataset.index,
      skuId = e.currentTarget.dataset.skuId,

      item = _this.data.cartItems[index],
      effectivePrice = _this.data.effectivePrice;
    // 后端同步更新
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    App._post_form('/api/cart/modify', {
      quantity: ++item.quantity,
      skuId: skuId
    }, function () {
      // _this.setData({
      //   ['cartItems[' + index + ']']: item,
      //   effectivePrice: _this.mathadd(effectivePrice, item.price)
      // });
      _this.getCartList();
    
    });
  },

  /**
   * 递减指定的商品数量
   */
  minusCount: function (e) {
    let _this = this,
      index = e.currentTarget.dataset.index,
      skuId = e.currentTarget.dataset.skuId,

      item = _this.data.cartItems[index],
      effectivePrice = _this.data.effectivePrice;
    if (item.quantity > 1) {
      // 后端同步更新
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      App._post_form('/api/cart/modify', {
        quantity: --item.quantity,
        skuId: skuId
      }, function () {
        // item.quantity > 0 && _this.setData({
        //   ['cartItems[' + index + ']']: item,
        //   effectivePrice: _this.mathsub(effectivePrice, item.price)
        //   });
        _this.getCartList();
      });

    }
  },

  /**
   * 删除商品
   */
  remove: function (e) {
    let _this = this,
      skuId = e.currentTarget.dataset.skuId;
    wx.showModal({
      title: "提示",
      content: "您确定要移除当前商品吗?",
      success: function (e) {
        e.confirm && App._post_form('/api/cart/remove', {
          skuId: skuId
        }, function (result) {
          _this.getCartList();
        });
      }
    });
  },

  /**
   * 购物车结算
   */
  submit: function (t) {
    wx.navigateTo({
      url: '../checkout/checkout?order_type=cart'
    });
  },

  /**
   * 加法
   */
  mathadd: function (arg1, arg2) {
    return (Number(arg1) + Number(arg2)).toFixed(2);
  },

  /**
   * 减法
   */
  mathsub: function (arg1, arg2) {
    return (Number(arg1) - Number(arg2)).toFixed(2);
  },

  /**
   * 去购物
   */
  goShopping: function () {
    wx.switchTab({
      url: '../index/index',
    });
  },

  checkboxChange: function(e) {
    let _this = this;
    // console.info("index:"+_this.data.id);
    // console.info("index:"+e.detail.value);
    App._get('/api/cart/updateBuy?cartItemId='+e.detail.value+"&&cartId="+_this.data.id, {}, function (result) {
      _this.getCartList();
    });
   
  },


})