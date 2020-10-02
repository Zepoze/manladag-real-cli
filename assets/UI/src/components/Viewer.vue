<template>
    <v-container fluid class="black">
      <v-dialog  v-model="searchDialog" scrollable>
        <search-card  @read="read"/>
      </v-dialog>
      <v-card color="grey darken-4" style="position: absolute;bottom: 0;top: 0;right:0;left:0;" :loading="loadingMlag">
        <v-toolbar dense transition="slide-x-transition" v-if="toolbar">
          <v-toolbar-title>Viewer - {{ toolbarInfo }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu
            :close-on-content-click="false"
            :nudge-width="200"
            offset-x
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-list>
                <v-list-item>
                  <v-list-item-avatar>
                    <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>John Leider</v-list-item-title>
                    <v-list-item-subtitle>Founder of Vuetify.js</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-list>
                  <v-list-item>
                    <v-list-item-action>
                      <v-container fluid>
                        <v-row>
                          <v-col cols="5">
                            <v-btn fab x-small class="mx-4" outlined @click="zoomOut">
                              <v-icon>mdi-minus</v-icon>
                            </v-btn>
                          </v-col>
                          <v-col cols="5">
                            <v-btn fab x-small class="mx-4" outlined @click="zoomIn">
                              <v-icon>mdi-plus</v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-row v-if="allowLocalViewer">
                          <v-col cols="12">
                            <v-file-input show-size label="File input" accept=".mlag" @change="mlagFile"></v-file-input>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-btn @click="showSearchDialog"> Reader</v-btn>
                        </v-row>
                      </v-container>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
            </v-card>
          </v-menu>
        </v-toolbar>
      <v-window v-scroll="onScroll" v-model="onboarding" vertical :class="[toolbar ? 'with_toolbar' : 'with_no_toolbar']" id="wfix" v-on:keyup.enter="showSearchDialog">
      <v-window-item
        v-for="(n,i) in images"
        :key="`card-${i}-${render}`"
        class="overflow-auto fill-height"
      >
      <v-img :src="n" lazy-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" :max-height="heightFromZoomFactor" contain>{{invoked}}</v-img>
      </v-window-item>
      </v-window>
      <v-btn class="mx-2" fab dark small color="primary" absolute left style="bottom:0" @click="prev">
        <v-icon dark>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn class="mx-2" fab dark small color="primary" absolute right  style="bottom:0" @click="next">
        <v-icon dark>mdi-chevron-right</v-icon>
      </v-btn>
      </v-card>
    </v-container>
</template>
<script>
//import jsZip from 'jszip'
import SearchCard from '@/components/SearchCard.vue'
let jsZip
import _ from 'lodash'
export default {
    components: {
      SearchCard
    },
    props: {
      allowLocalViewer: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      render:0,
      infos: undefined,
      images: new Array(10),
      length: 10,
      onboarding: 0,
      toolbar: true,
      zoom:0,
      fullScreen: false,
      loadingMlag: false,
      loadingError: false,
      invoked:0,
      searchDialog: false
    }),
    watch: {
      infos(val) {
        try {
          Object.keys(val)
          this.onboarding = 0
        } finally {}
      },
      '$route': 'fetchChapterPages'
    },
    computed: {
      heightFromZoomFactor() {
        if(this.fullScreen)
          return 'auto'
        else return (100+this.zoom*10) + '%'
      },

      toolbarInfo() {
        const infos = this.infos
        if(!!infos)
          return infos.manga.name+'  -  '+infos.chapter
        else if(this.loadingMlag) return 'Loading' 
        else
        if(this.loadingError)
          return this.getErrorMessage(this.loadingError)
        else return 'No file Loaded'
      }
    },
    methods: {
      onScroll() {
        this.invoked++
      },
      next () {
        this.onboarding = this.onboarding + 1 === this.images.length
          ? 0
          : this.onboarding + 1
      },
      prev () {
        this.onboarding = this.onboarding - 1 < 0
          ? this.images.length - 1
          : this.onboarding - 1
      },
      zoomIn() {
        if(this.zoom<10) this.zoom++
      },
      zoomOut() {
        if(this.zoom>0) this.zoom--
      },
      mlagFile(file) {
        const that = this
        const f = file
        if(!f) return;
        jsZip.loadAsync(f).then((zip) => {
          zip.file("manifest.json").async("text").then((text) => {
            const infos = JSON.parse(text)
            this.images = new Array(infos["pages-number"])
            const images = Object.keys(zip.files).filter(function(e) {
              return e!= 'manifest.json'
            })
            this.infos = infos
            this.loadingMlag = true
            images.forEach((img,i) => {
              zip.file(img).async('base64').then((base64) => {
                this.images[i] = 'data:image/png;base64,'+base64
                if(this.onboarding == i) this.render +=1
                if(i==0) this.loadingMlag = false
              })
            })
          })
        })
      },
      fetchChapterPages() {
        this.loadingMlag = true

        this.sockets.subscribe('get-chapter-pages-response',({ manga, pages, error }) => {
          this.sockets.unsubscribe('get-chapter-pages-response')
          if(error){
            this.loadingError = error
            //this.loadingMlag = false
          }
          else {
            this.infos = { manga, chapter: parseFloat(this.$route.params.chapter)}
            this.images = pages
          }
          this.loadingMlag = false
        })

        this.$socket.emit('get-chapter-pages', this.$route.params)
      },
      getErrorMessage(num) {
        switch(num) {
          case 2:
            return 'Chapter unavailable'
          case 1:
            return 'Library unavailable'
        }
      },
      showSearchDialog() {
        console.log(this.searchDialog)
        this.searchDialog = true
      },
      go() {
        console.log('go')
      },
      read({ source, chapter, mangaKey}) {
        this.searchDialog = false
        this.$router.push({ path: `/reader/${source}/${mangaKey}/${chapter}`})
      }
    },
    created() {
      if(this.allowLocalViewer) {
        const jszip = require('jszip')
        jsZip = jszip
      } 
      else {
        jsZip = undefined
        this.fetchChapterPages()
      }
    }
  }
</script>
<style>
  #wfix .v-window__container {
    height: 100%
  }
  #wfix.with_toolbar {
    height: calc( 100% - 48px )
  }
  #wfix.with_no_toolbar {
    height: 100%
  }
</style>


