Page({
  data: {
    scanResult: ''
  },

  onLoad: function () {
    this.autoScan()
  },

  autoScan: function() {
    setTimeout(() => {
      this.startScan()
    }, 500)
  },

  startScan: function() {
    wx.scanCode({
      scanType: ['barCode'],
      success: (res) => {
        console.log('扫描结果', res.result)
        this.setData({
          scanResult: res.result
        })
        wx.showToast({
          title: '扫描成功',
          icon: 'success'
        })
      },
      fail: (err) => {
        console.error('扫描失败', err)
        if (err.errMsg !== 'scanCode:fail cancel') {
          wx.showToast({
            title: '扫描失败，请重试',
            icon: 'none'
          })
        }
      }
    })
  },

  scanAgain: function() {
    this.setData({
      scanResult: ''
    })
    setTimeout(() => {
      this.startScan()
    }, 100)
  },

  fillForm: function() {
    wx.navigateTo({
      url: `/pages/add-book/add-book?isbn=${encodeURIComponent(this.data.scanResult)}`
    })
  }
})
