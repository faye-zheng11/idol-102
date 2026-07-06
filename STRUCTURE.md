# 仓库结构（分区总图）

用目录把不同类型的东西分清楚：**活区**（一直最新，跟 git 走）+ **封存区**（每个 OK 的版本冻一份）。

> 跨工具/发给别人怎么配满血（Claude ↔ Codex），见 [SETUP.md](SETUP.md)。工作规则唯一事实源是 `CLAUDE.md`（Codex 走 `AGENTS.md`，已指向它）。

## 活区（一直是最新）

| 区 | 目录 | 用途 | 谁看 |
| --- | --- | --- | --- |
| 🧩 **原型/源码** | 根目录 `index.html` / `app.js` / `src/` / `server.js` / `assets/` / `styles.css` | 能跑的手机原型，接真实对话 API。开发最终参考、喂 AI 的源码 | 开发 / AI |
| 📄 **文档** | `docs/` | 项目级总 PRD + 各模块业务 PRD；`_setup/` 放配置截图 | 全员 |
| 🎬 **演示** | `demo/` | 给团队/开发看的实时演示壳：左内嵌可操作原型，右随页面显示业务说明，顶挂版本文档 | 团队 / 开发 |
| 📊 **数据** | `workbench/data/` | 数据分析产出（oppa-analyze/BI 结果、指标）；P4 从这取数 | PM |
| 💭 **讨论 & 工作** | `workbench/`（`bets/` `playbooks/` `references/` `drafts/` `STATE.md` `WORKFLOW.md` `LEARNINGS.md`） | PM 跑流程（P0→P5）的地方，入口 `/pm`；讨论都在 bets | PM |

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
