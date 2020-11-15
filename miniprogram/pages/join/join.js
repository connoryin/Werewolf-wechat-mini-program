// miniprogram/pages/join/join.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    res: {},
    seat: null,
    creater: false
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
        creater: options.creater=="1"?true:false
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const db = wx.cloud.database()
    const watcher = db.collection("room").where({
      number: this.data.res.number
    }).watch({
      onChange: (snapshot) => {
        console.log(snapshot)
        let res = this.data.res
        res.players = snapshot.docChanges[snapshot.docChanges.length-1].doc.players
        this.setData({
          res: res
        })
      },
      onError: (err) => {
        console.log(err)
      }
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
    let res = this.data.res
    wx.getUserInfo({
      success: (info) => {
        let nickname = info.userInfo.nickName
        for (let i=0;i<res.players.length;i++){
          if (res.players[i] == nickname) {
            res.players[i] = "空位"
          }
        }
        wx.cloud.callFunction({
          name: "updateSeat",
          data: {
            players: res.players,
            number: res.number
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
  sit (e) {
    let index = e.target.id
    let res = this.data.res
    if (res.players[index] == "空位") {
      let nickname;
    wx.getUserInfo({
      success: (info) => {
        nickname = info.userInfo.nickName
        res.players[index] = nickname
        if (this.data.seat != null) {
          res.players[this.data.seat] = "空位"
        }
        this.setData({
          res: res,
          seat: index
        })
        wx.cloud.callFunction({
          name: "updateSeat",
          data: {
            players: res.players,
            number: res.number
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
    } else if (index == this.data.seat) {
      res.players[index] = "空位"
      this.setData({
        res: res,
        seat: null
      })
      wx.cloud.callFunction({
        name: "updateSeat",
        data: {
          players: res.players,
          number: res.number
        },
        success: (res)=>{
          console.log(res)
        },
        fail: (err)=>{
          console.log(err)
        }
      })
    }
    
  },
  start (e) {
    wx.navigateTo({
      url: '../blank/blank',
    })
  }
})