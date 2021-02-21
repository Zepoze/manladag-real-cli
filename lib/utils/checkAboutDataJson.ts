import path from 'path'
import fs from 'fs'


const pathDATAJSON = path.join(__dirname,'..','data.json')

export default function() {

  try {
    if(Object.keys(JSON.parse(fs.readFileSync(pathDATAJSON).toString())).length ==0 ) throw new Error()

  } catch(e) {
    try {
      fs.writeFileSync(pathDATAJSON,'{}')
    } finally {
      throw new Error('Your data.json seem missing, please install manladag libs !')
    }
  }
}