import Vue from 'vue'
import store from './store/index.js'
import VueSocketIO from 'vue-socket.io'
import options from 'options'

Vue.use(new VueSocketIO({
    debug: options.isDev,
    connection: options.ui.hostBase,
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
}))