import Vue from 'vue'
import Home from './views/Home.vue'
import KRouter from './krouter'
// 实际执行的是install方法
Vue.use(KRouter)

// 路由基本的配置
export default new KRouter({
  routes:[
    {
      path:'/',
      component:Home,
      // 进入路由之前的生命周期
      beforeEnter(from,to, next){
        // next执行才跳转
        // console.log(`beforeEnter from ${from} to ${to}`)
        // 模拟异步
        setTimeout(()=>{
          // 2秒之后再跳转
          // 做任何权限认证的事情
          next()
        },1000)
      }
    },
    {
      path:"/about",
      component:() => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})