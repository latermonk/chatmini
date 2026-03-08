const { bestsellersData } = require('../../data/bestsellers.js')

Page({
  data: {
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    recentBooks: []
  },

  onLoad: function () {
    this.loadStats()
    this.loadRecentBooks()
  },

  onShow: function () {
    this.loadStats()
    this.loadRecentBooks()
  },

  loadStats: function() {
    try {
      const books = wx.getStorageSync('books') || []
      const total = books.length
      const available = books.filter(b => b.status === 'available').length
      const borrowed = books.filter(b => b.status === 'borrowed').length

      this.setData({
        totalBooks: total,
        availableBooks: available,
        borrowedBooks: borrowed
      })
    } catch (e) {
      console.error('加载统计数据失败', e)
    }
  },

  loadRecentBooks: function() {
    try {
      const books = wx.getStorageSync('books') || []
      const recent = books.slice(-5).reverse()
      this.setData({
        recentBooks: recent
      })
    } catch (e) {
      console.error('加载最近图书失败', e)
    }
  },

  goToBookList: function() {
    wx.navigateTo({
      url: '/pages/book-list/book-list'
    })
  },

  goToBorrowList: function() {
    wx.navigateTo({
      url: '/pages/borrow-list/borrow-list'
    })
  },

  importBestsellers: function() {
    wx.showLoading({
      title: '导入中...'
    })

    try {
      const books = wx.getStorageSync('books') || []
      let counter = wx.getStorageSync('bookCounter') || 0

      bestsellersData.forEach(book => {
        counter++
        book.id = `book_${counter}`
        book.status = 'available'
        book.addTime = this.formatDate(new Date())
        book.cover = ''
        books.push(book)
      })

      bestsellersData.forEach(book => {
        counter++
        book.id = `book_${counter}`
        book.status = 'available'
        book.addTime = this.formatDate(new Date())
        books.push(book)
      })

      wx.setStorageSync('books', books)
      wx.setStorageSync('bookCounter', counter)

      wx.hideLoading()
      wx.showToast({
        title: `成功导入${bestsellersData.length}本畅销书`,
        icon: 'success',
        duration: 2000
      })

      setTimeout(() => {
        this.loadStats()
        this.loadRecentBooks()
      }, 100)
    } catch (e) {
      wx.hideLoading()
      console.error('导入失败', e)
      wx.showToast({
        title: '导入失败',
        icon: 'none'
      })
    }
  },

  formatDate: function(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hour}:${minute}`
  },

  scanAddBook: function() {
    wx.navigateTo({
      url: '/pages/scan-code/scan-code'
    })
  },

  goToAddBook: function() {
    wx.navigateTo({
      url: '/pages/add-book/add-book'
    })
  },

  goToDetail: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/book-detail/book-detail?id=${id}`
    })
  }
})
