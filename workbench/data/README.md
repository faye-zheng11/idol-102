# data — 数据区（活）

📊 数据分析产出放这：`oppa-analyze` / BI 查询结果、留存·流失·情绪·分群等指标、图表。

- 这是**活区**，一直是最新，跟着 git 走，不按版本封存。
- 文件名带日期，如 `2026-07-06-churn-signals.md`、`2026-07-06-day14-retention.md`。
- P4 Signal Review 就从这里取数（数据源是 mysql `idol101_bi`，见 `../../SETUP.md`）。
- 某个版本封版时，会把当时的关键指标**复制**一份冻进 `releases/v<X>/data/`，本目录仍继续更新。

> 原始数据访问和统计落库通过 mysql MCP 完成；这里放的是**分析产出**，不是原始库。
