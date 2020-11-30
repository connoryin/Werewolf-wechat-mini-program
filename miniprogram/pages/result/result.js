// miniprogram/pages/result/result.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: "",
    disable: true,
    res: {},
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
      let cp = res.data[0].cp
      if (res.data[0].dead.includes(cp[0]) && !res.data[0].dead.includes(cp[1])) {
        res.data[0].dead.push(cp[1])
      } else if (!res.data[0].dead.includes(cp[0]) && res.data[0].dead.includes(cp[1])) {
        res.data[0].dead.push(cp[0])
      }   
      this.setData({
        res: res.data[0],
        disable: options.creator=="0"?true:false
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const audio2 = wx.createInnerAudioContext()
    audio2.autoplay = true
    audio2.src = "cloud://werewolf-9gwbfrsr2624cd12.7765-werewolf-9gwbfrsr2624cd12-1304224331/next_day.mp3"
    audio2.onEnded(()=>{
      const audio = wx.createInnerAudioContext()
      audio.autoplay = true
      audio.src = "cloud://werewolf-9gwbfrsr2624cd12.7765-werewolf-9gwbfrsr2624cd12-1304224331/police.mp3"
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
  result () {
    let info
    if (this.data.res.dead.length) {
      info = "今晚死的人是"
      for (let i=0;i<this.data.res.dead.length;i++){
        info += this.data.res.dead[i]+1
        info += "号 "
      }
    } else {
      info = "今天晚上平安夜"
    }
    
    this.setData({
      info: info
    })
  }
})