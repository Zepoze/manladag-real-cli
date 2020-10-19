import { ManladagSource } from "@manladag/source"
import { Provider } from 'nconf'
import getSource from './getSource'
export default async function(source: string, mangaKey: string, data: Provider, interval: number | 0): Promise<number> {
    
    const storageName = `${source.toLowerCase()}:mangas:${mangaKey}`
    const localChap = data.get(storageName+':last-know-chapter') as number
    console.log(localChap)
    if((Date.now() - (data.get(storageName+':last-chapter-check') as number))< interval && interval != 0) {
        return localChap
    }
    const md = new ManladagSource(getSource(data.get(source).module))
    console.log('force')
    const chapter = await md.getLastChapter(mangaKey)
    if(chapter>=localChap || typeof(localChap) != 'number') {
        console.log('lets-go to save')
        data.set(storageName+ ':last-chapter-check', Date.now())
        data.set(storageName+':last-know-chapter', chapter)
        return await new Promise<number>((resolve,reject) => data.save(() => { resolve(chapter)}))
       
    }
    return localChap


}