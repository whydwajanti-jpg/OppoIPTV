import React from 'react';
import './PlaybackScreen.css';
import { usePlaybackStore } from '@stores/playbackStore';
import { useAppStore } from '@stores/appStore';
import Loading from '@components/ui/Loading';

const PlaybackScreen: React.FC = () => {
  const playbackState = usePlaybackStore();
  const goBack = useAppStore((state) => state.goBack);

  const {
    status,
    currentTime,
    duration,
    contentId,
    contentType,
    streamUrl,
    audioTracks,
    subtitleTracks,
    selectedAudioTrack,
    selectedSubtitleTrack,
    selectAudioTrack,
    selectSubtitleTrack,
    play,
    pause,
    seek,
    stop,
  } = playbackState;

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (status === 'LOADING') {
    return <Loading message="Loading content..." />;
  }

  return (
    <div className="playback-screen">
      <div className="playback-video-container">
        <video
          className="playback-video"
          src={streamUrl || ''}
          controls
          autoPlay
          crossOrigin="anonymous"
        />
      </div>

      <div className="playback-controls">
        <div className="playback-progress">
          <div
            className="playback-progress-bar"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="playback-info">
          <div className="playback-time">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="playback-type">
            <span>{contentType?.toUpperCase()}</span>
          </div>
        </div>

        <div className="playback-buttons">
          <button
            className="playback-btn"
            onClick={() => (status === 'PLAYING' ? pause() : play())}
          >
            {status === 'PLAYING' ? '⏸️ Pause' : '▶️ Play'}
          </button>
          <button className="playback-btn" onClick={() => stop()}>
            ⏹️ Stop
          </button>
          <button className="playback-btn" onClick={() => goBack()}>
            ← Back
          </button>
        </div>

        {audioTracks.length > 0 && (
          <div className="playback-tracks">
            <label htmlFor="audio-select">Audio Track:</label>
            <select
              id="audio-select"
              value={selectedAudioTrack || ''}
              onChange={(e) => selectAudioTrack(e.target.value)}
            >
              {audioTracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {subtitleTracks.length > 0 && (
          <div className="playback-tracks">
            <label htmlFor="subtitle-select">Subtitles:</label>
            <select
              id="subtitle-select"
              value={selectedSubtitleTrack || ''}
              onChange={(e) => selectSubtitleTrack(e.target.value)}
            >
              <option value="">None</option>
              {subtitleTracks.map((track) => (
                <option key={track.id} value={track.id}>
                  {track.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaybackScreen;
