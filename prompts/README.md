# idol102 · Prompt Routing

idol102 全量 LLM / TTS 提示语的人工「逐字快照」文档站：功能链路 × 模型总线 × 提示语原文。纯静态站点，无构建步骤。

- 入口：`index.html`（路由矩阵 / 分组目录 / 模型总线 / 通用约定）
- 域子页：`chat.html`（普通聊天 A/B/C/D）、`scene.html`（Scene 场景 E–J）、`media.html`(翻译语音 K/L)
- 源码事实源：邻仓 `../oppaya-spring-boot-biz-idol102`（api-app / assembly-chat / common-util）

## 维护约定

- **纯手写维护**，无生成器；提示语原文逐字取自源码字符串。
- `.src` 锚点使用「类名 · 方法名/常量名」制，**不钉行号**（源码高频改动会系统性错位）；全站以页脚/readout 的「锚点基准 `<commit>`」标记对齐到的源码版本，更新完成后一并收口。
- 双语：每条 `.rb` 的 `data-native` 标注线上原文语言（zh/en），另一语为参考译文；逐条可独立切换（`toggle.js`）。
- 条目 ID 只增不改（当前 33 条：A1–A10、B1–B4、C1、D1、E1、F1–F8、G1–G3、H1、I1、J1、K1），存在跨页互引（F6→A6、G→A2/F1–F4、A2′→#a9/#a10 页内锚）。
- index 口径三角必须一致：readout 计数 = 路由矩阵行数 = 子页 distinct ID 总数 = 总线表行数。

## 逐字校验

```bash
python3 scripts/verify_prompts.py
```

反向抽取比对：把文档 native 正文剥标签、掏空 `{{占位}}`、归一空白后，与源码**按序抽取的字符串字面量拼接**做子串校验。预期仅 F6 的「/」并排骨架行未命中（有意的结构化缩写）。转写新条目时禁止凭记忆敲正文——从源码整段复制后只做 HTML 转义与占位符标注。

## 设计记号（视觉体系，改样式前先读）

- 隐喻：**播出控制室 / 配音棚 cue sheet**——站点内容本身就是 Director/Actor/Voiceover/Scene Beat 的演出脚本，深色机头（console chrome）+ 浅色规格纸（reading sheet）两分区。
- 签名件：路由矩阵 = **接线板 patch bay**（`.nd-p` 实心塞+外环 / `.nd-s` 空环辅路 / `.nd-o` 未接微孔），加载时按总线列逐列「接入」（`@keyframes patch`，respects reduced-motion）；机头底边为四总线色带（`.console::after`）。
- 色板：`--ink #16171b` 机头石墨、`--paper #f4f4f2` 规格纸、`--amber #ffbe55` 磷光琥珀（cue/占位符/读数/激活音轨）、`--hot #f23a2c` ON AIR；总线 `--gen #4040c9` / `--gpt #0c8266` / `--grok #343a44` / `--fish #0a7f9e`（色族即语义，改值不改族）。
- 字体：Display=**Big Shoulders Display**（仅拉丁高光位：H1/链路字母/读数），Mono/Body=IBM Plex（CJK 回退 PingFang SC）；中文一律不用 italic（`.cm` 用降饱和色）。
- 克制清单：无背景纹理（点阵已删）、动效仅 live 脉冲 + 矩阵接入 + 悬停微反馈。

## 本地预览与部署

- 本地：直接 `open index.html`。
- 部署：Vercel 静态托管（项目 `idol102-prompt-routing`），根目录即站点根，零配置；`vercel deploy --prod` 或经 Vercel MCP 部署。
