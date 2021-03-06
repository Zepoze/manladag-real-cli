import Path from 'path'
import fs from 'fs'
import rimraf from 'rimraf'
import os from 'os'
import { ManladagSource, _DOWNLOAD} from '@manladag/source'
import getManager from '../../utils/getManagerInstalledLib'
import { getManladagLib } from '../../utils/getManladagLib'
import { getNconfDataJSON } from '../../utils/getNconfData'

import ProgressBar from '../../progressbar'

export const run =  async function(argv: {
    [argName: string]: unknown;
    _: string[];
    $0: string;
}) {
    const manager = await getManager()
    const nconf = getNconfDataJSON()

    const tmpDir = Path.join(fs.mkdtempSync(Path.join(os.tmpdir(),"manladag-cli")))
    const mlag = fs.existsSync(argv["path"] as string) ? Path.join(argv["path"] as string,`${argv["source"]}-${argv["manga"]}-${argv["chapter"]}`) : argv["path"] as string
    
    let pb:ProgressBar
    const StorageName = `${argv['source']}:mangas:${argv["manga"]}`

    const mdg = new ManladagSource(getManladagLib(manager)(argv["source"] as string).Source)
    .setOnDownloadChapterStartedListener(({source, manga, chapter, numberPage})=> {
        //const t = new ConsoleDate(Date.now())
        console.log('================ DOWNLOAD START ')
        console.log(`== Site : ${source}`)
        console.log(`== Manga : ${manga}`)
        console.log(`== Chapter : ${chapter}`)
        console.log(`== Pages : ${numberPage}`)
        console.log('================')
        if(process.stdout.isTTY) pb = new ProgressBar(numberPage)
    })
    .setOnDownloadPageFinishedListener(({page}) => {
        if(pb) pb.update(page)
    })
    .setOnDownloadChapterFinishedListener(({path})=> {
        console.log(`download in -> ${path}`)
        console.log(`================ DOWNLOAD FINISHED`)
        nconf.set(StorageName, { ...nconf.get(StorageName), 
            ...{
                "last-downloaded-chapter": argv["chapter"],
                "last-download-file": mlag,
                "last-download-date": ((date:number) => {
                    let d = new Date(date),
                        month = '' + (d.getMonth() + 1),
                        day = '' + d.getDate(),
                        year = d.getFullYear();
                
                    if(month.length < 2) 
                        month = '0' + month;
                    if(day.length < 2) 
                        day = '0' + day;
                
                    return [year, month, day].join('-');
                })(Date.now())
            }
        })
        let ttmp
        let tmp = (ttmp =nconf.get(StorageName+':last-know-chapter')) ? ttmp  : -5
        if((tmp)<(argv["chapter"] as number)) nconf.set(StorageName+':last-know-chapter',argv['chapter'])

        nconf.save(() => {
            rimraf.sync(tmpDir)
            process.exit(0)
        })
    })
    .setOnDownloadChapterErrorListener(({error}) => {
        console.log('\ndownload error '+error.message)
        console.log(`================ DOWNLOAD ABORTED`)
        //console.log(error)
        rimraf.sync(tmpDir)
        process.exit(1)
    })

    process.on('SIGINT',()=> {
        try {
            rimraf.sync(tmpDir)
        } finally {
            console.log("\n================ ABORTED KEYBOARD INTERRUPT\n")
            process.exit(1)
        }
    })

    mdg.downloadChapter(argv['manga'] as string, argv['chapter'] as number, tmpDir, _DOWNLOAD.INIT.AUTO_START, { mlag }).catch((e)=> {
        try {
            console.error(e.message)
        } finally {
            rimraf.sync(tmpDir)
            process.exit(1)
        }
    })
}