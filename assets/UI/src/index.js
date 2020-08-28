import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import store from '@/plugins/store'
import './plugins/socketio'
import App from '@/components/App.vue'

new Vue({
    vuetify,
    store,
    render: h => h(App)
}).$mount('#app')
