#!/bin/bash

# Simple build script for Netlify deployment
echo "Building HackBox..."

# Display Node.js version
echo "Node.js version:"
node --version

# Display npm version
echo "npm version:"
npm --version

# No build steps required for static files
echo "No build steps required. Static files ready for deployment."

# Exit with success
exit 0