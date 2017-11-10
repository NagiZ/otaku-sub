import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Index from '@/components/Index'
import Room from '@/components/Room'
import HostSetting from '@/components/HostSetting'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/index',
      name: 'Index',
      component: Index
    },
    {
      path: '/chat/room',
      component: Room,
      name: 'Room'
    },
    {
      path: '/users/hostsetting',
      component: HostSetting,
      name: 'HostSetting'
    }
  ]
})
