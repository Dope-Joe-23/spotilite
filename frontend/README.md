# Spotilite Frontend

This is the React + Vite frontend for the Spotilite music player application.

## Getting Started

### Install Dependencies
```bash
npm install
```

### Development
```bash
npm run dev
```

The development server will start at `http://localhost:5173` and proxy API requests to the Django backend at `http://localhost:8000`.

### Build
```bash
npm run build
```

The production build will be optimized and ready for deployment.

## Environment Variables

Create a `.env` file in the root of this directory:

```
VITE_API_URL=http://localhost:8000/api
```

## Project Structure

```
src/
├── api/          # API client using axios
├── components/   # Reusable React components
├── contexts/     # React Context (Auth)
├── hooks/        # Custom React hooks
├── pages/        # Page components
├── App.jsx       # Main app component
└── main.jsx      # Entry point
```

## Features

- User authentication (Sign In / Sign Up)
- Browse songs, artists, and albums
- Create and manage playlists
- Add/remove songs from playlists
