# ADGN — Portail de demandes de remboursement

Application statique HTML/CSS/JS hébergeable sur GitHub Pages.

## Déploiement
1. Déposez **tous les fichiers et le dossier `icons/`** à la racine d'un dépôt GitHub.
2. Le courriel de destination par défaut est déjà `association.divertissement.gn@gmail.com` dans `app.js`. Modifiez `DEFAULT_EMAIL` seulement si nécessaire, et ajustez `DEFAULT_ACTIVITIES` (par ex. `['Laestrom', 'Autre événement']`).
3. GitHub > Settings > Pages > Deploy from a branch > main / (root) > Save.
4. Ouvrez l'URL Pages et soumettez **un formulaire d'essai**, avec une fausse facture sans données privées.
5. Confirmez l'adresse de réception depuis le courriel d'activation de FormSubmit. Vérifiez le message et les pièces jointes avant utilisation réelle.

## Installer sur téléphone (PWA)
- **Android** : ouvrir le site publié avec Chrome puis choisir « Installer l’application » (bouton proposé lorsque disponible, sinon menu ⋮ > Installer l’application / Ajouter à l’écran d’accueil).
- **iPhone** : ouvrir avec Safari, toucher **Partager** puis **Sur l’écran d’accueil** et **Ajouter**. Selon la version iOS, l’option peut être dans le menu « ... » de partage.
- Une fois installée, l’application s’ouvre dans sa propre fenêtre sans barre du navigateur. La page peut s’ouvrir hors ligne après le premier chargement, mais l’envoi et les factures nécessitent Internet.
- **Attention** : la demande et les fichiers joints ne sont pas enregistrés en brouillon; ne fermez pas l’application avant l’envoi. Les préférences d’activité et de destination sont locales à cet appareil. L’option d’installation requiert le HTTPS fourni par GitHub Pages (ou localhost pour tester).

## Fonctionnement
- Chaque demande contient nom, courriel, activité, justification, plusieurs dépenses (quoi/où/quand/montant), méthode de remboursement et fichiers justificatifs.
- Total CAD calculé automatiquement.
- Envoi par formulaire HTML `multipart/form-data` à FormSubmit. Les images sont des pièces jointes, pas des images insérées dans le corps du message.
- Limite totale de fichiers: 10 Mo (selon le service).
- Configuration via l'interface sauvée **sur l'appareil local uniquement** : pour une configuration partagée, modifiez les constantes de `app.js` et republiez.
- Le service tiers gère l'envoi, la vérification et les éventuels filtres anti-spam. Le fonctionnement dépend du service; test réel requis.

## Sécurité et limites
- Ne demandez jamais les mots de passe, numéros de compte bancaire complets ou informations sensibles inutiles.
- Les formulaires et les factures passent par **FormSubmit (un fournisseur externe)**. Vérifiez que son utilisation convient à la politique de confidentialité de votre organisme.
- La destination configurée dans un fichier public est visible; toute personne connaissant l'URL pourrait soumettre des demandes. La vérification anti-robot et le filtrage de FormSubmit ne remplacent pas une authentification.
- GitHub Pages ne fournit pas de serveur d'envoi de courriels ni de stockage privé.
- Aucune base de données, aucun suivi d'approbation et aucun statut de remboursement.
- Si l'organisme souhaite des accès privés, une conservation documentaire contrôlée ou un suivi, envisager un backend authentifié.

Sources : https://formsubmit.co/documentation et https://docs.github.com/en/pages
