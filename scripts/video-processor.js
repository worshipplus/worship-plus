const ffmpegPath = require('ffmpeg-static')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const { ensureDir } = require('./io-utils')

ffmpeg.setFfmpegPath(ffmpegPath)

function extractPoster(videoPath, outDir, opts = {}){
  ensureDir(outDir)
  const basename = path.basename(videoPath, path.extname(videoPath))
  const outPath = path.join(outDir, `${basename}-poster.jpg`)
  return new Promise((resolve, reject)=>{
    // probe to get duration
    ffmpeg.ffprobe(videoPath, (err, metadata)=>{
      if(err) return reject(err)
      const duration = metadata.format.duration || 0
      const at = Math.floor((duration || 1) / 2)
      ffmpeg(videoPath)
        .screenshots({ timestamps: [at], filename: `${basename}-poster.jpg`, folder: outDir, size: opts.size || '1280x720' })
        .on('end', ()=> resolve(outPath))
        .on('error', e=> reject(e))
    })
  })
}

module.exports = { extractPoster }
