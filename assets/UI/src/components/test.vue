<template>
    <v-btn @click="$emit('dis')"> {{ data }} </v-btn>
</template>
<script>
export default {
    name: 'test',
    props:  {
        data: {
            type: String,
            default: 'test'
        }
    },
    sockets: {
        connect(data) {
            console.log('socket connected')
            console.log(data)
        },
        test(data) {
            console.log(data)
        }
    }
}
</script>

