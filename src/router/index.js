import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
// import Index from '@/components/Index'
import IndexPanel from '@/components/IndexPanel'
import Room from '@/components/Room'
import Setting from '@/components/Setting'
// import Test from '@/components/test'

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
      name: 'IndexPanel',
      component: IndexPanel,
      children: [
        {
          path: '/index/room/:id',
          component: Room,
          name: 'Room'
        },
        {
          path: '/index/host/setting',
          component: Setting,
          name: 'Setting'
        }
      ]
    }
  ]
})
