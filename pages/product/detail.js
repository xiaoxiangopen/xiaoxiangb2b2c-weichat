let App = getApp(),
  wxParse = require("../../wxParse/wxParse.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav_select: false, // 快捷导航

    indicatorDots: true, // 是否显示面板指示点
    autoplay: true, // 是否自动切换
    interval: 3000, // 自动切换时间间隔
    duration: 800, // 滑动动画时长

    currentIndex: 1, // 轮播图指针
    floorstatus: false, // 返回顶部
    showView: true, // 显示商品规格

    detail: {}, // 商品详情信息
    price: 0, // 商品价格
    marketPrice: 0, // 划线价格
    stock: 0, // 库存数量

    quantity: 1, // 商品数量
    skuId: 0, // 规格id
    cart_total_num: 0, // 购物车商品总数量
    specData: {}, // 多规格信息
    productName: "", // 商品名称
  },

  // 记录规格的数组
  goods_spec_arr: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    // 商品id
    _this.data.productId = options.productId;
    _this.data.productName = options.productName;
    // 获取商品信息
    _this.getDetail();
    wx.showShareMenu({
      withShareTicket:true,
      menus:['shareAppMessage','shareTimeline']
      })
  },

   //分享到朋友圈
   onShareTimeline: function (res) {
    let _this = this;
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title:_this.data.productName ,
      path: "/pages/product/detail?productId=" + _this.data.productId
    }
  },

  /**
   * 获取商品信息
   */
  getDetail() {
    let _this = this;
    App._get('/api/product/detail', {
      productId: _this.data.productId
    }, function (result) {
      // 初始化商品详情数据
      let data = _this.initDetailData(result.data);
      _this.setData(data);
    });
  },

  /**
   * 初始化商品详情数据
   */
  initDetailData(data) {
    let _this = this;
    // 富文本转码
    if (data.detail.introduction!=null&&data.detail.introduction.length > 0) {
      wxParse.wxParse('content', 'html', data.detail.introduction, _this, 0);
    }
      //  console.info("index:"+data.contents);
    if (data.contents.length > 0) {
      wxParse.wxParse('text', 'html', data.contents, _this, 0);
    }
    // 商品价格/划线价/库存
    data.skuId = data.detail.defaultSku.skuId;
    data.price = data.detail.defaultSku.price;
    data.marketPrice = data.detail.defaultSku.marketPrice;
    data.stock = data.detail.defaultSku.stock;
    // 初始化商品多规格
    if (data.detail.hasSpecification) {
      data.specData = _this.initManySpecData(data.specData);
    }
    data.name=data.detail.name;
    return data;
  },

  /**
   * 初始化商品多规格
   */
  initManySpecData(data) {
    for (let i in data.specificationItems) {
      for (let j in data.specificationItems[i].entries) {
        if (j < 1) {
          data.specificationItems[i].entries[0].isSelected = true;
          this.goods_spec_arr[i] = data.specificationItems[i].entries[0].id;
        }
      }
    }
    return data;
  },

  /**
   * 点击切换不同规格
   */
  modelTap(e) {
    let attrIdx = e.currentTarget.dataset.attrIdx,
      itemIdx = e.currentTarget.dataset.itemIdx,
      specData = this.data.specData;
    for (let i in specData.specificationItems) {
      for (let j in specData.specificationItems[i].entries) {
        if (attrIdx == i) {
          specData.specificationItems[i].entries[j].isSelected = false;
          if (itemIdx == j) {
            specData.specificationItems[i].entries[itemIdx].isSelected = true;
            this.goods_spec_arr[i] = specData.specificationItems[i].entries[itemIdx].id;
          }
        }
      }
    }

    this.setData({
      specData
    });
    // 更新商品规格信息
    this.updateSpecGoods();
  },

  /**
   * 更新商品规格信息
   */
  updateSpecGoods() {
    let spec_sku_id = this.goods_spec_arr.join('_');

    // 查找skuItem
    let skus = this.data.specData.skus,
      skuItem = skus.find((val) => {
        return val.specSkuId == spec_sku_id;
      });
    this.data.detail.defaultSku = skuItem;
    // 记录skuId
    // 更新商品价格、划线价、库存
    if (typeof skuItem === 'object') {
      this.setData({
        detail: this.data.detail
      });
    }
  },

  /**
   * 设置轮播图当前指针 数字
   */
  setCurrent(e) {
    this.setData({
      currentIndex: e.detail.current + 1
    });
  },

  /**
   * 控制商品规格/数量的显示隐藏
   */
  onChangeShowState() {
    this.setData({
      showView: !this.data.showView
    });
  },

  /**
   * 返回顶部
   */
  goTop(t) {
    this.setData({
      scrollTop: 0
    });
  },

  /**
   * 显示/隐藏 返回顶部按钮
   */
  scroll(e) {
    this.setData({
      floorstatus: e.detail.scrollTop > 200
    })
  },

  /**
   * 增加商品数量
   */
  up() {
    this.setData({
      quantity: ++this.data.quantity
    })
  },

  /**
   * 减少商品数量
   */
  down() {
    if (this.data.quantity > 1) {
      this.setData({
        quantity: --this.data.quantity
      });
    }
  },

  /**
   * 跳转购物车页面
   */
  flowCart: function () {
    wx.switchTab({
      url: "../cart/list"
    });
  },

  /**
   * 加入购物车and立即购买
   */
  submit(e) {
    let _this = this,
      submitType = e.currentTarget.dataset.type;
    if (submitType === 'buyNow') {
      // 立即购买
      wx.navigateTo({
        url: '../checkout/checkout?' + App.urlEncode({
          order_type: 'buyNow',
          quantity: _this.data.quantity,
          skuId: _this.data.detail.defaultSku.skuId,
        })
      });
    } else if (submitType === 'addCart') {
      // 加入购物车
      App._post_form('/api/cart/add', {
        quantity: _this.data.quantity,
        skuId: _this.data.detail.defaultSku.skuId,
      }, function (result) {
        App.showSuccess(result.message);
        _this.setData(result.data);
      });
    }
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage: function () {
    // 构建页面参数
    let _this = this;
    return {
      title: _this.data.productName ,
      path: "/pages/product/detail?productId=" + _this.data.productId
    };
  },

})