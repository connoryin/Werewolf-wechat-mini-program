// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const state = event.state
  const number = event.number
  const db = cloud.database()
  const roomCollection = db.collection("room")
  const _ = db.command
  roomCollection.where({
    number: number
  })
  .update({
    data: {
      state: _.set(state)
    },
    success: (res)=>{
      console.log(res)
    },
    fail: (err)=>{
      console.log(err)
    }
  })
}