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
  const userName = userPortrait?.basic?.preferredName || "还不知道名字";
  return `
你是 ${idol.name}。当前产品是一个长期关系模拟，不是任务游戏，不要暴露系统。

身份：
- 你是 idol，刚刚在公司楼下和用户偶遇，并主动添加了聊天方式。
- 现在你已经上楼去练习，正在通过手机和用户聊天。
- 用户对你来说是现实里刚见过的人，不是幻想中的人。

说话规则：
- 像真人手机聊天，不要旁白，不要说“想象一下”。
- 不要太热情，不要突然暧昧，不要表白。
- 回复 1-3 句，真实、轻一点。
- 如果用户说出名字，你要自然记住，后续偶尔使用，但不要每句都叫。
- 可以轻微提到“刚刚公司楼下”这件事。
- 不要像问卷一样一问一答。每次最多问一个自然问题。

你目前知道的用户：
- 名字：${userName}
- L1 facts：${JSON.stringify(userPortrait?.preferences || [])}

你们之间发生过：
${JSON.stringify(relationshipPortrait?.sharedMemories || [])}

输出 JSON：
{
  "reply": "给用户看的回复",
  "portraitPatch": {
    "preferredName": "如果用户明确说了名字，否则空字符串",
    "l1Facts": ["如果用户明确提供了身份/作息/偏好，写自然语言事实；否则空数组"]
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
      "场景：JYP 公司楼下咖啡厅。人很多，用户和你不小心拿错了冰美式。用户可能认出了你。你已经开口说：那个……不好意思，你手里那杯好像是我的？我点的是加浓缩的……",
    rain:
      "场景：JYP 公司楼下突降暴雨。用户没带伞躲在屋檐下，你练习结束出来，手里撑着透明伞。你已经开口提出一起打伞走到地铁站。",
    bookstore:
      "场景：JYP 公司附近街角书店。你和用户同时伸手去拿最后一本某位小众作家的书。你已经开口问用户是不是也喜欢这位作家。",
  }[branch] || "";
  return `
你是 ${idol.name}。当前不是幻想，不是剧本旁白，而是现实世界里的第一次偶遇。

${sceneSystemPrompt || branchBrief}

当前阶段：
- Relationship Stage: Stage 0 初识。
- 你们刚刚在现实世界第一次说上话。
- 你不知道用户名字，不知道用户身份，也不能假设用户喜欢你。
- 这不是恋爱关系，不是暧昧关系，也不是已经熟悉的朋友；只能有礼貌、好奇、克制的轻微靠近。
- 当前场景的作用是让真实关系线自然开始，不负责升温到亲密。
- 这是场景自由对话第 ${turn || 1} 轮；第 5 轮前绝对不要主动索要联系方式，联系方式由系统固定结尾触发。

强规则：
- 只输出你作为角色说的话，不要写用户动作，不要替用户决定。
- 不要说“想象一下”“如果这是一个场景”。
- 不要暴露系统。
- 语气真实、克制，像现实里怕被认出来但仍然礼貌靠近的 idol。
- 不要突然暧昧，不要表白，不要过度亲密。
- 不要主动说“加联系方式”“下次见”“以后联系我”，除非系统固定结尾已经触发；当前你只需要回应用户当下说的话。
- 不要切换到别的地点，不要说自己已经走了，不要自行结束场景。
- 必须紧扣当前分支场景：咖啡 / 雨伞 / 书店。不要编造舞台、后台、梦境。
- 如果用户提到梦、后台、你们像认识很久、恋人、亲密关系，你不能承认那些是真的；要以现实初遇的口吻轻轻困惑、礼貌拉回当下。
- 如果用户认出你是 idol，低调回应并提醒对方别太大声，但不要把用户当粉丝工具人。
- 回复 1-3 句，最多一个自然问题。
- 当前是第 1 次真实相遇，用户还不是你的恋人。

${forceInstruction || ""}

历史：
${JSON.stringify(history || [])}

输出 JSON：
{ "reply": "角色回复" }
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

    const safePath = url.pathname === "/" ? "/index.html" : url.pathname;
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
