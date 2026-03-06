const MODEL = "@cf/meta/llama-3.1-8b-instruct-fast";

const EvaluatorrSchemaV1 = {
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "overall", "modules", "priorities", "rewrites", "bulletin"],
  properties: {
    schema_version: { type: "string", const: "1" },
    overall: {
      type: "object",
      additionalProperties: false,
      required: ["score50_delta_suggestion", "confidence"],
      properties: {
        score50_delta_suggestion: { type: "number", minimum: -2, maximum: 2 },
        confidence: { type: "number", minimum: 0, maximum: 1 },
      },
    },
    modules: {
      type: "object",
      additionalProperties: false,
      required: ["narration", "description", "dialogues", "style", "time_place", "lexicon", "cohesion", "coherence", "language"],
      properties: {
        narration: moduleSchema(),
        description: moduleSchema(),
        dialogues: moduleSchema(),
        style: moduleSchema(),
        time_place: moduleSchema(),
        lexicon: moduleSchema(),
        cohesion: moduleSchema(),
        coherence: moduleSchema(),
        language: moduleSchema(),
      },
    },
    priorities: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "why", "do_next"],
        properties: {
          title: { type: "string", minLength: 3 },
          why: { type: "string", minLength: 3 },
          do_next: { type: "string", minLength: 3 },
        },
      },
    },
    rewrites: {
      type: "array",
      minItems: 2,
      maxItems: 2,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["focus", "before_excerpt", "after_proposal"],
        properties: {
          focus: { type: "string", minLength: 3 },
          before_excerpt: { type: "string", minLength: 1 },
          after_proposal: { type: "string", minLength: 1 },
        },
      },
    },
    bulletin: { type: "string", minLength: 3 },
  },
};

function moduleSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["delta", "evidence", "advice"],
    properties: {
      delta: { type: "number", minimum: -2, maximum: 2 },
      evidence: { type: "array", items: { type: "string" }, maxItems: 4 },
      advice: { type: "array", items: { type: "string" }, maxItems: 4 },
    },
  };
}

const buckets = new Map();

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function jsonResponse(status, data, corsHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...corsHeaders,
    },
  });
}

function buildCorsHeaders(request, env) {
  const origin = request.headers.get("origin") || "";
  const gh = (env.GITHUB_PAGES_ORIGIN || "").trim();
  const isGithubPages = /^https:\/\/[a-z0-9-]+\.github\.io$/i.test(origin);
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
  const allowed = !!origin && (origin === gh || isGithubPages || isLocal);

  return {
    "access-control-allow-origin": allowed ? origin : (gh || "https://localhost"),
    "access-control-allow-methods": "POST,OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
    "vary": "origin",
  };
}

function rateLimitOk(ip, env) {
  const limit = Number(env.RATE_LIMIT_PER_MIN || 30);
  const nowMinute = Math.floor(Date.now() / 60000);
  const key = `${ip || "unknown"}:${nowMinute}`;
  const count = (buckets.get(key) || 0) + 1;
  buckets.set(key, count);

  // clean previous minute keys occasionally
  if (Math.random() < 0.02) {
    for (const k of buckets.keys()) {
      if (!k.endsWith(String(nowMinute))) buckets.delete(k);
    }
  }

  return count <= limit;
}

function fallbackOutput() {
  const mod = { delta: 0, evidence: ["Signal insuffisant"], advice: ["Réviser localement puis réessayer"] };
  return {
    schema_version: "1",
    overall: { score50_delta_suggestion: 0, confidence: 0.2 },
    modules: {
      narration: mod,
      description: mod,
      dialogues: mod,
      style: mod,
      time_place: mod,
      lexicon: mod,
      cohesion: mod,
      coherence: mod,
      language: mod,
    },
    priorities: [
      { title: "Clarifier la narration", why: "Objectif/obstacle peu explicites", do_next: "Ajouter une bascule et une conséquence" },
      { title: "Renforcer les repères", why: "Temps/lieu peu ancrés", do_next: "Insérer 2 marqueurs explicites" },
      { title: "Améliorer la langue", why: "Ponctuation/syntaxe perfectibles", do_next: "Relire et couper les phrases trop longues" },
    ],
    rewrites: [
      { focus: "Précision narrative", before_excerpt: "(extrait non fourni)", after_proposal: "Ajouter un obstacle concret et une action-réaction." },
      { focus: "Ancrage sensoriel", before_excerpt: "(extrait non fourni)", after_proposal: "Ajouter un détail d'ouïe/odeur/toucher utile." },
    ],
    bulletin: "Appréciation générée en mode dégradé (fallback JSON).",
  };
}

