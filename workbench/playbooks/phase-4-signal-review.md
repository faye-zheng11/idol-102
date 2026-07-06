# P4 Signal Review — Playbook

**目的**：上线第 14 天，拿 Bet Brief 对着**行为数据**，一小时内做一个决定。
**AI 怎么做**：拉出该 bet 的 `01-bet-brief.md` ③④；用 `oppa-analyze` 取真实行为数据（idol101_bi 库），用 `business-health-diagnostic` 辅助判断；把数据摆在 Brief 预设旁边，逼出决定。**禁止让结论停在"再观察一下"。**
**产物**：`bets/<slug>/04-signal-review.md`

---

## 步骤

1. 取 Brief ③ 那个"要看到的行为"的真实数据（`oppa-analyze`）。
2. 并排对比：预设 vs 实际。
3. 按 Brief ④ 预写的分支执行。

## 决策表（只能选一个）

| 情况 | 决定 |
| --- | --- |
| 看到了目标行为 | **continue** —— 下一步扩什么、怎么放大飞轮 |
| 没看到，但方向有信号 | **pivot** 到 [具体方向] / **缩 scope** 到 [具体调整] |
| 没看到，且触发 kill 条件 | **stop** —— 干净收尾 |

> 硬规则：不允许"再观察一下"作为结论。判断不了，说明 Brief ③ 当初没写成可观察行为——记下这条，进 P5 学习。

## 出口

`04-signal-review.md` 里有：预设 vs 实际数据、一个明确决定、决定的理由。更新 `STATE.md` → 进 P5。
