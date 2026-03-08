Page({
  data: {
    books: [],
    filteredBooks: [],
    filterType: 'all',
    searchKeyword: ''
  },

  onLoad: function () {
    this.loadBooks()
  },

  onShow: function () {
    this.loadBooks()
  },

  loadBooks: function() {
    try {
      const books = wx.getStorageSync('books') || []
      this.setData({ books })
      this.filterBooks()
    } catch (e) {
      console.error('加载图书列表失败', e)
    }
  },

  onSearch: function(e) {
    const keyword = e.detail.value.toLowerCase()
    this.setData({ searchKeyword: keyword })
    this.filterBooks()
  },

  setFilter: function(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ filterType: type })
    this.filterBooks()
  },

  filterBooks: function() {
    let filtered = this.data.books

    if (this.data.filterType !== 'all') {
      filtered = filtered.filter(book => book.status === this.data.filterType)
    }

    if (this.data.searchKeyword) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(this.data.searchKeyword) ||
        book.author.toLowerCase().includes(this.data.searchKeyword)
      )
    }

    this.setData({ filteredBooks: filtered })
  },

  goBack: function() {
    wx.navigateBack()
  },

  goToDetail: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/book-detail/book-detail?id=${id}`
    })
  }
})
