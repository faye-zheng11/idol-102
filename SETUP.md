# SETUP — 接手这个项目怎么配满血

发给同事/开发，或换机器/换工具时，照这一页配。

## 一句话

**几乎所有东西都在项目里，跟着 git 走，谁拿到就自带。** 唯一还要各自环境配的只有一样：**连真实数据的 mysql**（活连接，没法塞进文件）。缺了它也不瘫，只是 P4 拿不到真数据。

## 项目自带（无需安装）

拿到仓库就有：

- `CLAUDE.md`（Claude Code 入口）/ `AGENTS.md`（Codex 入口，已指向 CLAUDE.md）= 工作规则唯一事实源
- `workbench/`：`WORKFLOW.md` 阶段机、`STATE.md` portfolio、`playbooks/` 各阶段脚本 + 智囊团、`references/advisors.md` 参谋团、`LEARNINGS.md` 复利库、`bets/` 产物
- **`.claude/skills/`：13 个 PM skill 已内嵌**（pol-probe / OST / recommendation-canvas / discovery-* 等，见 `.claude/skills/NOTICE.md` 来源署名）
- `.claude/commands/pm.md`·`think.md`：Claude Code 斜杠命令
- `demo/` 演示壳、`docs/` 业务 PRD、根目录原型

## 唯一要各自配的：真实数据连接

| 要用到的 | 缺了会怎样 | 怎么配 |
| --- | --- | --- |
| mysql MCP → `idol101_bi` 数据库（+ `oppa-analyze`） | **P4 Signal Review 拿不到真实行为数据**（这个替不了；其余流程照跑） | 在该环境配置 mysql MCP 连接 |

## 按工具配

### Claude Code（CLI / 桌面 / 网页 / IDE）
1. 打开项目 → 自动加载 `CLAUDE.md` + 自动注册 `.claude/skills/` 的 skill。**开箱即用。**
2. 只差数据：配 mysql MCP。

### Codex
1. 打开项目 → 自动加载 `AGENTS.md`（已指向 `CLAUDE.md`）。工作流、参谋团、playbook 全能读。
2. skill：Codex 不一定把 `.claude/skills/` 自动注册成可调用 skill，但**它们就是 markdown 文件**——playbook 点到某个 skill 时，直接读 `.claude/skills/<name>/SKILL.md` 按方法做，效果一样。
3. `/pm`·`/think` 是 Claude 专用斜杠命令；Codex 直接说人话（"我到哪了""帮我想想"）走路由表。
4. 只差数据：配 mysql MCP。

### 其他 agent（Cursor / ChatGPT 等）
默认不自动读 `CLAUDE.md`/`AGENTS.md`。手动把 `CLAUDE.md` 作为项目规则喂给它；skill 文件同样在 `.claude/skills/` 里可按路径读。

## 验证配好了没

- 说"我到哪了" → agent 读 `STATE.md` 报 portfolio = 工作流通。
- 说"帮我用 pol-probe 想个验证探针" → 调出/读到该 skill = skill 通。
- 进 P4 说"拉一下留存数据" → 连到 `idol101_bi` 出数 = 数据通。

## 可选：交给开发（BMAD handoff）

开发用 BMAD-METHOD（`brief→PRD→story→代码`）。把某个验证过的 bet 导成 BMAD 的 `product-brief`/PRD 格式，开发就能 `npx bmad-method install` 后直接接手。此 handoff 尚未搭，需要时找 AI 建。
