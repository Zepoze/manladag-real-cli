import io from 'socket.io'
import { Provider } from 'nconf'
import { ManladagSource } from '@manladag/source'
import getSource from '../../../../../utils/getSource'
import getLastChapter from '../../../../../utils/getLastChapter'
import {save} from './cache'

export default function(socket: io.Socket, nconf:Provider) {
    return function({ source, mangaKey}: any) {
        getLastChapter(source,mangaKey,1000*60*5)
        .then((chapter) => {
            return socket.emit('get-last-chapter', { source, mangaKey, chapter, check: Date.now()})
        })
        .catch((e) => {
            return socket.emit('get-last-chapter', { source, mangaKey, chapter:null, check: Date.now()})
        })


    }
    
}