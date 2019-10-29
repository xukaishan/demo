import Vue from 'vue'
import Router from 'vue-router'

const BaseOral = resolve => require(['@/components/BaseOral'], resolve)
const PracticalOral = resolve => require(['@/components/PracticalOral'], resolve)
const RaiseOral = resolve => require(['@/components/RaiseOral'], resolve)
const ContentBase = resolve => require(['@/views/ContentBase'], resolve)
const Home = resolve => require(['@/views/Home'], resolve)
const Test = resolve => require(['@/views/Test'], resolve)

Vue.use(Router)


const routes = [
    {
        path: '/',
        redirect:'/Test',
        component: Home,
        meta: ['年级选择']
    },
    {
        path: '/Test',
        component: Test,
        meta: ['年级选择']
    },
    {
        path: '/contentBase',
        component: ContentBase,
        children: [
            {
                path: '/contentBase',
                component: BaseOral,
                meta: ['0']
            },
            {
                path: '/contentBase/BaseOral',
                component: BaseOral,
                meta: ['0']
            },
            {
                path: '/contentBase/RaiseOral',
                component: RaiseOral,
                meta: ['1']
            },
            {
                path: '/contentBase/PracticalOral',
                component: PracticalOral,
                meta: ['2']
            }
        ]
    }

]

export default new Router({
    routes,
})
