# 仓库结构（分区总图）

用目录把不同类型的东西分清楚：**活区**（一直最新，跟 git 走）+ **封存区**（每个 OK 的版本冻一份）。

## 顶层每一项是什么（对着 VS Code 看这张就够）

**① 你平时碰的（你的内容）**
- `docs/` 📄 文档（PRD、后端 story、埋点表）
- `demo/` 🎬 演示（给团队/开发看的带说明原型）
- `prompts/` 🧠 后端真实运行的提示语（聊体感用）
- `workbench/` 💭 讨论 & 工作（想法/流程/数据/知识库——你天天在这）
- `releases/` 📦 封存区（v1.0 等定稿版本）

**② 原型源码（产品本体，开发/AI 用，你一般不手改）**
- `index.html` `app.js` `src/` `styles.css` `shell.js` `server.js` `assets/` `package.json`

**③ 规则 & 说明（配置文件，主要给 AI 读）**
- `CLAUDE.md` AI 工作规则（Claude 读）· `AGENTS.md` 同规则（Codex 读，指向 CLAUDE.md）
- `SETUP.md` 换机器/发别人怎么配 · `STRUCTURE.md` 本文件 · `README.md` 启动说明 · `.gitignore`

**④ 机器件（引擎，别删也别管）**
- `.claude/commands/` 斜杠命令 `/pm` `/think` `/ux` 的定义
- `.claude/skills/` 13 个内嵌 PM skill（pol-probe 等）

> 记忆法：**碰内容只进第 ① 组**；②③④ 是产品/规则/引擎，AI 帮你管。

> 跨工具/发给别人怎么配满血（Claude ↔ Codex），见 [SETUP.md](SETUP.md)。工作规则唯一事实源是 `CLAUDE.md`（Codex 走 `AGENTS.md`，已指向它）。

## 活区（一直是最新）

| 区 | 目录 | 用途 | 谁看 |
| --- | --- | --- | --- |
| 🧩 **原型/源码** | 根目录 `index.html` / `app.js` / `src/` / `server.js` / `assets/` / `styles.css` | 能跑的手机原型，接真实对话 API。开发最终参考、喂 AI 的源码 | 开发 / AI |
| 📄 **文档** | `docs/` | 项目级总 PRD + 各模块业务 PRD；`BACKEND_STORIES.md` 后端 story；`tracking/` 埋点表；`_setup/` 配置截图 | 全员 / 开发 |
| 🎬 **演示** | `demo/` | 给团队/开发看的实时演示壳：左内嵌可操作原型，右随页面显示业务说明，顶挂版本文档 | 团队 / 开发 |
| 📊 **数据** | `workbench/data/` | 数据分析产出（oppa-analyze/BI 结果、指标）；P4 从这取数 | PM |
| 🧠 **后端 prompt** | `prompts/` | 开发实际运行的 LLM/TTS 提示语逐字快照站；聊体感、排查角色行为时 AI 直接读 | PM / 开发 / AI |
| 💭 **讨论 & 工作** | `workbench/`（`bets/` `playbooks/`（含 `handoff/` 交给开发的模板）`references/` `drafts/` `STATE.md` `WORKFLOW.md` `LEARNINGS.md`） | PM 跑流程（P0→P5）的地方，入口 `/pm`；讨论都在 bets | PM |

## 封存区（冻结的版本）

| 区 | 目录 | 用途 |
| --- | --- | --- |
| 📦 **releases** | `releases/v<X>/` | 某版本拍板 OK 后，把当时 docs+演示+数据冻一份，只读不改，方便日后对比。见 [releases/README.md](releases/README.md)。触发：跟 AI 说「X 版本封版」 |

> 讨论/工作台**不封版**——它是活区，可迁移学习在 `workbench/LEARNINGS.md` 跨版本累积。

> 为什么原型不挪进 `prototype/`：`server.js` 从根目录起服务、且禁止跳出根目录。原型留在根，`demo/` 等作为根下子目录同一个服务就能访问 `localhost:8787/demo/`，不改服务端代码。

## 启动

```bash
export OPENAI_API_KEY="你的 key"
npm start
```

- 原型：<http://localhost:8787/>
- 演示版：<http://localhost:8787/demo/>

## 演示版怎么维护

演示版内容全部数据驱动，改 `demo/spec-data.js` 即可，不用碰逻辑：

- 改摘要卡（模块职责 / 关键规则 / 边界）→ 改 `modules`
- 加 / 改页面可点击热区 → 改 `hotspots`（`selector` 指原型页面内的元素）
- 改版本号 / 更新说明 / 文档链接 → 改 `version`
- 新增原型页面时补映射 → 改 `screenToModule`

## 清理记录

- 删除了 `reports/figma/reports/` 与 `reports/figma/reports 2/` 两个误拷贝的嵌套重复目录。
- 分区整理（2026-07-06）：`reports/ui-spec-ai-light.xml` → `docs/`；根目录 8 个 `lark_*.png` → `docs/_setup/`；新建 `workbench/data/`（数据区）与 `releases/`（封存区）；清掉空壳 `workbench/analysis`、`workbench/skill-outputs`。
- 删除 figma 静态快照（`reports/figma` 那批 41 张 PNG + 沟通板 + zip，约 3.9MB）：已被实时演示壳 `demo/` 取代，冗余。
- 合并 Codex 的 `pm/` 工作台（2026-07-06）：本项目并成一套 markdown 工作流；吸收了 `docs/BACKEND_STORIES.md`、`docs/tracking/`（埋点表）、`workbench/playbooks/handoff/`（前后端 story + 埋点审计 + demo 脚本模板）。Codex 原 `pm/` 代码版（含 in-app 标注）完整存档在 `codex-pm-workbench` 分支，需要时可取回。
