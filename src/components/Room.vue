<template>
  <div class="room">
    <nav class="navbar navbar-default no-margin no-border" id="navigation">
      <div class="container-fluid">
        <div class="navbar-header no-margin fl">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#nav-collapse" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand font-cf" href="http://www.baidu.com">Otaku Chat~</a>
          <div class="avator visible-xs">
            <div>info: chatroom</div>
          </div>
        </div>
        <div class="navbar-header collapse navbar-collapse no-margin" id="nav-collapse">
          <ul class="nav navbar-nav">
            <li class="active"><router-link to="/index/room">Action1</router-link></li>
            <li><router-link to="/index">Action2</router-link></li>
            <li><router-link to="/">Action3</router-link></li>
          </ul>
        </div>
        <div class="avator" id="avator" @click="getHostInfo">
          <img :src="getUserInfo.avator" :alt="getUserInfo.name">
        </div>
      </div>
    </nav>
    <!-- navigation end ->-> -->
    <div class="container-fluid panel-area">
      <div class="row panel-box">
        <div class="member-area col-md-3 col-xs-3 hidden-xs panel panel-default">
          <ul class="list-group">
            <li class="list-group-item" v-for="item in users">
              <img src="#" alt="avator" :title="item.user" @click="chatTo(item.id)">
              <span class="name" @click="getUserDetail(item.id)">{{item.user}}</span>
            </li>
          </ul>
          <div id="host-info">
            <span class="host-name" @click="getHostInfo"><img src="#" alt="avator">Nagi</span>
            <ul class="list-group host-detail" style="margin-bottom: 0;">
              <li class="list-group-item">email</li>
              <li class="list-group-item">tag</li>
              <li class="list-group-item">online</li>
              <li class="list-group-item text-danger" @click="signout">Sign out</li>
            </ul>
          </div>
        </div>
        <div class="chat-area col-md-9 col-sm-9 panel panel-default">
          <div class="message" id="msglist">
            <div id="message-items" v-for="item in gms" :class="[item.type ? 'm-left' : 'm-right', 'msg-box']">
              <div :class="[item.type ? 'img-l' : 'img-r']">
                <img src="#" alt="avator">
                <p class="msg-from">{{item.name}}</p>
              </div>
              <div class="msg-body">
                <span class="created-time" v-text="toLocale(item.create_time)"></span>
                <p class="content" v-text="item.message"></p>
              </div>
            </div>
          </div>
          <div class="input" id="input">
            <textarea v-model="msgInput"></textarea>
            <button class="btn btn-default btn-send" @click='sendMessage()'>
              <span class="glyphicon glyphicon-send"></span>
            </button>
          </div>
        </div>
      </div> 
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
// import $ from 'jquery'
// import rA from '../../config/roomActions.js'
export default {
  name: 'Room',
  data: () => {
    return {
      users: [{user: 'Nagi'}, {user: 'Nagi'}, {user: 'Nagi'}, {user: 'Nagi'}, {user: 'Nagi'}, {user: 'Nagi'}],
      msgInput: ''
    }
  },
  methods: {
    sendMessage: function () {
      if (this.msgInput.trim().length === 0) {
        return false
      }
      var sending = {
        method: 'sendMessage',
        data: {
          name: this.getUserInfo.name,
          id: this.getUserInfo.id,
          channel_id: this.getCurRoomId,
          message: this.msgInput.trim(),
          avator: this.getUserInfo.avator,
          create_time: Date.now()
        }
      }
      console.log(this.getCurRoomId)
      this.$store.dispatch('addToMsgList', sending.data)
      // rA.addMessage(this.messages, {message: this.msgInput.trim(), type: 0, from: 'host'}, $('#msglist #message-items'), $('#msglist'))
      this.msgInput = ''
      var ws = this.getWebSocket
      console.log(ws.readyState)
      ws.send(JSON.stringify(sending), (err) => {
        console.log(err)
      })
    },
    signout: function () {
      this.$store.dispatch('loginOut', this)
    },
    chatTo: function (id) {
      // 检测是否存在此私人频道：
      // 存在：直接进入该频道；
      // 不存在：创建该频道并进入，同时邀请对方进入
    },
    getUserDetail: function (id) {

    },
    getHostInfo: function () {
      this.$store.dispatch('getHostInfo', this)
    },
    toLocale: function (timeStamp) {
      var date = new Date(timeStamp)
      // `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
      return date.toLocaleTimeString()
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getRoomInfo',
      'getWebSocket',
      'getCurRoomId'
    ]),
    gms: function () {
      return this.$store.getters.getMsgListById(this.getCurRoomId)
    }
  },
  created: function () {
    // if (this.$store.getters.getMsgListById(this.getCurRoomId)) {
    //   this.messages = this.$store.getters.getMsgListById(this.getCurRoomId)
    // }
    // var ws = this.getWebSocket
    // var that = this
    // ws.onmessage = function (msg) {
    //   console.log(that.messages)
    // }
  },
  mounted: function () {
    console.log(this.gms)
  }
}
</script>

