/* eslint-disable no-console */
let Vue 
class Router {
    static install(_vue) {
        Vue = _vue
        Vue.mixin({
            beforeCreate () {
                Vue.prototype.$xulei = 99
                if (this.$options.router) {
                    Vue.prototype.$router = this.$options.router
                    this.$options.router.init()
                }

            }
        })
    }
    constructor(options) {
        this.routerOptions = options
        this.routerMap = {}
        this.app = new Vue({
            data: {
                current: '/'
            }
        })
    }
    getHash() {
        return window.location.hash.slice(1) || '/'
    }
    getForm(e) {
        let from , to
        if (e.newURL) {
            from = e.oldURL.split('#')[1]
            to = e.newURL.split('#')[1]
        }else {
            from = ''
            to = location.hash
        }
        return {from, to}

    }
    onHashChange(e) {
        let {from , to} = this.getForm(e)
        let hash = this.getHash()
        let router = this.routerMap[hash]
        if (router.beforeEnter) {
            router.beforeEnter(from, to , ()=> {
                this.app.current = this.getHash()
            })
        }
    }
    bindEvent() {
        window.addEventListener('load', this.onHashChange.bind(this), false)
        window.addEventListener('hashchange', this.onHashChange.bind(this), false)
    }
    creatRouteMap(options) {
        options.routes.forEach(item=> {
            this.routerMap[item.path] = item
        })
    }
    initComponent(Vue) {
        Vue.component('router-link', {
            props: {
                to: String
            },
            render(h) {
                return h('a', {
                    attrs: {
                        href: '#' + this.to
                    }
                },
                [this.$slots.default]
                )
            }
        })
        const _this = this
        Vue.component('router-view', {
            render(h) {
                // console.log('_this.routerMap[_this.app.current]', _this.routerMap);
                return h(_this.routerMap[_this.app.current].component)
            }
        })
    }
    init() {
        this.bindEvent()
        this.creatRouteMap(this.routerOptions)
        this.initComponent(Vue)
    }
}
export default Router