const nconf = require('nconf')
const Path = require('path')
nconf.file({dir: Path.join(__dirname,'..'),file: 'data.json'})

module.exports = function(url) {
    try {
        require.resolve(url)
    } catch(e) {
        return 0
    }
    try {
        const Source = require(url).Source
        nconf.set(`${Source.site.toLowerCase()}:mangas`, {})
        Object.keys(Source.mangas).forEach((e)=> {
            nconf.set(`${Source.site.toLowerCase()}:mangas:${e}`, {})
        })
        nconf.set(`${Source.site.toLowerCase()}:module`,url)
        nconf.save()

        console.log(`the source ${url} will be added`)
        return 1
    } catch(e) {
        throw new Error(`the source ${url} will be not added because something get wrong\n${e.message}`)
    }
}