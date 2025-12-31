# Spotilite Refactoring Guide

## What Was Changed

Your Django monolith has been successfully refactored into a modern **frontend + backend** architecture:

### ✅ Backend (Django REST API)
- **Location**: `/backend`
- **Removed**: All HTML templates and template rendering views
- **Focus**: Pure REST API endpoints for all operations
- **Authentication**: JWT-based using `djangorestframework-simplejwt`
- **CORS**: Configured to accept requests from Vite dev server

### ✅ Frontend (React + Vite)
- **Location**: `/frontend`
- **Stack**: React 18, Vite, React Router, Axios
- **Architecture**: Component-based with custom hooks
- **Features**:
  - Authentication context for global state management
  - Custom data hooks (`useSongs`, `useArtists`, etc.)
  - API client with interceptors for JWT tokens
  - Protected routes with authentication check
  - Page components: Home, SignIn, SignUp, Songs, Artists, Albums, Playlists

### ✅ Project Root Configuration
- **Root `package.json`**: Commands to run and build entire app
- **Root `README.md`**: Complete documentation
- **Environment files**: `.env.example` for reference
- **.gitignore**: Updated for both Python and Node.js projects

## Quick Start

### 1. Install All Dependencies
```bash
cd spotilite
npm run install-all
```

### 2. Run Development Servers
```bash
npm run dev
```

This will automatically start:
- Django at `http://localhost:8000`
- React at `http://localhost:5173`

### 3. Database Setup (First Time)
```bash
npm run migrate
cd backend
python manage.py createsuperuser
```

### 4. Start Adding Content
Visit `http://localhost:8000/admin` to add songs, artists, and albums.

## File Structure After Refactoring

```
spotilite/
├── backend/                    # Django REST API
│   ├── music/
│   │   ├── models.py          # Songs, Artists, Albums, Playlists
│   │   ├── views.py           # API ViewSets and Views (UPDATED)
│   │   ├── serializers.py
│   │   ├── urls.py            # API routes only (UPDATED)
│   │   ├── migrations/
│   │   └── __pycache__/
│   ├── music_api/
│   │   ├── settings.py        # UPDATED: CORS config, removed template
│   │   ├── urls.py
│   │   └── __pycache__/
│   ├── media/                 # Songs and images
│   ├── db.sqlite3
│   ├── manage.py
│   ├── requirements.txt        # NEW: Python dependencies
│   └── .env                    # NEW: Backend environment vars
│
├── frontend/                   # React + Vite App
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js       # NEW: Axios API client
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx # NEW: Auth context
│   │   ├── hooks/
│   │   │   └── useData.js      # NEW: Custom data hooks
│   │   ├── pages/              # NEW: Page components
│   │   │   ├── Home.jsx
│   │   │   ├── SignIn.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── Songs.jsx
│   │   │   ├── Artists.jsx
│   │   │   ├── Albums.jsx
│   │   │   └── Playlists.jsx
│   │   ├── App.jsx             # NEW: Main router
│   │   ├── main.jsx            # NEW: Entry point
│   │   ├── App.css
│   │   └── index.css
│   ├── index.html              # NEW: HTML entry point
│   ├── vite.config.js          # NEW: Vite configuration
│   ├── tsconfig.json           # NEW: TypeScript config
│   ├── package.json            # NEW: Node dependencies
│   ├── .env                    # NEW: Frontend env vars
│   ├── .gitignore              # NEW: Node gitignore
│   └── README.md               # NEW: Frontend docs
│
├── package.json                # NEW: Root scripts
├── README.md                   # NEW: Main documentation
├── .env.example                # NEW: Example env vars
├── .gitignore                  # UPDATED: Added Node.js patterns
├── .git/                       # Git repository
└── .hintrc
```

## Key Changes Summary

### Backend Changes
| Change | File | Impact |
|--------|------|--------|
| Removed HTML templates | `music/templates/` | ❌ Deleted |
| Removed template views | `music/views.py` | ✏️ Removed `home`, `signup_view`, `signin_view`, etc. |
| Updated URL routes | `music/urls.py` | ✏️ Kept only API endpoints |
| Configured CORS | `music_api/settings.py` | ✏️ Updated for Vite dev server |
| Updated imports | `music/views.py` | ✏️ Removed unused imports |

### Frontend Additions
- Complete React + Vite setup
- API client with JWT support
- Authentication context
- Custom hooks for data fetching
- Pre-built page components
- Development server with API proxy

## Common Commands

```bash
# Development
npm run dev              # Run both frontend and backend
npm run dev:backend      # Run backend only
npm run dev:frontend     # Run frontend only

# Database
npm run migrate          # Run migrations
npm run build            # Build everything for production
npm run build:frontend   # Build React app for production

# Installation
npm run install-all      # Install all dependencies
```

## API Endpoints

All endpoints are prefixed with `/api/`:

### Authentication
- `POST /api/signup/` - Create account
- `POST /api/signin/` - Get JWT tokens
- `GET /api/user-info/` - Get current user

### Content
- `GET /api/songs/`
- `GET /api/artists/`
- `GET /api/albums/`
- `GET /api/playlists/`

## What's Next?

1. **Install dependencies**: `npm run install-all`
2. **Run migrations**: `npm run migrate`
3. **Start development**: `npm run dev`
4. **Add test data** via Django admin
5. **Customize styling** in the React components
6. **Expand pages** with more features

## Important Notes

- The Django admin interface still works for managing content
- JWT tokens are stored in localStorage on the frontend
- The Vite dev server proxies `/api` requests to Django
- All file uploads (songs, images) continue to work as before
- The database is shared between frontend and backend (SQLite in dev)

## Troubleshooting

### Port Already in Use
If port 8000 or 5173 is in use, you can change them in:
- Backend: `manage.py runserver 8001`
- Frontend: `vite.config.js` → `server.port`

### CORS Errors
Make sure your frontend URL is in `CORS_ALLOWED_ORIGINS` in `backend/music_api/settings.py`

### Dependencies Not Installing
```bash
cd backend && pip install --upgrade pip
pip install -r requirements.txt
```

---

**Congratulations!** Your app is now a modern, scalable full-stack application! 🚀
