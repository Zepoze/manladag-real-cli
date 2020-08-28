import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import App from '@/components/App.vue'


new Vue({
    vuetify,
    el:"#app",
    render: h => h(App)
})
