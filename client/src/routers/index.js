import { createRouter, createWebHashHistory } from "vue-router";


const routes = [
    {
        path: '/',
        component: () => import('../views/HomePage.vue')
    },
    {
        path: '/test',
        component: () => import('../views/Test.vue')
    },
    {
        path: '/detail',
        component: () => import('../views/Detail.vue')
    },
    {
        path: '/login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/dashboard',
        redirect: { name: 'article' },
        component: () => import('../views/dashboard/Dashboard.vue'),
        children:
            [
                {
                    path: 'category',
                    component: () => import('../views/dashboard/Category.vue'),
                },
                {
                    name: 'article',
                    path: 'article',
                    component: () => import('../views/dashboard/Article.vue'),
                }
            ]
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export { router, routes }