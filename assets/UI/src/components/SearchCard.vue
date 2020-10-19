<template>
  <v-card max-width="500px" class="mx-auto" dark>
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
          @keyup.enter="readTry"
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
            >
              mdi-download
            </v-icon>
          </template>
          <template v-slot:item.last="{ item }">
            <v-tooltip v-if="item['last-know-chapter']" left>
              <template v-slot:activator="{on, attrs}">
                <span>
                  <v-icon v-if="nowForLast - item['last-chapter-check'] >= intervalLastChapter" @click="getLastChapter(item)" x-small>
                    mdi-autorenew
                  </v-icon>
                  <v-chip v-bind="attrs" v-on="on" @click="read(item, true)" x-small>{{ item["last-know-chapter"] }}</v-chip>
                </span>
              </template>
              <div>
                <span>Check at : {{ item["last-chapter-check"] ? literalDate(item) : 'unknow' }}</span>
              </div>
            </v-tooltip>
            <v-icon v-else @click="getLastChapter(item)" small>
              mdi-autorenew
            </v-icon>
          </template>

        </v-data-table>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn>hola</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import _ from 'lodash'
import { isDev } from 'options'
import { logDev } from 'utils'
import { setInterval, clearInterval } from 'timers'
let interval
export default {
    data() {
      return {
        intervalLastChapter: 1000*60*10,
        nowForLast: Date.now(),
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
          {
            text: 'Last',
            value: 'last',
            sortable: false
          },
          { text: 'Actions',
            value: 'actions',
            sortable: false
          }
        ]

      }
    },
    beforeMount() {
      this.nowForLast = Date.now()
      interval = setInterval(() => {
        this.nowForLast = Date.now()
      },1000*60*30)
    },
    beforeDestroy() {
      clearInterval(interval)
    },
    computed: {
      datax() {
        const d = this.$store.state.data
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
      read(item, last) {
        let c =''
        if((c = item["last-know-chapter"]) && last) this.chapter = ''+c
        this.itemSelected = { mangaKey: item.mangaKey, source: item.source, mode: 'read' }        
        this.$refs.chapter.$el.focus()

      },
      readTry(data) {
        if(this.ruleChapter(this.chapter)) {
          logDev('ready')
          this.$emit('read', { ...this.itemSelected, chapter: parseFloat(this.chapter) })
        }
      },
      ruleChapter(v) {
        const c = parseFloat(v)
        return v!='' && typeof(c) == 'number' && c >=0 && c!= 0 ? Math.floor(Math.log10(c)) + (c%1 ===0 ? 1 : 2 + (''+c).replace(/\d+\.()/i, '$1').length) == v.length : v.length == 1
      },
      getLastChapter({ source, mangaKey }) {
        this.$socket.emit('get-last-chapter', { source, mangaKey })
      },
      literalDate(i) {
        try {
          const n = i["last-chapter-check"]
          const date = new Date(n)
          const now = new Date(Date.now())
          const dateStr= `${date.getMonth()+1}/${date.getDate()}${now.getFullYear() != date.getFullYear() ? date.getUTCFullYear() : ''}`
          if(date.getMonth() == now.getMonth() && date.getDate() == now.getDate() && date.getFullYear() == now.getFullYear()) {
            return dateStr+' '+ `${date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes() }`
          } else return dateStr
        } catch(e) {
          return 'unknow'
        }
      }
    }
}
</script>
