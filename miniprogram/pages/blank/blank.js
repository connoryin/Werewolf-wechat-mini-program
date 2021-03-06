// miniprogram/pages/blank/blank.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    res: {},
    role: "",
    seat: null,
    num: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const db = wx.cloud.database()
    const roomCollection = db.collection("room")
    roomCollection.where({
      number: options.num
    }).get().then((res)=>{      
      this.setData({
        res: res.data[0],
      })
    })
    this.setData({
      role: options.role,
      seat: parseInt(options.seat),
      num: options.num,
    })
    if (options.creator == "1") {
      this.creator = true
    } else {
      this.creator = false
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const audio = wx.createInnerAudioContext()
    audio.autoplay = true
    audio.src = "cloud://werewolf-9gwbfrsr2624cd12.7765-werewolf-9gwbfrsr2624cd12-1304224331/wellcom.mp3"
    audio.onEnded(()=>{
      const audio2 = wx.createInnerAudioContext()
      audio2.autoplay = true
      audio2.src = "cloud://werewolf-9gwbfrsr2624cd12.7765-werewolf-9gwbfrsr2624cd12-1304224331/see_role.mp3"
      audio2.onEnded(()=>{
        const audio3 = wx.createInnerAudioContext()
        audio3.autoplay = true
        audio3.src = "cloud://werewolf-9gwbfrsr2624cd12.7765-werewolf-9gwbfrsr2624cd12-1304224331/close_eye.mp3"
        if (this.creator) {
          audio3.onEnded(()=>{
            let state
            if (this.data.res.roles.includes("丘比特")) {
              state = "6"
            } else {
              state = "2"
            }
            wx.cloud.callFunction({
              name: "changeState",
              data: {
                state: state,
                number: this.data.num
              },
              success: (res)=>{
                console.log(res)
              },
              fail: (err)=>{
                console.log(err)
              }
            })
          
          })
        }
        
      })
      
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

  }
})