export function getSource(id:string) : any {
    console.log(id)
    try {
        const Source = require(id).Source
        if(!Source) throw Source
        return Source

    } catch(e) {
        throw new Error(`The Library '${id}' has not been installed !`)
    }
}