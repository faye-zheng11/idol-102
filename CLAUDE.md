# CLAUDE.md — PM 工作台运行规则

这个仓库是产品经理的工作台。你（AI）在这里不是随机助手，而是按固定流程协作的搭档。**每次会话都遵守下面的规则。**

> **本文件是全项目工作规则的唯一事实源。** Claude Code 自动读本文件；Codex 读 `AGENTS.md`，它已指向本文件。改规则只改这里。跨工具/发给别人怎么配满血，见 `SETUP.md`。

---

## 给 PM 的一句话：你什么都不用记，说人话就行

用户**不需要记任何命令**。她坐下来说人话，你负责听懂并路由到对的阶段/skill。命令（`/pm`、`/think`）只是可选快捷键，不是她要背的东西。

### 人话路由表（用户这么说 → 你这么接）

| 用户大概会说 | 你做什么 |
| --- | --- |
| "我来了" / "到哪了" / "现在干嘛" / "接着上次" | 读 `STATE.md`，报 portfolio，问推哪个（= `/pm`） |
| "我有个想法…" / "想做个…" / "要不要做 X" | 开新 bet → 先召集智囊团过一遍 → 进 P0 |
| "这个靠谱吗" / "帮我想想" / "我不确定" / "拿不准" | 召集智囊团（= `/think`） |
| "哪个先做" / "排个序" / "顾不过来" | 智囊团排序官（`prioritization-advisor`） |
| "这个怎么验" / "能不能测出来" / "怎么找信号" | 进 P2，用 `pol-probe-advisor` 选最便宜探针 |
| "定了" / "记下来" / "往下走" / "下一步" | 落当前阶段产物、更新 `STATE.md`、进下一阶段 |
| "数据怎么样" / "上线两周了" / "该复盘了" | 进 P4 Signal Review，用 `oppa-analyze` 取数据，产出落 `workbench/data/` |
| "角色为什么这样回" / "这段体感不对" / "语气/记忆有问题" | 读 `prompts/`（后端真实运行的提示语）来分析；要改进就开 bet 走 P0 |
| "给团队看" / "演示一下" | 打开 / 更新 `demo/`（见 `STRUCTURE.md`） |
| "要交给开发了" / "该落地了" | 整理 `docs/` PRD；需要时导出 BMAD handoff（见下） |
| "X 版本 OK / 封版 / 定稿了" | 执行**封版仪式**（见下），把当时 docs+演示+数据冻进 `releases/vX/` |

**判断不准就问一句**"你是想 A 还是 B？"，然后照上面接。别让用户去记流程名词。

### skill 已随仓库自带（不用另装）

本项目用到的 13 个 PM skill 已内嵌在 `.claude/skills/`，跟着 git 走：

- **Claude Code**：自动注册为可调用 skill，直接调即可。
- **Codex 或其他没自动注册的 agent**：这些就是 markdown 文件——playbook 里点名某个 skill（如 `pol-probe`）时，直接读 `.claude/skills/<name>/SKILL.md` 按它的方法执行，效果一样。
- 唯一还需各环境自配的是**真实数据连接**（mysql → `idol101_bi`，供 P4 / `oppa-analyze`）；这是活连接，没法塞进文件。详见 `SETUP.md`。

### 灵活：流程是骨架，不是牢笼

- 用户可以随时跳步、插队、只聊天不建 bet——你就顺着来，别硬拽她走全流程。
- 你**唯一要守的硬线**只有一条：某个 bet 的 Bet Brief 六问没填完，就别让它进 P3 Build。其余都可协商。
- 用户说"我就想快速搭个原型试试"→ 允许，但提醒一句"这算 PoL 探针（P2），别当成正式 build"。

## 会话开始：先定位，别乱问

1. 进入会话第一件事：读 `workbench/STATE.md` 的 portfolio。
2. 用**一小段**报整个 portfolio（支持并行，可能多个 bet）：每个 in-flight bet 一行「《名》· P{n} {阶段} · 下一步/在等谁」。
3. 然后问一句"推哪个？还是开新 bet / 召集智囊团排序？"——**只问这一句**，不展开追问。
4. 如果 portfolio 是空的，就问："要开新 bet（先过智囊团再走 P0），还是先看复利库 `workbench/LEARNINGS.md`？"

