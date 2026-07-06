# Repository Instructions

> 本文件是 Codex（以及任何读 AGENTS.md 的 agent）的入口。Claude Code 读 `CLAUDE.md`。
> 两者共用同一套规则——**规则的唯一事实源是 `CLAUDE.md`**，本文件不复制内容、只指向它，避免两边不同步。

## ⚠️ 所有 agent（含 Codex）先做这件事

进入本项目，**先完整读 `CLAUDE.md` 并完全遵守**——它是产品经理工作台的运行规则，对你同样适用（不只对 Claude）。要点：

- 这是 PM 工作台：会话开始先读 `workbench/STATE.md` 报 portfolio，别乱问。
- **用户说人话即可，你负责路由**（完整"人话路由表"在 `CLAUDE.md`）。用户不需要记命令。
- 照 `workbench/playbooks/` 的脚本走，不即兴提问。流程是骨架不是牢笼，可跳步；唯一硬线：Bet Brief 没填完的 bet 不进 build。
- 完整阶段机与 skill 映射见 `workbench/WORKFLOW.md`。

**Codex 侧注意**：`/pm`、`/think` 是 Claude Code 的斜杠命令快捷键，Codex 里可能不生效——没关系，直接说人话（"我到哪了"/"帮我想想"/"这个怎么验"），路由表照样把你带到对的阶段。要满血用到 `pol-probe` 等高级 skill 和真实数据，见 `SETUP.md`。

## 开发分支规则

- Default development branch: `main`.
- Do all future code development and pushes on `main` unless the user explicitly asks to create or switch to another branch.
- Do not create new branches without an explicit user command.
