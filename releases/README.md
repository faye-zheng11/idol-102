# releases — 封存区（冻结的版本）

每个产品版本你拍板 OK 后，把当时的**文档 + 演示 + 数据**冻一份进这里，**以后不改**，方便日后查阅、对比。
讨论（workbench）是活区，**不进封存**——它一直往前走。

## 里面长什么样

```
releases/
  v1.0/
    RELEASE.md      这版是什么、你拍板的决定、日期
    prototype/      冻结的整份可跑原型（index.html/app.js/src/styles.css/assets… 当时的样子）
    docs/           冻结的正式 PRD（当时交付给开发的版本）
    demo/           冻结的演示壳代码（iframe 指向本目录 prototype/；+ screens/ 可选关键页面截图）
    data/           冻结的关键指标（支撑这版决策/结果的数据）
  v1.1/
    ...
```
> **原型不用拼接**：活的原型永远只有根目录一份（=最新版）。做 2.0 就直接在根目录改，1.0 的样子已完整冻在 `releases/v1.0/prototype/`。想对比就「releases/v1.0/prototype」对「根目录」，两份各自能单独跑。
> 同时也打 `git tag v1.0` 双保险（git 层面的版本机）。

## 封版仪式（你说 OK 就触发）

你说「**1.0 版本 OK，封版**」（或类似的话），AI 就：

1. 建 `releases/v1.0/`。
2. 复制当前**整份原型**（`index.html` `app.js` `shell.js` `styles.css` `src/` `assets/` `server.js` `package.json`）→ `releases/v1.0/prototype/`（这就是 1.0 原型的永久样子，能单独跑）。
3. 复制当前 `docs/` → `releases/v1.0/docs/`（冻结正式 PRD）。
4. 复制当前 `demo/` → `releases/v1.0/demo/`，并把它的 iframe 改指向 `../prototype/`（让这版 demo 展示的是 1.0 原型，不是最新的）；如需静态版，截几张关键页面图放 `demo/screens/`。
5. 复制 `workbench/data/` 里这版相关的关键指标 → `releases/v1.0/data/`。
6. 写 `RELEASE.md`：这版做了什么、你拍板的决定、日期。
7. 打 `git tag v1.0`（双保险）。
8. 之后这个目录**只读不改**；活区（root 原型 / docs / demo / workbench）继续迭代下一版。

## 约定

- 封存 = 快照，是**复制**不是移动——活区原件继续用。
- 版本号用产品版本（v1.0 / v1.1…）；封版时同时打 git tag，两者对应。
- 讨论/学习不封存：可迁移学习已在 `workbench/LEARNINGS.md` 里跨版本累积。

## 已封存

- **v1.0**（2026-07-06）— 见 `v1.0/RELEASE.md`。冻结了当时的 prototype / docs(含埋点) / demo / prompts / data；git 标签 `v1.0`。
