import "core-js/modules/es6.promise"
import "core-js/modules/es6.array.iterator"

import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import store from '@/plugins/store/index.js'
import router from '@/plugins/router.js'
import '@/plugins/socketio'
import App from '@/components/App.vue'

new Vue({
    vuetify,
    store,
    router,
    render: h => h(App)
}).$mount('#app')
