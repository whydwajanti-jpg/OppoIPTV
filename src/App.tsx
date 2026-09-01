import React, { useEffect } from 'react';
import { useAppStore } from '@stores/appStore';
import { useProviderStore } from '@stores/providerStore';
import MainNavigation from '@components/navigation/MainNavigation';
import HomeScreen from '@components/screens/HomeScreen';
import LiveTVScreen from '@components/screens/LiveTVScreen';
import VodScreen from '@components/screens/VodScreen';
import ProviderSetupScreen from '@components/screens/ProviderSetupScreen';
import PlaybackScreen from '@components/screens/PlaybackScreen';

const App: React.FC = () => {
  const currentScreen = useAppStore((state) => state.currentScreen);
  const initializeApp = useAppStore((state) => state.initializeApp);
  const loadProviders = useProviderStore((state) => state.loadProviders);

  useEffect(() => {
    initializeApp();
    loadProviders();
  }, [initializeApp, loadProviders]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace' || e.key === 'Escape') {
        useAppStore.getState().goBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'livetv':
        return <LiveTVScreen />;
      case 'vod':
        return <VodScreen />;
      case 'provider-setup':
        return <ProviderSetupScreen />;
      case 'playback':
        return <PlaybackScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="app-container">
      <MainNavigation />
      <main className="app-main">
        {renderScreen()}
      </main>
    </div>
  );
};

export default App;
