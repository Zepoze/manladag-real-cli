import fs from 'fs'
import Path from 'path'
import gc from 'global-cache-dir'
import rimraf from 'rimraf'
import io from 'socket.io'

async function _getCacheInfo() {
    const dir = await gc('manladag-cli')
    let chapterUrls:string,index, stat
    if(!fs.existsSync(chapterUrls = Path.join(dir,'chapterUrls')))
        fs.mkdirSync(chapterUrls)
    if(fs.existsSync(chapterUrls)) {
        if((stat = fs.statSync(chapterUrls)).isDirectory()) {
            if(!fs.existsSync(index= Path.join(chapterUrls, 'index.json'))) {
                fs.writeFileSync(index,'{}')
            }
            
        }
    }
    stat = fs.statSync(chapterUrls)
    return { size: stat.size, files: fs.readdirSync(chapterUrls).length }
}

async function _deleteCache() {
    const dir = await gc('manladag-cli')
    rimraf.sync(Path.join(dir,'chapterUrls'))

}

export function getCacheInfo(socket: io.Socket) {
    return async function() {
        let infos 
        try {
            infos = await _getCacheInfo()
        }finally{}
        socket.nsp.emit('get-cache-info', infos)
    }
}

export function deleteCache(socket:io.Socket) {
    return async function() {
        let done
        try {
            done = await _deleteCache()
        }finally{}
        socket.nsp.emit('delete-cache', done)
    }

}