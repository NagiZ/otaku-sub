<template>
  <div class="index container panel">
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
          <div class="avatar" id="avatar" @click="getHostInfo">
            <img :src="getUserInfo.avatar" :title="getUserInfo.name">
          </div>
        </div>
        <div class="navbar-header collapse navbar-collapse no-margin" id="nav-collapse">
          <ul class="nav navbar-nav">
            <li id="newId">
              <!-- <input type="text" v-model="newId"><span class="glyphicon glyphicon-plus" @click="addFriend"></span> -->
              <form class="navbar-form navbar-left">
                <div class="form-group id">
                  <input type="text" v-model="newId" class="form-control" placeholder="Enter an ID ">
                </div>
                <button type="submit" class="btn btn-info" @click="addFriend">
                  <span>添加</span>
                </button>
              </form>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <!-- navigation ended ->-> index content -->
    <div class="index-group">
      <ul class="list-group channel_list">
        <li class="list-group-item channel_list_item" id="public-box" title="Public Channels" @click="ulShow('public')">PUBLIC
          <ul class="list-group" id="public">
            <li class="list-group-item sub-list-item" v-for="item in roomList" @click="getIn()">
              {{item.name}}
            </li>
          </ul>
        </li>
        <li class="list-group-item channel_list_item" id="private-box" title="Private Channels" @click="ulShow('private')">FRIENDS
          <ul class="list-group" id="private">
            <li class="list-group-item sub-list-item" v-for="item in getSocialCircle" @click="getIn(item.channel_id, $event)">
              <span>{{item.name}}</span>
              <!-- 是否有未读，未读数目。进入channel则置零该channel未读数 -->
              <span class="unread" title="Unread Messages" v-text="item.unread"></span>
            </li>
          </ul>
        </li>
        <li class="list-group-item channel_list_item" title="Semi-public Channels">GROUPS</li>
      </ul>
    </div>
    <router-link to="/index/chat/room">to test</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import $ from 'jquery'
export default {
  name: 'Index',
  data: () => {
    return {
      roomList: [{name: 'Animation', id: 1}, {name: 'Comic', id: 2}, {name: 'Music', id: 3}, {name: 'Film', id: 4}, {name: 'Games', id: 5}, {name: 'Novels', id: 6}],
      newId: ''
    }
  },
  methods: {
    getIn: function (id, e) {
      console.log(e.which)
      switch (e.which) {
        case 1 :
          // this.$store.dispatch('getInChannel', {obj: this, id: id})
          this.$router.push('chat/room')
          break
        case 2 :
          this.$store.dispatch('getFriendInfo', id)
          break
        default: break
      }
    },
    ulShow: function (ele) {
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
    getHostInfo: function () {
      this.$store.dispatch('getHostInfo', this)
    },
    addFriend: function () {
      this.$store.dispatch('addFriend', this)
    }
  },
  computed: {
    ...mapGetters([
      'getSocialCircle',
      'getUserInfo'
    ])
  },
  created: function () {
    // this.$store.dispatch('getMyFriends')
  }
}
</script>

<style scoped>
  .index{
    height: 100%;
    padding: 5px;
    background-color: #af0;
  }
  .avatar{
    width:50px; height: 50px; background-color: #f00; float: right; margin-right: 20px; cursor: pointer;
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
    background-color: #a9f;
  }
  .channel_list_item{
    background-color: transparent;
    border: none;
    border-bottom: 1px solid #fff;
    cursor: pointer;
    transition: all 0.3s;
    overflow: hidden;
    padding-left: 0;
    padding-right: 0;
  }
  .channel_list_item ul{
    opacity: 0.9;
    margin-bottom: -10px;
    margin-top: 10px;

  }
  .sub-list-item{
    position: relative;
    transition: all 0.3s;
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
</style>