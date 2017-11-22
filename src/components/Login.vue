<template>
  <div class="login">
    <div class="container-fluid row loginBox">
      <div class="col-md-4 col-sm-6 col-md-offset-4 col-sm-offset-3">
        <form method="formMds" id="login-form" class="lf form-horizontal">
          <div class="form-gorup">
            <label for="username">Username</label>
            <input type="text" v-model="username" name="name" class="form-control common-input" placeholder="Enter Your Username" id="username">
          </div>
          <div class="form-gorup">
            <label for="e-mail">E-mail</label>
            <input type="email" v-model="email" class="form-control common-input" name="email" placeholder="Enter Your Email" id="e-mail">
          </div>
          <div class="form-gorup">
            <label for="password">Password</label>
            <input type="password" v-model="password" class="form-control common-input" name="password" placeholder="Enter Your Password" id="password">
          </div>
          <div class="form-gorup" id="captcha-box">
              <input type="text" class="form-control common-input captcha-input" v-model="captcha">
            <!-- http://173.254.200.108:80/user/captcha -->
              <img id="captcha" src="http://173.254.200.108:80/user/captcha" title="看不清？换一张"  @click="getCaptcha">
          </div>
          <div class="btn-act">
            <button class="btn si" @click="sign($event)">Sign In</button>
            <router-link to="/f-pw" class="f-pw" @click="">忘记密码</router-link>
            <button class="btn btn-info su" @click="register($event)">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
export default {
  name: 'Login',
  data () {
    return {
      password: '',
      email: '',
      username: '',
      captcha: ''
    }
  },
  methods: {
    sign: function (event) {
      if (this.captcha.trim() === '') {
        return false
      }
      var that = this
      event.preventDefault()
      that.$store.dispatch('signIn', that)
    },
    register: function (event) {
      if (this.captcha.trim() === '') {
        return false
      }
      var that = this
      event.preventDefault()
      that.$store.dispatch('register', that)
    },
    getCaptcha: function () {
      $('#captcha').get(0).src = 'http://173.254.200.108:80/user/captcha' + '?' + Math.random() * 100000000000
      // this.$store.dispatch('getCaptcha', this)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .login{
    height: 100%;
    background-color: #000;
  }
  .dn{
    display: none;
  }
  .lf{
    text-align: left;
  }
  .lf>div{
    margin-bottom: 20px;
  }
  .loginBox{
    padding-top: 50px;
    margin-left: 0;
    margin-right: 0;
  }
  .loginBox>div{
    padding: 15px 30px;
  }
  /*button in form*/
  .btn-act{
    display: flex;
    overflow: hidden;
    justify-content: space-around;
    height: 90px;
    padding: 8px 0;
  }
  .si, .su{
    align-self: flex-start;
    transition: all 0.3s;
  }
  .si:hover, .su:hover{
    opacity: 0.9;
    box-shadow: 0 0 10px #d8d8d8;
  }
  .f-pw{
    align-self: flex-end;
  }
  .common-input{
    border: none;
    box-shadow: 0 0 10px #d8d8d8;
    transition: all 0.5s;
  }
  .common-input:focus{
    outline: none;
    box-shadow: 0 0 30px #38e;
  }
  #captcha-box{
    /*border: 1px solid #0f0;*/
    /*box-shadow: 0 0 30px #e8e8e8;*/
  }
  #captcha{
    padding: 2px 0;
    height: 100%;
    margin-left: -86px;
    cursor: pointer;
  }
  .captcha-input{
    display: inline;
    max-width: 160px;
    float: left;
    box-shadow: 0 0 -30px #f00;
  }
</style>
