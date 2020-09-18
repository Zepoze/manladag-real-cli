import { Server } from 'http'
import io from 'socket.io'
import Path from 'path'
import nconf from 'nconf'
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
        socket.on('get-chapter-pages', ({ source, manga, chapter }) => {

        })
        
    })
}