<template>
  <v-card max-width="500px" class="mx-auto">
    <v-card-title>
      <v-spacer>
        <v-text-field
          v-show="!itemSelected.mode"
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-text-field
          ref="chapter"
          v-model="chapter"
          :rules="[ruleChapter]"
          v-show="itemSelected.mode"
          append-icon="mdi-magnify"
          label="Chapter"
          single-line
          hide-details
          @keyup.enter="gop"
          @blur="itemSelected = {}"
        ></v-text-field>
      </v-spacer>
    </v-card-title>
    <v-card-text class="text-align-center" style="height:300px">
        <v-data-table
        :headers="headers"
        :items="datax"
        :search="search"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon
              :color="item.mangaKey == itemSelected.mangaKey && item.source == itemSelected.source && itemSelected.mode == 'read' ? 'primary' : ''"
              small
              class="mr-2"
              @click="read(item)"
            >
              mdi-eye
            </v-icon>
            <v-icon
              small
              @click="go(item)"
            >
              mdi-download
            </v-icon>
          </template>
        </v-data-table>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn @click="go">hola</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import _ from 'lodash'
export default {
    data() {
      return {
        itemSelected: {},
        modeSearch: true,
        search: undefined,
        chapter: '',
        headers: [
          {
            text: 'Library',
            value: 'source'
          },
          {
            text: 'Manga',
            value: 'name'
          },
          { text: 'Actions',
            value: 'actions',
            sortable: false
          }
        ]

      }
    },
    computed: {
      datax() {
        const d = this.$store.state.data
        console.log(d)
        return _.flatten(
          _.concat(Object.values(d).map(
            (e,i)=> Object.values(e.mangas).map( 
              (l,li) => ({...l, source: Object.keys(d)[i], mangaKey: Object.keys(Object.values(d)[i].mangas)[li]})
            )
          ))
        )
      }
    },
    methods: {
      go(data) {
        console.log(data ? data : this.datax)
      },
      read(item) {
        this.itemSelected = { mangaKey: item.mangaKey, source: item.source, mode: 'read' }
        this.$refs.chapter.$el.focus()
        console.log(this.$refs.chapter)

      },
      gop(data) {
        if(this.ruleChapter(this.chapter)) {
          console.log('ready')
          this.$emit('read', { ...this.itemSelected, chapter: parseFloat(this.chapter) })
        }
      },
      ruleChapter(v) {
        const c = parseFloat(v)
        return v!='' && typeof(c) == 'number' && c >=0 && c!= 0 ? Math.floor(Math.log10(c)) + (c%1 ===0 ? 1 : 2 + (''+c).replace(/\d+\.()/i, '$1').length) == v.length : v.length == 1
      },
    }
}
</script>
