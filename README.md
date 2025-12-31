# Spotilite - Music Player Application

A modern music streaming application built with **React + Vite** for the frontend and **Django REST Framework** for the backend.

## Project Structure

```
spotilite/
├── backend/              # Django REST API
│   ├── music/           # Music app with models, views, serializers
│   ├── music_api/       # Django project settings
│   ├── media/           # User-uploaded files (songs, images)
│   ├── manage.py        # Django CLI
│   └── requirements.txt  # Python dependencies
├── frontend/            # React + Vite application
│   ├── src/
│   │   ├── api/         # API client
│   │   ├── contexts/    # React Context (Auth)
│   │   ├── hooks/       # Custom hooks
│   │   ├── pages/       # Page components
│   │   └── App.jsx      # Main component
│   ├── vite.config.js   # Vite configuration
│   └── package.json     # Node dependencies
└── package.json         # Root scripts for development
```

## Features

- **User Authentication**: Sign up, sign in, and user profile management
- **Music Library**: Browse songs, artists, and albums
- **Playlists**: Create, edit, and manage personal playlists
- **API-First Architecture**: RESTful API endpoints for all operations
- **Real-time UI**: React-based responsive frontend with Vite

## Getting Started

### Prerequisites

- **Node.js** (v16+) and npm
- **Python** (v3.10+) and pip
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd spotilite
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

   Or manually:
   
   **Backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```
   
   **Frontend:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Running the Application

#### Development Mode

Run both frontend and backend concurrently:
```bash
npm run dev
```

This starts:
- **Backend**: Django development server at `http://localhost:8000`
- **Frontend**: Vite dev server at `http://localhost:5173`

#### Running Separately

**Backend only:**
```bash
npm run dev:backend
```
or
```bash
cd backend
python manage.py runserver
```

**Frontend only:**
```bash
npm run dev:frontend
```
or
```bash
cd frontend
npm run dev
```

### Database Setup

1. **Run migrations**
   ```bash
   npm run migrate
   ```
   or
   ```bash
   cd backend
   python manage.py migrate
   ```

2. **Create a superuser** (admin account)
   ```bash
   cd backend
   python manage.py createsuperuser
   ```

3. **Access Django admin**
   Navigate to `http://localhost:8000/admin` and log in with your superuser credentials

### Building for Production

```bash
npm run build
```

This will:
- Build the React frontend (optimized for production)
- Prepare the Django backend
- Collect static files

## API Documentation

### Authentication Endpoints

- `POST /api/signup/` - Create a new user account
- `POST /api/signin/` - Sign in and receive JWT token
- `GET /api/user-info/` - Get authenticated user information

### Music Endpoints

- `GET /api/songs/` - List all songs
- `GET /api/artists/` - List all artists
- `GET /api/albums/` - List all albums

### Playlist Endpoints

- `GET /api/playlists/` - List user's playlists
- `POST /api/playlists/` - Create a new playlist
- `POST /api/playlists/{id}/add_song/` - Add song to playlist
- `POST /api/playlists/{id}/remove_song/` - Remove song from playlist

## Configuration

### Backend Configuration

Edit `backend/music_api/settings.py`:
- `DEBUG`: Set to `False` for production
- `ALLOWED_HOSTS`: Add your domain
- `CORS_ALLOWED_ORIGINS`: Add frontend URL for production

### Frontend Configuration

Create `frontend/.env` with:
```
VITE_API_URL=http://localhost:8000/api
```

For production, update the API URL accordingly.

## Technologies Used

### Backend
- Django 5.1
- Django REST Framework
- Django CORS Headers
- Simple JWT Authentication
- SQLite (development) / PostgreSQL (production recommended)

### Frontend
- React 18
- React Router DOM
- Vite
- Axios

## Environment Variables

### Backend (`.env` in `backend/`)
```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Frontend (`.env` in `frontend/`)
```
VITE_API_URL=http://localhost:8000/api
```

## Deployment

### Backend Deployment

1. Set `DEBUG=False` in settings.py
2. Update `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`
3. Use a production database (PostgreSQL recommended)
4. Configure static files to be served by a web server
5. Deploy using Gunicorn + Nginx or similar

### Frontend Deployment

1. Build the frontend: `cd frontend && npm run build`
2. The optimized build will be in `frontend/dist/`
3. Deploy to Vercel, Netlify, or your preferred hosting

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT License

## Support

For issues or questions, please create an issue in the repository.

---

**Note**: This is a refactored version of the original monolithic Django application, now using a modern frontend framework (React) with a dedicated backend API.
