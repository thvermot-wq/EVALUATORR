# Tests manuels (PR0)

Objectif: valider rapidement le comportement actuel d'EVALUATORR avec des textes de référence, sans modifier le moteur de scoring.

## Pré-requis
- Navigateur web (Chrome, Firefox, Edge, Safari).
- Dépôt local cloné.
- Fichier d'entrée principal: `index.html`.

## Jeu de fixtures
Les 12 textes de test sont dans `tests/fixtures/`:
- Niveaux: 5e, 4e, 3e
- Qualité: très mauvais, moyen, bon

## Procédure (≈ 5 minutes)
1. Ouvrir `index.html` dans le navigateur.
2. Pour chaque niveau (5e, 4e, 3e), copier-coller au moins:
   - 1 fixture `*_tres_mauvais_*`
   - 1 fixture `*_moyen_*`
   - 1 fixture `*_bon_*`
3. Lancer l'évaluation.
4. Vérifier les points suivants:
   - Le résultat s'affiche sans erreur JS visible.
   - Les textes « très mauvais » obtiennent un rendu global nettement inférieur aux textes « bons » du même niveau.
   - Les indicateurs détaillés (passes/metrics) sont cohérents avec la qualité perçue.
5. Vérifier les exports:
   - Export disponible et fichier généré.
   - Le contenu exporté contient bien la note/les sections affichées.
6. Vérifier l'historique local:
   - Une entrée est ajoutée après évaluation.
   - Après rechargement de la page, l'historique est toujours présent (localStorage).

## Vérification minimale recommandée
- 3 évaluations (5e mauvais, 4e moyen, 3e bon).
- 1 export.
- 1 contrôle de persistance après refresh.

## Résultat attendu
- Flux complet fonctionnel de bout en bout: saisie → scoring → affichage → export → historique.
