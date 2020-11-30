// miniprogram/pages/cupid_result/cupid_result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    res: {},
    info: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.creator == "1") {
      this.creator = true
    } else {
      this.creator = false
    }
    console.log(options)
    const db = wx.cloud.database()
    const roomCollection = db.collection("room")
    
    roomCollection.where({
      number: options.num
    }).get().then((res)=>{    
      let info
      if (options.seat==parseInt(res.data[0].cp[0])) {
        info = "你的对象是"+(res.data[0].cp[1]+1)+"号"
      } else if (options.seat==parseInt(res.data[0].cp[1])) {
        info = "你的对象是"+(res.data[0].cp[0]+1)+"号"
      } else {
        info = "你没有对象"
      }  
      this.setData({
        res: res.data[0],
        info: info
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const audio2 = wx.createInnerAudioContext()
    audio2.autoplay = true
    audio2.src = "cloud://werewolf-9gwbfrsr2624cd12.7765-werewolf-9gwbfrsr2624cd12-1304224331/everyone_open.mp3"
    audio2.onEnded(()=>{
      const audio1 = wx.createInnerAudioContext()
      audio1.autoplay = true
      audio1.src = "cloud://werewolf-9gwbfrsr2624cd12.7765-werewolf-9gwbfrsr2624cd12-1304224331/blank.m4a"
      audio1.onEnded(()=>{
        const audio3 = wx.createInnerAudioContext()
        audio3.autoplay = true
        audio3.src = "cloud://werewolf-9gwbfrsr2624cd12.7765-werewolf-9gwbfrsr2624cd12-1304224331/everyone_close.mp3"
        if (this.creator) {
          audio3.onEnded(()=>{
            wx.cloud.callFunction({
              name: "changeState",
              data: {
                state: "2",
                number: this.data.res.number
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