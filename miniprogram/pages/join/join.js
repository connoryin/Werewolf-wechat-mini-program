// miniprogram/pages/join/join.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    res: {},
    disable: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.seat = null
    console.log(options)
    const db = wx.cloud.database()
    const roomCollection = db.collection("room")
    roomCollection.where({
      number: options.num
    }).get().then((res)=>{     
      console.log(res) 
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
    const db = wx.cloud.database()
    this.watcher = db.collection("room").where({
      number: this.data.res.number
    }).watch({
      onChange: (snapshot) => {
        console.log(snapshot)
        let res = this.data.res
        
        if (snapshot.docChanges.length) {
          let i
          for (i=0;i<snapshot.docChanges.length;i++){
            if (snapshot.docChanges[i].doc.number == res.number) {
              break
            }
          }
          if (i<snapshot.docChanges.length){
            let newState = snapshot.docChanges[i].doc.state
            if (newState != res.state) {
              if (newState == "1") {
                console.log("seat: "+this.seat)
                let creator
                  if (this.data.disable) {
                    creator = "0"
                  } else {
                    creator = "1"
                  }
                wx.navigateTo({
                  url: '../blank/blank?role='+this.data.res.roles[this.seat]+'&seat='+this.seat+'&num='+this.data.res.number+'&creator='+creator,
                })
              } else if (newState == "2") {
                wx.navigateTo({
                  url: '../wolf/wolf?num='+this.data.res.number+'&seat='+this.seat+'&role='+this.data.res.roles[this.seat],
                })
              } else if (newState == "3") {
                const audio = wx.createInnerAudioContext()
                audio.autoplay = true
                audio.src = "cloud://werewolf-9gwbfrsr2624cd12.7765-werewolf-9gwbfrsr2624cd12-1304224331/wolf_close_eyes.mp3"
                audio.onEnded(()=>{
                  wx.navigateTo({
                    url: '../seer/seer?num='+this.data.res.number+'&seat='+this.seat+'&role='+this.data.res.roles[this.seat],
                  })
                })
                  
              } else if (newState == "4") {
                const audio = wx.createInnerAudioContext()
                audio.autoplay = true
                audio.src = "cloud://werewolf-9gwbfrsr2624cd12.7765-werewolf-9gwbfrsr2624cd12-1304224331/seer_close.mp3"
                audio.onEnded(()=>{
                  wx.navigateTo({
                    url: '../witch/witch?num='+this.data.res.number+'&seat='+this.seat+'&role='+this.data.res.roles[this.seat],
                  })
                })
              } else if (newState == "5") {
                const audio = wx.createInnerAudioContext()
                audio.autoplay = true
                audio.src = "cloud://werewolf-9gwbfrsr2624cd12.7765-werewolf-9gwbfrsr2624cd12-1304224331/witch_close.mp3"
                audio.onEnded(()=>{
                  let creator
                  if (this.data.disable) {
                    creator = "0"
                  } else {
                    creator = "1"
                  }
                  wx.navigateTo({
                    url: '../result/result?num='+this.data.res.number+'&seat='+this.seat+'&creator='+creator,
                  })
                })
              } else if (newState == "6") {
                wx.navigateTo({
                  url: '../cupid/cupid?num='+this.data.res.number+'&seat='+this.seat+'&role='+this.data.res.roles[this.seat],
                })
              } else if (newState == "7") {
                const audio2 = wx.createInnerAudioContext()
                audio2.autoplay = true
                audio2.src = "cloud://werewolf-9gwbfrsr2624cd12.7765-werewolf-9gwbfrsr2624cd12-1304224331/cupid_close.mp3"
                audio2.onEnded(()=>{
                  let creator
                  if (this.data.disable) {
                    creator = "0"
                  } else {
                    creator = "1"
                  }
                  wx.navigateTo({
                    url: '../cupid_result/cupid_result?num='+this.data.res.number+'&seat='+this.seat+'&creator='+creator,
                  })
                })
              }
            }
            
            res.players = snapshot.docChanges[i].doc.players
            res.state = snapshot.docChanges[i].doc.state
            this.setData({
              res: res
            })
          }
          
        }
        
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
    this.watcher.close()
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
    let index = parseInt(e.target.id)
    let res = this.data.res
    if (res.players[index] == "空位") {
      let nickname;
    wx.getUserInfo({
      success: (info) => {
        nickname = info.userInfo.nickName
        res.players[index] = nickname
        if (this.seat != null) {
          res.players[this.seat] = "空位"
        }
        this.setData({
          res: res,
        })
        this.seat = index
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
    } 
    // else if (index == this.seat) {
    //   res.players[index] = "空位"
    //   this.seat = null
    //   this.setData({
    //     res: res,
    //   })
    //   wx.cloud.callFunction({
    //     name: "updateSeat",
    //     data: {
    //       players: res.players,
    //       number: res.number
    //     },
    //     success: (res)=>{
    //       console.log(res)
    //     },
    //     fail: (err)=>{
    //       console.log(err)
    //     }
    //   })
    // }
    
  },
  start (e) {
    wx.cloud.callFunction({
      name: "changeState",
      data: {
        state: "1",
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