<template>
    <v-container v-if="$store.state.data[$route.params.source]" fluid>
        <v-row>
            <v-col cols="auto" v-for="(m,_m,o) in mangas" :key="`${_m}-${o}`">
                <manga-mini-view :manga-name="m.name" :manga-key="_m" :width="100" height="100%"/>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import MangaMiniView from '@/components/MangaMiniView.vue'
export default {
    components: {
        MangaMiniView
    },
    mounted() {
        console.log(this.$route)
    },
    computed: {
        mangas() {
            return this.$store.getters.mangas(this.$route.params.source)
        }
    }
}
</script>

