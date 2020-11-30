// miniprogram/pages/seer/seer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    res: {},
    info: "",
    disable: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const db = wx.cloud.database()
    const roomCollection = db.collection("room")
    let disable
    if (options.role=="预言家") {
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
    audio2.src = "cloud://werewolf-9gwbfrsr2624cd12.7765-werewolf-9gwbfrsr2624cd12-1304224331/seer_open.mp3"
    audio2.onEnded(()=>{
      const audio = wx.createInnerAudioContext()
      audio.autoplay = true
      audio.src = "cloud://werewolf-9gwbfrsr2624cd12.7765-werewolf-9gwbfrsr2624cd12-1304224331/seer_see.mp3"
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
  see(e){
    
    let index = parseInt(e.target.id)
    let info
    if (this.data.res.roles[index]=="狼人") {
      info = "他的身份是狼人"
    } else {
      info = "他的身份是好人"
    }
    this.setData({
      disable: true,
      info: info
    })
        wx.cloud.callFunction({
          name: "changeState",
          data: {
            state: "4",
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