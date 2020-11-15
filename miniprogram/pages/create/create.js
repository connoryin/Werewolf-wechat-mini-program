// pages/craete.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: "",
    checked: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  handleSubmit (e) {
    let roomnum = e.detail.value.roomNumber
    const db = wx.cloud.database()
    const roomCollection = db.collection("room")
    roomCollection.where({
      number: roomnum
    }).get().then((res)=>{
      if (res.data.length) {
        this.setData({
        prompt: "房间号已存在"
      })
      } else {
        let roles = this.data.checked
        let players = []
        for (let i=0;i<e.detail.value.wolfNumber;i++){
          roles.push("wolf")
        }
        for (let i=0;i<e.detail.value.citizenNumber;i++){
          roles.push("citizen")
        }
        for (let i=0;i<roles.length;i++){
          players.push("空位")
        }
        roomCollection.add({
          data: {
            number: roomnum,
          players: players,
          roles: roles,
          dead: {},
          state: 0
          },
          success: ()=>{
            this.setData({
              prompt: "房间创建成功"
            })
            wx.navigateTo({
              url: '../join/join?num='+roomnum+'&creator=1',
            })
          },
          fail: ()=>{
            this.setData({
              prompt: "房间创建失败"
            })
          }
        })
        
      }
      
    })
  },
  checkboxChange (e) {
    this.setData({
      checked: e.detail.value
    })
  }
})