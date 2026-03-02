#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const { generateThumbnail } = require('./image-processor')
const { extractPalette } = require('./palette-extractor')
const { extractPoster } = require('./video-processor')
const { ensureDir, isImageOrVideo, readPalettes, writePalettes } = require('./io-utils')

const argv = yargs(hideBin(process.argv))
  .option('input', { type: 'string', default: path.join(__dirname, '../agents/worship+/frontend-developer-agent/inspiration-images') })
  .option('thumb-dir', { type: 'string', default: path.join(__dirname, '../agents/worship+/frontend-developer-agent/Design System/inspiration-thumbs') })
  .option('poster-dir', { type: 'string', default: path.join(__dirname, '../agents/worship+/frontend-developer-agent/Design System/inspiration-posters') })
  .option('palettes', { type: 'string', default: path.join(__dirname, '../agents/worship+/frontend-developer-agent/Design System/palettes.json') })
  .option('dry-run', { type: 'boolean', default: false })
  .argv

async function main(){
  const inputDir = path.resolve(argv.input)
  const thumbDir = path.resolve(argv['thumb-dir'])
  const posterDir = path.resolve(argv['poster-dir'])
  const palettesPath = path.resolve(argv.palettes)

  ensureDir(thumbDir)
  ensureDir(posterDir)

  const items = fs.readdirSync(inputDir).filter(f => isImageOrVideo(f))
  const palettes = readPalettes(palettesPath)
  const summary = { processed: [], thumbs: [], posters: [], palettes: {} }

  for(const filename of items){
    const inputPath = path.join(inputDir, filename)
    const ext = path.extname(filename).toLowerCase()
    console.log('processing', filename)
    if(argv['dry-run']){
      console.log(' dry-run: would process', inputPath)
      continue
    }
    try{
      if(['.webp','.png','.jpg','.jpeg'].includes(ext)){
        const thumb = await generateThumbnail(inputPath, thumbDir)
        summary.thumbs.push(thumb)
        const colors = await extractPalette(inputPath)
        summary.palettes[filename] = colors
        summary.processed.push(filename)
      }else if(ext === '.mp4'){
        const poster = await extractPoster(inputPath, posterDir)
        summary.posters.push(poster)
        // optionally extract palette from poster
        const colors = await extractPalette(poster)
        summary.palettes[filename] = colors
        summary.processed.push(filename)
      }
    }catch(e){
      console.error('error processing', filename, e.message)
    }
  }

  // merge palettes with existing, keeping history
  const now = new Date().toISOString()
  for(const [file, cols] of Object.entries(summary.palettes)){
    const existing = palettes.images && palettes.images[file]
    if(!palettes.images) palettes.images = {}
    palettes.images[file] = { colors: cols, generatedAt: now, previous: existing || null }
  }

  if(!argv['dry-run']){
    writePalettes(palettesPath, palettes)
    console.log('wrote palettes to', palettesPath)
  }

  console.log('summary', JSON.stringify(summary, null, 2))
}

main().catch(e=>{ console.error(e); process.exit(1) })