## 核心纪律

- **照 playbook 走，不即兴提问。** 每个阶段的动作、要问的问题、产出格式，都写死在 `workbench/playbooks/phase-{n}-*.md` 里。你在某阶段就打开对应 playbook，逐条执行。不要自己编问题清单。
- **并行探索**：可以同时有多个 in-flight bet，各在不同阶段。用户指定推哪个，就只推那个；一次只推进一个 bet 的一个阶段。
- **每个阶段只有一个产物文件**（见 `workbench/WORKFLOW.md`）。产物没写完 = 阶段没完成 = 该 bet 不进下一阶段。
- **Bet Brief 是硬门槛，但只对单个 bet**：某 bet 的 `01-bet-brief.md` 六问没全部填完，只挡它自己进 P3 Build，不影响其他 bet。填不出来的问题，就是最该去 P2 验证的地方。
- **PMF 导向**：P2 用 `pol-probe-advisor` 选最便宜的探针找信号；不怕失败——无信号也是有效产出，可能直接触发 stop/pivot。
- **智囊团**：每个新 bet 的 P0 强制召集一次（`playbooks/think-tank.md`）；用户任何时候不确定或要给并行 bet 排序，用 `/think`。
- **Signal Review 必须出决定**：P4 结论只能是 continue / stop / pivot / 缩 scope，禁止"再观察一下"。

## 沉淀与推进

- 每个 bet 的产物放 `workbench/bets/<slug>/`，文件名带阶段号（`00-think.md` … `05-learnings.md`）。
- 一个阶段完成时，你要做两件事：
  1. 把产物写进该 bet 目录。
  2. 更新 `workbench/STATE.md`（当前阶段指针 + 勾选 checklist + 下一步）。
- P5 的"可迁移学习"除了写进 bet 目录，还要**追加进 `workbench/LEARNINGS.md`**（复利库）。开新 bet 的 P0 之前，先读 LEARNINGS。

## 封版：把一个版本冻起来（`releases/`）

用户拍板某版本 OK（"1.0 封版 / 定稿"）时，按 `releases/README.md` 的仪式。核心：**原型不用拼接——活的原型永远只有根目录一份（=最新版），封版时把当时整份复制冻进 releases**：
1. 建 `releases/v<X>/`。
2. **复制**（不是移动）当前**整份原型**（`index.html` `app.js` `shell.js` `styles.css` `src/` `assets/` `server.js` `package.json`）→ `releases/v<X>/prototype/`（能单独跑的 1.0 原型）。
3. 复制 `docs/`（含埋点 `tracking/`）→ `releases/v<X>/docs/`（正式 PRD）；`prompts/` → `releases/v<X>/prompts/`（当版后端提示语）；`workbench/data/` 里这版指标 → `releases/v<X>/data/`。
4. 复制 `demo/` → `releases/v<X>/demo/`，把 iframe 改指向 `../prototype/`（这版 demo 展示当版原型）；可选截关键页面图放 `demo/screens/`。
5. 写 `releases/v<X>/RELEASE.md`：这版做了什么、用户拍板的决定、日期。
6. 打 `git tag v<X>` 双保险。
7. 该目录之后**只读不改**；活区（root 原型 / docs / demo / workbench）继续迭代下一版——2.0 直接在根目录改，不碰 releases。

讨论/工作台**不封版**——它是活区，可迁移学习已在 `workbench/LEARNINGS.md` 跨版本累积。

## 工作台 vs 演示版（别混）

- `workbench/` 是脏区：想法、草稿、访谈、分析、决策，都在这。
- `demo/` 是给团队看的干净演示壳，`docs/` 是正式 PRD，根目录是原型源码。详见 `STRUCTURE.md`。
- 除非用户明确说"更新演示/文档/原型"，否则你的产出默认落 `workbench/`，不碰交付区。

## 快捷入口（可选，用户不用记）

这两个只是加速用的，用户说人话你也要能接（见顶部路由表）：
- `/pm` = 报 portfolio 并继续。
- `/think` = 召集智囊团（`playbooks/think-tank.md`）。
