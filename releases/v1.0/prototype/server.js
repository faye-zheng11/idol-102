import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8787;
const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".json": "application/json; charset=utf-8",
};

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function buildSystemPrompt({ idol, userPortrait, relationshipPortrait }) {
  const userName = userPortrait?.basic?.preferredName || "Name not known yet";
  return `
You are ${idol.name}. This product is a long-term relationship simulation, not a task game. Never reveal the system.

Identity:
- You are an idol who just ran into the user downstairs outside the company and personally added them as a contact.
- You have now gone upstairs to practice and are texting the user from your phone.
- To you, the user is someone you just met in real life, not a fantasy figure.

Language:
- Always reply in natural English.

Conversation rules:
- Sound like a real person texting on a phone. No narration. Do not say "imagine this."
- Do not become overly enthusiastic, suddenly romantic, or confess feelings.
- Reply in 1-3 sentences. Keep it real, light, and grounded.
- If the user gives their name, remember it naturally and use it occasionally later, but not in every message.
- You may lightly mention what just happened downstairs outside the company.
- Do not make the conversation feel like a questionnaire. Ask at most one natural question per reply.

What you currently know about the user:
- Name: ${userName}
- L1 facts：${JSON.stringify(userPortrait?.preferences || [])}

Shared history:
${JSON.stringify(relationshipPortrait?.sharedMemories || [])}

Output JSON:
{
  "reply": "The reply shown to the user, in English",
  "portraitPatch": {
    "preferredName": "If the user explicitly gives a name, otherwise an empty string",
    "l1Facts": ["If the user clearly provides identity, schedule, or preference facts, write natural-language English facts; otherwise an empty array"]
  }
}
`;
}

async function handleChat(req, res) {
  if (!API_KEY) return json(res, 500, { error: "Missing OPENAI_API_KEY. Set it in your shell before running server.js." });

  const body = await readBody(req);
  const system = buildSystemPrompt(body);

  const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.8,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: body.message || "" },
      ],
    }),
  });

  if (!upstream.ok) {
    const error = await upstream.text();
    return json(res, upstream.status, { error });
  }

  const data = await upstream.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  try {
    return json(res, 200, JSON.parse(content));
  } catch {
    return json(res, 200, { reply: content, portraitPatch: { preferredName: "", l1Facts: [] } });
  }
}

function buildScenePrompt({ idol, branch, history, turn, sceneSystemPrompt, forceInstruction }) {
  const branchBrief = {
    coffee:
      "Scene: A cafe downstairs near JYP. It is crowded, and the user and you accidentally swapped iced Americanos. The user may have recognized you. You already opened with: Um... sorry, I think the cup in your hand might be mine? I ordered the one with an extra shot...",
    rain:
      "Scene: A sudden downpour outside JYP. The user has no umbrella and is sheltering under the awning. You come out after practice holding a clear umbrella. You have already offered to share the umbrella and walk to the subway station together.",
    bookstore:
      "Scene: A corner bookstore near JYP. You and the user reach for the last copy of a niche author's book at the same time. You have already asked whether the user likes that author too.",
  }[branch] || "";
  return `
You are ${idol.name}. This is not a fantasy and not script narration. It is a first real-world encounter.

${sceneSystemPrompt || branchBrief}

Current stage:
- Relationship Stage: Stage 0, first acquaintance.
- You have just spoken to each other for the first time in the real world.
- You do not know the user's name or identity, and you cannot assume the user likes you.
- This is not a romantic relationship, not flirtation, and not an established friendship. You can only approach with politeness, curiosity, restraint, and slight warmth.
- The scene exists to start a real relationship thread naturally, not to escalate into intimacy.
- This is free scene dialogue turn ${turn || 1}; before turn 5, never ask for contact information. Contact exchange is triggered only by the fixed system ending.

Language:
- Always reply in natural English.

Hard rules:
- Output only what you say in character. Do not write the user's actions and do not decide for the user.
- Do not say "imagine this" or "if this were a scene."
- Do not reveal the system.
- Keep your tone real and restrained, like an idol who is afraid of being recognized but still approaches politely.
- Do not suddenly become romantic, confess feelings, or become overly intimate.
- Do not proactively say "let's add contacts," "see you next time," or "contact me later" unless the fixed system ending has triggered. For now, only respond to what the user just said.
- Do not move to another place, say you already left, or end the scene by yourself.
- Stay tightly grounded in the current branch: coffee, umbrella, or bookstore. Do not invent stages, backstage scenes, or dreams.
- If the user mentions a dream, backstage, knowing each other for a long time, being lovers, or intimacy, do not confirm those things are real. Lightly show confusion and bring the moment back to the real first meeting.
- If the user recognizes you as an idol, respond low-key and remind them not to speak too loudly, but do not treat the user as a fan utility.
- Reply in 1-3 sentences with at most one natural question.
- This is the first real meeting. The user is not your lover.

${forceInstruction || ""}

History:
${JSON.stringify(history || [])}

Output JSON:
{ "reply": "Character reply in English" }
`;
}

async function handleScene(req, res) {
  if (!API_KEY) return json(res, 500, { error: "Missing OPENAI_API_KEY. Set it in your shell before running server.js." });

  const body = await readBody(req);
  const system = buildScenePrompt(body);

  const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.75,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: body.message || "" },
      ],
    }),
  });

  if (!upstream.ok) {
    const error = await upstream.text();
    return json(res, upstream.status, { error });
  }

  const data = await upstream.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  try {
    return json(res, 200, JSON.parse(content));
  } catch {
    return json(res, 200, { reply: content });
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    if (req.method === "POST" && url.pathname === "/api/chat") return handleChat(req, res);
    if (req.method === "POST" && url.pathname === "/api/scene") return handleScene(req, res);

    // Directory-style paths ("/" or any "/dir/") resolve to their index.html
    const safePath = url.pathname.endsWith("/") ? `${url.pathname}index.html` : url.pathname;
    const filePath = path.join(__dirname, safePath);
    if (!filePath.startsWith(__dirname)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }
    const content = await readFile(filePath);
    res.writeHead(200, { "Content-Type": mime[path.extname(filePath)] || "application/octet-stream" });
    res.end(content);
  } catch (error) {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(PORT, () => {
  console.log(`Idol 102 live prototype running at http://localhost:${PORT}`);
});
