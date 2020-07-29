// 路由配置
import Vue from 'vue'
import VueRouter from 'vue-router' // 路由插件

import Login from '../component/login/Login.vue'
import Admin from '../component/admin/Admin.vue'

// 组件
import GoodsList from '../component/admin/goods/list/List.vue'
import GoodsDetail from '../component/admin/goods/detail/Detail.vue'
import GoodsComment from '../component/admin/goods/comment/Comment.vue'

Vue.use(VueRouter)

// admin的子路由 => 商品管理模块相关页面
const goods = [
    { name: 'goodsList', path: 'goods/list', component: GoodsList }, // 子路由path不加/自动拼接父路由path
    { name: 'goodsDetail', path: 'goods/detail/:id', component: GoodsDetail }, // 子路由path不加/自动拼接父路由path
    { name: 'goodsComment', path: 'goods/comment', component: GoodsComment } // 子路由path不加/自动拼接父路由path
];

// 导出路由实例 
let router = new VueRouter({
    routes: [
        { name: 'login', path: '/login', component: Login },

        { name: 'admin', path: '/admin', component: Admin, children: [...goods] },
    ]
});

// to与from是两个对象, 可以拿到url信息
router.beforeEach((to, from, next) => {
    
    Vue.prototype.$http.get(Vue.prototype.$api.islogin).then(res => {
        let isLogin = false;

        // 已登陆
        if(res.data.code == 'logined') {
            isLogin = true;
        }

        if(to.name == 'login') {
            if(isLogin) {
                next({name: 'admin'});
            }else {
                next();
            }
        }

        if(to.name != 'login') {
            if(isLogin) {
                next();
            }else {
                // 登陆成功
                next({name: 'login', query: {next: to.fullPath}}); 
            }
        }
    })
});

export default router;
