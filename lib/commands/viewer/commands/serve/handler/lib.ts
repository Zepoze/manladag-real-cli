import Path from 'path'
import fs from 'fs'
import AdmZip from 'adm-zip'
import express from 'express'
import FileType from 'file-type' 
import ejs from 'ejs'

import MlagZip from '@manladag/source/dist/ClassMlagZip'

async function go(files:string[], routeParam:string = '/') {
    const route = express.Router()
    let data: {[key:string]:{zip:AdmZip, html:string}} = {}
    const mangas:{serverUrl:string, name:string, site:string, url:string, chapter:string }[] = []

    const template = fs.readFileSync(Path.join(__dirname,'../../../../../../assets/serve/chapter.ejs'),'utf-8')

    for(let i = 0;i<files.length;i++) {
        const zip = new MlagZip(files[i])
        const infos = JSON.parse(zip.readAsText('manifest.json'))

        if(!(infos.site && infos.manga.name && infos.url && infos.chapter)) throw new Error(`${files[i]} is corrupted or not a mlag file`)

        const zip_files = (await Promise.all(zip.getEntries().map(async function(e) {
            const result = await FileType.fromBuffer(e.getData())
            if(result && !e.isDirectory) {
                if(result.ext == 'jpg' || result.ext =='png')
                    return e.name
            }
        })))
        .filter((f) => {
            return typeof f == 'string'
        })
        .map((f) => {
            if(f) return `./page/${f}`
        })


        if(infos) {
            data[`${new String(infos.site+infos.manga.name+infos.chapter).toLowerCase()}`] =  {html: ejs.render(template, { manga:infos.manga.name, chapter: infos.chapter, site: infos.site, files: zip_files , url: infos.url}), zip}
            mangas.push({ serverUrl: `./${infos.site}/${infos.manga.name}/${infos.chapter}/chapter`, name: infos.manga.name, chapter: infos.chapter, site: infos.site, url: infos.url})
        } else throw new Error(`${files[i]} is corrupted or not a mlag file`)

    }

    const templateIndex = fs.readFileSync(Path.join(__dirname,'../../../../../../assets/serve/index.ejs'),'utf-8')
    const indexEjs = ejs.render(templateIndex,{ mangas })

    route.get('/', function(req,res) {
        res.writeHead(200, { 'Content-Type': 'text/html'})
        res.end(indexEjs)
    })

    route.get('/:site/:manga/:chapter/page/:page', function({params},res) {
        const key = new String(params.site+params.manga+params.chapter).toLowerCase()
        if(!data[key]) {
            res.end('page available')
        } else {
            const buff = data[key].zip.getEntry(`${params.page}`).getData()
            FileType.fromBuffer(buff).then((result) => {
                if(result) {
                    if(result.ext == 'jpg' || result.ext == 'png') {
                        res.writeHead(200, {"Content-Type": result.mime})
                        res.end(buff)
                    }
                    else res.end('the page is unavailable')
                } else res.end('error')
            })
            .catch(() => {
                res.end('error')
            })
        }
    })

    route.get('/:site/:manga/:chapter/chapter', function({params},res) {
        const key = new String(params.site+params.manga+params.chapter).toLowerCase()
        if(!data[key]) {
            res.end('manga unvailable')
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html'})
            res.end(data[key].html)
        }
    })

    route.get('/', function(req,res) {
        res.end('mangas')
    })

    return express().use(routeParam,route)
}

export default go