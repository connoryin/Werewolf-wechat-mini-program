// miniprogram/pages/wolf/wolf.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    res: {},
    info: "",
    disable: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const db = wx.cloud.database()
    const roomCollection = db.collection("room")
    let disable
    if (options.role=="狼人") {
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
    const audio = wx.createInnerAudioContext()
    audio.autoplay = true
    audio.src = "cloud://werewolf-9gwbfrsr2624cd12.7765-werewolf-9gwbfrsr2624cd12-1304224331/wolf_open_eye.mp3"
    audio.onEnded(()=>{
      const audio2 = wx.createInnerAudioContext()
      audio2.autoplay = true
      audio2.src = "cloud://werewolf-9gwbfrsr2624cd12.7765-werewolf-9gwbfrsr2624cd12-1304224331/wolf_kill.mp3"
    })
    
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
  kill (e) {

    let index = parseInt(e.target.id)+1
    this.setData({
      info: "已杀死"+index+"号"
    })

    wx.cloud.callFunction({
      name: "kill",
      data: {
        dead: [index-1],
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
        state: "3",
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