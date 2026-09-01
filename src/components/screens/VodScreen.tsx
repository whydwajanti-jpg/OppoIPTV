import React from 'react';
import './VodScreen.css';
import { useVODStore } from '@stores/vodStore';
import { useAppStore } from '@stores/appStore';
import Loading from '@components/ui/Loading';
import ErrorBox from '@components/ui/ErrorBox';

const VodScreen: React.FC = () => {
  const items = useVODStore((state) => state.items);
  const categories = useVODStore((state) => state.categories);
  const selectedItemId = useVODStore((state) => state.selectedItemId);
  const currentCategory = useVODStore((state) => state.currentCategory);
  const isLoading = useVODStore((state) => state.isLoading);
  const error = useVODStore((state) => state.error);
  const selectItem = useVODStore((state) => state.selectItem);
  const setCategory = useVODStore((state) => state.setCategory);
  const navigateTo = useAppStore((state) => state.navigateTo);

  const displayItems = currentCategory
    ? items.filter((i) => i.genre === currentCategory)
    : items;

  if (isLoading) {
    return <Loading message="Loading VOD..." />;
  }

  return (
    <div className="vod-screen">
      <div className="vod-header">
        <h1>Movies & Series</h1>
      </div>

      {error && (
        <ErrorBox
          message={error}
          onDismiss={() => navigateTo('home')}
        />
      )}

      <div className="vod-container">
        <aside className="vod-sidebar">
          <div className="genre-section">
            <h2>Genres</h2>
            <button
              className={`genre-button ${!currentCategory ? 'active' : ''}`}
              onClick={() => setCategory(null)}
            >
              All ({items.length})
            </button>
            {categories.map((category) => {
              const count = items.filter((i) => i.genre === category).length;
              return (
                <button
                  key={category}
                  className={`genre-button ${currentCategory === category ? 'active' : ''}`}
                  onClick={() => setCategory(category)}
                >
                  {category} ({count})
                </button>
              );
            })}
          </div>
        </aside>

        <main className="vod-content">
          <div className="vod-grid">
            {displayItems.map((item) => (
              <div
                key={item.id}
                className={`vod-card ${selectedItemId === item.id ? 'selected' : ''}`}
                onClick={() => selectItem(item.id)}
              >
                {item.poster && (
                  <img src={item.poster} alt={item.title} className="vod-poster" />
                )}
                <div className="vod-info">
                  <h3 className="vod-title">{item.title}</h3>
                  {item.year && <span className="vod-year">{item.year}</span>}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VodScreen;
