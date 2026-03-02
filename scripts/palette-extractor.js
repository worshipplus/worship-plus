const Vibrant = require('node-vibrant')

async function extractPalette(imagePath, swatches = 5){
  try{
    const palette = await Vibrant.from(imagePath).getPalette()
    // palette is object of swatches; get swatches sorted by population
    const arr = Object.values(palette).filter(Boolean)
    arr.sort((a,b)=>b.getPopulation() - a.getPopulation())
    const colors = arr.slice(0, swatches).map(s => s.getHex())
    return colors
  }catch(e){
    console.error('palette error', imagePath, e.message)
    return []
  }
}

module.exports = { extractPalette }
