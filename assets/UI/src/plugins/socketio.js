import Vue from 'vue'
import store from './store/index.js'
import VueSocketIO from 'vue-socket.io'
import options from 'options'
import io from 'socket.io-client'
Vue.use(new VueSocketIO({
    debug: true,
    connection: io(options.ui.hostBase, { reconnectionAttempts: 1 }),
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
}))