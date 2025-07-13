# HackBox

HackBox is a web-based platform that provides Ubuntu with LXDE desktop environment directly in your browser. It's designed for cybersecurity enthusiasts and users who want to access Linux without installing it on their machines.

## Features

- Full Ubuntu Linux environment in your browser
- LXDE desktop environment for a lightweight GUI experience
- Direct browser access with no installation required
- Integrated with Netlify's NEON database for serverless PostgreSQL
  - User management demo showing database functionality
  - Persistent storage for user settings and preferences
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
   npm run deploy:prod
   ```
   or directly:
   ```
   netlify deploy --prod
   ```
4. (Optional) Set up Netlify DB after deployment using one of these commands:
   ```
   # For all platforms with Node.js
   npm run db:init
   
   # For Linux/macOS
   npm run db:init:sh
   
   # For Windows
   npm run db:init:bat
   ```
   This will configure the Netlify NEON database for your project

## Technologies Used

- Docker
- noVNC
- Ubuntu Linux
- LXDE Desktop Environment
- Netlify
- NEON Database (Serverless PostgreSQL)

## Netlify DB Integration

HackBox includes a demonstration of Netlify's NEON database integration:

1. User Management Page: Create and view users stored in the PostgreSQL database
2. Database Status API: Check the connection to the database
3. Serverless Functions: Interact with the database using Netlify Functions

To use the Netlify DB features:

1. Deploy your site to Netlify
2. Initialize the database with `npm run db:init`
3. Access the User Management page from the home screen

Example code for using Netlify DB in your functions:

```javascript
import { neon } from '@netlify/neon';

export const handler = async function(event, context) {
  // Create a SQL client using the NETLIFY_DATABASE_URL environment variable
  const sql = neon();
  
  // Query the database
  const result = await sql`SELECT * FROM users WHERE username = ${username}`;
  
  // Return the result
  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
}
```