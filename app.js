App({
  onLaunch: function () {
    console.log('图书管理系统启动')
    this.initData()
  },

  initData: function() {
    try {
      const books = wx.getStorageSync('books')
      if (!books) {
        wx.setStorageSync('books', [])
      }

      const borrowRecords = wx.getStorageSync('borrowRecords')
      if (!borrowRecords) {
        wx.setStorageSync('borrowRecords', [])
      }

      const bookCounter = wx.getStorageSync('bookCounter')
      if (!bookCounter) {
        wx.setStorageSync('bookCounter', 0)
      }
    } catch (e) {
      console.error('初始化数据失败', e)
    }
  },

  globalData: {
    userInfo: null
  }
})
