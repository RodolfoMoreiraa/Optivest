import React, { useRef, useState } from 'react';
import './VideoHero.css';
import videoSrc from '../assets/VideoOptivest.mp4';

const VideoHero = () => {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  return (
    <section className="video-hero">
      <div className="video-wrapper">
        <video
          className="responsive-video"
          src={videoSrc}
          autoPlay
          loop
          muted={muted}
          playsInline
          ref={videoRef}
        />
        <button className="mute-toggle" onClick={toggleMute}>
          {muted ? '🔇' : '🔊'}
        </button>
      </div>
    </section>
  );
};

export default VideoHero;
