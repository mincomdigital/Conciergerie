# Site Conciergerie Airbnb

Site vitrine multi-pages en HTML/CSS/JS pur, pret a ouvrir localement.

## Ouvrir le site

1. Ouvrir `index.html` dans un navigateur.
2. Navigation complete entre les pages:
   - `services.html`
   - `a-propos.html`
   - `faq.html`
   - `contact.html`
   - `mentions-legales.html`
   - `politique-confidentialite.html`

## Personnalisation rapide

- Nom de marque: rechercher `Cle d'Or Conciergerie` dans les fichiers `.html`.
- Coordonnees: modifier telephone/email/villes dans le footer des pages.
- Offres/prix: modifier la section Formules dans `index.html`.
- Couleurs/typos: modifier `assets/css/main.css` (variables CSS en debut de fichier).
- Comportements JS (menu mobile, FAQ, formulaire): `assets/js/main.js`.
- Theme jour/nuit: bouton en haut du site, et styles dans `assets/css/main.css`.
- Parallax: elements avec classe `.parallax-layer` et attribut `data-parallax-speed`.

## Note formulaire

Le formulaire de `contact.html` valide les champs et peut envoyer un vrai email via configuration front.
Sans configuration (`provider: none`), le site reste en mode demo et n'envoie rien.

### Config email rapide

1. Ouvrir `assets/js/email-config.js`.
2. Choisir `provider`:
   - `none`: pas d'envoi externe (mode demo)
   - `formspree`: renseigner `endpoint`
   - `web3forms`: renseigner `accessKey`
3. Sauvegarder puis tester `contact.html`.

Un fichier exemple est fourni: `assets/js/email-config.example.js`.
