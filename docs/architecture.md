# Architecture — Liste de courses

Application Expo (SDK 57) / Expo Router organisée en **Clean Architecture** (ports & adapters).  
Le code métier est indépendant de React Native, d’AsyncStorage et d’Expo.

## Vue d’ensemble

```
src/
├── app/               # Routes Expo Router (coquilles minces)
├── domain/            # Entités + ports (pur, sans I/O)
├── application/       # Cas d’usage (orchestration)
├── infrastructure/    # Adaptateurs concrets + composition root
└── presentation/      # UI React Native, hooks, thème
```

Alias TypeScript : `@/*` → `./src/*`.

### Sens des dépendances

```
app ──────────────► infrastructure, presentation
presentation ─────► application (via provider), domain
infrastructure ───► application, domain
application ──────► domain uniquement
domain ───────────► rien d’extérieur
```

**Interdit :** la présentation n’importe jamais l’infrastructure ; le domaine n’importe jamais React, Expo ou AsyncStorage.

---

## Couches

### 1. Domain (`src/domain`)

Modèle métier et contrats. Aucune dépendance framework.

| Dossier | Rôle |
|---------|------|
| `entities/` | Types + fonctions pures (`ShoppingList`, `Item`, `ThemePreference`, …) |
| `ports/` | Interfaces (`ShoppingListRepository`, `Clock`, `IdGenerator`, …) |

Règles importantes :

- Les mutations métier vivent dans les entités (`addItemToList`, `markListAsArchived`, …).
- Quand une règle interdit la modification, la fonction **renvoie la même référence** (no-op détectable par identité).
- Les ports décrivent *quoi* persister / générer, jamais *comment*.

### 2. Application (`src/application`)

Orchestre le domaine contre les ports. Expose des fonctions appelables.

| Fichier / dossier | Rôle |
|-------------------|------|
| `appUseCases.ts` | Façade `AppUseCases` + `createAppUseCases(deps)` |
| `useCases/shoppingLists/` | Création, requêtes, archive, items |
| `useCases/theme/` | Préférence de thème |

Pattern usuel : factory `makeXxx(deps) → (input) => Promise<…>`.

Brique partagée : `makeMutateShoppingList` charge → mute (domaine) → horodate → persiste, et **n’écrit pas** si `mutated === list`.

### 3. Infrastructure (`src/infrastructure`)

Seule couche autorisée à connaître AsyncStorage, `Date`, etc.

| Fichier / dossier | Rôle |
|-------------------|------|
| `createAppContainer.ts` | **Composition root** : branche les implémentations concrètes |
| `storage/` | Repos AsyncStorage, mapper, mutex, clés |
| `system/` | `systemClock`, `randomIdGenerator` |

Tout nouveau I/O = nouveau port (domaine) + adaptateur ici + câblage dans `createAppContainer` uniquement.

### 4. Presentation (`src/presentation`)

UI React Native. Consomme les cas d’usage via contexte, jamais le stockage.

| Dossier | Rôle |
|---------|------|
| `screens/` | Écrans (`HomeScreen`, `ListScreen`, …) |
| `components/` | Composants réutilisables |
| `hooks/` | État local + appels use cases + refresh |
| `providers/` | `UseCasesProvider` |
| `theme/` | Tokens, `ThemeProvider`, `makeStyles` |
| `formatters/` | Textes UI (pluriels FR, etc.) |
| `navigation/` | Options de stack |

Organisation d’un composant / écran :

```
ComponentName/
├── ComponentName.tsx
├── ComponentName.styles.ts   # useComponentNameStyles = makeStyles(...)
└── index.ts                  # export public
```

### 5. App / routes (`src/app`)

Expo Router utilise `src/app` (prioritaire sur un éventuel `app/` racine).

Les fichiers de route sont des **re-exports** d’écrans, sauf `_layout.tsx` qui compose :

1. `createAppContainer()`
2. `UseCasesProvider`
3. `ThemeProvider`
4. `Stack` + `StatusBar`

| Route | Écran | Titre nav |
|-------|-------|-----------|
| `index` | `HomeScreen` | Accueil |
| `liste/[id]` | `ListScreen` | Liste |
| `historique` | `HistoryScreen` | Historique |
| `parametres` | `SettingsScreen` | Paramètres |

---

## Styles & thème

- Styles hors JSX : fichiers `*.styles.ts` via `makeStyles((theme) => ({ … }))`.
- `makeStyles` met en cache `StyleSheet.create` par schéma `light` / `dark`.
- Tokens : `presentation/theme/tokens/` (`colors`, `spacing`, `radius`, `typography`, `shadows`).
- Préférence thème : domaine (`light` \| `dark` \| `system`) → port → AsyncStorage → use cases → `ThemeProvider`.
- Icônes UI : **Ionicons** (`@expo/vector-icons`) uniquement — ne pas introduire une seconde famille (FontAwesome, etc.).

---

## Animations & perf UI

- Animations interactives / layout (scale press, morph tab, etc.) : **`react-native-reanimated`** (UI thread). Babel est déjà configuré via `babel-preset-expo`.
- Animations simples de fade / opacity hors hot path peuvent rester sur `Animated` RN.
- Toujours `cancelAnimation` (Reanimated) ou `.stop()` (RN) dans le cleanup `useEffect`.

### React Compiler & `memo`

`experiments.reactCompiler` (Expo) **n’est pas activé** pour l’instant — décision différée jusqu’à un healthcheck + validation manuelle (tabs, listes, animations).

Jusque-là :

- Garder `React.memo` sur les rows de listes (`ItemRow`, `CardRow`) et stabiliser handlers / props dans les écrans / sections qui les mappent.
- Ne pas ajouter `useMemo` / `useCallback` hors listes « pour la perf ».
- Quand le compiler sera activé (`app.json` → `experiments.reactCompiler: true`), on pourra retirer les `memo` redondants progressivement.

---

## Conventions de langage

| Zone | Langue |
|------|--------|
| Routes, titres, libellés UI, alertes | **Français** |
| Identifiants code / domaine / use cases | **Anglais** (`ShoppingList`, `active`, `archive`) |
| Commentaires | Souvent français |

---

## Checklist pour une nouvelle feature

1. **Règle métier** → fonction pure dans `domain/entities`.
2. **Besoin d’I/O** → port dans `domain/ports` + adaptateur dans `infrastructure`.
3. **Cas d’usage** → `make*` dans `application/useCases`, enregistré dans `AppUseCases`.
4. **Câblage** → uniquement dans `createAppContainer`.
5. **UI** → hook / écran via `use*UseCases()`, styles dans `*.styles.ts`, textes FR.
6. **Route** → fichier mince dans `src/app` qui réexporte l’écran.

---

## Références

- Rules IA Cursor : `.cursor/rules/`
- Docs Expo SDK 57 : https://docs.expo.dev/versions/v57.0.0/
