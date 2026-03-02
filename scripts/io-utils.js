const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')

function ensureDir(dir){
  mkdirp.sync(dir)
}

function isImageOrVideo(filename){
  const ext = path.extname(filename).toLowerCase()
  return ['.webp','.png','.jpg','.jpeg','.mp4'].includes(ext)
}

function readPalettes(palettesPath){
  try{
    if(!fs.existsSync(palettesPath)) return {}
    const raw = fs.readFileSync(palettesPath,'utf8')
    return JSON.parse(raw)
  }catch(e){
    console.error('Error reading palettes:', e.message)
    return {}
  }
}

function writePalettes(palettesPath, json){
  ensureDir(path.dirname(palettesPath))
  fs.writeFileSync(palettesPath, JSON.stringify(json, null, 2), 'utf8')
}

module.exports = { ensureDir, isImageOrVideo, readPalettes, writePalettes }
