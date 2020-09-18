import Vue from "vue"
import VueRouter from "vue-router"
import LocalViewer from '@/components/Viewer.vue'
import Source from '@/components/Source.vue'
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: LocalViewer        
    },
    {
        path: '/source/:source',
        name: 'Source',
        component: Source
    }
]

const router = new VueRouter({
    mode: "history",
    routes
  })
export default router