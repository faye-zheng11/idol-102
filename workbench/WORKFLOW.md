# PM 工作流：bet 组合（支持并行探索）

来源：leader 的产品思维框架（YC / Elon / Jobs / 一鸣 参谋团 + Bet Brief 四步）+ deanpeters PM skills 里的 PMF 验证方法。
一个"产品实验"= 一个 **bet**。**可以同时跑多个 bet**（见下方"并行探索"）。每个 bet 从 P0 走到 P5，产物逐阶段沉淀，学习进复利库。
定位：**注重 PMF 验证——不怕失败、专找信号，同时用 OST + 智囊团确保没在乱做事。**

## 阶段机

| 阶段 | 名称 | 什么时候 | 干什么 | 绑定 skill | 唯一产物 | 出口条件 |
| --- | --- | --- | --- | --- | --- | --- |
| **P0** | 想法讨论 | build 前 | 过两支队伍：智囊团（商业）+ 用户体验团（体验）；参谋团 5 问逼诚实 + OST 确认没乱做 + AI bet 评估 | 智囊团 `think-tank` / 用户体验团 `ux-panel` / `opportunity-solution-tree` / `recommendation-canvas` / `positioning-workshop` | `00-think.md` | 两团各过一遍、5 问诚实、有一张 OST |
| **P1** | Bet Brief | build 前 | 填六问，把"在测什么"写成可证伪的一句话 | `epic-hypothesis` / `problem-statement` | `01-bet-brief.md` | 六问**全部**填完（否则回 P2 验证） |
| **P2** | 验证 / 找信号 | build 前 | 选最便宜的探针逼真相；访谈是其中一种探针 | `pol-probe-advisor` / `pol-probe` / `discovery-interview-prep` | `02-validation.md` | 探针跑完出结论：有信号/无信号/换探针 |
| **P3** | Build | 有信号才做 | 写 PRD/设计原型交互 → 过**设计与技术团** → 做原型/接开发；上线出 handoff（前后端 story + 埋点审计 + demo 脚本） | 设计与技术团 `design-tech-panel` / `frontend-design` 等设计 skill / `run` / `verify` / `playbooks/handoff/` | `03-build.md` | 过了设计与技术团；可演示、能观察到目标行为；上线则 handoff 齐 |
| **P4** | Signal Review | 上线第 14 天 | 拿 Brief 看行为数据，做决定 | `oppa-analyze` / `business-health-diagnostic` | `04-signal-review.md` | 出一个决定：continue/stop/pivot/缩 scope |
| **P5** | 可迁移学习 | Signal Review 后 | 写 1–3 条对下一个产品有用的结论 | — | `05-learnings.md` + 追加 `LEARNINGS.md` | 结论进复利库 |

## 并行探索

- 可以**同时挂多个 in-flight bet**，各自处在不同阶段（A 在 P2 验证、B 在 P3 Build、C 还在 P0）。
- `STATE.md` 的 portfolio 表是所有并行 bet 的总览；AI 每次进来先报整个 portfolio。
- **硬门槛只对单个 bet 生效**：某个 bet 的 Bet Brief 没填完只挡它自己进 build，不影响其他 bet。
- 不知道先推哪个 → 用 **智囊团排序官**（`/think 给并行 bet 排序`，跑 `prioritization-advisor`）。

## 智囊团（随时可召集）

命令 `/think`（`playbooks/think-tank.md`）：想法模糊、不确定、或给并行 bet 排序时召集多视角面板。每个新 bet 的 P0 强制过一次。

## 硬规则（来自 leader）

1. Bet Brief 填不完，不开始 build。
2. Signal Review 不允许"再观察一下"，必须是决定。
3. 每个 bet 结束都要留下可迁移学习，让下一个 bet 有复利。
4. 参谋团问题不是求好答案，是逼诚实答案——回答完感觉舒服，说明问得不够狠。

## 产物目录结构

```
workbench/
  STATE.md              ← portfolio：所有并行 bet 各在哪个阶段（唯一事实源）
  LEARNINGS.md          ← 跨 bet 的可迁移学习复利库
  playbooks/            ← 每个阶段写死的脚本 + think-tank.md（智囊团）
  references/advisors.md← 参谋团完整问题清单（leader 原文）
  bets/<slug>/
    00-think.md 01-bet-brief.md 02-validation.md
    03-build.md 04-signal-review.md 05-learnings.md
```

## 怎么用（给 PM）

- 每次进项目输入 `/pm`（或直接说话）→ AI 读 STATE 报整个 portfolio，问你推哪个。
- 想开新想法："开个新 bet" → AI 建 `bets/<slug>/`，先过智囊团再进 P0。
- 想推进："<bet> 这步定了，往下走" → AI 落产物、更新 STATE、进下一阶段。
- 不确定 / 排序 → `/think`。
