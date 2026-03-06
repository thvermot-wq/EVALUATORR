# Evaluatorr Worker (`/correct`)

Worker Cloudflare pour alimenter le mode `ONLINE` d'EVALUATORR.

## Endpoint
- `POST /correct`
- Réponse: **JSON strict uniquement**

## Fonctionnalités
- CORS autorisé pour:
  - votre domaine GitHub Pages (`GITHUB_PAGES_ORIGIN`)
  - `*.github.io`
  - `localhost` / `127.0.0.1`
- Rate-limit simple: par IP / minute
- Limite de taille payload
- Appel Workers AI:
  - modèle `@cf/meta/llama-3.1-8b-instruct-fast`
  - JSON mode via `response_format: json_schema`

## Déploiement (Wrangler)
1. Installer Wrangler:
   - `npm i -g wrangler`
2. Login:
   - `wrangler login`
3. Se placer dans `worker/`
4. Déploiement:
   - `wrangler deploy`

## Variables
Dans `wrangler.toml`:
- `GITHUB_PAGES_ORIGIN` (ex: `https://thvermot-wq.github.io`)
- `MAX_PAYLOAD_BYTES` (par défaut `12000`)
- `RATE_LIMIT_PER_MIN` (par défaut `30`)

## Exemple de requête
```bash
curl -X POST "https://<votre-worker>/correct" \
  -H "Content-Type: application/json" \
  -d '{
    "tool":"EVALUATORR",
    "level":"4e",
    "text":"Texte élève...",
    "local":{
      "score50":28,
      "modules":{},
      "gates":{},
      "traceLight":[]
    },
    "schema":"evaluatorr-v1"
  }'
```

## Notes
- Le Worker **ne donne pas** de note finale: il renvoie des **deltas** + preuves/conseils.
- Côté client, la note finale reste déterministe/calibrée.
- Allocation free Workers AI: 10,000 Neurons/jour (selon offre Cloudflare en vigueur).
