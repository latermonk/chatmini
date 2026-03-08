Page({
  data: {
    records: [],
    filteredRecords: [],
    filterType: 'all'
  },

  onLoad: function () {
    this.loadRecords()
  },

  onShow: function () {
    this.loadRecords()
  },

  loadRecords: function() {
    try {
      const records = wx.getStorageSync('borrowRecords') || []
      records.sort((a, b) => new Date(b.borrowTime) - new Date(a.borrowTime))
      this.setData({ records })
      this.filterRecords()
    } catch (e) {
      console.error('加载借阅记录失败', e)
    }
  },

  setFilter: function(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ filterType: type })
    this.filterRecords()
  },

  filterRecords: function() {
    let filtered = this.data.records

    if (this.data.filterType !== 'all') {
      filtered = filtered.filter(record => record.status === this.data.filterType)
    }

    this.setData({ filteredRecords: filtered })
  },

  goBack: function() {
    wx.navigateBack()
  },

  goToBookDetail: function(e) {
    const bookId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/book-detail/book-detail?id=${bookId}`
    })
  }
})
