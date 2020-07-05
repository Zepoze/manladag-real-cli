import serve from './lib'
import open from 'open'
import { key } from 'nconf';

export default function(argv: {
    [argName: string]: unknown;
    _: string[];
    $0: string;
}) {
    let port = argv["port"] as number
    port = port ? port : 1854
    const files = argv["files"]as string[]
    
    serve(files).then((app) => {
        app.listen(port, "127.0.0.1", () => {

            const alphabFiles = files.sort(function(a, b){
                if(a < b) return -1
                if(a > b) return 1
                return 0
            })

            console.log(`file${files.length>1?'s': ''}:\n\t${alphabFiles.join(',\n\t')}\n\n${files.length>1?'are': 'is'} serving on http://127.0.0.1:${port}`)
            open(`http://127.0.0.1:${port}`, {app:["chromium-browser", "--new-window"]}).catch(()=> {
                open(`http://127.0.0.1:${port}`).catch()
            })
        
        })
    })
    .catch((e) => {
        console.error(e.message)
        process.exit(1)
    })
}