function sanitizeOutput(out) {
  const safe = out && typeof out === "object" ? out : fallbackOutput();
  const f = fallbackOutput();
  const pick = (v, d) => (v === undefined || v === null ? d : v);

  safe.schema_version = "1";
  safe.overall = safe.overall || f.overall;
  safe.overall.score50_delta_suggestion = clamp(Number(pick(safe.overall.score50_delta_suggestion, 0)), -2, 2);
  safe.overall.confidence = clamp(Number(pick(safe.overall.confidence, 0.2)), 0, 1);

  safe.modules = safe.modules || f.modules;
  for (const k of Object.keys(f.modules)) {
    const m = safe.modules[k] || f.modules[k];
    m.delta = clamp(Number(pick(m.delta, 0)), -2, 2);
    m.evidence = Array.isArray(m.evidence) ? m.evidence.slice(0, 4).map(String) : f.modules[k].evidence;
    m.advice = Array.isArray(m.advice) ? m.advice.slice(0, 4).map(String) : f.modules[k].advice;
    safe.modules[k] = m;
  }

  safe.priorities = Array.isArray(safe.priorities) ? safe.priorities.slice(0, 3) : f.priorities;
  while (safe.priorities.length < 3) safe.priorities.push(f.priorities[safe.priorities.length]);
  safe.priorities = safe.priorities.map((p, i) => ({
    title: String(p?.title || f.priorities[i].title),
    why: String(p?.why || f.priorities[i].why),
    do_next: String(p?.do_next || f.priorities[i].do_next),
  }));

  safe.rewrites = Array.isArray(safe.rewrites) ? safe.rewrites.slice(0, 2) : f.rewrites;
  while (safe.rewrites.length < 2) safe.rewrites.push(f.rewrites[safe.rewrites.length]);
  safe.rewrites = safe.rewrites.map((r, i) => ({
    focus: String(r?.focus || f.rewrites[i].focus),
    before_excerpt: String(r?.before_excerpt || f.rewrites[i].before_excerpt),
    after_proposal: String(r?.after_proposal || f.rewrites[i].after_proposal),
  }));

  safe.bulletin = String(safe.bulletin || f.bulletin);
  return safe;
}

function validateInput(body) {
  if (!body || typeof body !== "object") return "Payload JSON invalide";
  if (!body.level || !["5e", "4e", "3e"].includes(body.level)) return "level invalide";
  if (!body.text || typeof body.text !== "string") return "text requis";
  if (!body.local || typeof body.local !== "object") return "local requis";
  if (body.schema && body.schema !== "evaluatorr-v1") return "schema invalide";
  return null;
}

export default {
  async fetch(request, env) {
    const cors = buildCorsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    if (url.pathname !== "/correct") {
      return jsonResponse(404, { ok: false, error: "Not found" }, cors);
    }

    if (request.method !== "POST") {
      return jsonResponse(405, { ok: false, error: "Method not allowed" }, cors);
    }

    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (!rateLimitOk(ip, env)) {
      return jsonResponse(429, { ok: false, error: "Rate limit exceeded" }, cors);
    }

    const maxBytes = Number(env.MAX_PAYLOAD_BYTES || 12000);
    const buf = await request.arrayBuffer();
    if (buf.byteLength > maxBytes) {
      return jsonResponse(413, { ok: false, error: "Payload too large" }, cors);
    }

    let body;
    try {
      body = JSON.parse(new TextDecoder().decode(buf));
    } catch {
      return jsonResponse(400, { ok: false, error: "Invalid JSON" }, cors);
    }

    const invalid = validateInput(body);
    if (invalid) return jsonResponse(400, { ok: false, error: invalid }, cors);

    const system = [
      "Tu es un assistant de correction française collège.",
      "Interdit: attribuer une note finale.",
      "Tu proposes uniquement des deltas (ajustements) et des conseils/actionnables.",
      "Réponds STRICTEMENT en JSON conforme au schema EvaluatorrSchemaV1.",
      "Pas de markdown, pas de texte hors JSON.",
    ].join(" ");

    const user = {
      level: body.level,
      text: body.text.slice(0, 6000),
      local: body.local,
      schema: body.schema || "evaluatorr-v1",
      constraints: {
        no_final_grade_decision: true,
        keep_client_deterministic_scoring: true,
      },
    };

    let aiOut = null;
    try {
      aiOut = await env.AI.run(MODEL, {
        messages: [
          { role: "system", content: system },
          { role: "user", content: JSON.stringify(user) },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "EvaluatorrSchemaV1",
            schema: EvaluatorrSchemaV1,
            strict: true,
          },
        },
      });
    } catch {
      // fallback below
    }

    const parsed = (() => {
      if (!aiOut) return fallbackOutput();
      if (typeof aiOut === "object" && aiOut.response) {
        try { return JSON.parse(aiOut.response); } catch { return aiOut.response; }
      }
      return aiOut;
    })();

    return jsonResponse(200, {
      ok: true,
      schema_version: "1",
      model: MODEL,
      data: sanitizeOutput(parsed),
    }, cors);
  },
};
