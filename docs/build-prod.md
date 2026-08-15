# Build production — Liste de courses

Guide pour produire un APK Android de production avec EAS Build, et gérer les versions.

## Prérequis

1. Compte Expo connecté au projet :
   ```bash
   npm run eas:login
   ```
2. Projet EAS initialisé (déjà fait si `app.json` contient `extra.eas.projectId`) :
   ```bash
   npm run eas:init
   ```
3. Les tests / checks locaux passent de préférence :
   ```bash
   npm run typecheck
   npm test
   npm run lint
   ```

## Profils de build

Définis dans `eas.json` :

| Profil        | Script npm              | Usage                     | Sortie Android |
| ------------- | ----------------------- | ------------------------- | -------------- |
| `development` | `npm run build:dev`     | Dev client interne        | APK            |
| `preview`     | `npm run build:preview` | Test interne (sans store) | APK            |
| `production`  | `npm run build:prod`    | Release prod              | APK            |

> Toujours utiliser `npm run <script>`, pas `npm <script>`.

## Versions : comment ça marche ici

Deux notions distinctes :

| Champ                               | Où                                            | Rôle                                                                        |
| ----------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------- |
| **Version utilisateur** (`version`) | `app.json` → `expo.version` (ex. `1.0.0`)     | Affichée à l’utilisateur (« version 1.0.0 »)                                |
| **Version native / build**          | Android : `versionCode` · iOS : `buildNumber` | Entier technique imposé par les stores ; doit **augmenter** à chaque upload |

### Config actuelle du projet

Dans `eas.json` :

```json
{
  "cli": {
    "appVersionSource": "remote"
  },
  "build": {
    "production": {
      "autoIncrement": true
    }
  }
}
```

- **`appVersionSource: "remote"`** — le `versionCode` (Android) est géré **sur les serveurs EAS**, pas dans le repo.
- **`autoIncrement: true`** (profil `production`) — à chaque `build:prod`, EAS incrémente automatiquement le `versionCode` distant.

Tu n’as donc **pas** à modifier manuellement un `versionCode` dans `app.json` pour les builds prod.

### Quand incrémenter la version utilisateur (`1.0.0` → `1.1.0`, etc.)

C’est **manuel** : édite `expo.version` dans `app.json` (et optionnellement `version` dans `package.json` pour rester aligné).

Convention semver recommandée :

| Changement | Exemple           | Quand                               |
| ---------- | ----------------- | ----------------------------------- |
| Patch      | `1.0.0` → `1.0.1` | Correctifs, petits changements      |
| Minor      | `1.0.0` → `1.1.0` | Nouvelles features rétrocompatibles |
| Major      | `1.0.0` → `2.0.0` | Breaking changes / refonte          |

Le `versionCode` natif, lui, continue d’être incrémenté automatiquement par EAS à chaque build prod, indépendamment du semver.

### Initialiser / forcer la version distante

Si tu migrés depuis un autre canal de distribution, ou si le compteur distant est désynchronisé :

```bash
npx eas-cli build:version:set
```

Cette commande permet de fixer la dernière version native connue côté EAS.

Consulter les versions distantes :

```bash
npx eas-cli build:version:get
```

## Lancer un build production

1. **(Optionnel)** Bump la version utilisateur dans `app.json` si c’est une nouvelle release visible.
2. Committe tes changements (recommandé : build depuis un état propre et traçable).
3. Lance le build :
   ```bash
   npm run build:prod
   ```
   Équivalent :
   ```bash
   npx eas-cli build --platform android --profile production
   ```
4. Suis la progression dans le terminal ou sur [expo.dev](https://expo.dev) (projet → Builds).
5. Une fois terminé, télécharge l’APK depuis le dashboard EAS ou via le lien fourni en fin de build.

Le `versionCode` distant est incrémenté automatiquement pendant ce build.

## Après le build

- Installer l’APK sur un appareil de test (sideload) pour valider.
- Publier sur le Play Store uniquement si tu passes en AAB (`app-bundle`) et configures la soumission — aujourd’hui le profil prod génère un **APK** (`buildType: "apk"`), pratique pour distribution directe / tests, pas le format standard Play Store.

Pour soumettre plus tard via EAS Submit (quand le profil prod sera en AAB) :

```bash
npx eas-cli submit --platform android --profile production
```

(Le bloc `submit.production` existe déjà dans `eas.json`.)

## Checklist release

- [ ] Features / fixes mergés
- [ ] `npm run typecheck` + `npm test` + `npm run lint` OK
- [ ] `expo.version` bumpée si nouvelle version utilisateur
- [ ] `npm run build:prod`
- [ ] APK testé sur appareil
- [ ] Tag git optionnel : `v1.0.0` (aligné sur `expo.version`)

## Dépannage rapide

| Problème                                     | Piste                                                              |
| -------------------------------------------- | ------------------------------------------------------------------ |
| `Unknown command: "build:prod"`              | Utiliser `npm run build:prod`                                      |
| Non connecté à Expo                          | `npm run eas:login`                                                |
| Version native déjà utilisée / conflit store | `npx eas-cli build:version:get` puis `build:version:set`           |
| Build qui échoue sur les credentials         | Suivre les prompts EAS (keystore Android géré par EAS Credentials) |

## Références

- [EAS Build](https://docs.expo.dev/build/introduction/)
- [App version management](https://docs.expo.dev/build-reference/app-versions/)
- Config locale : `eas.json`, `app.json`, scripts dans `package.json`
