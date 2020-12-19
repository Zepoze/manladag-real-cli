import { ManladagSource } from "@manladag/source"
import nconf from 'nconf'
import Path from 'path'
import getSource from './getSource'
export default async function(source: string, mangaKey: string, interval: number | 0): Promise<number> {
    const data = nconf.file(Path.join(__dirname,'..','..','data.json'))
    const storageName = `${source.toLowerCase()}:mangas:${mangaKey}`
    const localChap = data.get(storageName+':last-know-chapter') as number
    if((Date.now() - (data.get(storageName+':last-chapter-check') as number))< interval && interval != 0) {
        return localChap
    }
    const md = new ManladagSource(getSource(data.get(source).module))
    
    const chapter = await md.getLastChapter(mangaKey)
    if(chapter>=localChap || typeof(localChap) != 'number') {
        data.set(storageName+ ':last-chapter-check', Date.now())
        data.set(storageName+':last-know-chapter', chapter)
        return await new Promise<number>((resolve,reject) => data.save(() => { resolve(chapter)}))
       
    }
    return localChap


}