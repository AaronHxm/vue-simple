import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken,removeToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import {reconstruction} from '@/utils/utils'
import { filterAsyncRoutes} from '@/api/system'
import Layout from '@/layout'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect','css'] // no redirect whitelist
var hasMenus = false
router.beforeEach(async(to, from, next) => {

  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)
  if (whiteList.indexOf(to.path) !== -1) {
    // in the free login whitelist, go directly
    next()
  }
  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {

    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // determine whether the user has obtained his permission roles through getInfo


      const hasUser = localStorage.getItem('userInfo') != null
      if (hasUser && hasMenus) {
        next()
      } else {
        try {
          hasMenus = true
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
         // store.dispatch('user/getInfo')
          const accessRoutes =  await store.dispatch('user/getInfo',hasToken)
           // generate accessible routes map based on roles

          let routers = reconstruction(accessRoutes.sysMenus,'sysMenuId','menuFid','children')
          routers = filterAsyncRoutes(routers)
          localStorage.setItem('menus',JSON.stringify(routers))
          routers.unshift(  {
              path: '/login',
              component: () => import('@/views/login/index'),
              hidden: true
            },

            {
              path: '/404',
              component: () => import('@/views/404'),
              hidden: true
            },
            {
              path: '/',
              component: Layout,
              redirect: '/dashboard',
              children: [{
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/index'),
                meta: { title: '首页', icon: 'dashboard' }
              },{
                path: '/org',
                name: '部门管理',
                component: () => import('@/views/sys/org/orgList'),
                hidden: false,
          meta: { title: '部门管理', icon: 'dashboard' }
              }]
            },
            {path: '*', redirect: '/login', hidden: true})
          router.options.routes = routers
          console.log("routers------>",routers)

          // dynamically add accessible routes
          router.addRoutes(routers)
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          console.log('error',error)
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
         // Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
