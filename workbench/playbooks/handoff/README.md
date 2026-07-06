# handoff — 交给开发的模板

P3 Build 里某个 bet 要真上线时，用这四个模板产出，落到该 bet 目录（`bets/<slug>/`）。
来源：吸收自 Codex 的 `pm/` 工作台（现存档在 `codex-pm-workbench` 分支）。

| 模板 | 写什么 |
| --- | --- |
| `06-frontend-stories.md` | 前端 Story：显示、跳转、交互、状态 |
| `07-backend-stories.md` | 后端 Story：业务逻辑、状态机、数据、API、边界 |
| `08-tracking-audit.md` | ⭐ 埋点审计：先写 PMF 问题，再查埋点够不够回答它 |
| `09-demo-script.md` | 给团队演示的走查脚本 |

配套已有资产：
- `docs/BACKEND_STORIES.md` —— 全站后端业务 Story 拆解（现成参考）
- `docs/tracking/` —— events / parameters / user_properties 三张埋点表（标了 PMF 指标口径）

> 埋点审计是 PMF 闭环的关键：P3 埋对了，P4 Signal Review 才拿得到信号。
