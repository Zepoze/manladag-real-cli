<template>
    <v-container fluid class="black">
      <v-dialog  v-model="searchDialog" scrollable >
        <search-card  @read="read"/>
      </v-dialog>
      <v-dialog
        v-model="readedDialog"
        dark
        max-width="300"
      >
        <v-card>
          <v-card-title class="text-uppercase">Chapter Finished</v-card-title>
          <v-card-text> You reach the last page of the chapter</v-card-text>
          <v-card-actions>
            <v-btn v-if="isLastChapter" @click="read({ ...$route.params, chapter: parseInt($route.params.chapter)+1 })">Next Chapter</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-card color="grey darken-4" style="position: absolute;bottom: 0;top: 0;right:0;left:0;" :loading="loadingMlag">
        <v-app-bar dense :value="toolbar" color="primary">
          <v-toolbar-title><span class="teal--text">MANLADAG</span> - {{ toolbarInfo }}</v-toolbar-title>
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
                  <v-list-item style="width: 100%">
                    <v-list-item-action style="width: 100%">
                      <v-container fluid>
                        <v-row v-if="images">
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
                          <v-col cols="auto">
                            <v-btn fab x-small class="mx-4" outlined @click="vertical = true" :color="vertical ? 'primary' :''">
                              <v-icon>mdi-arrow-up-down</v-icon>
                            </v-btn>
                          </v-col>
                          <v-col cols="auto">
                            <v-btn fab x-small class="mx-4" outlined @click="vertical = false" :color="!vertical ? 'primary' : ''">
                              <v-icon>mdi-arrow-left-right</v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-row v-if="allowLocalViewer">
                          <v-col cols="12">
                            <v-file-input truncate-length="15" label="File input" accept=".mlag" @change="mlagFile"></v-file-input>
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
        </v-app-bar>
        <template v-if="images">
          <v-window v-model="onboarding" :vertical="vertical" :class="[toolbar ? 'with_toolbar' : 'with_no_toolbar']" id="wfix">
            <v-hover v-if="!$vuetify.breakpoint.mobile" v-slot="{ hover }" close-delay="800" open-delay="300">
              <div :class="['tool-wrapper', !showToolBox ? 'hidden' : '', hover ? 'on-hover' : '']">
                <v-btn @click="showToolBox = true" small icon :class="['grey darken-2 hide-btn', !showToolBox ? 'shown' : 'hidden']" style="border-radius: 50% 0 0 50%">
                    <v-icon class="">mdi-chevron-left</v-icon>
                </v-btn>
                <v-container class="tool-box grey darken-2">
                  <v-row>
                      <v-btn small icon @click="zoomIn">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                  </v-row>
                  <v-row>
                      <v-btn small icon @click="zoomOut">
                        <v-icon>mdi-minus</v-icon>
                      </v-btn>
                  </v-row>
                  <v-row>
                    <v-btn small icon @click="vertical = !vertical">
                      <v-icon :class="['orientation-icon', vertical ? '' : 'horizontal']">mdi-arrow-up-down</v-icon>
                    </v-btn>
                  </v-row>
                  <v-row>
                    <v-btn small icon @click="showToolBox = false">
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                  </v-row>
                </v-container>
              </div>
            </v-hover>
            <v-window-item
              v-for="(n,i) in images"
              :key="`card-${i}-${render}`"
              class="overflow-auto fill-height window-item-image"
            >
              <v-img :src="n" lazy-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" :max-height="heightFromZoomFactor" height="10000%" width="10000%" contain>{{invoked}}</v-img>
            </v-window-item>
          </v-window>
          <v-btn class="mx-2" fab dark small color="primary" absolute left style="bottom:0" @click="prev">
            <v-icon dark>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn class="mx-2" fab dark small color="primary" absolute right  style="bottom:0" @click="next">
            <v-icon dark>mdi-chevron-right</v-icon>
          </v-btn>
        </template>
        <template v-else>
          <v-container>
            <v-row>
              <v-col cols="12"  class="text-center">
                <div class="title text-center white--text">
                  Get started !
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" class="text-center">
                <v-file-input dark dense truncate-length="15" label="Read Mlag file" accept=".mlag" @change="mlagFile"></v-file-input>
              </v-col>
              <v-col cols="6" class="text-center">
                <v-btn class="pa-auto" @click="searchDialog = true">Read Chapter Online</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </template>
      </v-card>
    </v-container>
