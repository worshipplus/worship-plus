const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const { ensureDir } = require('./io-utils')

async function generateThumbnail(inputPath, outDir, opts = {}){
  ensureDir(outDir)
  const basename = path.basename(inputPath, path.extname(inputPath))
  const outPath = path.join(outDir, `${basename}-thumb.webp`)
  const width = opts.width || 800
  const height = opts.height || 450
  try{
    await sharp(inputPath)
      .resize({ width, height, fit: 'inside' })
      .webp({ quality: opts.quality || 80 })
      .toFile(outPath)
    return outPath
  }catch(e){
    console.error('thumbnail error', inputPath, e.message)
    return null
  }
}

module.exports = { generateThumbnail }
