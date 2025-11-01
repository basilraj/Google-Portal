@echo off
REM ============================================================
REM 🧹 GIT RESET AND CLEAN UPLOAD SCRIPT — GOOGLE JOBTICA
REM Deletes old .git repo, reinitializes, and pushes fresh content
REM ============================================================

:: ⚙️ CONFIGURATION
set PROJECT_PATH=C:\Users\user\Downloads\Google Jobtica
set REPO_URL=https://github.com/basilraj/Google-Portal.git
set BRANCH=main
set LOG_FILE=%PROJECT_PATH%\git_reset_log.txt

cd /d "%PROJECT_PATH%" || (
    echo ❌ ERROR: Project path not found. >> "%LOG_FILE%"
    echo The system cannot find the specified path.
    pause
    exit /b
)

echo =========================================================== >> "%LOG_FILE%"
echo [RESET START] %date% %time% >> "%LOG_FILE%"
echo =========================================================== >> "%LOG_FILE%"

:: 🚨 STEP 1: DELETE OLD GIT REPOSITORY
if exist "%PROJECT_PATH%\.git" (
    echo 🧹 Deleting old .git folder... >> "%LOG_FILE%"
    rmdir /s /q "%PROJECT_PATH%\.git"
    echo ✅ Old repository removed. >> "%LOG_FILE%"
) else (
    echo ⚠️ No existing .git folder found — starting fresh. >> "%LOG_FILE%"
)

:: 🚀 STEP 2: INITIALIZE NEW GIT REPO
git init >> "%LOG_FILE%" 2>&1
git add . >> "%LOG_FILE%" 2>&1
git commit -m "Fresh full upload on %date% %time%" >> "%LOG_FILE%" 2>&1
git branch -M %BRANCH% >> "%LOG_FILE%" 2>&1
git remote add origin %REPO_URL% >> "%LOG_FILE%" 2>&1

:: 🔄 STEP 3: FORCE PUSH NEW CONTENT
git push -u origin %BRANCH% --force >> "%LOG_FILE%" 2>&1

echo ✅ Successfully deleted old repo and uploaded new files to GitHub. >> "%LOG_FILE%"
echo ✅ Fresh upload complete! View log at "%LOG_FILE%"
pause
