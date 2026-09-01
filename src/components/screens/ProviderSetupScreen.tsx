import React, { useState } from 'react';
import './ProviderSetupScreen.css';
import { useProviderStore } from '@stores/providerStore';
import { useAppStore } from '@stores/appStore';
import Button from '@components/ui/Button';
import Loading from '@components/ui/Loading';
import ErrorBox from '@components/ui/ErrorBox';
import type { Provider } from '@types/index';

const ProviderSetupScreen: React.FC = () => {
  const [providerType, setProviderType] = useState<'xtream' | 'm3u' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    baseUrl: '',
    username: '',
    password: '',
    playlistUrl: '',
  });
  const [isValidating, setIsValidating] = useState(false);

  const addProvider = useProviderStore((state) => state.addProvider);
  const validateProvider = useProviderStore((state) => state.validateProvider);
  const error = useProviderStore((state) => state.error);
  const navigateTo = useAppStore((state) => state.navigateTo);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);

    const provider: Omit<Provider, 'id' | 'status'> = {
      name: formData.name,
      type: providerType || 'xtream',
      baseUrl: formData.baseUrl,
      username: formData.username,
      password: formData.password,
      playlistUrl: formData.playlistUrl,
    };

    const isValid = await validateProvider(provider);
    setIsValidating(false);

    if (isValid) {
      addProvider({
        id: Math.random().toString(36).substr(2, 9),
        ...provider,
        status: 'ACTIVE',
      });
      navigateTo('home');
    }
  };

  if (isValidating) {
    return <Loading message="Validating provider..." />;
  }

  return (
    <div className="provider-setup-screen">
      <div className="setup-header">
        <h1>Add IPTV Provider</h1>
        <p>Connect to your IPTV service provider</p>
      </div>

      {error && <ErrorBox message={error} />}

      {!providerType ? (
        <div className="provider-type-selection">
          <h2>Select Provider Type</h2>
          <div className="type-buttons">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setProviderType('xtream')}
            >
              Xtream API
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setProviderType('m3u')}
            >
              M3U Playlist
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="provider-form">
          <div className="form-group">
            <label htmlFor="name">Provider Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., MyIPTV"
              required
            />
          </div>

          {providerType === 'xtream' ? (
            <>
              <div className="form-group">
                <label htmlFor="baseUrl">Server URL</label>
                <input
                  type="text"
                  id="baseUrl"
                  value={formData.baseUrl}
                  onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                  placeholder="https://xtream.example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Your username"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Your password"
                  required
                />
              </div>
            </>
          ) : (
            <div className="form-group">
              <label htmlFor="playlistUrl">M3U Playlist URL</label>
              <input
                type="text"
                id="playlistUrl"
                value={formData.playlistUrl}
                onChange={(e) => setFormData({ ...formData, playlistUrl: e.target.value })}
                placeholder="https://example.com/playlist.m3u"
                required
              />
            </div>
          )}

          <div className="form-buttons">
            <Button type="submit" variant="primary" size="lg">
              Connect Provider
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setProviderType(null)}
            >
              Back
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProviderSetupScreen;
