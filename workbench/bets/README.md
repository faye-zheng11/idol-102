# bets/ — 每个产品实验一个文件夹

一个 bet = 一个产品实验，从 P0 走到 P5。每个 bet 一个子目录，slug 用小写连字符（如 `daily-checkin`）。

```
bets/<slug>/
  00-think.md          P0 想法讨论（参谋团逼问结论）
  01-bet-brief.md      P1 Bet Brief 六问
  02-validation.md     P2 验证 / 找信号（选探针 → 跑 → 回填）
  03-build.md          P3 Build 记录
  04-signal-review.md  P4 第 14 天决策
  05-learnings.md      P5 可迁移学习
```

不必一次建齐——每进一个阶段，AI 才创建该阶段的文件。当前进度看 `../STATE.md`。
