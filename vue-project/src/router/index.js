import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/UpLoad',
      name: 'UpLoad',
      component: () => import('@/components/UpLoad')
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/home/Index')
    },
    {
      path: '/index1',
      name: 'Index',
      component: () => import('@/views/home/Index1')
    },
    {
      path: '/index2',
      name: 'Index',
      component: () => import('@/views/home/Index2')
    },
    {
      path: '/idx',
      name: 'idx',
      component: () => import('@/views/home/idx')
    },
    {
      path: '/Test',
      name: 'Test',
      component: () => import('@/views/test')
    },
    {
      path: '/Charts',
      name: 'Charts',
      component: () => import('@/views/Charts')
    },
    {
      path: '/Table',
      name: 'Table',
      component: () => import('@/views/Table')
    },
    {
      path: '/Ueditor',
      name: 'Ueditor',
      component: () => import('@/views/ueditor/Index')
    },
    {
      path: '/UeditorBase',
      name: 'UeditorBase',
      component: () => import('@/views/ueditor/UeditorBase')
    }
  ]
})
