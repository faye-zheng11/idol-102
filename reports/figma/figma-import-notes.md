# Idol 102 Figma 沟通稿

本目录用于给开发沟通当前项目页面结构和模块划分。

## 已生成

- `idol102-figma-board.html`：一个可视化沟通板，按模块整理了 10 个手机页面稿。
- `idol102-figma-board.svg`：Figma 可直接导入的纯 SVG 画板，结构和文字可编辑。
- `web-snapshots/`：从本地网页实际运行状态抓取的 PNG 快照。
- `web-snapshots/index.html`：网页快照总览页，可直接打开给开发看。
- `web-snapshots/module-board.html`：按模块拆分的详细说明板，包含触发条件、功能目的、工程位置和待补子状态。
- `web-snapshots/detailed-flow-board.html`：更详细的用户路径截图板，按真实操作步骤拆分，说明更偏白话。

## 页面拆分

1. Splash / Login
2. Member Select
3. Dream Intro
4. OB Dream Chat
5. Wake Transition
6. Real Scene
7. Home
8. Chat
9. Scene List
10. Me

## 模块边界

- Onboarding：登录、角色选择、进入梦境
- OB：梦境剧情聊天、点选式选择、错误/重载状态
- RealMeet：真实世界初遇、首次交换联系方式
- Home：关系状态、记忆时间线、角色海报
- Chat：长期聊天、关系连续性、记忆回调入口
- Scene：可进入的关系场景列表
- Me：用户资料与账号设置

## 当前 Figma 云端链接状态

当前环境没有配置 `FIGMA_OAUTH_TOKEN`，也没有暴露 `create_new_file` / `use_figma` 写入工具，所以我还不能直接创建一个云端 Figma 文件 URL。

要生成真正的 Figma 地址，需要：

1. 在 Codex 启动环境里配置 `FIGMA_OAUTH_TOKEN`。
2. 在 `~/.codex/config.toml` 启用 Figma MCP：

```toml
[mcp_servers.figma]
url = "https://mcp.figma.com/mcp"
bearer_token_env_var = "FIGMA_OAUTH_TOKEN"
http_headers = { "X-Figma-Region" = "us-east-1" }

[features]
rmcp_client = true
```

3. 重启 Codex 后，我可以把这份沟通板迁移成 Figma 文件，并返回 Figma URL。

## 临时用法

开发沟通可以先打开：

`reports/figma/idol102-figma-board.html`

这份 HTML 已经按 Figma 画板方式排版，截图或投屏都可以直接用。

如果需要导入 Figma，直接把 `reports/figma/idol102-figma-board.svg` 拖进 Figma 画布即可。

如果需要基于真实页面截图沟通，打开：

`reports/figma/web-snapshots/index.html`

也可以把 `reports/figma/web-snapshots/*.png` 直接拖进 Figma。

如果需要按模块沟通，打开：

`reports/figma/web-snapshots/module-board.html`

如果需要看最详细的逐步截图，打开：

`reports/figma/web-snapshots/detailed-flow-board.html`

快照来源说明：

- `01` 到 `06`：从本地网页真实 onboarding / OB 流程点击截图。
- `10` 到 `13`：从项目内置 `?preview=app` 主应用预览状态截图，用来覆盖 Home / Chat / Scene / Me。
