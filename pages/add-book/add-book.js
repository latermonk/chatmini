Page({
  data: {
    isEdit: false,
    editId: null,
    formData: {
      title: '',
      author: '',
      isbn: '',
      publisher: '',
      publishDate: '',
      location: '',
      cover: '',
      description: ''
    }
  },

  onLoad: function (options) {
    if (options.isbn) {
      this.setData({
        'formData.isbn': decodeURIComponent(options.isbn)
      })
    }
    if (options.edit && options.data) {
      try {
        const bookData = JSON.parse(decodeURIComponent(options.data))
        this.setData({
          isEdit: true,
          editId: bookData.id,
          formData: bookData
        })
      } catch (e) {
        console.error('解析图书数据失败', e)
      }
    }
  },

  onInput: function(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({
      [`formData.${field}`]: value
    })
  },

  onDateChange: function(e) {
    this.setData({
      'formData.publishDate': e.detail.value
    })
  },

  chooseImage: function() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.setData({
          'formData.cover': tempFilePath
        })
      }
    })
  },

  clearCover: function() {
    this.setData({
      'formData.cover': ''
    })
  },

  validateForm: function() {
    const { title, author, isbn, location } = this.data.formData

    if (!title.trim()) {
      wx.showToast({
        title: '请输入书名',
        icon: 'none'
      })
      return false
    }

    if (!author.trim()) {
      wx.showToast({
        title: '请输入作者',
        icon: 'none'
      })
      return false
    }

    if (!isbn.trim()) {
      wx.showToast({
        title: '请输入ISBN',
        icon: 'none'
      })
      return false
    }

    if (!location.trim()) {
      wx.showToast({
        title: '请输入存放位置',
        icon: 'none'
      })
      return false
    }

    return true
  },

  submitForm: function() {
    if (!this.validateForm()) return

    if (this.data.isEdit) {
      this.updateBook()
    } else {
      this.addBook()
    }
  },

  addBook: function() {
    try {
      const books = wx.getStorageSync('books') || []
      let counter = wx.getStorageSync('bookCounter') || 0
      counter++

      const newBook = {
        id: `book_${counter}`,
        ...this.data.formData,
        status: 'available',
        addTime: this.formatDate(new Date())
      }

      books.push(newBook)
      wx.setStorageSync('books', books)
      wx.setStorageSync('bookCounter', counter)

      wx.showToast({
        title: '添加成功',
        icon: 'success'
      })

      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (e) {
      console.error('添加图书失败', e)
      wx.showToast({
        title: '添加失败',
        icon: 'none'
      })
    }
  },

  updateBook: function() {
    try {
      const books = wx.getStorageSync('books') || []
      const index = books.findIndex(b => b.id === this.data.editId)

      if (index === -1) {
        wx.showToast({
          title: '图书不存在',
          icon: 'none'
        })
        return
      }

      books[index] = {
        ...books[index],
        ...this.data.formData,
        id: this.data.editId
      }

      wx.setStorageSync('books', books)

      wx.showToast({
        title: '修改成功',
        icon: 'success'
      })

      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (e) {
      console.error('更新图书失败', e)
      wx.showToast({
        title: '修改失败',
        icon: 'none'
      })
    }
  },

  cancelEdit: function() {
    wx.navigateBack()
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
