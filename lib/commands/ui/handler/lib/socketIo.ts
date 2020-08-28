import { Server } from 'http'
import io from 'socket.io'
import Path from 'path'
import nconf from 'nconf'
nconf.file(Path.join(__dirname,'..','..','..','..','..','data.json'))

const initData = nconf.get()

export default function(server:Server, isDev:boolean) {
    const Sio = io(server)
    Sio.on('connection', (socket) => {
        console.log('a user connected')
        socket.on('disconnect', function(reason) {
            console.log(reason)
        })
        socket.emit('init', initData)
    })
}