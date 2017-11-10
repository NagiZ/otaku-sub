<template>
  <div class="hostSetting">
    <h3></h3>
    <ul class="list-group">
      <li class="list-group-item" v-for="(value, key) in getUserInfo">{{key}}: {{value}}</li>
    </ul>
    <!-- <button @click="addTest">添加Cat</button> -->
    <!-- <button @click="showMyFriends">我的好友</button> -->
    <!-- <button @click="getFriendInfo('1')">Get Cat Info</button> -->
    <input type="text" v-model="newName" name="newname" id="newname" placeholder="New Name">
    <button @click="changeName">Change Tag/Name</button>
    <!-- <button @click="getMyChannelList">Channel List</button> -->
    <!-- <button @click="createChnnel">Create Channel</button> -->
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'HostSetting',
  data: function () {
    return {
      newName: ''
    }
  },
  created: function () {
    console.log(this.getUserInfo)
  },
  methods: {
    addTest: function (id) {
      this.$store.dispatch('addFriend', this)
    },
    showMyFriends: function () {
      this.$store.dispatch('getMyFriends')
    },
    getFriendInfo: function (id) {
      this.$store.dispatch('getFriendInfo', id)
    },
    changeName: function () {
      this.$store.dispatch('changeName', this)
    },
    getMyChannelList: function () {
      this.$store.dispatch('getMyChannelList')
    },
    createChnnel: function () {
      this.$store.dispatch('createNormalChannel')
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo'
    ])
  }
}
</script>