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
      avatar: '',
      id: null,
      email: ''
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
    getInfoById: (state, getters) => (id) => {
      var value = state.socialCircle.find(v => v.channel_id === id)
      if (!value) {
        return
      }
      var singleAlert = '他/她隐藏了此信息'
      var ct = new Date(1000 * value.create_time)
      var dt = new Date(1000 * value.date_time)
      var result = {
        basic: {
          'Name': value.name,
          'Channel WithYou': value.channel_id,
          'Id': value.id,
          'Tow Way': value.two_way,
          'Date Time': dt.toLocaleDateString(),
          'Create Time': ct.toLocaleDateString() === 'Invalid Date' ? singleAlert : ct.toLocaleDateString(),
          'Email Adress': value.email || singleAlert,
          'User Type': value.type || singleAlert
        },
        infoIn: value.infoIn,
        avatar: value.avatar
      }
      return result
    },
    getCurRoomId: state => state.currentRoomId,
    getWebSocket: state => state.ws,
    getSocialCircle: state => state.socialCircle
  },
  mutations: {
    setUserInfo (state, data) {
      try {
        // console.log(data)
        state.userInfo.token = data.user_token
        state.userInfo.id = data.id
      } catch (err) {
        console.log(err)
      }
    },
    setUsername (state, data) {
      try {
        state.userInfo.name = data
      } catch (err) {
        console.log(err)
      }
    },
    setAvatar (state, data) {
      try {
        state.userInfo.avatar = 'http://api.otaku.chat/pic/' + data
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
          var vPlus = Object.assign({}, v, {unread: 0, infoIn: false})
          vPlus.avatar = 'http://api.otaku.chat/pic/' + vPlus.avatar
          state.socialCircle.push(vPlus)
          state.roomInfo.msgList.push({channel_id: v.channel_id, messages: [], unread: 0})
        })
        // console.log(state.roomInfo.msgList)
      } catch (err) {
        console.log(err)
      }
    },
    connectWs (state, data) {
      state.ws = new WebSocket('ws://173.254.200.108:2333')
      var ws = state.ws
      ws.onopen = function () {
        var loginMsg = {method: 'login', data: {user_token: data.data}}
        console.log(loginMsg)
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
            avatar: 'http://api.otaku.chat/pic/' + msgdata.data.avatar,
            unread: 0,
            infoIn: false
          }
          state.socialCircle.push(oneWay)
        }
        if (channelIn.channel_id !== state.currentRoomId) {
          console.log('不在此频道')
          channelIn.unread ++
          oneWay.unread ++
        }
        channelIn.messages.push(msgin)
        // console.log(channelIn.messages)
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
      // console.log(data)
      // console.log(targetList)
      targetList.messages.push(data)
    },
    showCorUInfo (state, data) {
      // channel info for the best, though it can just show single user's info now
      var targetUser = state.socialCircle.find(v => v.channel_id === data.channel_id)
      switch (data.showTag) {
        case 1:
          targetUser.infoIn = true
          break
        case 0:
          targetUser.infoIn = false
          break
        default: break
      }
    }
  },
  actions: {
    async signIn (ctx, vueObj) {
      // console.log(ctx)
      // var result = {}
      await axios.post('http://173.254.200.108:80/user/login', qs.stringify({
        'email': vueObj.email.trim(),
        'password': vueObj.password.trim(),
        'captcha': vueObj.captcha
      })).then((response) => {
        if (response.data.code === 200) {
          console.log(response.data)
          ctx.state.ut = response.data.data.user_token
          ch.setCookieItem('user_token', response.data.data.user_token)
          ch.setCookieItem('id', response.data.data.id)
          ctx.commit('setUserInfo', response.data.data)
          ctx.commit('connectWs', {vObj: vueObj, data: response.data.data.user_token})
          // result = {
          //   login: 'success'
          // }
        } else {
          // result = {
          //   login: 'fail'
          // }
        }
      }).catch((err) => {
        // result = {
        //   login: 'fail'
        // }
        console.log(err)
      })
      await ctx.dispatch('getMyFriends')
      await ctx.dispatch('getHostInfo')
      // 应该把路由跳转独立出来
      // return result
      await vueObj.$router.push('index')
    },
    async skipLogin (ctx, data) {
      ctx.commit('setUserInfo', data)
      ctx.commit('connectWs', {data: data.user_token})
      await ctx.dispatch('getMyFriends')
      await ctx.dispatch('getHostInfo')
    },
    async register (ctx, vueObj) {
      // console.log(vueObj.captcha)
      await axios.post('http://173.254.200.108:80/user/register', qs.stringify({
        email: vueObj.email.trim(),
        password: vueObj.password.trim(),
        captcha: vueObj.captcha
      })).then((response) => {
        // console.log(response.data)
        if (response.data.code === 200) {
          ctx.commit('setUserInfo', response.data.data)
          ctx.commit('connectWs')
          ctx.state.ut = response.data.data.user_token
          ch.setCookieItem('user_token', response.data.data.user_token)
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
      await ctx.dispatch('getMyFriends')
      await ctx.dispatch('getHostInfo')
      await vueObj.$router.push('index')
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
      obj.obj.chatTo = {
        name: userTar.name,
        avatar: userTar.avatar
      }
      obj.obj.avatarShow = true
      channelTar.unread = 0
      userTar.unread = 0
      obj.obj.$router.push('/index/room/' + obj.id)
    },
    // 获取用户信息
    async getHostInfo (ctx, obj) {
      // console.log(JSON.stringify(ctx.state))
      return axios.post('http://173.254.200.108:80/user/get_my_info', qs.stringify({
        user_token: ctx.state.userInfo.token
      })).then((response) => {
        console.log(response.data)
        var ui = response.data.data.info
        // console.log(ui)
        ctx.state.userInfo.name = ui.name
        ctx.state.userInfo.id = ui.id
        ctx.state.userInfo.email = ui.email
        ctx.state.userInfo.avatar = 'http://api.otaku.chat/pic/' + ui.avatar
        if (obj) {
          console.log(obj)
          obj.$router.push('/users/hostsetting')
        }
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
        // console.log(response.data.data.list)
        ctx.commit('renderFriendList', response.data.data.list)
        // console.log(ctx.state.socialCircle)
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
    async changeName (ctx, obj) {
      return axios.post('http://173.254.200.108:80/user/change_name', qs.stringify({
        name: obj.newName,
        user_token: ctx.state.userInfo.token
      })).then((response) => {
        if (response.data.code === 200) {
          ctx.commit('setUsername', obj.newName)
          return true
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    async changeAvatar (ctx, obj) {
      console.log(obj.data.get('avatar'))
      obj.data.append('user_token', ctx.state.userInfo.token)
      var config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      return axios.post('http://173.254.200.108:80/user/change_avatar', obj.data, config).then((res) => {
        console.log(res)
        if (res.data.code === 200) {
          return {
            status: 'success'
          }
        } else {
          return {
            status: 'failed'
          }
        }
      }).catch((err) => {
        console.log(err)
        return {
          status: 'failed'
        }
      })
    },
    addToMsgList (ctx, data) {
      var msgobj = Object.assign({}, data, {type: 0})
      ctx.commit('addMessages', msgobj)
    }
  }
})

export default store
