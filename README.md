# Liste de course

Application Android simple pour gérer vos listes de courses au quotidien.  
Les données restent **uniquement sur votre téléphone** : pas de compte, pas de connexion Internet requise.

---

## Fonctionnalités

- **Plusieurs listes** — créez autant de listes que nécessaire (supermarché, marché, pharmacie…)
- **Articles** — ajoutez, modifiez, cochez ou supprimez des articles dans chaque liste
- **Archivage** — maintenez appuyé sur une liste depuis l’accueil pour l’archiver une fois la course terminée
- **Historique** — consultez vos listes archivées (lecture seule)
- **Thème** — clair, sombre ou automatique (selon le réglage du téléphone)
- **Hors ligne** — tout fonctionne sans réseau, vos listes sont sauvegardées localement

---

## Installation (Android)

> Cette application n’est **pas disponible sur le Play Store**. Elle est distribuée gratuitement via GitHub pour un usage personnel entre proches.

### Prérequis

- Un téléphone **Android** (version 7.0 / API 24 minimum)
- Autorisation d’installer des applications **hors du Play Store** (sources inconnues)

### Étapes

1. Rendez-vous dans la section **[Releases](https://github.com/chaigneauP/liste-course/releases)** de ce dépôt.
2. Téléchargez le fichier **`.apk`** de la dernière version (ex. `liste-course-v1.0.0.apk`).
3. Ouvrez le fichier téléchargé :
   - depuis **Chrome** ou votre gestionnaire de fichiers,
   - ou via la notification « Téléchargement terminé ».
4. Si Android affiche un avertissement de sécurité, appuyez sur **Paramètres** ou **Autoriser quand même**, puis autorisez l’installation pour cette source (Chrome, Fichiers, etc.).
5. Appuyez sur **Installer**, puis **Ouvrir**.

L’application apparaît sous le nom **« liste de course »** sur votre écran d’accueil.

### Dépannage

| Problème | Solution |
|----------|----------|
| « Application bloquée » ou « Source inconnue » | Autorisez l’installation depuis l’application utilisée pour télécharger l’APK (Réglages → Applications → [Chrome/Fichiers] → Installer des applications inconnues). |
| « Application non installée » | Désinstallez une ancienne version incompatible, ou vérifiez que vous avez assez d’espace de stockage. |
| L’app ne s’ouvre pas | Assurez-vous d’avoir téléchargé l’APK **preview** ou **production** (pas le build *development*, qui nécessite un ordinateur connecté). |

---

## Mise à jour

Les mises à jour ne sont **pas automatiques** (pas de Play Store).

1. Consultez la page [Releases](https://github.com/chaigneauP/liste-course/releases).
2. Téléchargez la nouvelle version.
3. Installez-la par-dessus l’ancienne (vos listes sont conservées tant que le numéro de version interne de l’app reste compatible).

---

## Utilisation rapide

| Action | Comment faire |
|--------|---------------|
| Créer une liste | Appuyez sur **Nouvelle liste** (bouton central en bas) |
| Ouvrir une liste | Appuyez sur la liste depuis l’accueil |
| Ajouter un article | Dans une liste, appuyez sur **+** en bas à droite |
| Cocher un article | Appuyez sur la case à cocher |
| Archiver une liste | Maintenez appuyé sur la liste depuis l’accueil |
| Voir l’historique | Onglet **Historique** |
| Changer le thème | Onglet **Paramètres** → Apparence |
| Supprimer l’historique | Onglet **Paramètres** → Supprimer l’historique |

---

## Confidentialité

- Aucune donnée n’est envoyée sur Internet.
- Aucun compte utilisateur n’est nécessaire.
- Les listes sont stockées localement sur l’appareil.
- La suppression de l’application efface toutes les données.

---

## iPhone / iPad

Une version iOS n’est pas proposée pour l’instant. La distribution hors App Store sur iPhone nécessite un compte développeur Apple payant et des démarches techniques peu adaptées à un usage familial.

---

## Développement

Ce dépôt contient le code source de l’application (Expo / React Native).  
Pour les détails d’architecture, voir [`docs/architecture.md`](docs/architecture.md).

---

## Licence

Usage personnel. Application non commerciale, partagée entre proches.
