import React from 'react';
import { useAppStore } from '@stores/appStore';
import './MainNavigation.css';

const MainNavigation: React.FC = () => {
  const navigateTo = useAppStore((state) => state.navigateTo);

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <div className="nav-logo">
          <span className="logo-text">OppoIPTV</span>
        </div>
        <ul className="nav-menu">
          <li>
            <button
              className="nav-button"
              onClick={() => navigateTo('home')}
              aria-label="Home"
            >
              Home
            </button>
          </li>
          <li>
            <button
              className="nav-button"
              onClick={() => navigateTo('livetv')}
              aria-label="Live TV"
            >
              Live TV
            </button>
          </li>
          <li>
            <button
              className="nav-button"
              onClick={() => navigateTo('vod')}
              aria-label="VOD"
            >
              Movies
            </button>
          </li>
          <li>
            <button
              className="nav-button"
              onClick={() => navigateTo('favorites')}
              aria-label="Favorites"
            >
              Favorites
            </button>
          </li>
          <li>
            <button
              className="nav-button"
              onClick={() => navigateTo('settings')}
              aria-label="Settings"
            >
              Settings
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default MainNavigation;
