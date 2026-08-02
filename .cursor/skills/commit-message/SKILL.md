---
name: commit-message
description: >-
  Génère un message de commit conventional à partir des changements git locaux.
  Use when the user asks for a commit message, "message de commit", or wants to
  describe changes before pushing — without committing unless explicitly asked.
---

# Commit Message

Génère un message de commit conventional décrivant les changements qui seront poussés.

## Workflow

1. **Analyser l'état git** — lancer en parallèle :
   - `git status`
   - `git diff` (et `git diff --cached` si des fichiers sont stagés)
   - `git log --oneline -10` (style existant du dépôt)

2. **Inclure les fichiers non suivis** — lire les nouveaux fichiers pertinents si le diff seul ne suffit pas.

3. **Rédiger le message** — ne pas committer sauf demande explicite de l'utilisateur.

## Format conventional commit

```
<type>(<scope>): <description courte>

<corps optionnel — pourquoi et points clés>
```

### Types

| Type | Usage |
|------|-------|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `refactor` | Refactoring sans changement de comportement |
| `chore` | Maintenance, dépendances, config |
| `docs` | Documentation seule |
| `test` | Tests |
| `style` | Formatage, pas de changement logique |

### Règles

- **Sujet** : impératif, ≤ 72 caractères, sans point final
- **Scope** : optionnel, domaine concerné (`lists`, `storage`, `ui`, …)
- **Corps** : expliquer le *pourquoi* et les changements majeurs, pas une liste fichier par fichier
- **Langue** : anglais pour le sujet conventional ; corps en français si l'utilisateur communique en français
- **Référence issue** : ajouter `#<numéro>` si une issue GitLab est connue

## Sortie attendue

Présenter le message dans un bloc prêt à copier :

```
feat(scope): description

- Point clé 1
- Point clé 2
```

Ajouter une brève synthèse des fichiers touchés si utile, sans remplacer le message.

## Exemple

Changements : écran unique remplacé par des listes multiples, migration stockage.

```
feat(lists): prise en charge de plusieurs listes de courses

- Route dynamique liste/[id] à la place de nouvelle-liste
- Stockage multi-listes avec migration depuis l'ancien format
- Accueil : affichage, création et suppression des listes
```
