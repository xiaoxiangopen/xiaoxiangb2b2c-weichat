let App = getApp();

Page({
  data: {
    searchColor: "rgba(0,0,0,0.4)",
    searchSize: "15",
    searchName: "搜索商品",

    scrollHeight: null,
    showView: false,
    arrange: "",

    sortPrice: false,   // 价格从低到高
    orderType: '',

    option: {},
    list: {},

    noList: true,
    no_more: false,

    pageNumber: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let _this = this;

    // 设置商品列表高度
    _this.setListHeight();

    // 记录option
    _this.setData({ option }, function () {
      // 获取商品列表
      _this.getProductList(true);
    });

  },

  /**
   * 获取商品列表
   */
  getProductList: function (is_super, pageNumber) {
    let _this = this;
    App._get('/api/product/list', {
      pageNumber: pageNumber || 1,
      orderType: _this.data.orderType,
      productCategoryId: _this.data.option.productCategoryId || 0,
      search: _this.data.option.search || '',
    }, function (result) {
      let resultList = result.data
        , dataList = _this.data.list;
      if (is_super === true || typeof dataList === 'undefined') {
        // typeof dataList.data === 'undefined'
        _this.setData({ list: resultList, noList: false });
      } else {
        _this.setData({ 'list.productItems': dataList.productItems.concat(resultList.productItems) });
      }
      
    });
  },

  /**
   * 设置商品列表高度
   */
  setListHeight: function () {
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          scrollHeight: res.windowHeight - 90,
        });
      }
    });
  },

  /**
   * 切换排序方式
   */
  switchSortType: function (e) {
    let _this = this
      , orderType
      , newSortType = e.currentTarget.dataset.type
      , newSortPrice = newSortType === 'price' ? !_this.data.sortPrice : true;
    
    if (newSortType === 'price') {
      orderType = newSortPrice ? 'PRICE_ASC' : 'PRICE_DESC';
    } else if (newSortType === 'sales') {
      orderType = 'SALES_DESC';
    } else {
      orderType = 'TOP_DESC';
    }

    _this.setData({
      list: {},
      pageNumber: 1,
      sortPrice: newSortPrice,
      orderType: orderType
    }, function () {
      // 获取商品列表
      _this.getProductList(true);
    });
  },

  /**
   * 跳转筛选
   */
  toSynthesize: function (t) {
    wx.navigateTo({
      url: "../category/screen?objectId="
    });
  },

  /**
   * 切换列表显示方式
   */
  onChangeShowState: function () {
    let _this = this;
    _this.setData({
      showView: !_this.data.showView,
      arrange: _this.data.arrange ? "" : "arrange"
    });
  },

  /**
   * 下拉到底加载数据
   */
  bindDownLoad: function () {
    // 已经是最后一页
    if (this.data.pageNumber >= this.data.lastPage) {
      this.setData({ no_more: true });
      return false;
    }
    this.getProductList(false, ++this.data.pageNumber);
  },

  /**
   * 设置分享内容
   */
  onShareAppMessage: function () {
    return {
      title: "全部分类",
      desc: "",
      path: "/pages/category/index"
    };
  },

});
