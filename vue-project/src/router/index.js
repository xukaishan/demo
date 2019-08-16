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
      name: 'Test',
      component: () => import('@/views/test')
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
      component: () => import('@/views/Ueditor')
    }
  ]
})
