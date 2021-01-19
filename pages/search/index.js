let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recentSearch: [],
    searchValue: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 获取历史搜索
    this.getRecentSearch();
  },

  /**
   * 获取历史搜索
   */
  getRecentSearch() {
    let recentSearch = wx.getStorageSync('recentSearch');
    this.setData({ recentSearch });
  },

  /**
   * 绑定输入值
   */
  getSearchContent(e) {
    this.data.searchValue = e.detail.value;
  },

  /**
   * 搜索提交
   */
  search() {
    if (this.data.searchValue) {
      // 记录最近搜索
      let recentSearch = wx.getStorageSync('recentSearch') || [];
      console.log('success:'+this.data.searchValue);
      recentSearch.unshift(this.data.searchValue);
      wx.setStorageSync('recentSearch', recentSearch)
      // 跳转到商品列表页
      wx.navigateTo({
        url: '../search/list?search=' + this.data.searchValue,
      })
    }
  },

  /**
   * 清空最近搜索记录
   */
  clearSearch() {
    wx.removeStorageSync('recentSearch');
    this.getRecentSearch();
  },

  /**
   * 跳转到最近搜索
   */
  goSearch(e) {
    wx.navigateTo({
      url: '../search/list?search=' + e.target.dataset.text,
    })
  },

})