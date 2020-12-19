<template>
  <v-app id="inspire">
    

    <v-main>
      <router-view></router-view>
    </v-main>


    <!--<v-footer
      app
      color="blue-grey"
      class="white--text"
    >
      <span>Vuetify</span>
      <v-spacer></v-spacer>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->
  </v-app>
</template>

<script>
  import { mapGetters } from 'vuex'
  import options from 'options'
  import Test from '@/components/test.vue'

  export default {
    components: {
      Test
    },
    data: () => ({
      drawer: null,
      drawerRight: null,
      right: false,
      left: false,
      text: 'wow',
      show: true
    }),
    computed: {
      ...mapGetters([
        'source'
      ])
    },
    sockets: {
    },
    mounted() {
      console.log('app mounted')
    }
  }
</script>
