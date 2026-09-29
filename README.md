# Carte de visite digitale

Carte de visite digitale avec **QR code** — site 100 % statique (HTML / CSS / JS), sans serveur ni base de données.

## 🚀 Mise en ligne (GitHub Pages)

1. Poussez le projet vers votre dépôt GitHub (fait si vous lisez ceci depuis le dépôt).
2. Sur GitHub : **Settings → Pages → Source : *Deploy from a branch*** → branche `main` → dossier `/ (root)` → **Save**.
3. Votre carte est en ligne à :
   `https://<votre-pseudo>.github.io/<nom-du-depot>/`
   *(ex. : `https://khalilsigner.github.io/Carte-de-visite-digitale/`)*

## 📱 Le QR code

- Le QR code affiché dans l'application pointe vers l'**URL publique** de la carte.
- En scannant, le téléphone ouvre un navigateur et affiche la carte **sans** le bouton « Modifier » et **sans** la section QR code : un rendu 100 % professionnel.
- La version publique est reconnue grâce à `?v=public` ajoutée à l'URL.
- ⚠️ Si le site n'est pas encore en ligne, l'application bascule automatiquement sur un QR vCard (les coordonnées directement scannables) pour rester fonctionnelle hors-ligne.

## ✏️ Mettre à jour la carte publique (2 clics)

1. Ouvrez `index.html` → **Modifier ma carte** → modifiez vos infos → **Enregistrer**
   *(le fichier `card-data.js` se télécharge automatiquement)*
2. **Double-cliquez sur `publier.bat`** dans le dossier du projet
   *(il copie le fichier téléchargé et envoie tout sur GitHub automatiquement)*
3. Attendez 1 à 2 minutes, puis rescannez le QR code.

> 💡 Les modifications faites localement ne sont visibles que sur **votre** navigateur (localStorage). Pour que les visiteurs les voient, il faut toujours exporter + publier.

## 📁 Structure

```
index.html        → l'application (carte + éditeur)
style.css         → le design
script.js         → la logique
card-data.js      → les données affichées au public
vendor/qrcode.js  → bibliothèque QR (locale, aucun CDN requis)
```