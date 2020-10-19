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
        },
        "SOCKET_get-last-chapter"(state, { source, mangaKey, chapter, check }) {
            if(chapter)
                state.data[source].mangas[mangaKey] = {...state.data[source].mangas[mangaKey], "last-know-chapter":chapter}
            if(check)
            state.data[source].mangas[mangaKey] = {...state.data[source].mangas[mangaKey], "last-chapter-check": check }

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