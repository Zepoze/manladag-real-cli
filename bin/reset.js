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

official.forEach((e) => {
    update(e)
})