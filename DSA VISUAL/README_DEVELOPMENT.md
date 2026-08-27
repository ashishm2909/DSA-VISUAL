# DSA Visual Development Guide

This document explains how to install, run, build, and extend DSA Visual.

## Requirements

- Node.js 18 or newer
- npm 9 or newer
- A modern browser with JavaScript enabled
- Port `4000` available for the Express API
- Port `5173` available for the Vite development server
- A configured public frontend origin for deployed environments

Node.js 18 or newer is recommended because the server uses the built-in `fetch`
API for text-to-speech requests.

## Project Layout

The repository uses npm workspaces:

```text
DSA VISUAL/
  client/                 React and Vite frontend
    src/components/       Reusable interface components
    src/renderers.jsx      Visual renderers for lesson states
    src/api.js             Frontend API requests
  server/                 Express backend
    algorithms/            Step generators for each algorithm category
    data/lessons.js        Lesson catalog and metadata
    data/patterns.js       Interview pattern content
    index.js               API server and production static-file server
  package.json             Workspace scripts and dependencies
  package-lock.json        Locked dependency versions
```

## Installation

The application files are inside the `DSA VISUAL` directory. From a terminal:

```bash
cd "DSA VISUAL"
npm install
```

This installs dependencies for both the `client` and `server` workspaces.

## Environment Configuration

The server uses these optional environment variables:

- `PORT` changes the Express listening port. It defaults to `4000`.
- `CLIENT_ORIGIN` controls allowed browser origins. Provide one origin or a
  comma-separated list, for example:

  ```bash
  CLIENT_ORIGIN=https://dsa.example.com npm start
  ```

For local development, the default allowed origin is `http://localhost:5173`.
The server also sends standard security headers through Helmet.

## Development

Run the API and frontend together:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The Vite server proxies
requests beginning with `/api` to `http://localhost:4000`.

The workspaces can also be started independently:

```bash
npm run dev:server
npm run dev:client
```

## Production Build

Build the frontend and serve it through Express:

```bash
npm run build
npm start
```

Then open [http://localhost:4000](http://localhost:4000). The build output is
written to `client/dist` and is served by the backend.

## API Endpoints

- `GET /api/lessons` returns lesson categories, default array data, and the default
  graph.
- `GET /api/lesson/:id` returns the metadata and pseudocode for one lesson.
- `POST /api/run` accepts `{ "lessonId": "...", "input": {} }` and returns the
  visualization kind plus its ordered animation steps.
- `GET /api/tts?text=...&lang=en` requests optional speech audio. The frontend can
  fall back to the browser speech engine if the request is unavailable.

## Adding An Algorithm

1. Add a generator in the appropriate file under `server/algorithms/`.
2. Make it return a result shaped like:

   ```js
   {
     kind: "sorting",
     steps: [
       {
         description: "Compare the current pair",
         codeLine: 3,
         state: {}
       }
     ]
   }
   ```

3. Register the generator in `server/algorithms/index.js` using the lesson ID.
4. Add the lesson title, kind, pseudocode, input configuration, and operations to
   `server/data/lessons.js`.
5. Add or update the matching visual renderer in `client/src/renderers.jsx`.
6. Run `npm run build` and manually test the lesson through the frontend.

The sidebar and lesson navigation are driven by the server lesson catalog, so a
new lesson does not normally require a new frontend route.

## Useful Commands

```bash
npm run dev          # Start client and server in watch/development mode
npm run build        # Create the client production build
npm start            # Start Express and serve the production build
npm run dev:client   # Start only Vite
npm run dev:server   # Start only Express with Node watch mode
```

## Troubleshooting

### `ENOENT: package.json not found`

Change into the nested project directory before running npm commands:

```bash
cd "/workspaces/DSA-VISUAL/DSA VISUAL"
```

### Port already in use

Stop the process using port `4000` or `5173`, or run the affected service with a
different port. The Vite API proxy must point to the port used by the backend.

### Frontend cannot load lessons

Confirm that the Express server is running on port `4000`, then check
`http://localhost:4000/api/lessons` directly.