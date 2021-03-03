let App = getApp();
Page({
  data: {
    // banner轮播组件属性
    indicatorDots: true, // 是否显示面板指示点	
    autoplay: true, // 是否自动切换
    interval: 3000, // 自动切换时间间隔
    duration: 800, // 滑动动画时长
    imgHeights: {}, // 图片的高度
    imgCurrent: {}, // 当前banne所在滑块指针
    // 页面元素
    ads: {},
    newest: {},
    best: {},
    scrollTop: 0,
    option: {},
    pageNumber: 1,
    scrollHeight: null,
    curNav: 121,
  },

/**导航菜单的跳转路径**/
goNav(event){
  // 跳转商品分类的id
  // console.log(event)
  let id = event.currentTarget.id; 
  console.log("id："+id)
  let url = '../../pages/category/list?productCategoryId='+id;
  wx.navigateTo({
    url: url,
  })

},

  onLoad: function(option) {
    var that = this;
    // 设置页面标题
    App.setTitle();
    // 设置navbar标题、颜色
    App.setNavigationBar();
    // 获取首页数据
    this.getIndexData();

    // 设置商品列表高度
    that.setListHeight();
     // 记录option
     that.setData({ option }, function () {
      // 获取商品列表
      that.getProductList(true);
    });
  },

  /**
   * 获取首页数据
   */
  getIndexData: function() {
    let _this = this;
    App._get('/api/index', {}, function(result) {
      _this.setData(result.data);
    });
  },


  
  /**
   * 获取商品列表
   */
  getProductList: function (is_super, pageNumber) {
    let _this = this;
    App._get('/api/product/list', {
      pageNumber: pageNumber || 1,
      orderType: 'PRICE_DESC',
      productCategoryId: 0
    }, function (result) {
      let resultList = result.data
        , dataList = _this.data.list;
      if (is_super === true || typeof dataList === 'undefined') {
        _this.setData({ list: resultList, noList: false });
      } else {
        _this.setData({ 'list.productItems': dataList.productItems.concat(resultList.productItems) });
      }
      
    });
  },

  selectNav: function (t) {
    let curNav = t.target.dataset.id;
    this.setData({
      curNav,
      scrollTop: 0
    });
    this.getProductList(true);
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
   * 计算图片高度
   */
  imagesHeight: function(e) {
    let imgId = e.target.dataset.id,
      itemKey = e.target.dataset.itemKey,
      ratio = e.detail.width / e.detail.height, // 宽高比
      viewHeight = 750 / ratio, // 计算的高度值
      imgHeights = this.data.imgHeights;

    // 把每一张图片的对应的高度记录到数组里
    if (typeof imgHeights[itemKey] === 'undefined') {
      imgHeights[itemKey] = {};
    }
    imgHeights[itemKey][imgId] = viewHeight;
    // 第一种方式
    let imgCurrent = this.data.imgCurrent;
    if (typeof imgCurrent[itemKey] === 'undefined') {
      imgCurrent[itemKey] = Object.keys(this.data.ads[0]);
    }
    this.setData({
      imgHeights,
      imgCurrent
    });
  },

  bindChange: function(e) {
    let itemKey = e.target.dataset.itemKey,
      imgCurrent = this.data.imgCurrent;
    // imgCurrent[itemKey] = e.detail.current;
    imgCurrent[itemKey] = e.detail.currentItemId;
    this.setData({
      imgCurrent
    });
  },

  goTop: function(t) {
    this.setData({
      scrollTop: 0
    });
  },

  scroll: function(t) {
    this.setData({
      indexSearch: t.detail.scrollTop
    }), t.detail.scrollTop > 300 ? this.setData({
      floorstatus: !0
    }) : this.setData({
      floorstatus: !1
    });
  },

   //分享到朋友圈
   onShareTimeline: function (res) {
    let _this = this;
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title:'小象网乐购' ,
      path: "/pages/index/index"
    }
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage: function () {
    // 构建页面参数
    let _this = this;
    return {
      title:'小象网乐购' ,
      path: "/pages/index/index"
    };
  },

});