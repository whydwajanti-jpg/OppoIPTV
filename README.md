# OppoIPTV

A modern IPTV player application for Samsung Smart TVs (Tizen 8.0+)

## Features

- 📺 **Live TV Streaming** - Watch live channels from IPTV providers
- 🎬 **Video on Demand** - Browse and play VOD content
- 📖 **Electronic Program Guide (EPG)** - View program schedules
- ⭐ **Favorites Management** - Save favorite channels and content
- 🔄 **Resume Playback** - Continue watching from where you left off
- 🌐 **Multiple Providers** - Support for Xtream API and M3U playlists
- 🎙️ **Audio/Subtitle Tracks** - Switch between available tracks
- 💾 **Persistent Storage** - Local data persistence across sessions
- 🎮 **Remote-First UI** - Optimized for Samsung TV remote control
- 🔒 **Secure** - No credential logging, secure storage

## Supported Devices

- Samsung Smart TVs 2024 and newer
- Tizen 8.0, 9.0, 10.0+
- 1920×1080 and 4K (3840×2160) displays

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Git
- Tizen Studio (for device deployment)

### Installation

```bash
# Clone repository
git clone https://github.com/whydwajanti-jpg/OppoIPTV.git
cd OppoIPTV

# Install dependencies
npm install

# Start development server
npm start
```

The app will be available at `http://localhost:8080`

### Building for Tizen

```bash
# Create production build
npm run build

# Package for Tizen
npm run package

# Install on TV device
TIZEN_SDK_PATH=/path/to/tizen-studio ./scripts/install-wgt-dev.sh 192.168.1.100
```

## Architecture

The project follows a layered architecture:

```
UI Layer (React Components)
    ↓
State Management (Zustand Stores)
    ↓
Services Layer (Business Logic)
    ↓
External Services (APIs, Storage)
```

### Key Directories

- `src/components/` - React UI components
- `src/stores/` - Zustand state management
- `src/services/` - Business logic and integrations
- `src/types/` - TypeScript type definitions
- `public/` - Static assets
- `scripts/` - Build and deployment utilities

## Development

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Testing
npm test

# Production build
npm run build
```

See [BUILD.md](BUILD.md) for detailed build documentation.

## Configuration

### Adding IPTV Providers

Providers are configured through the app UI:

1. Go to Settings
2. Select "Add Provider"
3. Choose provider type (Xtream or M3U)
4. Enter credentials/URL
5. Validate and save

Providers are stored locally in browser storage.

### Customization

The design system tokens are in `src/styles/index.css`:

```css
--color-accent: #00b4ff;
--color-bg-primary: #0a0e27;
--spacing-lg: 24px;
/* ... */
```

## Requirements Alignment

This project implements the comprehensive requirements from `iptv_smarters_pro-Requirements.md`:

- ✅ Samsung TV platform baseline (Tizen 8.0+)
- ✅ M3U/M3U8 playlist support
- ✅ Xtream-style account API
- ✅ Provider abstraction layer
- ✅ Live TV with EPG
- ✅ Video on Demand (VOD)
- ✅ Series with episodes
- ✅ Search functionality
- ✅ Favorites management
- ✅ Playback with state machine
- ✅ Remote-first UX
- ✅ Focus management
- ✅ Error handling and diagnostics
- ✅ Memory management
- ✅ Security best practices

## Performance Targets

- ⚡ Cold launch: < 5 seconds
- ⚡ Navigation: < 200ms transition
- ⚡ Catalog loading: Virtualized rendering
- ⚡ Memory: Monitored long-session behavior
- ⚡ Bundle size: < 2MB gzipped

## Security

- No plaintext credential storage
- Secure storage for sensitive data
- Content Security Policy compliance
- Input validation and sanitization
- Regular dependency audits

## License

MIT License - See [LICENSE](LICENSE) file

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Support

For issues and questions:
- GitHub Issues: [Report a bug](https://github.com/whydwajanti-jpg/OppoIPTV/issues)
- Discussions: [Ask a question](https://github.com/whydwajanti-jpg/OppoIPTV/discussions)

## Roadmap

- [ ] Picture-in-Picture support
- [ ] Multi-profile support
- [ ] Parental controls
- [ ] Advanced EPG filtering
- [ ] Recording capabilities
- [ ] Cast/streaming to other devices
- [ ] Custom authentication methods

## Acknowledgments

Built with:
- React 18
- TypeScript
- Zustand
- Webpack
- Tizen SDK

---

**Made with ❤️ for Samsung Smart TV enthusiasts**
