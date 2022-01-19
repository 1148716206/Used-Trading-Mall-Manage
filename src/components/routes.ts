const WEB_NAME = '后台管理系统';

export default [
  {
    path: '/404',
    component: '@/components/404',
    name: '404',
    key: '404'
  }, {
    path: '/500',
    component: '@/components/500',
    name: '500',
    key: '500'
  }, {
    title: `${WEB_NAME}-首页`,
    path: '/',
    component: '@/layout/index',
    name: '首页',
    key: 'index',
    routes:[
      {
        title: `${WEB_NAME}-用户管理`,
        path: '/User',
        component: '@/components/User/index',
        name: '用户管理',
        key: 'user'
      }, {
        title: `${WEB_NAME}-商品管理`,
        path: '/products',
        component: '@/components/Products/index',
        name: '商品管理',
        key: 'products'
      }, {
        title: `${WEB_NAME}-订单管理`,
        path: '/order',
        component: '@/components/Order/index',
        name: '订单管理',
        key: 'order'
      }, {
        title: `${WEB_NAME}-留言管理`,
        path: '/message',
        component: '@/components/Message/index',
        name: '留言管理',
        key: 'message'
      },
    ]
  },

]
