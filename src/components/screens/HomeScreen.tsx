import React from 'react';
import './HomeScreen.css';
import { useAppStore } from '@stores/appStore';
import { useProviderStore } from '@stores/providerStore';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';

const HomeScreen: React.FC = () => {
  const navigateTo = useAppStore((state) => state.navigateTo);
  const providers = useProviderStore((state) => state.providers);

  return (
    <div className="home-screen">
      <div className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to OppoIPTV</h1>
          <p className="hero-subtitle">
            Your complete IPTV experience on Samsung Smart TVs
          </p>
        </div>
      </div>

      <div className="home-grid">
        <Card className="home-card">
          <div className="card-icon">📺</div>
          <h2 className="card-title">Live TV</h2>
          <p className="card-description">
            Watch live television from your IPTV providers
          </p>
          <Button
            variant="primary"
            onClick={() => navigateTo('livetv')}
          >
            Open Live TV
          </Button>
        </Card>

        <Card className="home-card">
          <div className="card-icon">🎬</div>
          <h2 className="card-title">Movies & VOD</h2>
          <p className="card-description">
            Browse and watch video on demand content
          </p>
          <Button
            variant="primary"
            onClick={() => navigateTo('vod')}
          >
            Browse Movies
          </Button>
        </Card>

        <Card className="home-card">
          <div className="card-icon">⭐</div>
          <h2 className="card-title">Favorites</h2>
          <p className="card-description">
            Access your saved favorite channels and content
          </p>
          <Button
            variant="primary"
            onClick={() => navigateTo('favorites')}
          >
            View Favorites
          </Button>
        </Card>

        <Card className="home-card">
          <div className="card-icon">⚙️</div>
          <h2 className="card-title">Settings</h2>
          <p className="card-description">
            Manage providers, preferences, and application settings
          </p>
          <Button
            variant="primary"
            onClick={() => navigateTo('settings')}
          >
            Open Settings
          </Button>
        </Card>
      </div>

      {providers.length === 0 && (
        <div className="home-prompt">
          <Card>
            <h2>No Providers Added</h2>
            <p>
              To get started, add an IPTV provider in the settings.
            </p>
            <Button
              variant="primary"
              onClick={() => navigateTo('provider-setup')}
            >
              Add Provider
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
