<template>
    <v-card :width="width" :height="height" to="/reader/lelscanv/one-piece/990">
        <v-img max-width="auto" max-height="70%" :src="src ? src : 'https://lelscan.net/mangas/one-piece/990/00.jpg?v=fr1599814660'" contain>
        </v-img>
        <v-card-text>{{ mangaName}} </v-card-text>
    </v-card>
</template>
<script>
import axios from 'axios'
export default {
    props: {
        height: {
            type: String | Number,
            default: 'auto'
        },
        width: {
            type: String | Number,
            default: 'auto'
        },
        mangaName: {
            type: String,
            required: true
        },
        mangaKey: {
            type: String,
            required: true
        },
    }
    ,
    data() {
        return {
            src: undefined
        }
    },
    created() {
        axios
            .get('https://kitsu.io/api/edge/manga?filter[text]='+this.mangaKey+'&page[limit]=1')
            .then(response => {
                let tiny
                if(tiny = response.data.data[0].attributes.posterImage.tiny) this.src=tiny
            })
    },
}
</script>

