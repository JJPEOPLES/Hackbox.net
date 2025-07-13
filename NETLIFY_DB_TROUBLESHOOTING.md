# Netlify DB Troubleshooting Guide

If you're having issues setting up Netlify DB for your HackBox project, this guide will help you troubleshoot common problems.

## Prerequisites

Before attempting to initialize Netlify DB, make sure you have:

1. Deployed your site to Netlify
2. Installed Node.js (v14 or later)
3. Installed the Netlify CLI globally or have access to npx

## Common Issues and Solutions

### 1. "Command not found" error when running `netlify db init`

**Solution:**
- Make sure you have the Netlify CLI installed:
  ```
  npm install -g netlify-cli
  ```
- Verify the installation by running:
  ```
  netlify --version
  ```

### 2. Authentication issues

**Solution:**
- Make sure you're logged in to Netlify CLI:
  ```
  netlify login
  ```

### 3. Site not linked to Netlify

**Solution:**
- Link your local project to your Netlify site:
  ```
  netlify link
  ```

### 4. Netlify DB feature not available

**Solution:**
- Make sure you're using the latest version of Netlify CLI:
  ```
  npm update -g netlify-cli
  ```
- Check if Netlify DB is available for your account tier
- Contact Netlify support if you believe you should have access

### 5. Script execution issues

If the npm scripts aren't working, try running the commands directly:

```
# For Linux/macOS
chmod +x init-db.sh
./init-db.sh

# For Windows
init-db.bat

# Direct command
netlify db init
```

## Manual Setup

If you're still having issues, you can try setting up Netlify DB manually:

1. Go to your Netlify dashboard
2. Select your site
3. Go to the "Integrations" tab
4. Look for database integrations
5. Follow the on-screen instructions

## Getting Help

If you're still experiencing issues:

1. Check the [Netlify documentation](https://docs.netlify.com/storage/netlify-db/)
2. Visit the [Netlify Community forums](https://answers.netlify.com/)
3. Contact Netlify support