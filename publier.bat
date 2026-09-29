@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ============================================
echo   Publication de la carte en ligne...
echo ============================================
echo.

:: 1) Récupérer automatiquement le card-data.js téléchargé (dossier Téléchargements)
powershell -NoProfile -ExecutionPolicy Bypass -Command "$d=Get-ChildItem \"$env:USERPROFILE\Downloads\card-data*.js\" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1; if($d){$l=Join-Path '%~dp0' 'card-data.js'; if($d.LastWriteTime -gt (Get-Item $l).LastWriteTime){Copy-Item $d.FullName $l -Force; Write-Host ('Nouvelle version copiée : '+$d.Name)}else{Write-Host 'Le fichier local est déjà à jour.'}}else{Write-Host 'Aucun card-data.js dans Téléchargements (pas grave si rien à publier).'}"

echo.

:: 2) Envoyer tout sur GitHub
git add -A
set CHANGES=0
git diff --cached --quiet || set CHANGES=1
if "%CHANGES%"=="0" (
  echo Aucun nouveau changement détecté.
) else (
  git commit -m "Mise à jour carte de visite"
  echo.
  echo Commit effectué, envoi sur GitHub...
)

git push origin main
if errorlevel 1 goto erreur

echo.
echo ============================================
echo   TERMINÉ !
echo   Patientez 1 à 2 minutes puis rescannez
echo   le QR code.
echo ============================================
pause
exit /b 0

:erreur
echo.
echo  ERREUR : la publication a échoué.
echo  Vérifiez votre connexion et vos identifiants GitHub.
pause
exit /b 1