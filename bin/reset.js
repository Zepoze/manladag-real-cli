#!/bin/sh 
":" //# comment; exec /usr/bin/env node --no-warnings "$0" "$@"

const fs = require('fs')
const Path = require('path')

if( fs.existsSync(Path.join(__dirname,'..','data.json'))) fs.unlinkSync(Path.join(__dirname,'..','data.json'))

const update = require('../scripts/update')

const data = fs.readFileSync(Path.join(__dirname,'..','officialsource.txt'),'utf-8')

const official = data.split('\n').map((e) => {
    return e.replace(/\\ ?(.+) ?: ?(.+) ?\\/gi,"$2").trim()
})

let nbSource = 0
official.forEach((e) => {
    nbSource += update(e)
})

if(nbSource == 0) {
    console.log(`there is no source for manladag !!?`)
    process.exit(1)
}