import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        data: {}
    },
    mutations: {
        "SOCKET_init"(state,p) {
            state.data = {...p}
        }
    },
    actions: {},
    getters: {
        source(state) {
            return Object.keys(state.data)
        },
        mangas: (state) => (s) => state.data[s].mangas
    },
    modules: {}
})