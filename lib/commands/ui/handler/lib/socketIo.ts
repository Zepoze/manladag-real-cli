import { Server } from 'http'
import io from 'socket.io'
import Path from 'path'
import nconf from 'nconf'
import { ManladagSource } from '@manladag/source'
import { getSource } from '../../../../utils';
nconf.file(Path.join(__dirname,'..','..','..','..','..','data.json'))

const initSource = nconf.get()

export default function(server:Server, isDev:boolean) {
    let Sio
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
        socket.emit('init', initSource)
        socket.on('get-chapter-pages', ({ source, mangaKey, chapter }) => {
            console.log(chapter)
            const chap = parseFloat(chapter)
            let ms: ManladagSource
            try {
                ms = new ManladagSource(getSource(initSource[source].module))
            } catch(e) {
                return socket.emit('get-chapter-pages-response',{ error: 1 })
            }
            ms.chapterIsAvailable(mangaKey,chap).then((available) => {
                if(available)
                    return ms.getUrlPages(mangaKey,chap)
                throw 2


            })
            .then((pages) => {
                socket.emit('get-chapter-pages-response',{ error: undefined , pages, manga: ms.mangas[mangaKey] })
                console.log(pages)
            }).catch((error) => {
                console.log('some error')
                console.log(error)
                socket.emit('get-chapter-pages-response',{ error: (error<999)? error:0 , pages: undefined })
            })
            //console.log(source,mangaKey,chapter, new ManladagSource(require(initSource[source].module)))
        })
        
    })
}