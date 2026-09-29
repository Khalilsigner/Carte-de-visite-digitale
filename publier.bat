@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ============================================
echo   Publication de la carte sur GitHub...
echo ============================================
echo.

git add -A

set CHANGES=0
git diff --cached --quiet || set CHANGES=1

if "%CHANGES%"=="0" (
  echo Aucun nouveau changement detecte (carte deja a jour).
) else (
  git commit -m "Mise a jour carte de visite"
  echo.
  echo Commit effectue, envoi sur GitHub...
)

git push origin main
if errorlevel 1 goto erreur

echo.
echo ============================================
echo   TERMINE !
echo   Patientez 1 a 2 minutes (GitHub Pages
echo   reconstruit le site) puis rescannez
echo   le QR code.
echo ============================================
pause
exit /b 0

:erreur
echo.
echo  ERREUR : la publication a echoue.
echo  Verifiez votre connexion et vos identifiants GitHub.
pause
exit /b 1