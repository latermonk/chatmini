Page({
  data: {
    book: null,
    currentBorrow: null
  },

  onLoad: function (options) {
    const id = options.id
    if (id) {
      this.loadBookDetail(id)
    }
  },

  onShow: function () {
    if (this.data.book) {
      this.loadBookDetail(this.data.book.id)
    }
  },

  loadBookDetail: function(id) {
    try {
      const books = wx.getStorageSync('books') || []
      const book = books.find(b => b.id === id)

      if (book) {
        this.setData({ book })

        const borrowRecords = wx.getStorageSync('borrowRecords') || []
        const currentBorrow = borrowRecords.find(r =>
          r.bookId === id && r.status === 'borrowed'
        )
        this.setData({ currentBorrow })
      } else {
        wx.showToast({
          title: '图书不存在',
          icon: 'none'
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      }
    } catch (e) {
      console.error('加载图书详情失败', e)
    }
  },

  borrowBook: function() {
    wx.showModal({
      title: '确认借出',
      content: '请输入借阅人姓名',
      editable: true,
      placeholderText: '请输入姓名',
      success: (res) => {
        if (res.confirm && res.content) {
          this.processBorrow(res.content)
        }
      }
    })
  },

  processBorrow: function(borrower) {
    try {
      const books = wx.getStorageSync('books') || []
      const bookIndex = books.findIndex(b => b.id === this.data.book.id)

      if (bookIndex === -1) return

      books[bookIndex].status = 'borrowed'
      wx.setStorageSync('books', books)

      const borrowRecords = wx.getStorageSync('borrowRecords') || []
      borrowRecords.push({
        id: Date.now().toString(),
        bookId: this.data.book.id,
        bookTitle: this.data.book.title,
        borrower: borrower,
        borrowTime: this.formatDate(new Date()),
        status: 'borrowed'
      })
      wx.setStorageSync('borrowRecords', borrowRecords)

      this.setData({
        book: books[bookIndex],
        currentBorrow: borrowRecords[borrowRecords.length - 1]
      })

      wx.showToast({
        title: '借出成功',
        icon: 'success'
      })
    } catch (e) {
      console.error('借出失败', e)
      wx.showToast({
        title: '借出失败',
        icon: 'none'
      })
    }
  },

  returnBook: function() {
    if (!this.data.currentBorrow) return

    wx.showModal({
      title: '确认归还',
      content: `确认归还《${this.data.book.title}》吗？`,
      success: (res) => {
        if (res.confirm) {
          this.processReturn()
        }
      }
    })
  },

  processReturn: function() {
    try {
      const books = wx.getStorageSync('books') || []
      const bookIndex = books.findIndex(b => b.id === this.data.book.id)

      if (bookIndex === -1) return

      books[bookIndex].status = 'available'
      wx.setStorageSync('books', books)

      const borrowRecords = wx.getStorageSync('borrowRecords') || []
      const recordIndex = borrowRecords.findIndex(r => r.id === this.data.currentBorrow.id)

      if (recordIndex !== -1) {
        borrowRecords[recordIndex].status = 'returned'
        borrowRecords[recordIndex].returnTime = this.formatDate(new Date())
        wx.setStorageSync('borrowRecords', borrowRecords)
      }

      this.setData({
        book: books[bookIndex],
        currentBorrow: null
      })

      wx.showToast({
        title: '归还成功',
        icon: 'success'
      })
    } catch (e) {
      console.error('归还失败', e)
      wx.showToast({
        title: '归还失败',
        icon: 'none'
      })
    }
  },

  editBook: function() {
    const bookData = encodeURIComponent(JSON.stringify(this.data.book))
    wx.navigateTo({
      url: `/pages/add-book/add-book?edit=true&data=${bookData}`
    })
  },

  deleteBook: function() {
    if (this.data.book.status === 'borrowed') {
      wx.showToast({
        title: '图书已借出，无法删除',
        icon: 'none'
      })
      return
    }

    wx.showModal({
      title: '确认删除',
      content: `确认删除《${this.data.book.title}》吗？`,
      success: (res) => {
        if (res.confirm) {
          this.processDelete()
        }
      }
    })
  },

  processDelete: function() {
    try {
      const books = wx.getStorageSync('books') || []
      const newBooks = books.filter(b => b.id !== this.data.book.id)
      wx.setStorageSync('books', newBooks)

      wx.showToast({
        title: '删除成功',
        icon: 'success'
      })

      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (e) {
      console.error('删除失败', e)
      wx.showToast({
        title: '删除失败',
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
  }
})
