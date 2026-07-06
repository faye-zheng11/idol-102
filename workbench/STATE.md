# STATE — 工作台 portfolio（唯一事实源）

> AI 每次会话先读这里，报整个 portfolio；每完成一个阶段就更新对应 bet 的行。
> 支持并行：多个 bet 可同时在不同阶段。硬门槛（Bet Brief 填完才 build）只对单个 bet 生效。

## Portfolio（所有 in-flight bet）

| Slug | 名称 | 当前阶段 | 上一步完成 | 下一步 / 在等谁 | 更新日期 |
| --- | --- | --- | --- | --- | --- |
| _(还没有)_ | | | | | |

> 阶段取值：P0 想法讨论 / P1 Bet Brief / P2 验证 / P3 Build / P4 Signal Review / P5 学习 / ✅完成 / ⛔已 stop

## 各 bet 详情

<!-- 每个 in-flight bet 一段，勾 checklist。开新 bet 时复制一段。 -->

### （示例，删掉换成真实 bet）`<slug>` — 《名称》
- [ ] P0 想法讨论（智囊团过一次）→ `00-think.md`
- [ ] P1 Bet Brief（六问填满）→ `01-bet-brief.md`
- [ ] P2 验证 / 找信号（探针跑完）→ `02-validation.md`
- [ ] P3 Build（可演示版本）→ `03-build.md`
- [ ] P4 Signal Review（出决定）→ `04-signal-review.md`
- [ ] P5 可迁移学习（进复利库）→ `05-learnings.md`

---
_更新约定：推进阶段后改 portfolio 表对应行 + 勾该 bet 的 checklist；开新 bet 加一行 + 复制一段详情；stop/完成的 bet 从 portfolio 移到下方归档。_

## 已归档 bet

| Slug | 名称 | 结局 | 关键学习 | 日期 |
| --- | --- | --- | --- | --- |
| _(还没有)_ | | | | |
