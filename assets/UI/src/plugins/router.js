import Vue from "vue"
import VueRouter from "vue-router"
import LocalViewer from '@/components/Viewer.vue'
import Source from '@/components/Source.vue'
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: LocalViewer,
        props: { allowLocalViewer:true }

    },
    {
        path: '/source/:source',
        name: 'Source',
        component: Source
    },
    {
        path: '/reader/:source/:mangaKey/:chapter(\\d+,\?\\d+)',
        name: 'Reader',
        component: LocalViewer
    }
]

const router = new VueRouter({
    mode: "history",
    routes
  })
export default router