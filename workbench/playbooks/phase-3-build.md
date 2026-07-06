# P3 Build — Playbook

**目的**：把验证过的假设做成可上线/可演示的最小版本。这一步对接根目录原型 + `demo/` 演示壳。
**AI 怎么做**：帮 PM 把 Bet Brief 的"核心行为"翻成最小可用范围；能落到原型/文档就落；用 `run` / `verify` 起本地验证。别在这里加 Brief 没要求的功能。
**产物**：`bets/<slug>/03-build.md`

---

## 只做验证假设必需的

- 从 Bet Brief ③（要看到的行为）反推：**要观察到这个行为，最少要做什么？**
- 其他一律砍（Jobs：加进去的东西是让核心更纯粹还是更复杂？）。

## 落地去向（别混区）

- 交互原型改动 → 根目录原型源码（`index.html` / `app.js` / `src/`）。
- 要给团队演示 → 更新 `demo/spec-data.js`（说明卡 / 热区 / 版本），见 `STRUCTURE.md`。
- 正式业务规则 → `docs/` 对应 PRD。

## 记录（`03-build.md`）

- 本 bet 做了哪些改动、对应原型/demo 的哪个版本。
- 为了观察 Brief ③ 的行为，埋了什么可观测点（数据/事件）。
- 明确上线日期，用来倒推 P4 的第 14 天。

## 交给开发（handoff）——要真上线时才做

想清楚要落地给开发时，用 `workbench/playbooks/handoff/` 里的模板产出，放进本 bet 目录：

1. **前端 Story**（`handoff/06-frontend-stories.md`）：显示、跳转、交互、状态。
2. **后端 Story**（`handoff/07-backend-stories.md`）：业务逻辑、状态机、数据、API、边界。参考已有的 `docs/BACKEND_STORIES.md`。
3. **埋点审计**（`handoff/08-tracking-audit.md`）：⭐ 关键——**先写本次要回答的 PMF 问题，再检查埋点够不够回答它**。对照 `docs/tracking/`（events/parameters/user_properties）。埋点埋不到 = P2/P4 找不到信号，等于白做。
4. **Demo 脚本**（`handoff/09-demo-script.md`）：给团队演示的走查脚本。

> 开发用 BMAD 的话，这些 Story 正好是它 `story→dev` 阶段的输入（见 `SETUP.md` 末尾的 handoff 说明）。

## 出口

有一个能被真实用户使用、且能观察到目标行为的版本；要上线的话 handoff 四件（前端/后端 story + 埋点审计 + demo 脚本）齐了。更新 `STATE.md` → 等到上线第 14 天进 P4。
