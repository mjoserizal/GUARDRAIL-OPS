# Assets Directory

This directory contains static assets for the GuardRail Ops game including:

- Icons and graphics
- Audio files (for future implementation)
- Image assets
- Font files
- Other static resources

## Structure

```
assets/
├── images/          # Game images and graphics
├── icons/           # Icon files
├── audio/           # Sound effects and music (future)
├── fonts/           # Custom font files
└── data/            # Game data files
```

## Usage

Import assets in your components like:
```tsx
import iconPath from '../assets/icons/security.svg';
import backgroundImage from '../assets/images/cyber-grid.png';
```