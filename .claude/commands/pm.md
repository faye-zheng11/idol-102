---
description: 进入 PM 工作台：读当前状态，告诉我在哪个 bet 的哪个阶段，接着做
---

执行工作台的"会话开始"定位流程：

1. 读 `workbench/STATE.md`，判断当前进行中的 bet 和阶段。
2. 用一句话汇报：「你在《bet 名》的 P{n} {阶段名}。上一步完成了 X，下一步 Y。」
3. 打开当前阶段对应的 `workbench/playbooks/phase-{n}-*.md`，**照 playbook 逐条执行**，不要自己另编问题。
4. 如果没有进行中的 bet，问我：开新 bet（走 P0），还是先读 `workbench/LEARNINGS.md`？

规则以根目录 `CLAUDE.md` 和 `workbench/WORKFLOW.md` 为准。参数（如果我给了）：$ARGUMENTS —— 可能是 bet slug 或"开新 bet：<想法>"。
