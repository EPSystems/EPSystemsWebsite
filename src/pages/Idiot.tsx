import { useEffect, useRef, useState } from 'react'

export function Idiot() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [needsTap, setNeedsTap] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = false
    video.volume = 1
    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        setNeedsTap(true)
      })
    }
  }, [])

  const handleTap = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = false
    video.volume = 1
    video.play().then(() => setNeedsTap(false)).catch(() => {})
  }

  return (
    <div
      onClick={needsTap ? handleTap : undefined}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        cursor: needsTap ? 'pointer' : 'default',
      }}
    >
      <video
        ref={videoRef}
        src="/idiot.mp4"
        autoPlay
        playsInline
        controls={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
      {needsTap && (
        <div
          style={{
            position: 'absolute',
            color: '#fff',
            fontFamily: 'sans-serif',
            fontSize: '1.25rem',
            background: 'rgba(0,0,0,0.5)',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
          }}
        >
          Tap to play with sound
        </div>
      )}
    </div>
  )
}