</template>
<script>
//import jsZip from 'jszip'
import SearchCard from '@/components/SearchCard.vue'
let jsZip
import _ from 'lodash'
import { setTimeout } from 'timers';
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
      readedDialog: false,
      vertical: true,
      render:0,
      infos: undefined,
      images: null,
      length: 10,
      onboarding: 0,
      onboardinginv:0,
      toolbar: true,
      zoom:0,
      fullScreen: false,
      loadingMlag: false,
      loadingError: false,
      invoked:0,
      searchDialog: true,
      showToolBox: true
    }),
    watch: {
      infos(val) {
        try {
          Object.keys(val)
          this.onboarding = 0
        } finally {}
      },
      '$route': 'fetchChapterPages',
      images() {
        /*this.$nextTick(() => {
          if(document.getElementById('wfix')) {
            if(!document.getElementById('wfix').onwheel) document.getElementById('wfix').onwheel = _.debounce(this.onScroll,200)
          }
        })*/
        
  
      },
      //onboardinginv(val) 

      onboarding() {
        //this.zoom = 0
      },
     },
    computed: {
      isLastChapter() {
        try {
          return this.$store.getters.mangas(this.$route.params.source)[this.$route.params.mangaKey]['last-know-chapter'] != parseFloat(this.$route.params.chapter)
        } catch(e) {
          return true
        }
      },
      heightFromZoomFactor() {
        if(this.fullScreen)
          return '100%'
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
        else return 'No Chapter Loaded'
      }
    },
    methods: {
      /*onScroll(e) {
        if(e.deltaY>0) {
          this.next()
        } else {
          this.prev()
        }
      },*/
      next () {
        this.onboarding = this.onboarding + 1 === this.images.length
          ? (() => {this.readedDialog = true;return this.onboarding})()
          : this.onboarding + 1
      },
      prev () {
        if(this.onboarding != 0) this.onboarding--
      },
      zoomIn() {
        if(this.zoom<10) this.zoom++
      },
      zoomOut() {
        if(this.zoom>0) this.zoom--
      },
      fullscreen(bool) {
        this.toolbar = bool == null ? !this.toolbar : bool 
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
        const t = setTimeout(() => {
          if(!this.$socket.connected) {
            this.$socket.connect()
          }
        }, 1000*60)
        this.sockets.subscribe('get-chapter-pages-response',({ manga, pages, error }) => {
          clearTimeout(t)
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
        console.log('on est la')
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
        this.readedDialog = false
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
      console.log(this.$socket)
      window.addEventListener('keyup', (e) => {
        try {
          if(this.images && !this.searchDialog) {
            if(e.keyCode == 37) {
              this.prev()
            }
            if(e.keyCode == 39) {
              this.next()
            }
            if(e.keyCode == 38) {
              this.zoomIn()
            }
            if(e.keyCode == 40) {
              this.zoomOut()
            }
            if(e.keyCode == 70 && e.shiftKey) {
              this.fullscreen()
            }
          }
        } finally{}
      })
    },
    mounted() {
      //if(document.getElementById('wfix'))document.getElementById('wfix').onwheel = _.debounce(this.onScroll,200)
    }
  }
</script>
<style>
  #wfix .v-window__container {
    height: 100%;
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0px;
  }
  #wfix.with_toolbar {
    height: calc( 100% - 48px );
    top: unset;
  }
  #wfix.with_no_toolbar {
    height: 100%;
    top: 0;
    position: absolute;
    left: 0px;
    right: 0px;
  }
  .window-item-image::-webkit-scrollbar {
    display: none;
  }
  .window-item-image {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .tool-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: absolute;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 10000;
    transition: all 0.4s ease;
  }
  .tool-wrapper.hidden {
    transform: translateX(28px)
  }
  .tool-wrapper:not(.on-hover), .tool-wrapper:not(.on-hover) .hide-btn.shown {
    opacity: 0.3;
  }
  .tool-wrapper .hide-btn.shown {
    transition: all 0.7 ease;
    opacity: 1
  } 
  .tool-wrapper .hide-btn.hidden{
    transition: all 0.7 ease;
    opacity: 0
  } 
  .tool-box {
    border-radius: 10px 0 0 10px;
    width: 101%;
  }
  .orientation-icon{
    transition: transform cubic-bezier(0.075, 0.82, 0.165, 1);
  }
  .horizontal {
    transform: rotateZ(90deg)
  }
</style>


