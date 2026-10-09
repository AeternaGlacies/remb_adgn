# ADGN — Portail de remboursement

## [OUVRIR L’APPLICATION](https://aeternaglacies.github.io/remb_adgn/)

Le formulaire envoie à **association.divertissement.gn@gmail.com** par FormSubmit. L'adresse est fixe dans l'interface ; l'application GitHub Pages reste publique et un utilisateur techniquement compétent pourrait contourner les validations côté navigateur. Aucun mot de passe ou secret ne peut être caché dans le JavaScript publié.

## Référence de remboursement

L'objet et le contenu du courriel contiennent un identifiant comme `LAESTROM2026_7F2A4B90E1D3AC`. Le suffixe est produit avec `crypto.getRandomValues()` (56 bits). Le risque de collision est très faible, **mais l'unicité absolue n'est pas garantie sans registre central**. Une nouvelle tentative de la même demande sur la même page utilise la même référence pour faciliter les vérifications.

## Sécurité et conservation

- Les images et PDF sont vérifiés sur le navigateur : types autorisés et poids total maximum 10 Mo. Ces contrôles ne remplacent pas une validation serveur.
- Ne pas transmettre de numéros bancaires complets. Pour Interac, renseigner uniquement un courriel ou un téléphone.
- FormSubmit reçoit les données et pièces jointes ; vérifier ses conditions de confidentialité et de conservation avant production.
- Vérifier manuellement chaque remboursement avec le bénévole, puis conserver facture + justificatif de virement dans les archives de l'ADGN.
- L'ADGN doit protéger l'accès Gmail avec la vérification en deux étapes et limiter l'accès aux archives.
- Les paramètres locaux conservent seulement la liste d'activités ajoutées, pas les demandes ou factures.
- Cette application ne certifie pas l'identité de l'expéditeur et ne réalise aucun virement.

## Installation GitHub Pages

Téléverser le **contenu** du ZIP à la racine de `AeternaGlacies/remb_adgn`, en conservant les dossiers `assets/` et `icons/`. Dans Settings > Pages : branche `main`, dossier `/(root)`.

```text
remb_adgn/
├── README.md
├── index.html
├── app.js
├── style.css
├── manifest.webmanifest
├── sw.js
├── assets/
│   ├── adgn-epee.png
│   └── adgn-logo.png
└── icons/
    ├── icon-192.png
    ├── icon-512.png
    ├── icon-maskable-512.png
    ├── apple-touch-icon.png
    └── favicon-32.png
```

Les anciens PNG placés directement à la racine peuvent être retirés **après** confirmation que les ressources sous `icons/` et `assets/` fonctionnent en production.
