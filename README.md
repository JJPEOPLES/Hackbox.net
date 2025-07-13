# HackBox

HackBox is a web-based platform that provides Ubuntu with LXDE desktop environment directly in your browser. It's designed for cybersecurity enthusiasts and users who want to access Linux without installing it on their machines.

## Features

- Full Ubuntu Linux environment in your browser
- LXDE desktop environment for a lightweight GUI experience
- Direct browser access with no installation required
- Integrated with Netlify's NEON database for serverless PostgreSQL
- Cybersecurity tools pre-installed

## Getting Started

1. Clone this repository
2. Run `docker-compose up -d`
3. Access the environment at `http://localhost:8080`

## Deployment

This project can be deployed on Netlify with the following steps:

1. Push the repository to GitHub
2. Connect your GitHub repository to Netlify
3. Deploy your site through the Netlify UI or CLI:
   ```
   netlify deploy --prod
   ```
4. (Optional) Set up Netlify DB after deployment:
   ```
   netlify db init
   ```
   This will configure the Netlify NEON database for your project

## Technologies Used

- Docker
- noVNC
- Ubuntu Linux
- LXDE Desktop Environment
- Netlify
- NEON Database (Serverless PostgreSQL)