import Vue from 'vue'
import Router from 'vue-router'

const routerOptions = [
  { path: '/', name: 'home', component: 'Home' },
  { path: '/about', name: 'about', component: 'About' },
  { path: '*', name: 'notFound', component: 'NotFound' }
]

// Lazy load the components
const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/components/${route.component}.vue`)
  }
})

Vue.use(Router)

export default new Router({
  routes,
  mode: 'history'
})
