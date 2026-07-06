# prompts — 后端实际运行的提示语（体感讨论用）

> 这是开发**真正在跑**的全部 LLM / TTS 提示语的逐字快照站。聊"体感问题"（角色为什么这样回、语气不对、记忆没带上…）时，AI 直接读这里的真实 prompt 来分析。

## 当前对齐版本：**1.0 已确认** ✅

现在这份 = 1.0 线上运行的 prompt。以后开发改 prompt（2.0）时更新本目录；封 1.0 版时会把这份冻进 `releases/v1.0/prompts/`。

## 怎么看

- 直接 `open prompts/index.html`（纯静态站，路由矩阵 + 分组目录 + 模型总线）。
- 子页：`chat.html`（普通聊天 A–D）、`scene.html`（Scene E–J）、`media.html`（翻译语音 K–L）。
- 逐字来源与校验说明见同目录 `README.md`（站点自带）；`scripts/verify_prompts.py` 对着源码逐字校验。

## 在工作流里的位置

- 属于**活区**：讨论体感、排查角色行为时随时读。
- 不是产品 PRD（那在 `docs/`）；这是"角色行为的真实驱动源"。
- 体感问题若要变成改进 → 走 workbench 开 bet 讨论（P0），别直接在这改线上 prompt。
