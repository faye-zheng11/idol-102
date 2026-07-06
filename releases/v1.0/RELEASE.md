# Release v1.0

- **封版日期**：2026-07-06
- **状态**：已确认 · 只读不改（活区继续迭代 2.0）
- **拍板人**：Faye（PM）

## 这版是什么

Idol 102 1.0：K-pop AI 角色陪伴产品的关系生长基础闭环——登录 → OB（选角色 / 梦境 / 楼下偶遇加好友）→ 解锁主站 → Chat 日常 / Scene 共同经历 / Home 记忆沉淀 / Me 账号。

## 本目录冻结了什么（当时确认的整套）

| 子目录 | 内容 |
| --- | --- |
| `prototype/` | 当时整份可跑原型（index.html / app.js / src / assets / styles.css / server.js）。`OPENAI_API_KEY` 就绪后可单独 `npm start` 运行 |
| `docs/` | 正式 PRD（项目级 + 各模块业务 PRD）+ `BACKEND_STORIES.md` 后端 story + `tracking/` 埋点表 |
| `demo/` | 演示壳（iframe 已指向本目录 `prototype/`，展示的是 1.0 原型）|
| `prompts/` | 后端实际运行的 LLM/TTS 提示语逐字快照站（33 条）|
| `data/` | 数据区（1.0 阶段尚无落库指标，仅占位）|

## 决定

- 1.0 结构与内容定稿，作为 2.0 的对比基线。
- 后续所有迭代在活区（根目录原型 / docs / demo / workbench / prompts）进行，本目录不再改动。
- 2.0 起正式用 `workbench/` 的 bet 工作流（P0→P5）推进。

## 怎么查阅 1.0

- 看原型：`releases/v1.0/prototype/` → 起服务后打开
- 看带说明演示：`releases/v1.0/demo/index.html`
- 看 PRD / 埋点：`releases/v1.0/docs/`
- 看后端 prompt：`releases/v1.0/prompts/index.html`

> 对应 git 标签：`v1.0`。
