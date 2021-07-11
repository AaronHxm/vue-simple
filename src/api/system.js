import request from '../service/request'
import Layout from '@/layout'
import router from '../router'

export const getCascader = (params) => request('/user/loginByUserNameAndPwd',
  params,
  'post')
var count = 0

export function filterAsyncRoutes(asyncRouter) {
  count++
  const accessedRoutes = []
  asyncRouter.forEach(router => {
    router = {
      path: router.url ? router.url : '',
      name: router.menuName,
    //  isHidden:router.jsJump,
      //redirect:router.redirect,
      component: router.url,
      // alwaysShow: true,
      meta: {
        title: router.name,
        icon: router.icon // 设置该路由的图标
      },
      hidden:router.jsJump ===  '0'?true:false,
      children: router.children || []
    }

    if (router.component) {
      if (router.children && router.children.length) {

        router.component = Layout
      } else {
        if (router.component === 'Layout') {
          router.component = Layout
        } else {
          const component = router.path
          router.component = resolve => require([`@/views${component}`], resolve)
        }
      }
    } else {

      router.component = Layout
    }
    if (router.children && router.children.length) {

      router.children = filterAsyncRoutes(router.children)

    }

    accessedRoutes.push(router)
  })

  return accessedRoutes
}

export const rzqx = ['12', '24', '36', '48', '60']


