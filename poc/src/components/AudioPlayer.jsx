import React, { useRef, useState, useEffect } from 'react'
import { PlayIcon, PauseIcon } from './Icons'

function fmt(t) {
  if (!isFinite(t)) return '0:00'
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function AudioPlayer({ src }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onEnded = () => setPlaying(false)
    const onMeta  = () => setDuration(a.duration)
    const onTime  = () => setCurrent(a.currentTime)
    a.addEventListener('ended', onEnded)
    a.addEventListener('loadedmetadata', onMeta)
    a.addEventListener('timeupdate', onTime)
    return () => {
      a.removeEventListener('ended', onEnded)
      a.removeEventListener('loadedmetadata', onMeta)
      a.removeEventListener('timeupdate', onTime)
    }
  }, [])

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) { a.play(); setPlaying(true) }
    else          { a.pause(); setPlaying(false) }
  }

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={src} preload="none" />
      <button
        className="audio-play-btn"
        onClick={toggle}
        aria-label={playing ? 'Pausar' : 'Reproduzir'}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
      <span className="audio-time">
        {fmt(current)}{duration > 0 ? ` / ${fmt(duration)}` : ''}
      </span>
    </div>
  )
}
