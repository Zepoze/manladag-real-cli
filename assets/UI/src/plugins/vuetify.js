import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import '@mdi/font/css/materialdesignicons.min.css'

Vue.use(Vuetify)


export default new Vuetify({
    theme: {
        dark: true,
        themes: {
            dark: {
                primary: '#FF5252'
            },
            light: {
                primary: '#FF7F00'
            }
        }
    }
})