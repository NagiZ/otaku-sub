<template>
  <div class="IndexPanel container">
    <!-- <nav class="navbar navbar-default no-margin no-border" id="navigation">
      <div class="container-fluid">
        <div class="navbar-header no-margin fl">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#nav-collapse" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand font-cf" href="http://www.baidu.com">Otaku Chat~</a>
          <div class="avatar visible-xs">
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
        <div class="avatar" id="avatar" @click="getHostInfo">
          <img :src="getUserInfo.avatar" :alt="getUserInfo.name">
        </div>
      </div>
    </nav> -->
    <nav class="navbar-inverse navbar-default no-margin no-border" style="max-height: 50px;" id="navigation">
      <div class="container-fluid">
        <div class="navbar-header no-margin fl row">
          <span class="navbar-brand font-cf col-md-3">Otaku Chat~</span>
        </div>
        <!-- 实际上显示当前频道详情才是正解 -->
        <div class="avatar" id="avatar" v-if="avatarShow" @click="userInfoShow">
          <img :src="chatTo.avatar" :alt="chatTo.name">
        </div>
        <div class="navbar-header no-margin">
          <ul class="nav navbar-nav">
            <li id="newId">
              <!-- <input type="text" v-model="newId"><span class="glyphicon glyphicon-plus" @click="addFriend"></span> -->
              <form class="navbar-left">
                <div class="form-group id">
                  <input type="text" v-model="newId" class="form-control" placeholder="Enter an ID ">
                </div>
                <button class="btn" style="margin-left: 20px;" @click="addFriend($event)">
                  <span>添加</span>
                </button>
              </form>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <!-- navigation end ->-> -->
    <div class="container-fluid panel-area">
      <div class="row panel-box">
        <div class="member-area col-md-3 col-sm-4 col-xs-4 panel panel-default">
          <!-- <ul class="list-group">
            <li class="list-group-item" v-for="item in users">
              <img src="#" alt="avatar" :title="item.user" @click="chatTo(item.id)">
              <span class="name" @click="getUserDetail(item.id)">{{item.user}}</span>
            </li>
          </ul>
          <div id="host-info">
            <span class="host-name" @click="getHostInfo"><img src="#" alt="avatar">Nagi</span>
            <ul class="list-group host-detail" style="margin-bottom: 0;">
              <li class="list-group-item">email</li>
              <li class="list-group-item">tag</li>
              <li class="list-group-item">online</li>
              <li class="list-group-item text-danger" @click="signout">Sign out</li>
            </ul>
          </div> -->
          <div class="hostInfoBtn" id="hostInfoBtn" @click="hostInfoShow">
            <span class="glyphicon glyphicon-cog"></span>
          </div>
          <div class="hostInfo" id="hostInfo">
            <div class="na">
              <div>
                <img :src="getUserInfo.avatar" :alt="getUserInfo.name">
                <span class="modify" @click="setting">更改头像</span>
              </div>
              <div>
                <span v-text="getUserInfo.name" id="name"></span>
                <span class="modify" @click="setting">更改名字</span>
              </div>
            </div>
            <ul class="list-group host-detail" style="margin-bottom: 0;">
              <li class="list-group-item" v-text="getUserInfo.email"></li>
              <li class="list-group-item" v-text="getUserInfo.id"></li>
              <li class="list-group-item text-info">Online</li>
              <li class="list-group-item text-danger">Sign out</li>
            </ul>
            <div class="menu-hide-host" @click="hostInfoHide">
              <span class="glyphicon glyphicon-remove"></span>
            </div>
          </div>
          <div class="index-group">
            <ul class="list-group channel_list">
              <li class="list-group-item channel_list_item" id="public-box" title="Public Channels" @click="ulShow('public')"><span>PUBLIC</span>
                <ul class="list-group" id="public">
                  <li class="list-group-item sub-list-item" v-for="item in roomList" @click="getIn($event)">
                    <img :src="item.avatar" :alt="item.name">
                    <span>{{item.name}}</span>
                  </li>
                </ul>
              </li>
              <li class="list-group-item channel_list_item" id="private-box" title="Private Channels" @click="ulShow('private', $event)"><span>FRIENDS</span>
                <ul class="list-group" id="private">
                  <li class="list-group-item sub-list-item" v-for="item in getSocialCircle" @click="getIn($event, item.channel_id)">
                    <img :src="item.avatar" :alt="item.name">
                    <span>{{item.name}}</span>
                    <!-- 是否有未读，未读数目。进入channel则置零该channel未读数 -->
                    <span class="badge" title="Unread Messages" v-if="item.unread" v-text="item.unread"></span>
                  </li>
                </ul>
              </li>
              <li class="list-group-item channel_list_item" title="Semi-public Channels"><span>GROUPS</span></li>
            </ul>
          </div>
        </div>
        <router-view></router-view>
      </div> 
    </div>
    <div class="setting-panel container panel dn" v-if="set">
    </div>
    <div class="setting" id="setting" v-if="set">
      <h4>修改用户名/更换头像</h4>
      <div class="setting-item-name">
        <input type="text" placeholder="输入新用户名" id="username-input">
        <span class="btn comfirm" id="confirm-name" @click="changeName">确认</span>
      </div>
      <div class="setting-item-avatar">
        <canvas width="100" height="100" id="canvas">
          ...
        </canvas>
        <canvas id="canvas_sub" width="420" height="280" v-show="am"></canvas>
        <img src="" id="img_sub" class="dn">
        <div>
          <input type="file" id="avatar-file" class="dn" accept="image/*" enctype="multipart/form-data">
          <button class="btn btn-success" id="file-select" @click="selectImg">选择文件</button>
          <span class="btn comfirm" id="confirm-avatar" @click="changeavatar">确认</span>
        </div>
      </div>
      <!-- <div class="setting -hide-host">
        <span class="glyphicon glyphicon-remove"></span>
      </div> -->
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import $ from 'jquery'
import iA from '../../config/indexAction.js'
import ch from '../../config/cookieHandler.js'
// import rA from '../../config/roomActions.js'
export default {
  name: 'IndexPanel',
  data: () => {
    return {
      roomList: [{name: 'Animation', id: 1}, {name: 'Comic', id: 2}, {name: 'Music', id: 3}, {name: 'Film', id: 4}, {name: 'Games', id: 5}, {name: 'Novels', id: 6}],
      newId: '',
      chatTo: {},
      avatarShow: false,
      set: false,
      am: false,
      aData: ''
    }
  },
  methods: {
    getHostInfo: function () {
      this.$store.dispatch('getHostInfo', this)
    },
    getIn: function (e, id) {
      e.stopPropagation()
      console.log(e.which)
      switch (e.which) {
        case 1 :
          this.$store.dispatch('getInChannel', {obj: this, id: id})
          break
        case 2 :
          this.$store.dispatch('getFriendInfo', id)
          break
        default: break
      }
    },
    ulShow: function (ele, event) {
      switch (ele) {
        case 'public' :
          $('#public').slideToggle()
          break
        case 'private' :
          $('#private').slideToggle()
          break
        default: break
      }
    },
    addFriend: function (e) {
      e.preventDefault()
      this.$store.dispatch('addFriend', this)
    },
    hostInfoShow: function () {
      $('#hostInfo').addClass('noleft')
      $('#hostInfoBtn').addClass('dn')
    },
    hostInfoHide: function () {
      $('#hostInfo').removeClass('noleft')
      $('#hostInfoBtn').removeClass('dn')
    },
    userInfoShow: function () {
      this.$store.commit('showCorUInfo', {channel_id: this.getCurRoomId, showTag: 1})
    },
    setting: function () {
      this.set = true
    },
    changeName: async function () {
      var ifok = await this.$store.dispatch('changeName', {newName: $('#username-input').val()})
      console.log(ifok)
      if (ifok) {
        alert('修改成功')
        $('#username-input').val('')
        this.set = false
      }
    },
    changeavatar: async function () {
      var cvs = document.getElementById('canvas')
      this.aData = iA.canvasData(cvs, this.getUserInfo.name)
      var ifsuccess = await this.$store.dispatch('changeAvatar', {data: this.aData})
      if (ifsuccess.status === 'success') {
        alert('修改成功')
        // 低版本浏览器无效 待改进
        $('#vatar-file').val('')
        var ctx = document.getElementById('canvas_sub').getContext('2d')
        $('#canvas_sub').get(0).onmousemove = function () {
          return false
        }
        ctx.clearRect(0, 0, 420, 280)
        this.set = false
        this.am = false
        await this.$store.dispatch('getHostInfo')
      }
    },
    selectImg: function () {
      var left = $('.setting-item-avatar').get(0).offsetWidth - 420
      this.am = true
      $('#canvas_sub').css('left', left / 2)
      iA.changeA($('#avatar-file'), $('#canvas'), $('#canvas_sub'), $('#img_sub'), 64)
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getSocialCircle',
      'getCurRoomId'
    ]),
    gms: function () {
      return this.$store.getters.getMsgListById(this.getCurRoomId)
    }
  },
  mounted: function () {
  },
  created: async function () {
    var obj = {id: ch.getCookieItem('id'), user_token: ch.getCookieItem('user_token')}
    if (this.getUserInfo.token) {
      return
    }
    if (obj.user_token) {
      await this.$store.dispatch('skipLogin', obj)
    } else {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
  input:focus{
    outline: none!important;
  }
  li{
    transition: all 0.3s;
  }
  li:hover{
    cursor: pointer;
    text-shadow: 0 0 10px #fff;
  }
  .panel{
    margin-bottom: 0;
  }
  .dn{
    display: none;
  }
  .fl{
    float: left;
  }
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
    background-color: #000;
  }
  /*common end*/
  .member-area{
    position: relative;
    border: none;
    border-radius: 0;
    height: 100%;
    padding-left: 0;
    padding-right: 0;
    overflow: hidden;
    height: 100%;
    background: #353535;
  }
  .IndexPanel{
    height: 100%;
    position: relative;
    overflow: hidden;
    padding: 0;
  }
  /*index*/
  .index{
    height: 100%;
    padding: 5px;
    background-color: #af0;
  }
  .avatar{
    width:50px; height: 50px; float: right; margin-right: 20px; cursor: pointer;
  }
  .avatar>img{
    width: 50px;
    height: 50px;
    border-radius: 50px;
  }
  .no-margin{
    margin: 0;
  }
  .no-border{
    border: none;
  }
  #nav-collapse::-webkit-scrollbar{
      display: none;
  }
  html::-webkit-scrollbar{
      display: none;
  }
  .channel_list{
    color: #0af;
  }
  .channel_list_item{
    background-color: transparent;
    border-radius: 0;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
    overflow: hidden;
    padding-left: 0;
    padding-right: 0;
    box-shadow: 0 0 5px #fff;
  }
  .channel_list_item ul{
    color: #fff;
    opacity: 0.9;
    margin-bottom: -10px;
    margin-top: 10px;

  }
  .sub-list-item{
    position: relative;
    transition: all 0.3s;
    vertical-align: middle;
    height: 60px;
    border: none;
    border-radius: 0;
    background-color: transparent;
    box-shadow: 0 0 5px #000;
  }
  .sub-list-item>img{
    position: absolute;
    left: 6px;
    top: 6px;
    width: 48px;
    border-radius: 48px;
  }
  .sub-list-item:hover{
    background-color: #f05;
/*    font-size: 25px;
    padding: 20px 0;
*/    box-shadow: 0 0 50px #000;
  }
  #public, #private{
    display: none;
  }
  #newId{
    overflow: hidden;
    display: flex;
    flex-direction: 
  }
  #newId .id{
    float: left;
  }
  #newId input{
    border: none;
    display: inline-block;
    border-radius: 5px;
    padding: 5px 20px;
  }
  #newId button{
    display: inline-block;
  }
  #newId button:focus{
    outline: none;
  }
  /*#public-box:hover #public{
    display: block;
  }*/
  .unread{
    position: absolute;
    font-size: 10px;
    color: #fff;
    text-shadow: 0 0 3px #fff;
    right: 0;
    margin-right: 5px; 
    padding: 3px;
    border-radius: 14px;
    background-color: #a0a;
  }
  .cover{
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: #000;
  }
  /*setting*/
  .hostInfoBtn{
    position: absolute;
    bottom: -10px;
    left: 0;
    font-size: 26px;
    color: #aaa;
    z-index: 100;
    transition: all 0.3s;
    cursor: pointer;
  }
  .hostInfoBtn:hover{
    text-shadow: 0 0 10px #111;
  }
  .menu-hide-host{
    position: absolute;
    padding: 5px;
    right: 0;
    bottom: -10px;
    font-size: 26px;
    color: #121212;
    z-index: 100;
    transition: all 0.3s;
    cursor: pointer;
  }
  .menu-hide-host:hover{
    text-shadow: 0 0 10px #aaa;
    box-shadow: 0 0 10px #aaa;
  }
  .hostInfo{
    position: absolute;
    border-right: 1px solid #333;
    z-index: 101;
    width: 100%;
    left: -100%;
    height: 100%;
    background-color: #383838;
    transition: all 0.3s;
  }
  .na{
    vertical-align: middle;
    min-height: 30%;
    text-align: left;
    box-shadow: 0 1px 3px #fff;
    color: #fff;
  }
  .na>div{
    position: relative;
  }
  .na>div>img{
    width: 70px;
    height: 70px;
    border-radius: 70px; 
  }
  .na #name{
    display: inline-block;
    font-size: 25px;
    color: #fff;
    width: 100%;
    text-shadow: 0 0 15px #fff;
    padding: 20px 5px;
  }
  .na:hover .modify{
    display: inline-block;
  }
  .modify{
    position: absolute;
    display: none;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #08f;
    transition: all 0.3s;
  }
  .modify:hover{
    text-shadow: 0 0 10px #fff;
  }
  .host-detail{
    color: #fff;
    border: none;
    box-shadow: 0 -1px 3px #fff;
  }
  .host-detail>li{
    border: none;
    border-radius: 0;
    background-color: transparent;
  }
  .noleft{
    left: 0;
  }
  /*弹出设置修改部分*/
  .setting-panel{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    background-color: #111;
    opacity: 0.5;
  }
  .setting{
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 50px;
    left: 50%;
    width: 65%;
    height: 85%;
    color: #fff;
    background-color: #383838;
    transform: translateX(-50%);
  }
  .comfirm:hover{
    color:#fff;
    text-shadow: 0 0 10px #fff;
  }
  .setting>h4{
    font-family: Georgia, serif; 
  }
  .setting-item-name{
    padding: 20px 40px;
    flex: 0 0 auto;
  }
  .setting-item-name>input{
    border: none;
    width: 100%;
    float: left;
    border-bottom: 1px solid #fff;
    padding: 8px 15px;
    padding-right: 60px;
    background-color: transparent;
  }
  #confirm-name{
    border: none;padding: 8px 12px;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    margin-left: -56px;
  }
  .setting-item-avatar{
    flex: 1 0 auto;
    position: relative;
    padding: 20px 40px;
    overflow: hidden;
  }
  .setting-item-avatar>div{
    position: absolute;
    left: 200px;
    top: 50px;
  }
  #canvas{
    float: left;
    border: 1px solid #fff;
    background-color: #fff;
  }
  #canvas_sub{
    position: absolute;
    bottom: 10px;
  }
</style>