<style scoped>
  li{
    transition: all 0.3s;
  }
  li:hover{
    color: #a03;
    cursor: pointer;
    background-color: #a93;
    text-shadow: 0 0 5px #a03;
  }
  .panel{
    margin-bottom: 0;
  }
  /*common end*/
  #navigation{
    margin-bottom: 0;
  }
  .panel-area{
    width: 100%;
    height: 100%;
    padding-top: 52px;
    margin-top: -52px;
  }
  .panel-box{
    height: 100%;
  }
  /*common end*/
  .member-area{
    position: relative;
    height: 100%;
    padding-left: 0;
    padding-right: 0;
    overflow: hidden;
    height: 100%;
  }
  .room{
    height: 100%;
  }
  #host-info{
    width: 100%;
    position: absolute;
    bottom: 0;
  }
  .host-name{
    display: block;
    position: absolute;
    bottom: 0;
    width: 100%;
    border: 1px solid #e8e8e8;
    transition: all 0.3s;
    padding: 10px 0;
    cursor: pointer;
  }
  .host-name:hover{
    background-color: #c51;
  }
  .host-detail{
    position: absolute;
    width: 100%;
    bottom: -165px;
  }
  #host-info:hover .host-detail{
    bottom: 42px;
  }
  .host-detail li:hover{
    color: #3df;
  }
  /*member-area end*/
  .chat-area{
    border: 1px solid #f00;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
  }
  .message{
    background-color: black;
    order: 0;
    min-height: 30%;
    flex: 5 3 auto;
    overflow-y: scroll;
  }
  .message::-webkit-scrollbar{
    display: none;
  }
  .msg-box{
    display: flex;
    text-align: left;
    margin-bottom: 20px;
  }
  .m-left{
    justify-content: flex-start;
  }
  .m-right{
    justify-content: flex-end;
  }
  .img-l{
    order: 0;
    flex: 0 0 auto;
  }
  .img-r{
    order: 2;
    flex: 0 0 auto;
  }
  .msg-from{
    font-size: 20px;
    color: #f15;
    font-style: italic;
  }
  .msg-body{
    display: flex;
    flex-direction: column;
    /*margin: 3px 10px;
    padding: 3px 10px;
    word-break: break-all;
    background-color: #fff;
    box-shadow: 0 0 10px #e8e8e8;
    border-radius: 5px;*/
    flex: 0 1 auto;
  }
  .created-time{
    color: #a8a8a8;
    margin: -5px 0 0 10px;
  }
  .content{
    margin: 3px 10px;
    padding: 3px 10px;
    word-break: break-all;
    background-color: #fff;
    box-shadow: 0 0 10px #e8e8e8;
    border-radius: 5px;
    flex: 0 1 auto;
  }
  /*input && send*/
  .input{
    background-color: #0f0;
    display: flex;
    justify-content: space-between;
    order: 1;
    align-items: center;
    height: 10%;
    min-height: 10%;
    flex: 0 1 auto;
    padding-top: 5px;
    box-shadow: 0 0 10px #4f9;
  }
  .input>textarea{
    display: block;
    flex: 1 1 auto;
    height: 100%;
    border: none;
  }
  .input>textarea:focus{
    outline: none;
  }
  .btn-send{
    display: block;
    text-align: center;
    font-size: 25px;
    height: 100%;
    min-width: 50px;
    border-radius: 0;
    border: 2px solid #e8e8e8;
    /*border-left: none;*/
  }
  .btn-send:focus{
    outline: none;
  }
</style>