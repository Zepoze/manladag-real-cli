/// <reference path="cache.d.ts" />
import gc from 'global-cache-dir'
import Path from 'path'
import fs from 'fs'
import nconf from 'nconf'

const LogPrefix = '===================== DEV LOG : '
const MAXCACHE = 1000

function makeid(length:number) {
    var result           = ''
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-'
    var charactersLength = characters.length
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
 }

export async function save(source: string, mangaKey:string, chapter: number, urlsPages: string[]) {
    const dir = await gc('manladag-cli')
    let chapterUrls:string, index, bool
    if(bool = !fs.existsSync(chapterUrls = Path.join(dir,'chapterUrls')))
        fs.mkdirSync(chapterUrls)
    if(fs.existsSync(chapterUrls)) {
        if(fs.statSync(chapterUrls).isDirectory()) {
            if(!fs.existsSync(index= Path.join(chapterUrls, 'index.json'))) {
                fs.writeFileSync(index,'{}')
            }
            const key = source+mangaKey+chapter
            const filename = makeid(15)
            let f = nconf.file(index)
            const chap = f.get(key)
            
            if(!chap) {
                let all,n
                if((n = Object.values(all = f.get())).length>=MAXCACHE) {
  
                    const a =Object.values(all)
                    .sort((d:any,b:any)=> {
                        return d.lastRead - b.lastRead
                    }) as [{source:string, filename: string, mangaKey:string,chapter:number}]
                    console.log(LogPrefix+'Delete old extra cached chapter ')
                    f.remove('file')
                    for(let i =0;i<n.length+1-MAXCACHE;i++) {
                        try {
                            const c: {source:string, filename: string, mangaKey:string,chapter:number}= a[i]
                            if(!c) continue
                            if(fs.existsSync(Path.join(chapterUrls, c.filename))) fs.unlinkSync(Path.join(chapterUrls, c.filename))
                            //f.set(c.source+c.mangaKey+c.chapter,null)
                            delete all[c.source+c.mangaKey+c.chapter]
        
                        } finally{}
                    }
                    fs.writeFileSync(index, JSON.stringify(all))
                    f = nconf.file(index)
                }
            }
            



            f.set(key, {
                source,
                mangaKey,
                chapter,
                filename,
                lastRead: Date.now()
            })
            f.save(() => {
                fs.writeFileSync(Path.join(chapterUrls,filename), JSON.stringify(urlsPages))
                console.log(LogPrefix+ "Save Chapter ",chapter)
            })
        

        }
    }
}

export async function get(source: string, mangaKey:string, chapter:number){
    const dir = Path.join(await gc('manladag-cli'),'chapterUrls')
    const f = nconf.file(Path.join(dir,'index.json'))
    const key = source+mangaKey+chapter
    try {
        if(!f.get(key)) return null
        await new Promise((resolve,reject) => {
            f.set(key+':lastRead', Date.now())
            f.save(() => resolve())
        })
        return JSON.parse(fs.readFileSync(Path.join(dir,f.get(key).filename)).toString()) as string[]
    } catch(e) {
        return null
    }


}