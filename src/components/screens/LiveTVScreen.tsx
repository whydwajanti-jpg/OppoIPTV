import React from 'react';
import './LiveTVScreen.css';
import { useLiveTVStore } from '@stores/liveTVStore';
import { useAppStore } from '@stores/appStore';
import Loading from '@components/ui/Loading';
import ErrorBox from '@components/ui/ErrorBox';

const LiveTVScreen: React.FC = () => {
  const channels = useLiveTVStore((state) => state.channels);
  const categories = useLiveTVStore((state) => state.categories);
  const selectedChannelId = useLiveTVStore((state) => state.selectedChannelId);
  const currentCategory = useLiveTVStore((state) => state.currentCategory);
  const isLoading = useLiveTVStore((state) => state.isLoading);
  const error = useLiveTVStore((state) => state.error);
  const selectChannel = useLiveTVStore((state) => state.selectChannel);
  const setCategory = useLiveTVStore((state) => state.setCategory);
  const navigateTo = useAppStore((state) => state.navigateTo);

  const displayChannels = currentCategory
    ? channels.filter((c) => c.group === currentCategory)
    : channels;

  if (isLoading) {
    return <Loading message="Loading Live TV..." />;
  }

  return (
    <div className="livetv-screen">
      <div className="livetv-header">
        <h1>Live TV</h1>
      </div>

      {error && (
        <ErrorBox
          message={error}
          onDismiss={() => navigateTo('home')}
        />
      )}

      <div className="livetv-container">
        <aside className="livetv-sidebar">
          <div className="category-section">
            <h2>Categories</h2>
            <button
              className={`category-button ${!currentCategory ? 'active' : ''}`}
              onClick={() => setCategory(null)}
            >
              All ({channels.length})
            </button>
            {categories.map((category) => {
              const count = channels.filter((c) => c.group === category).length;
              return (
                <button
                  key={category}
                  className={`category-button ${currentCategory === category ? 'active' : ''}`}
                  onClick={() => setCategory(category)}
                >
                  {category} ({count})
                </button>
              );
            })}
          </div>
        </aside>

        <main className="livetv-content">
          <div className="channels-grid">
            {displayChannels.map((channel) => (
              <button
                key={channel.id}
                className={`channel-card ${selectedChannelId === channel.id ? 'selected' : ''}`}
                onClick={() => selectChannel(channel.id)}
              >
                {channel.logo && (
                  <img src={channel.logo} alt={channel.name} className="channel-logo" />
                )}
                <span className="channel-name">{channel.name}</span>
                {channel.currentProgram && (
                  <span className="channel-program">{channel.currentProgram.title}</span>
                )}
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LiveTVScreen;
