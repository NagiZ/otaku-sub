import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import qs from 'qs'
import ch from '../../config/cookieHandler.js'
// import rA from '../../config/roomActions.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    ut: '',
    userInfo: {
      name: '',
      token: '',
      avator: '',
      id: null
    },
    roomInfo: {
      userList: {},
      msgList: []
    },
    currentRoomId: null,
    socialCircle: [],
    ws: null
  },
  getters: {
    getUserInfo: state => state.userInfo,
    getRoomInfo: state => state.roomInfo,
    getMsgListById: (state, getters) => (id) => {
      var value = state.roomInfo.msgList.find(v => v.channel_id === id)
      if (!value) {
        return
      }
      return value.messages
    },
    getUnreadById: (state, getters) => (id) => {
      var value = state.roomInfo.msgList.find(v => v.channel_id === id)
      if (!value) {
        return
      }
      return value.unread
    },
    getCurRoomId: state => state.currentRoomId,
    getWebSocket: state => state.ws,
    getSocialCircle: state => state.socialCircle
  },
  mutations: {
    setUserInfo (state, data) {
      try {
        console.log(data)
        state.userInfo.token = data.user_token
        state.userInfo.id = data.id
        state.userInfo.name = 'nagi'
      } catch (err) {
        console.log(err)
      }
    },
    setCurRoomId (state, data) {
      state.currentRoomId = data.id
    },
    renderFriendList (state, data) {
      if (data.length === 0) {
        return
      }
      try {
        // console.log(data)
        data.forEach((v, i) => {
          var vPlus = Object.assign({}, v, {unread: 0})
          state.socialCircle.push(vPlus)
          state.roomInfo.msgList.push({channel_id: data[0].channel_id, messages: [], unread: 0})
        })
      } catch (err) {
        console.log(err)
      }
    },
    connectWs (state, data) {
      state.ws = new WebSocket('ws://173.254.200.108:2333')
      var ws = state.ws
      ws.onopen = function () {
        var loginMsg = {method: 'login', data: {user_token: data.data}}
        // console.log(loginMsg)
        console.log('opening')
        ws.send(JSON.stringify(loginMsg), (err) => {
          console.log(err)
        })
      }
      ws.onmessage = function (message) {
        var msgdata = JSON.parse(message.data)
        var channelIn = state.roomInfo.msgList.find(v => v.channel_id === msgdata.data.channel_id)
        var msgin = Object.assign({}, msgdata.data, {type: 1})
        var oneWay = state.socialCircle.find(v => v.channel_id === msgdata.data.channel_id)
        if (!channelIn || !oneWay) {
          channelIn = {channel_id: msgdata.data.channel_id, messages: [], unread: 0}
          state.roomInfo.msgList.push(channelIn)
          oneWay = {
            name: msgdata.data.name,
            channel_id: msgdata.data.channel_id,
            id: msgdata.data.id,
            avator: msgdata.data.avator,
            unread: 0
          }
          state.socialCircle.push(oneWay)
        }
        if (channelIn.channel_id !== state.currentRoomId) {
          console.log('不在此频道')
          channelIn.unread ++
          oneWay.unread ++
        }
        channelIn.messages.push(msgin)
        console.log(channelIn.messages)
        // state.roomInfo.msgList.forEach((v, i) => {
        //   console.log(v)
        //   if (v.channel_id === msgdata.data.channel_id) {
        //     console.log('wsonmessage')
        //     console.log(state.roomInfo.msgList[i])
        //     state.roomInfo.msgList[i].messages.push(msgin)
        //   }
        // })
      }
    },
    closeWs (state) {
      try {
        if (state.ws !== null) {
          state.ws.terminate()
        }
      } catch (err) {
        console.log(err)
      } finally {
        state.ws = null
      }
    },
    addMessages (state, data) {
      var targetList = state.roomInfo.msgList.find(v => v.channel_id === data.channel_id)
      console.log(data)
      console.log(targetList)
      targetList.messages.push(data)
    }
  },
  actions: {
    async signIn (ctx, vueObj) {
      console.log(ctx)
      await axios.post('http://173.254.200.108:80/user/login', qs.stringify({
        'email': vueObj.email.trim(),
        'password': vueObj.password.trim(),
        'captcha': vueObj.captcha
      })).then((response) => {
        console.log(axios.post)
        ch.setCookieItem('user_token', response.data.data.user_token)
        if (response.data.code === 200) {
          ctx.state.ut = response.data.data.user_token
          ctx.commit('setUserInfo', response.data.data)
          ctx.commit('connectWs', {vObj: vueObj, data: response.data.data.user_token})
        }
      }).catch((err) => {
        console.log(err)
      })
      await ctx.dispatch('getMyFriends')
      await vueObj.$router.push('index')
    },
    register (ctx, vueObj) {
      // console.log(vueObj.captcha)
      axios.post('http://173.254.200.108:80/user/register', qs.stringify({
        email: vueObj.email.trim(),
        password: vueObj.password.trim(),
        captcha: vueObj.captcha
      })).then((response) => {
        // console.log(response.data)
        if (response.data.code === 200) {
          ctx.commit('setUserInfo', response.data.data)
          ctx.commit('connectWs')
          var ws = ctx.state.ws
          ws.onopen = function () {
            var loginMsg = {method: 'login', data: {user_token: response.data.data.user_token}}
            ws.send(JSON.stringify(loginMsg), (err) => {
              console.log(err)
            })
            vueObj.$router.push('index')
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    loginOut (ctx, vueObj) {
      ctx.commit('setCurRoomId', {})
      ctx.commit('setUserInfo', {})
      ctx.commit('closeWs')
      vueObj.$router.push('/')
    },
    getCaptcha (ctx, data) {
      axios.get('http://173.254.200.108:80/user/captcha').then((response) => {
        console.log(response)
      }).catch((err) => {
        console.log(err)
      })
    },
    getInChannel (ctx, obj) {
      ctx.commit('setCurRoomId', obj)
      var channelTar = ctx.state.roomInfo.msgList.find(v => v.channel_id === obj.id)
      var userTar = ctx.state.socialCircle.find(v => v.channel_id === obj.id)
      channelTar.unread = 0
      userTar.unread = 0
      obj.obj.$router.push('chat/room')
    },
    // 获取用户信息
    getHostInfo (ctx, obj) {
      console.log(JSON.stringify(ctx.state))
      axios.post('http://173.254.200.108:80/user/get_my_info', qs.stringify({
        user_token: ctx.state.userInfo.token
      })).then((response) => {
        console.log(response.data)
        obj.$router.push('/users/hostsetting')
      }).catch((err) => {
        console.log(err)
      })
    },
    // addfriend
    addFriend (ctx, obj) {
      axios.post('http://173.254.200.108:80/user/add_friend', qs.stringify({
        id: obj.newId,
        user_token: ctx.state.userInfo.token
      })).then((response) => {
        console.log(response.data)
      }).catch((err) => {
        console.log(err)
      })
    },
    // delete friend
    delFriend (ctx, obj) {
      axios.post('http://173.254.200.108:80/user/del_friend', qs.stringify({
        id: '1',
        user_token: ctx.state.userInfo.token
      })).then((response) => {
        console.log(response.data)
      }).catch((err) => {
        console.log(err)
      })
    },
    async getMyFriends (ctx, obj) {
      axios.post('http://173.254.200.108:80/user/my_friends', qs.stringify({
        user_token: ctx.state.userInfo.token
      })).then((response) => {
        console.log(response.data.data.list)
        ctx.commit('renderFriendList', response.data.data.list)
        console.log(ctx.state.socialCircle)
      }).catch((err) => {
        console.log(err)
      })
    },
    getFriendInfo (ctx, id) {
      axios.post('http://173.254.200.108:80/user/my_friends', qs.stringify({
        user_token: ctx.state.userInfo.token,
        id: id
      })).then((response) => {
        console.log(response.data)
      }).catch((err) => {
        console.log(err)
      })
    },
    // get my channel list
    getMyChannelList (ctx) {
      axios.post('http://173.254.200.108:80/user/my_friends', qs.stringify({
        user_token: ctx.state.userInfo.token
      })).then((response) => {
        console.log(response.data)
      }).catch((err) => {
        console.log(err)
      })
    },
    createNormalChannel (ctx) {
      axios.post('http://173.254.200.108:80/channel/create_normal_channel', qs.stringify({
        user_token: ctx.state.userInfo.token,
        name: 'NNNNNNagi Buluuuuuuuuuuuu'
      })).then((response) => {
        console.log(response)
      }).catch((err) => {
        console.log(err)
      })
    },
    // change name
    changeName (ctx, obj) {
      axios.post('http://173.254.200.108:80/user/change_name', qs.stringify({
        name: obj.newName,
        user_token: ctx.state.userInfo.token
      })).then((response) => {
        console.log(response.data)
      }).catch((err) => {
        console.log(err)
      })
    },
    addToMsgList (ctx, data) {
      var msgobj = Object.assign({}, data, {type: 0})
      ctx.commit('addMessages', msgobj)
    }
  }
})

export default store
