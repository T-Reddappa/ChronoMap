# ChronoMap — Interactive World History Timeline

An interactive world map where you slide through 5,000 years of history and watch empires rise and fall.

## Quick Start

### 1. Get a Mapbox Token

1. Create a free account at [mapbox.com](https://account.mapbox.com/)
2. Copy your **Default public token** from the [tokens page](https://account.mapbox.com/access-tokens/)

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and paste your Mapbox token:

```
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijoi...your_token
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

```
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (metadata, fonts)
│   ├── page.tsx            # Main page (composition root)
│   └── globals.css         # Global styles + Mapbox overrides
├── components/
│   ├── MapView.tsx         # Mapbox GL map (dynamic import, no SSR)
│   ├── TimelineSlider.tsx  # Year slider with playback controls
│   └── EmpireDetailsPanel.tsx  # Slide-out info panel
├── lib/
│   ├── types.ts            # Core TypeScript interfaces
│   ├── empires.ts          # Static empire data + GeoJSON
│   └── timeUtils.ts        # Year formatting, filtering, conversion
└── store/
    └── useTimelineStore.ts # Zustand global state
```

### Key Design Decisions

- **Zustand over Context**: Selector-based subscriptions prevent re-rendering the entire tree when only `selectedYear` changes.
- **Dynamic import for MapView**: Mapbox GL requires DOM access. `next/dynamic` with `ssr: false` keeps the app server-renderable.
- **Imperative map layer management**: Layers are added/removed via Mapbox GL's JS API rather than re-mounting React components — critical for performance at scale.
- **Separated data layer**: Empire data is a plain array that can be swapped for an API call or database query without touching components.

## Tech Stack

| Layer          | Technology      |
| -------------- | --------------- |
| Framework      | Next.js 16 (App Router) |
| Language       | TypeScript      |
| Styling        | Tailwind CSS 4  |
| Maps           | Mapbox GL JS    |
| State          | Zustand         |
| Data           | Static JSON (MVP) |

## Future Roadmap

- [ ] Animated border expansion/contraction
- [ ] Religion overlay layer toggle
- [ ] Silk Road / trade route visualization
- [ ] Compare two years side-by-side
- [ ] AI narration mode
- [ ] Backend API with database for hundreds of empires
- [ ] User accounts and bookmarking
