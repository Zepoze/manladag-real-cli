const nconf = require('nconf')
const Path = require('path')
nconf.file({dir: Path.join(__dirname,'..'),file: 'data.json'})

module.exports = function(url) {
    try {
        const Source = require(url).Source
        nconf.set(`${Source.site.toLowerCase()}:mangas`, {})
        Object.keys(Source.mangas).forEach((e)=> {
            nconf.set(`${Source.site.toLowerCase()}:mangas:${e}`, {})
        })
        nconf.set(`${Source.site.toLowerCase()}:module`,url)
        nconf.save()
        
    } catch(e) {
        
    }
}