# PM 工作台

PM 在这里跑 skill / 工作流，产出中间物。这是**脏区**：草稿、分析、探索都放这，不进演示版。

## 怎么开始工作：你什么都不用记

**坐下来说人话就行。** 不用背命令、不用记流程名词。例如：

- 「我到哪了 / 接着上次」 → AI 报进度接着做
- 「我有个想法…」 → AI 帮你把它想清楚并开个 bet
- 「这个靠谱吗 / 我不确定」 → AI 召集智囊团帮你想
- 「哪个先做」 → AI 帮你排序
- 「定了，往下走」 → AI 落产物、进下一阶段

AI 会自动路由到对的阶段和 skill（完整路由表在根目录 `../CLAUDE.md`）。
懒得打字想要个固定入口，就敲 **`/pm`**；想让智囊团帮忙就敲 **`/think`**——但这俩只是快捷键，不记也行。

**流程是骨架不是牢笼**：可以跳步、插队、只聊天。唯一硬线——Bet Brief 没填完的 bet 不进 build。

规则写死在两处，AI 每次遵守：
- 根目录 `../CLAUDE.md`：会话开始定位、照 playbook 走、如何沉淀推进。
- `WORKFLOW.md`：一个 bet 从 P0 到 P5 的阶段机 + 每阶段绑定的 skill。

## 核心文件

| 文件 | 作用 |
| --- | --- |
| `WORKFLOW.md` | 阶段机总览：P0 想法讨论 → P1 Bet Brief → P2 验证/找信号 → P3 Build → P4 Signal Review → P5 学习（支持并行 bet） |
| `STATE.md` | 当前在哪个 bet 的哪个阶段（唯一事实源） |
| `LEARNINGS.md` | 跨 bet 的可迁移学习复利库；开新 bet 前先读 |
| `playbooks/` | 每个阶段写死的脚本（参谋团问题、Bet Brief 六问、Signal Review 决策表），AI 照着走 |
| `references/advisors.md` | leader 的参谋团完整问题清单 |
| `bets/<slug>/` | 每个产品实验的逐阶段产物 |

## 其他子目录

| 子目录 | 放什么 |
| --- | --- |
| `data/` | 📊 数据分析产出（`oppa-analyze`/BI 结果、留存/流失/情绪/分群指标、图表）。P4 从这取数 |
| `drafts/` | 需求探索、评审前中间版本、独立召集的智囊团结论 |

## 阶段绑定的 skill（AI 会在对应阶段自动用）

- P0 想法讨论 → **智囊团（必过）** + 参谋团逼问 + `opportunity-solution-tree`（别乱做）+ `recommendation-canvas`（AI bet 值不值）+ 需要时 `positioning-workshop` / `company-research`（护城河/竞品）
- P1 Bet Brief → `epic-hypothesis`（if/then 可验证）/ `problem-statement`
- P2 验证/找信号 → `pol-probe-advisor` + `pol-probe`（选最便宜探针）；访谈是探针之一 → `discovery-interview-prep`
- P4 Signal Review → `oppa-analyze`（取行为数据）/ `business-health-diagnostic`
- 随时 → `/think` 智囊团（`prioritization-advisor` 给并行 bet 排序等）

> 这些 skill 就是环境里的 `anthropic-skills:*`，已在线可用，不用另装。
> 产出写成 markdown 最省事；要给团队的正式文档（Word/PPT/Excel）再用对应 skill 导出。成熟结论再同步进 `docs/` 正式 PRD 或 `demo/spec-data.js` 说明卡。
