
import Vue from 'vue'
import Router from 'vue-router'
import home from './views/home'

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: home
        }
    ]
})

export default router;
