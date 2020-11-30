// miniprogram/pages/cupid/cupid.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    res: {},
    disable: false,
    checked: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const db = wx.cloud.database()
    const roomCollection = db.collection("room")
    let disable
    if (options.role=="丘比特") {
      disable = false
    } else {
      disable = true
    }
    roomCollection.where({
      number: options.num
    }).get().then((res)=>{      
      this.setData({
        res: res.data[0],
        disable: disable
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const audio2 = wx.createInnerAudioContext()
    audio2.autoplay = true
    audio2.src = "cloud://werewolf-9gwbfrsr2624cd12.7765-werewolf-9gwbfrsr2624cd12-1304224331/cupid_open.mp3"
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  checkboxChange (e) {
    this.setData({
      checked: e.detail.value
    })
  },
  handleSubmit (e) {
    let cp = this.data.checked
    let numcp = [parseInt(cp[0]), parseInt(cp[1])]
    wx.cloud.callFunction({
      name: "cp",
      data: {
        cp: numcp,
        number: this.data.res.number,
      },
      success: (res)=>{
        console.log(res)
      },
      fail: (err)=>{
        console.log(err)
      }
    })

    
      wx.cloud.callFunction({
        name: "changeState",
        data: {
          state: "7",
          number: this.data.res.number
        },
        success: (res)=>{
          console.log(res)
        },
        fail: (err)=>{
          console.log(err)
        }
      })
    
  }
})