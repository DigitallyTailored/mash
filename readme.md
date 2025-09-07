# MASH

A web-based implementation of the classic MASH (Mansion, Apartment, Shack, House) fortune-telling game built with Vue 3 and TypeScript for a technical assessment.

## What it is

MASH is a childhood game where players create lists of options for different life categories (house type, spouse, job, car, location, salary), then use a counting elimination process to determine their "future." This digital version recreates the game with a modern web interface.

## Features

- Multiplayer support with turn-based gameplay
- Customizable game categories with random option generation
- Interactive elimination process with visual feedback
- Game history storage using localStorage
- Sound effects and confetti animations
- Responsive design built with Bulma CSS framework
- TypeScript for type safety

## Technology Stack

- Vue 3 with Composition API
- TypeScript
- Vite (build tool)
- Bulma (CSS framework)
- Canvas Confetti (animations)

## Build Instructions

### Prerequisites
- Node.js (version 16+)
- npm

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

- `src/components/` - Vue components for game phases
- `src/data/gameData.ts` - Game categories and random options
- `src/constants/gameConstants.ts` - Constants used throughout - files, order, emojis etc
- `src/utils/` - Audio, visual effects, and storage utilities
- `src/style.css` - Global styles and animations

The game progresses through setup, number selection, elimination, and results phases, with state management handled through Vue's reactive system.