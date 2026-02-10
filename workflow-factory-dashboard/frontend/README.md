# Frontend: Workflow Factory Dashboard

Next.js 14 + React 18 + TypeScript + Tailwind CSS dashboard for managing AI agent workflows.

## Features

- **Real-time Dashboard** – Live workflow status, agent metrics, system health
- **Task Board** – Kanban-style task management (coming soon)
- **Collaboration Pane** – Agent suggestions and human feedback (coming soon)
- **Agent Management** – View agent status and performance metrics (coming soon)
- **Mobile Responsive** – Works on all devices

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui (planned)
- **State:** React Hooks + Zustand (planned)
- **Real-time:** WebSocket client
- **HTTP:** Axios/fetch

## Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn

### Installation

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Project Structure

```
frontend/
├── app/                 # Next.js app router
│   ├── page.tsx        # Dashboard home page
│   ├── layout.tsx      # Root layout
│   └── globals.css     # Global styles
│
├── components/         # React components
│   ├── dashboard/      # Dashboard widgets
│   │   ├── WorkflowStatus.tsx
│   │   ├── AgentMetrics.tsx
│   │   └── SystemHealth.tsx
│   │
│   ├── taskboard/      # Task board components (coming soon)
│   ├── collaboration/  # Collaboration pane (coming soon)
│   └── shared/         # Shared components
│       ├── Sidebar.tsx
│       └── Header.tsx
│
├── lib/                # Utilities and hooks
│   └── hooks/
│       ├── useApi.ts           # API data fetching
│       └── useWebSocket.ts     # WebSocket real-time updates
│
├── types/              # TypeScript type definitions
├── styles/             # CSS modules
│
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
└── postcss.config.js
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

## Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Start production server

# Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm test             # Run tests
npm run test:watch   # Watch mode
npm run test:coverage# Coverage report
```

## Component Development

### Creating a New Component

```typescript
// components/myfeature/MyComponent.tsx
'use client';

import React from 'react';

export function MyComponent() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Component content */}
    </div>
  );
}
```

### Using Hooks

```typescript
import { useApi } from '@/lib/hooks/useApi';
import { useWebSocket } from '@/lib/hooks/useWebSocket';

export function MyPage() {
  const { data, isLoading, error } = useApi('/api/workflows');
  const { isConnected, lastMessage } = useWebSocket(['workflows']);

  return (
    <div>
      {isLoading ? <div>Loading...</div> : <div>{data}</div>}
    </div>
  );
}
```

## Styling

We use **Tailwind CSS** for styling. No CSS-in-JS or CSS modules needed.

```tsx
// Good: Tailwind classes
<div className="bg-white rounded-lg shadow p-6 space-y-4">
  <h2 className="text-lg font-semibold text-gray-900">Title</h2>
  <p className="text-sm text-gray-600">Description</p>
</div>

// Avoid: Custom CSS
<style jsx>{`
  .container { background: white; }
`}</style>
```

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

Tests should be colocated with components:

```
components/
├── dashboard/
│   ├── WorkflowStatus.tsx
│   └── WorkflowStatus.test.tsx
```

## Type Safety

Make sure to add TypeScript types for all data:

```typescript
// types/workflow.ts
export interface Workflow {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  updatedAt: string;
}
```

## Performance Tips

1. **Code Splitting** – Next.js automatically code-splits at route level
2. **Image Optimization** – Use `next/image` for images
3. **Lazy Loading** – Use `React.lazy()` for heavy components
4. **Debounce** – Debounce WebSocket updates to avoid too many re-renders
5. **Memoization** – Use `React.memo()` for expensive components

## Debugging

```tsx
// Use React DevTools browser extension
// Chrome: https://chrome.google.com/webstore/detail/react-developer-tools

// Console logging
console.log('Debug info:', data);

// NextJS debug mode
// Run: npm run dev -- --debug
// Then: node --inspect-brk node_modules/.bin/next dev
```

## Building for Production

```bash
# Build
npm run build

# Test production build locally
npm start
```

The build output goes to `.next/` directory. This is optimized and ready for deployment to Vercel or other platforms.

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
docker build -f Dockerfile.dev -t wfd-frontend .
docker run -p 3000:3000 wfd-frontend
```

### Manual

```bash
npm run build
npm start
```

## Common Issues

### WebSocket Connection Error

Check that the backend is running on the correct URL:

```env
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

### API 404 Errors

Make sure the backend is running:

```bash
cd ../backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

## Further Reading

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Documentation](https://react.dev)

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

**Happy coding! 🚀**
