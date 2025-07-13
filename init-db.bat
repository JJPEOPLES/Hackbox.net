@echo off
echo Initializing Netlify DB...
echo This script will help you set up Netlify DB for your HackBox project.
echo.
echo Make sure you have:
echo 1. Deployed your site to Netlify
echo 2. Logged in to Netlify CLI using 'npx netlify login'
echo.
echo Running Netlify DB initialization...

:: Run the Netlify DB init command
netlify db init

:: Check if the command was successful
if %ERRORLEVEL% EQU 0 (
    echo.
    echo Netlify DB initialization completed successfully!
    echo You can now use Netlify DB in your project.
) else (
    echo.
    echo Netlify DB initialization failed.
    echo Please check the error message above and try again.
    echo You may need to install or update the Netlify CLI.
)