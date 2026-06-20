# Guide Technique - Framework & Maquette Tactique "Retro Spy"
Ce document sert de guide de référence pour le développement, l'intégration et l'architecture visuelle du **Retro Spy Framework**. Ce framework a été spécialement modélisé d'après les captures d'écran de l'application de jeu de société d'espionnage, en respectant une contrainte absolue de **hauteur fixe sans défilement (No-Scroll)** de 100vh.
## 1. Identité Visuelle & Design Tokens
L'interface adopte un style de bande dessinée d'espionnage des années 60 (esthétique "pop-art/polar"), caractérisé par des couleurs contrastées, des lignes de contours épaisses et des angles dynamiques (éléments inclinés).
### Palette de Couleurs

| Rôle dans l'application | Code Hexadécimal | Nom du jeton CSS | Description |
| :--- | :--- | :--- | :--- |
| **Arrière-plan Principal** | #b54d24 | .bg-spy-orange | Couleur rouille chaude historique. |
| **Dossiers et Papiers** | #f2eedb | .bg-spy-paper | Beige chaud imitant le papier journal vieilli. |
| **Foncés et Contours** | #111111 | .border-spy-black | Noir franc pour une lisibilité maximale et un effet BD. |
| **Alertes et Accents** | #facc15 | bg-yellow-400 | Jaune vif pour attirer l'attention sur les boutons d'action. |
| **Faction : VIRUS** | #b91c1c | text-red-700 | Rouge sombre pour les éléments de sabotage. |

### Contours BD & Effets d'Inclinaison (Skew / Rotate)
Pour casser la rigidité numérique et donner un effet "découpé à la main", plusieurs classes utilitaires modifient les angles des blocs de texte et des cartes :
 * **spy-tilt-left** : Applique une rotation de -1.2deg et un cisaillement horizontal de -1deg. Utilisé alternativement pour les cartes d'agents.
 * **spy-tilt-right** : Applique une rotation de 1deg et un cisaillement de 0.8deg.
 * **spy-tilt-slight** : Rotation légère de -0.5deg pour stabiliser certains titres.
 * **border-spy-black / shadow-spy** : Ajoute une bordure noire de 3px accompagnée d'une ombre plate décalée pour simuler les ombres portées des illustrations.
## 2. Architecture Technique "No-Scroll" (100vh)
Afin de garantir que l'intégralité de l'interface tient dans l'écran de l'utilisateur (notamment lors d'une utilisation sur appareil mobile ou dans un conteneur iframe), les règles suivantes ont été appliquées :
 1. **Bloquer le conteneur parent** : Les balises html et body disposent de la propriété overflow: hidden et d'une hauteur forcée à 100%.
 2. **Gestion Flexbox stricte** : L'en-tête, la barre de navigation et le bouton d'action bas utilisent la propriété de réduction de taille désactivée (shrink-0). Seule la zone centrale de contenu est autorisée à s'étirer (flex-1).
 3. **Limitations de listes** : La liste d'enregistrement d'agents de l'Écran 1 est bridée par un max-h-[170px] et un débordement vertical automatique (overflow-y-auto), évitant ainsi de repousser le reste des blocs d'interface.
## 3. Le Bouton d'Empreinte Persistant (Dual-Action)
Situé au bas de l'appareil de jeu, le module d'empreinte digitale a été repensé pour centraliser deux interactions cruciales d'une seule main :
### Action 1 : Le Clic Simple (Navigation Séquentielle)
 * **Comportement** : Un clic ou un tapotement rapide sur l'empreinte digitale déclenche la fonction handleSequentialClick().
 * **Effet** : Cette fonction incrémente l'index de la page et fait passer l'utilisateur à l'étape suivante dans l'ordre chronologique de la partie :
   
### Action 2 : Le Clic Maintenu (Hold to Reveal)
 * **Comportement** : Un appui long prolongé (déclenché par onmousedown et ontouchstart pendant au moins 550ms) active l'affichage des informations secrètes.
 * **Effet** : La classe .hidden-role (qui applique un flou de 8px et réduit l'opacité à 15%) est retirée au profit de la classe .revealed-role. Dès que l'utilisateur relâche le bouton (onmouseup / ontouchend), les données redeviennent floues automatiquement pour masquer l'information aux yeux des tiers.
## 4. Aperçu des 7 Écrans Intégrés
```
[ Écran 1 : Inscription ] ➔ [ Écran 2 : Brief Service ] ➔ [ Écran 3 : Adoration ]
                                                                   │
[ Écran 6 : Verdict ] ◄─── [ Écran 5 : Informateur ] ◄─── [ Écran 4 : Brief Virus ]
        │
[ Écran 7 : Paramètres ]
```
 1. **Inscription (#screen-register)** : Permet de gérer la liste des joueurs en cours. Ajout et retrait dynamiques d'agents avec contrôle de conformité.
 2. **Briefing Service (#screen-role)** : Sceau de l'agence du Service et instructions sur le nombre de complices du VIRUS présents.
 3. **Obsession Adoration (#screen-adoration)** : Écran décrivant l'obsession secrète d'un joueur devant faire triompher la cible désignée (J1).
 4. **Infiltration Virus (#screen-virus)** : Insigne du serpent et identité des complices (Sophie & Hugo).
 5. **Informateur Secret (#screen-informant)** : Grille de sélection tactile permettant d'inspecter deux agents pour savoir si l'un d'eux appartient à la faction adverse.
 6. **Verdict / Résultats (#screen-results)** : Affichage final des vainqueurs et des perdants avec leurs allégeances respectives.
 7. **Paramètres (#screen-settings)** : Réglages du chronomètre de briefing, du volume audio et choix du niveau de difficulté tactique.