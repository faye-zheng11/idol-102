---
description: 自动驾驶——给个想法，AI 驱动整条 bet 流水线，你只在关键节点点确认/答问题
argument-hint: <一句话想法>
---

按 `workbench/playbooks/auto-run.md` 开自动驾驶：

1. 拿我的想法（$ARGUMENTS）建 `workbench/bets/<slug>/`，登记进 `STATE.md`。
2. 按闸口地图逐段推进：闸口之间的桌面活（召集三支团、起草产物、选探针、拟 PRD、拉数据）**全自动做**；每到闸口用 AskUserQuestion 弹选项卡（= 确认按钮）+ 最多问 2–3 个只有我知道的事。
3. 遇到现实世界步骤（真去找用户聊、等 14 天数据）如实交棒，别假装完成。
4. 每阶段落产物到 bet 目录、更新 STATE。硬规则照旧：Bet Brief 没确认不进 build；P2 无信号触发 stop/pivot；P4 必出裁决。

我随时能说"这里停一下手动聊"切回手动，说"继续自动"再回来。
