import { Server } from 'http'
import io from 'socket.io'
import Path from 'path'
import nconf from 'nconf'
import { ManladagSource } from '@manladag/source'
import getSource from '../../../../../utils/getSource'
import getLastChapter from './getLastChapter'
import {save,get} from './cache'
import { type } from 'os';
const file = nconf.file(Path.join(__dirname,'..','..','..','..','..','..','data.json'))

const initSource = nconf.get()

export default function(server:Server, isDev:boolean) {
    let Sio:io.Namespace|io.Server
    if(isDev) {
        Sio = io(server)
    } else {
        Sio = io(server).of('/api')
    }
    
    Sio.on('connection', (socket) => {
        console.log('a user connected')
        socket.on('disconnect', function(reason) {
            console.log(reason)
        })
        console.log('go')
        socket.emit('init', initSource)
        socket.on('get-last-chapter', getLastChapter(socket,file))
        
        socket.on('get-chapter-pages', ({ source, mangaKey, chapter }) => {
            console.log(chapter)
            const chap = parseFloat(chapter)
            let ms: ManladagSource, fromLocal:string[]|null = null
            try {
                ms = new ManladagSource(getSource(initSource[source].module))
            } catch(e) {
                return socket.nsp.emit('get-chapter-pages-response',{ error: 1 })
            }

            get(source,mangaKey,chap+1).then((r) => {
                get(source,mangaKey,chap).then((res) =>{
                    if(!res) {
                        return ms.chapterIsAvailable(mangaKey,chap)
                    }
                    else {
                        console.log('from local')
                        fromLocal = res
                        return true 
                    }
                })

                .then((available) => {
                    if(available) {
                        if(fromLocal) return fromLocal
                        else return ms.getUrlPages(mangaKey,chap)
                    }
                    throw 2


                })
                .then((pages) => {
                    if(!!!fromLocal) save(source,mangaKey,chap,pages)
                    socket.nsp.emit('get-chapter-pages-response',{ error: undefined , pages, manga: ms.mangas[mangaKey] })
                    console.log(pages)
                    
                }).catch((error) => {
                    console.log('some error')
                    console.log(error)
                    socket.nsp.emit('get-chapter-pages-response',{ error: (error<999)? error:0 , pages: undefined })
                })
                if(!r) ms.getUrlPages(mangaKey,chap+1).then((pa) => {
                    save(source,mangaKey,chap+1,pa)
                    console.log('the second was cached')
                }).catch((e)=>{console.log(e)})
            }).catch((error) => {
                console.log('some error')
                console.log(error)
                socket.nsp.emit('get-chapter-pages-response',{ error: (error<999)? error:0 , pages: undefined })
            })

            
            //console.log(source,mangaKey,chapter, new ManladagSource(require(initSource[source].module)))
        })
        
    })
}