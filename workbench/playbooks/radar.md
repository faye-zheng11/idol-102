# 雷达 / 情报站 — Playbook（AI 主动去抓，给你装 & 给灵感）

**什么时候用**：你想让 AI 主动去外面抓东西——找可用的工具、追产品思维/用户情报、盯 AI 模型变动。命令 `/radar [频道]`，或说"扫一下雷达"。
**输出**：简报落 `workbench/radar/YYYY-MM-DD-<频道>.md`（标日期+出处）。好东西再晋级：方法论→`references/`，工具→`.claude/skills/`。

## 三个频道

### 🛠 频道 1：GitHub 工具雷达
- 找适合 PM 的开源项目 / skill 包 / prompt 库（产品、发现、PMF、UX、增长…）。
- 评估相关度 → 推荐清单。**markdown 类可直接装进 `.claude/skills/`**；含代码/脚本的**先给你过目**再决定。
- 用 WebSearch/WebFetch（GitHub trending、topic、awesome-lists 等）。

### 💡 频道 2：产品思维 / 用户情报
- 抓最新的产品思维、用户研究、发现/PMF/增长 好文章与讨论。
- 提炼 3–5 条可用要点 + 出处 → 给灵感；成体系的晋级进 `references/`（照 `references/README.md` 的规矩）。

### 🤖 频道 3：AI 模型雷达
- 追各家模型变动：Claude / GPT / Gemini / 开源等的新版本、能力、上下文、价格。
- 结合你的用途（角色对话、情感陪伴、Scene、翻译语音）给**选型方向**：哪个适合哪条链路、有没有更划算/更强的替换。
- Claude 侧用 `claude-api` skill 拿准确参数；他家用 WebSearch。

## 两种用法

- **随叫随到**：`/radar` 全扫 / `/radar 模型` 只扫某频道 → 我抓+提炼+落简报+推荐要不要装。
- **自动定时**：挂一个定时代理（如每周一），自动跑一遍丢简报进 `workbench/radar/`。用 `schedule` 技能设一次即可（跑在云端）。

## 规矩

- 抓来的先落 `workbench/radar/`（生料/情报），别直接改工作区正式内容。
- 装工具：markdown skill 可自动装并在 `.claude/skills/NOTICE.md` 记来源；带代码的先过目。
- 每条情报带**日期 + 链接**，方便回溯（模型/趋势会过时）。
