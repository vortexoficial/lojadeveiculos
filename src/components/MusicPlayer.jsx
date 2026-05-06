import { useEffect, useRef, useState } from 'react'

const TRACKS = [
  '/music/audio.mp3',
]

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  )
}

function IconPause() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  )
}

function IconMusic() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  )
}

// 'hidden' | 'visible' | 'leaving'
export default function MusicPlayer() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [balloonState, setBalloonState] = useState('hidden')
  const [trackIndex, setTrackIndex] = useState(0)

  function dismiss() {
    setBalloonState('leaving')
    setTimeout(() => setBalloonState('hidden'), 320)
  }

  useEffect(() => {
    const show = setTimeout(() => setBalloonState('visible'), 1600)
    return () => clearTimeout(show)
  }, [])

  useEffect(() => {
    if (balloonState !== 'visible') return
    const hide = setTimeout(dismiss, 6000)
    return () => clearTimeout(hide)
  }, [balloonState])

  function toggle() {
    if (balloonState === 'visible') dismiss()
    if (!TRACKS.length || !audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  function handleEnded() {
    if (!audioRef.current) return
    if (TRACKS.length > 1) {
      const next = (trackIndex + 1) % TRACKS.length
      setTrackIndex(next)
      audioRef.current.src = TRACKS[next]
    }
    audioRef.current.play().catch(() => {})
  }

  return (
    <div className="music-fab">
      {balloonState !== 'hidden' && (
        <div className={`music-balloon${balloonState === 'leaving' ? ' music-balloon--out' : ''}`} role="status">
          <IconMusic />
          <span>Ouça música enquanto navega</span>
          <button className="music-balloon-close" onClick={dismiss} aria-label="Fechar">×</button>
        </div>
      )}

      <button
        className={`music-btn${playing ? ' music-btn--playing' : ''}`}
        onClick={toggle}
        aria-label={playing ? 'Pausar música' : 'Tocar música'}
        title={playing ? 'Pausar' : 'Tocar música'}
      >
        {playing ? <IconPause /> : <IconPlay />}
      </button>

      {TRACKS.length > 0 && (
        <audio ref={audioRef} src={TRACKS[trackIndex]} onEnded={handleEnded} preload="none" />
      )}
    </div>
  )
}
