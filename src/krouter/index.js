
let Vue

class Router {
    static install(_Vue) {
        Vue = _Vue
        Vue.mixin({
            beforeCreate() {
                if(this.$options.router){
                    // new Vue的时候传递的
                    Vue.prototype.$kkbrouter = '哈喽啊 小老弟'
                    Vue.prototype.$krouter = this.$options.router
                    this.$options.router.init()
                    // console.log(this.$options.router)
                }
                // console.log(options)
            }
        })
    }
    constructor(options) {
        this.$options = options
        this.routeMap = {}
        this.app = new Vue({
            data: {
                current: '/'
            }
        })

    }
    // 绑定事件
    init() {
        this.bindEvents()
        this.createRouteMap(this.$options)
        this.initComponent(Vue)
    }
    bindEvents(){
        window.addEventListener('load', this.onHashChange.bind(this), false)
        window.addEventListener('hashchange', this.onHashChange.bind(this), false)

    }
    // 路由映射表
    createRouteMap(options) {
        options.routes.forEach(item => {
            this.routeMap[item.path] = item
        })
    }
    // 注册组件
    initComponent(Vue) {
        Vue.component('router-link', {
            props: {
                to: String
            },
            render(h){
                return h('a',{
                    attrs:{
                        href:'#'+this.to
                    }
                },[
                    this.$slots.default
                ])
            }
            // render
            // template: '<a :href="to"><slot>123</slot></a>'
        })

        const _this = this
        Vue.component('router-view', {
            render(h) {
                var component = _this.routeMap[_this.app.current].component
                return h(component)
            }
        })
    }

    // 获取当前 hash 串
    getHash() {
        return window.location.hash.slice(1) || '/'
    }
    push(url){
      window.location.hash  = url
    //   如果是
        // window.history.pushState(null,null,'#/'+url)
    }
    getFrom(e){
        let from, to
        if(e.newURL){
            from = e.oldURL.split('#')[1]
            to = e.newURL.split('#')[1]
        }else{
            from = ''
            to = location.hash
        }
        return {from,to}
    }
    // 设置当前路径
    onHashChange(e) {
        let {from, to} = this.getFrom(e)
        let hash = this.getHash()
        let router = this.routeMap[hash]

        if(router.beforeEnter){
            router.beforeEnter(from, to, ()=>{
                this.app.current = this.getHash()

            })
        }else{
            this.app.current = this.getHash()
        }
    }
}


export default Router