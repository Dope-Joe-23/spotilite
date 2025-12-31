# Production Deployment Guide

This guide covers deploying your Spotilite application to production environments.

## Backend Deployment

### Preparing Django for Production

1. **Update settings.py** (`backend/music_api/settings.py`):
```python
DEBUG = False
SECRET_KEY = os.environ.get('SECRET_KEY')
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')
CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',')
```

2. **Create production environment file** (`backend/.env.production`):
```
DEBUG=False
SECRET_KEY=your-secure-secret-key-here
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
DATABASE_URL=postgresql://user:password@host:5432/database
```

3. **Switch to PostgreSQL** (recommended for production):
```bash
pip install psycopg2-binary python-decouple
```

Update `settings.py`:
```python
import os
from decouple import config

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT', '5432'),
    }
}
```

4. **Collect static files**:
```bash
python manage.py collectstatic --noinput
```

5. **Run migrations**:
```bash
python manage.py migrate --database production
```

### Deployment Options

#### Option A: Heroku

1. Install Heroku CLI
2. Create Procfile:
```
web: gunicorn music_api.wsgi --log-file -
```

3. Create runtime.txt:
```
python-3.11.0
```

4. Deploy:
```bash
heroku login
heroku create spotilite-api
git push heroku main
heroku run python manage.py migrate
```

#### Option B: AWS (EC2 + RDS)

1. **Launch EC2 instance** with Ubuntu 22.04
2. **Setup server**:
```bash
sudo apt update
sudo apt install python3-pip python3-venv nginx supervisor postgresql-client
```

3. **Clone and setup project**:
```bash
git clone your-repo-url
cd spotilite/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

4. **Configure Gunicorn**:
```bash
pip install gunicorn
gunicorn music_api.wsgi:application --bind 0.0.0.0:8000
```

5. **Configure Nginx** as reverse proxy:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location /static/ {
        alias /path/to/spotilite/backend/staticfiles/;
    }
    
    location /media/ {
        alias /path/to/spotilite/backend/media/;
    }
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Option C: Docker

Create `Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend/ .

CMD ["gunicorn", "music_api.wsgi:application", "--bind", "0.0.0.0:8000"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: spotilite
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

  web:
    build: .
    command: gunicorn music_api.wsgi:application --bind 0.0.0.0:8000
    ports:
      - "8000:8000"
    environment:
      DEBUG: "False"
      DATABASE_URL: postgresql://postgres:postgres@db:5432/spotilite
    depends_on:
      - db
    volumes:
      - ./backend/media:/app/media

volumes:
  postgres_data:
```

---

## Frontend Deployment

### Build for Production

```bash
cd frontend
npm run build
```

This creates an optimized build in `frontend/dist/`

### Deployment Options

#### Option A: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --cwd frontend
```

3. Configure environment:
```
VITE_API_URL=https://api.yourdomain.com/api
```

#### Option B: Netlify

1. Connect GitHub repo
2. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`

3. Environment variables:
   - `VITE_API_URL`: `https://api.yourdomain.com/api`

#### Option C: AWS S3 + CloudFront

1. Build the app:
```bash
cd frontend
npm run build
```

2. Upload to S3:
```bash
aws s3 sync dist/ s3://your-bucket-name/
```

3. Configure CloudFront distribution

#### Option D: Self-hosted (Nginx)

1. Build the app:
```bash
npm run build
```

2. Copy to server:
```bash
scp -r dist/* user@server:/var/www/spotilite/
```

3. Configure Nginx:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    root /var/www/spotilite;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://api-server:8000;
    }
}
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
```

Update Nginx config:
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # ... rest of config
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Database Backup & Recovery

### PostgreSQL Backup

```bash
# Backup
pg_dump dbname > backup.sql

# Restore
psql dbname < backup.sql
```

### Automated Daily Backups

Create `backup.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
pg_dump spotilite > /backups/spotilite_$DATE.sql
find /backups -name "spotilite_*.sql" -mtime +30 -delete
```

Add to crontab:
```bash
0 2 * * * /path/to/backup.sh
```

---

## Monitoring & Logging

### Django Logging

Update `settings.py`:
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/var/log/django/error.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
        },
    },
}
```

### Application Monitoring

Consider using:
- **Sentry** - Error tracking
- **DataDog** - Performance monitoring
- **New Relic** - Application monitoring

---

## Performance Optimization

### Backend
- Use CDN for static files
- Enable GZIP compression
- Cache HTTP responses
- Use database indexing
- Optimize database queries

### Frontend
- Use lazy loading for routes
- Code splitting
- Image optimization
- Minify CSS/JS
- Enable service workers

---

## Security Checklist

- [ ] Set `DEBUG = False`
- [ ] Use strong `SECRET_KEY`
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable CSRF protection
- [ ] Set secure cookies
- [ ] Use strong passwords
- [ ] Keep dependencies updated
- [ ] Run security audits
- [ ] Setup firewall rules
- [ ] Monitor logs for suspicious activity

---

## Scaling Considerations

1. **Horizontal Scaling**: Use load balancer
2. **Database**: Move to managed PostgreSQL
3. **Media Storage**: Use S3 or similar
4. **Caching**: Implement Redis
5. **CDN**: Serve static files via CDN
6. **Containerization**: Use Docker for consistency

---

## Troubleshooting

### Static Files Not Loading
```bash
python manage.py collectstatic --noinput
```

### CORS Errors in Production
Check `CORS_ALLOWED_ORIGINS` in settings matches your frontend domain

### Database Connection Errors
Verify `DATABASE_URL` and network connectivity

### Out of Memory
Increase server resources or optimize queries

---

## Rollback Procedures

### Backend Rollback
```bash
git revert <commit-hash>
git push
heroku restart  # or restart your server
```

### Frontend Rollback
- Revert previous build in hosting platform
- Or rebuild from previous commit

---

For more information, refer to:
- [Django Deployment Guide](https://docs.djangoproject.com/en/5.1/howto/deployment/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Best Practices](https://react.dev/learn/security)
