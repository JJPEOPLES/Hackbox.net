# HackBox Installation Guide

This guide will help you set up and run HackBox, a web-based Ubuntu LXDE environment.

## Prerequisites

- Docker and Docker Compose
- Node.js (v14 or later)
- Netlify CLI (for deployment)

## Local Development Setup

1. Clone the repository:
   ```
   git clone <your-repository-url>
   cd hackbox
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the Docker container:
   ```
   npm start
   ```
   This will build and start the Docker container with Ubuntu LXDE and noVNC.

4. Access the web interface:
   Open your browser and navigate to `http://localhost:8080`

5. To stop the container:
   ```
   npm run stop
   ```

## Netlify Deployment

1. Install the Netlify CLI globally:
   ```
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```
   netlify login
   ```

3. Deploy to Netlify:
   ```
   npm run deploy
   ```
   or directly:
   ```
   netlify deploy
   ```

4. For production deployment:
   ```
   npm run deploy:prod
   ```
   or directly:
   ```
   netlify deploy --prod
   ```

5. (Optional) After successful deployment, you can set up Netlify DB using one of these commands:
   ```
   # For all platforms with Node.js
   npm run db:init
   
   # For Linux/macOS
   npm run db:init:sh
   
   # For Windows
   npm run db:init:bat
   ```
   This will configure the Netlify NEON database for your project.

## Docker Container Access

- Web interface: `http://localhost:8080`
- VNC client: `localhost:5901` (password: hackbox)

Note: The Ubuntu LXDE desktop environment is only available when running locally with Docker. When deployed to Netlify, only the web interface and database functionality will be available.

## Default Credentials

- VNC Password: `hackbox`
- Ubuntu User: `hackbox`
- Ubuntu Password: `hackbox`

## Customization

You can customize the Docker image by modifying the Dockerfile. To add additional tools or packages, add them to the `apt-get install` command in the Dockerfile, then rebuild the container:

```
docker-compose build
docker-compose up -d
```