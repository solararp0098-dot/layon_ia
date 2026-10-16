# LAYON AI — Studio TikTok gratuit

Prototype de site web statique qui fonctionne dans un navigateur récent, sans compte, sans clé API et sans abonnement.

## Ce que cette version fait
- Propose des idées de vidéos selon plusieurs univers visuels.
- Prépare une légende et des hashtags.
- Anime une scène verticale originale dans le navigateur.
- Exporte une courte vidéo WebM via l'enregistrement du canvas.

## Ce qu'elle ne fait pas encore
- Ce n'est pas un modèle génératif d'images ou de vidéos : les scènes sont des animations procédurales dessinées par le code.
- Elle ne publie pas directement sur TikTok.
- Elle ne tourne pas en arrière-plan toute seule : il faut ouvrir le site et lancer l'export.
- L'export est en WebM. Selon les options de ton compte et les formats acceptés à l'import, une conversion MP4 peut être nécessaire.

## Lancer sur Windows
1. Télécharge et décompresse `layon-ai.zip`.
2. Ouvre le dossier `layon-ai`.
3. Double-clique sur `index.html`.
4. Pour de meilleurs résultats, utilise une version récente de Google Chrome ou Microsoft Edge.
5. Choisis un univers visuel, clique sur **Générer une idée**, puis **Créer la vidéo**.
6. Garde l'onglet ouvert jusqu'à ce que le téléchargement démarre.
7. Importe le fichier téléchargé dans TikTok ou TikTok Studio et colle la légende préparée.

Aucun serveur n'est nécessaire pour tester le prototype localement.

## Mettre le site en ligne gratuitement
Tu peux héberger ces trois fichiers sur un service d'hébergement statique gratuit, par exemple GitHub Pages. Le site restera accessible via une URL publique, mais la création vidéo se déroule dans le navigateur du visiteur. Les services gratuits et leurs conditions peuvent évoluer.

## Publication automatique TikTok
La publication directe nécessite une intégration serveur avec l'API Content Posting de TikTok, une application enregistrée, les autorisations requises et, selon le cas, un audit. Ne donne jamais ton mot de passe TikTok à un bot tiers. Ce prototype ne demande aucun identifiant TikTok.

## Fichiers
- `index.html` : interface
- `style.css` : design responsive
- `app.js` : scènes animées, génération d'idées et export WebM
