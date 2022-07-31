import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'geojson',
    component: () => import('../views/geojson.vue')
  },
  {
    path: '/geojson',
    name: 'geojson1',
    component: () => import('../views/geojson.vue')
  },
  {
    path : '/dynamic-style',
    name : 'dynamicStyle',
    component : () => import('../views/dynamicStyle.vue')
  },
  {
    path : '/image',
    name : 'image',
    component : () => import('../views/image.vue')
  },
  {
    path : '/video',
    name : 'video',
    component : () => import('../views/video.vue')
  },
  {
    path : '/vector',
    name : 'vector',
    component : () => import('../views/vector.vue')
  },
  {
    path : '/fog',
    name : 'fog',
    component : () => import('../views/fog.vue')
  },
  {
    path : '/popup',
    name : 'popup',
    component : () => import('../views/popup.vue')
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
