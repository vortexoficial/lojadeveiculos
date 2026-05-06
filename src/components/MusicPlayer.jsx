import { useEffect, useRef, useState } from 'react'

// Adicione os arquivos de música na pasta public/music/
// e inclua os caminhos aqui:
const TRACKS = [
  // '/music/faixa-01.mp3',
  // '/music/faixa-02.mp3',
]

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
      <polygon points="5 3 19 12 5 21 5 3" />
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
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  )
}

export default function MusicPlayer() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [showBalloon, setShowBalloon] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const [balloonDismissed, setBalloonDismissed] = useState(false)

  useEffect(() => {
    if (balloonDismissed) return
    const show = setTimeout(() => setShowBalloon(true), 1800)
    return () => clearTimeout(show)
  }, [balloonDismissed])

  useEffect(() => {
    if (!showBalloon) return
    const hide = setTimeout(() => setShowBalloon(false), 6000)
    return () => clearTimeout(hide)
  }, [showBalloon])

  function dismissBalloon() {
    setShowBalloon(false)
    setBalloonDismissed(true)
  }

  function toggle() {
    dismissBalloon()
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

  const hasMusic = TRACKS.length > 0

  return (
    <div className="music-fab">
      {showBalloon && (
        <div className="music-balloon" role="status">
          <IconMusic />
          <span>Ouça música enquanto realiza sua compra</span>
          <button
            className="music-balloon-close"
            onClick={dismissBalloon}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
      )}

      <button
        className={`music-btn${playing ? ' music-btn--playing' : ''}${!hasMusic ? ' music-btn--disabled' : ''}`}
        onClick={toggle}
        aria-label={playing ? 'Pausar música' : 'Tocar música'}
        title={!hasMusic ? 'Em breve' : playing ? 'Pausar' : 'Tocar música'}
      >
        {playing ? <IconPause /> : <IconPlay />}
      </button>

      {hasMusic && (
        <audio
          ref={audioRef}
          src={TRACKS[trackIndex]}
          onEnded={handleEnded}
          preload="none"
        />
      )}
    </div>
  )
}
