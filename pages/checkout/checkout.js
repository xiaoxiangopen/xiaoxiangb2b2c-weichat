let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav_select: false, // 快捷导航
    options: {}, // 当前页面参数

    receiver: null, // 默认收货地址
    existReceiver: false, // 是否存在收货地址
    goods: {}, // 商品信息

    disabled: false,

    hasError: false,
    error: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 当前页面参数
    this.data.options = options;
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取当前订单信息
    this.getOrderData();
  },

  /**
   * 获取当前订单信息
   */
  getOrderData: function () {

    let _this = this,
     options = _this.data.options;
     console.log(_this.data.code);
    // 获取订单信息回调方法
    let callback = function (result) {
      if (result.status !== 200) {
        App.showError(result.message);
        return false;
      }
      // 显示错误信息
      if (result.data.has_error) {
        _this.data.hasError = true;
        _this.data.error = result.data.error_msg;
        App.showError(_this.data.error);
      }
      _this.setData(result.data);
    };

    // 立即购买
    if (options.order_type === 'buyNow') {
      App._get('/api/member/order/checkout', {
        quantity: options.quantity,
        skuId: options.skuId,
        code: _this.data.code
      }, function (result) {
        callback(result);
      });
    }

    // 购物车结算
    else if (options.order_type === 'cart') {
      App._get('/api/member/order/checkout', {
        code: _this.data.code
      }, function (result) {
        callback(result);
      });
    }

  },

  /**
   * 选择收货地址
   */
  selectAddress: function () {
    wx.navigateTo({
      url: '../receiver/' + (this.data.existReceiver ? 'list?from=flow' : 'add')
    });
  },


  /**
   * 订单提交
   */
  submitOrder: function () {
    let _this = this,
      options = _this.data.options;
      // console.log('_this.data.disabled：'+_this.data.disabled);
    if (_this.data.disabled) {
      return false;
    }
    _this.data.disabled = true;
    if (_this.data.hasError) {
      App.showError(_this.data.error);
      return false;
    }

    // 订单创建成功后回调--微信支付
    let callback = function (result) {

        //限制区域提交返回
        if (result.status == 510) {
          App.showError(result.message);
          return false;
        }
        
       //余额满额支付不需要调用微信支付
      if (result.status == 511) {
        wx.redirectTo({
          // url: '../order/view?orderSn=' + result.data.orderSn,
          url: '../order/list',
        });
        return false;
      }

      if (result.status !== 200) {
        App.showError(result.message, function () {
          // 跳转到未付款订单
          wx.redirectTo({
            url: '../order/list?type=payment',
          });
        });
        return false;
      }
      // 发起微信支付
      wx.requestPayment({
        timeStamp: result.data.timeStamp,
        nonceStr: result.data.nonceStr,
        package: result.data.packageValue,
        signType: result.data.signType,
        paySign: result.data.paySign,
        success: function (res) {
          // 跳转到订单详情
          wx.redirectTo({
            // url: '../order/view?orderSn=' + result.data.orderSn
            url: '../order/list',
          });
        },
        fail: function () {
          App.showError('订单未支付', function () {
            // 跳转到未付款订单
            wx.redirectTo({
              url: '../order/list?status=PENDING_PAYMENT',
            });
          });
        },
      });
    };

    // 按钮禁用, 防止二次提交
    _this.data.disabled = true;

    // 显示loading
    wx.showLoading({
      title: '正在处理...'
    });

    // 创建订单-立即购买
    if (options.order_type === 'buyNow') {
      let _this = this;
      App._post_form('/api/member/order/create', {
        quantity: options.quantity,
        skuId: options.skuId,
        balance:_this.data.balance,
        code: _this.data.code,
        invoiceTitle: _this.data.invoiceTitle,
        invoiceTaxNumber: _this.data.invoiceTaxNumber,
        memo: _this.data.memo
      }, function (result) {
        // success
        console.log('success');
        callback(result);
      }, function (result) {
        // fail
        console.log('fail');
      }, function () {
        // complete
        console.log('complete');
        // 解除按钮禁用
        _this.data.disabled = false;
      });
    }

    // 创建订单-购物车结算
    else if (options.order_type === 'cart') {
      let _this = this;
      console.log('success:'+_this.data.invoiceTitle);
      App._post_form('/api/member/order/create', {
        balance:_this.data.balance,
        code: _this.data.code,
        invoiceTitle: _this.data.invoiceTitle,
        invoiceTaxNumber: _this.data.invoiceTaxNumber,
        memo: _this.data.memo
      }, function (result) {
        // success
        console.log('success');
        callback(result);
      }, function (result) {
        // fail
        console.log('fail');
      }, function () {
        // complete
        console.log('complete');
        // 解除按钮禁用
        _this.data.disabled = false;
      });
    }

  },
  checkboxChange: function (e) {

    let _this = this;
    var am=_this.data.amountPayable;
    if(e.detail.value!=""){
      //待付钱
      var d=e.detail.value-am>=0?am:e.detail.value;
      //已付钱
      var y=_this.data.amount -d;
      this.setData({
        amountPayable:y ,
        balance:d
      })
    }else{
      this.setData({
        amountPayable:_this.data.amount,
        balance:0
      })
    }

 
  },

  share: function () {
    let _this = this;
    var sh = _this.data.shows;
    _this.setData({
      shows: !sh
    })
  },

  getInvoiceTitle: function (e) {
    // console.log('complete：'+e.detail.value);
    let _this = this;
    _this.data.invoiceTitle=e.detail.value;
  },
  getInvoiceTaxNumber: function (e) {
    // console.log('complete：'+e.detail.value);
    let _this = this;
    _this.data.invoiceTaxNumber=e.detail.value;
  },
  getMemo: function (e) {
    // console.log('complete：'+e.detail.value);
    let _this = this;
    _this.data.memo=e.detail.value;
  },

});