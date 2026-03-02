import React from 'react'

export default function Avatar({ src, alt, size = 44 }) {
  const style = { width: size, height: size, fontSize: size * 0.38 }
  return (
    <div className="avatar" style={style} title={alt}>
      {src
        ? <img src={src} alt={alt} loading="lazy" decoding="async" />
        : alt?.charAt(0).toUpperCase()
      }
    </div>
  )
}
