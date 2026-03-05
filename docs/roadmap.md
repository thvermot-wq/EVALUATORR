# Roadmap PR1 → PR5

## PR1 — Couverture de tests manuels étendue et grille d'observation
Structurer une grille de validation plus fine autour des sorties actuelles (cohérence des métriques, stabilité des scores entre essais, qualité des messages de feedback), puis consolider un protocole reproductible par niveau (5e/4e/3e) afin de préparer les changements futurs sans casser les attentes pédagogiques existantes.

## PR2 — Durcissement UX des entrées/sorties
Améliorer la robustesse de l'interface sans toucher au cœur de scoring: clarifier les états vides, mieux guider le collage de texte, renforcer les messages d'erreur/non-régression et harmoniser les parcours d'export/historique pour réduire les ambiguïtés lors des tests enseignants en conditions réelles.

## PR3 — Calibrage pédagogique progressif (non bloquant)
Introduire un cadre de calibrage léger entre score calculé et appréciation enseignante (échantillon contrôlé + écarts notés), afin d'identifier les zones de sur/sous-évaluation et de prioriser les futurs ajustements heuristiques avec des preuves concrètes plutôt qu'au ressenti.

## PR4 — Qualité des chartes et traçabilité documentaire
Rationaliser l'usage des chartes textuelles (rédaction, description, dialogues, style) via une documentation de référence unique: correspondance entre attentes pédagogiques et signaux évalués, exemples positifs/négatifs, et historique des arbitrages pour faciliter maintenance et onboarding.

## PR5 — Préparation d'une itération moteur sécurisée
Définir un plan d'évolution du moteur (à implémenter ensuite) avec garde-fous explicites: objectifs mesurables, jeux d'essai de non-régression, seuils d'acceptation, et stratégie de déploiement incrémental pour améliorer la pertinence du scoring tout en conservant la stabilité de l'outil en classe.
