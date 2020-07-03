#!/bin/sh 
":" //# comment; exec /usr/bin/env node --no-warnings "$0" "$@"

"use strict";

const {ManladagSource, _DOWNLOAD} = require('@manladag/source')
const source = require('@manladag/lelscanv').Source

const md = new ManladagSource(source)

md.downloadChapter("one-piece",983,__dirname,_DOWNLOAD.INIT.AUTO_START, {mlag:__dirname+'/bite/yep'}).then((e) => {
    console.log(e)
}).catch((e)=> {
    console.log('wtf')
    console.log(e)
})