# Idol 102 1.0 项目级 PRD（总目录版）

> 本文是 Idol 102 1.0 的项目级 PRD 总览。  
> 本文用于帮助产品、设计、开发和 AI 先理解整个项目要做什么，再进入各模块 PRD 查看细节。  
> 本文不重复展开所有模块细节；具体页面、交互、边界和验收标准以各模块 PRD 为准。

## 1. 项目定位

Idol 102 1.0 是一个面向 K-pop 粉丝的 AI 角色陪伴产品。

它不是单纯聊天工具，也不是一次性剧情游戏。它的核心是让用户和 AI 角色之间产生持续关系：

1. 通过 OB 建立第一次共同经历。
2. 通过 Chat 保持日常联系。
3. 通过 Scene 产生新的共同事件。
4. 通过 Home 把共同经历沉淀成可回看的拍立得记忆。
5. 通过 Me 管理用户自己的资料、语言和账号。

## 2. 核心假设

如果用户和 AI 角色不仅能聊天，还能一起经历具体地点和事件，并把这些经历沉淀成可回看的记忆，用户会更容易感到关系在生长。

因此 1.0 的重点不是把所有关系系统一次性做完，而是先做出关系生长的基础闭环：

- 第一次相遇
- 加上联系方式
- 日常聊天
- 发起或接受 Scene
- 完成 Scene
- 生成拍立得
- 回到 Home 看到关系痕迹

## 3. 1.0 产品目标

1. 完成新用户从登录到 OB 的强制引导。
2. 让用户选择首位角色，并完成第一次梦境 + 现实偶遇。
3. OB 完成后解锁 Home / Chat / Scene / Me。
4. 让用户在 Chat 中与已添加角色持续聊天。
5. 让用户可以通过 Discover Members 添加更多角色。
6. 让用户可以通过 Scene 与角色产生新的共同经历。
7. 每次 Scene 结束后生成拍立得，并沉淀到 Home。
8. 让用户可以管理自己的头像、昵称、语言、反馈、登出和注销。

## 4. 产品主链路

1. 用户打开 App。
2. 用户完成登录。
3. 如果未完成 OB，进入 OB。
4. 用户选择首位角色。
5. 用户完成 OB 梦境后台小剧场。
6. 用户完成楼下偶遇和加联系方式。
7. 系统生成第一张拍立得。
8. 用户默认落地 Home。
9. Chat 中出现首位角色会话。
10. 用户可继续 Chat、添加角色、发起 Scene。
11. Scene 完成后生成新的拍立得。
12. Home 持续沉淀这些关系记忆。

## 5. 模块总览

| 模块 | 主要职责 | 细节文档 |
| --- | --- | --- |
| OB | 新用户强制引导；选择首位角色；梦境后台小剧场；楼下首次偶遇；加好友；生成第一张拍立得；解锁主站 | 待替换为 OB 模块独立链接 |
| Home | 展示当前角色海报、昵称、相识天数、故事线日期卡；查看 Moment 拍立得；Memory Replay；编辑展示层内容 | [Home 模块 PRD](https://laientech.feishu.cn/docx/Npo3dByzMoHMzKxcUkHcG2zJnyd) |
| Chat | 会话列表；Discover Members；对话页；文本/图片消息；角色语音；角色来电；Chat Settings；举报；清空聊天记录 | [Chat 模块 PRD](https://laientech.feishu.cn/docx/SyGIdMHNRomIkux6nCNcrm8cnre) |
| Scene | 地图；地点和事件；用户发起 Scene；Trigger 发起后的前端表现；Active Scene；Scene 对话页；结束生成拍立得 | [Scene 模块 PRD](https://laientech.feishu.cn/docx/XEGAd52YyoYj3zxF2RWcZcQUnXc) |
| Me | 用户头像、背景图、昵称、UID、邮箱、Default Language、反馈、条款、登出、注销 | [Me 模块 PRD](https://laientech.feishu.cn/docx/L6CwdOeENoiCnoxqDPvcTY9anvc) |

## 6. 模块关系

### 6.1 OB 到主站

OB 是主站解锁前置流程。

OB 完成后同时发生：

- 用户完成首位角色添加。
- Home 出现第一张拍立得。
- Chat 出现首位角色会话。
- Home / Chat / Scene / Me 全部解锁。
- 默认落地 Home。

### 6.2 Chat 与 Home

Chat Settings 中的角色资料修改会影响 Home：

- 修改角色昵称后，Home 角色昵称同步变化。
- 修改 Home Poster 后，Home 当前角色海报同步变化。

Chat 清空聊天记录不影响：

- 好友关系
- Home 海报
- Home 拍立得
- Scene 历史
- 角色设置

### 6.3 Chat 与 Scene

Chat 是 Scene 邀请的承接入口。

用户发起 Scene 时：

- 用户从 Scene 选择地点、事件、角色。
- App 回到该角色 Chat。
- 用户发送 Scene 邀请卡片。
- 角色接受后出现 `Go Now`。
- 用户点击后进入 Scene。

Trigger 发起 Scene 时：

- Trigger 具体运行规则不在项目级 PRD 展开。
- Chat 只展示触发后的邀请消息和 Scene 卡片。
- 用户点击 `Accept` 后进入 Scene。
- 用户点击 `Decline` 后拒绝。

### 6.4 Scene 与 Home

Scene 完成后必须生成拍立得。

用户点击 `Collect Memory` 后：

- 跳转 Home。
- Home 切到对应角色。
- Home 定位到对应日期的故事线日期卡。
- 对应故事线日期卡播放闪烁动效。

Home 负责展示按日期聚合后的故事线和 Moment 拍立得预览。

### 6.5 Me 与全局语言

Me 中的 Default Language 影响：

- App 系统文案语言
- 角色文本回复语言
- 角色语音消息下方文本语言
- Voice Call 字幕语言
- Voice Call 回放字幕语言

Default Language 不影响：

- 角色语音声音语言
- Voice Call 声音语言

角色语音和电话声音始终为角色母语。

### 6.6 Me 与 Chat

Me 中的用户头像会显示在 Chat 的用户消息气泡旁。

用户在 Me 修改头像后：

- Me 页面头像更新。
- Chat 中用户消息气泡旁头像同步更新。

Me 中的用户昵称只影响 UI 展示，不决定角色在聊天中怎么称呼用户。角色如何称呼用户由 Memory / 对话系统决定。

## 7. 全局核心规则

1. OB 未完成前，Home / Chat / Scene / Me 不开放。
2. OB 完成后默认落地 Home。
3. Home 是关系沉淀页，不是信息流。
4. Chat 是关系延续入口，不是普通客服会话。
5. Scene 是共同经历系统，不是普通地图。
6. Me 是用户自己的资料和账号管理页，不修改角色资料。
7. 同一时间只能有 1 个 Active Scene。
8. Active Scene 只锁当前角色普通 Chat，不锁其他角色 Chat。
9. 用户不能主动发语音。
10. 用户不能主动打电话。
11. 角色语音和电话只由角色侧触发。
12. Scene 内不支持图片、语音、电话。
13. 每次 Scene 结束都必须生成拍立得。
14. 拍立得编辑只影响展示层，不影响角色记忆和原始聊天快照。

## 8. 关键体验名词

| 名词 | 说明 |
| --- | --- |
| OB | 新用户首次进入主站前的强制关系建立流程 |
| 首位角色 | 用户在 OB 中选择的第一个角色 |
| 已添加角色 | 通过 OB 或 Discover Members 建立好友关系的角色 |
| Scene | 用户和角色共同经历的地点 + 事件 + 对话 |
| Active Scene | 当前正在进行中的 Scene |
| 拍立得 | 用户和角色共同经历过的 Scene / OB 记忆卡 |
| 故事线日期卡 | Home 横向故事线中代表某个有 moment 日期的卡 |
| Moment 拍立得卡 | 点击故事线日期卡后展开看到的具体 moment 卡 |
| Memory Replay | 某个 moment 的只读聊天快照 |
| Default Language | Me 中设置的全局文本语言 |

## 9. 实现边界说明

本文和各模块 PRD 都遵循同一原则：

- 产品文档定义用户体验、业务流程、页面表现和验收标准。
- 产品文档不定义接口字段名、数据库字段名、接口拆分和具体技术实现。
- 如果文档写“系统需要提供”，意思是该页面为了完成体验需要拿到这些信息，不代表规定前端或后端怎么实现。
- 如果内容、图片、prompt 或配置暂时没准备好，开发可以先用占位内容搭流程，但上线前必须补齐正式内容。

## 10. 系统需要支撑的信息

为了让 1.0 闭环成立，系统需要能支撑这些产品信息：

- 用户登录状态
- OB 完成状态
- 已添加角色列表
- 当前角色资料
- 用户资料
- Default Language
- Chat 会话和消息
- 角色语音和电话内容
- Scene 地点和事件配置
- Active Scene 状态
- Scene 聊天快照
- Scene 总结标题和正文
- Home 故事线日期卡
- Moment 拍立得卡
- 用户对展示层内容的编辑结果

这些是产品层面的信息需求，不是接口字段定义。

## 11. 内容未准备好时的通用处理

开发期允许使用占位内容搭建流程：

- 角色图没给：使用角色占位图。
- 地点图没给：使用场景占位图。
- 海报没给：使用默认海报。
- Scene 事件没给：使用临时事件。
- 邀请文案没给：使用临时邀请文案。
- 总结没生成：展示 `Memory is being written...`。
- 条款链接没配：Toast 提示暂不可用。
- App Store 链接没配：Toast 提示暂不可用。

但上线前，正式内容必须补齐。

## 12. 不希望出现的全局体验

- 用户未完成 OB 就进入主站模块。
- OB 完成后 Home 没有第一张拍立得。
- Chat 变成普通客服式聊天列表。
- Scene 变成普通地图，不产生共同经历。
- Scene 完成后没有生成拍立得。
- Home 故事线出现没有 moment 的空白日期卡。
- 用户清空 Chat 后 Home 拍立得也消失。
- Active Scene 锁住了所有角色 Chat。
- Default Language 改变了角色语音 / 电话的声音语言。
- Me 修改用户资料却影响角色资料。
- Chat Settings 修改角色资料却影响用户资料。
- 各模块重复定义同一件事，导致规则冲突。

## 13. 验收方式

项目级验收先看主链路是否闭环：

1. 新用户登录后进入 OB。
2. OB 完成后默认落地 Home。
3. Home 出现首位角色和第一张拍立得。
4. Chat 出现首位角色会话。
5. 用户可以添加新角色。
6. 用户可以从 Scene 发起一次 Scene。
7. 用户可以从 Chat 接受一次 Trigger Scene 邀请。
8. Active Scene 状态能正确锁当前角色 Chat。
9. Scene 结束后生成拍立得。
10. `Collect Memory` 能回到 Home 对应故事线日期卡。
11. 用户能在 Home 查看 Moment 拍立得和 Memory Replay。
12. 用户能在 Me 修改头像，并同步到 Chat 用户消息气泡。
13. 用户能修改 Default Language，并影响文本和字幕语言。
14. 用户能反馈、登出和注销。

各模块的细节验收以模块 PRD 的“验收标准”为准。

## 14. 模块 PRD 阅读顺序

建议开发和 AI 按以下顺序阅读：

1. 本项目级 PRD
2. OB 模块 PRD
3. Home 模块 PRD
4. Chat 模块 PRD
5. Scene 模块 PRD
6. Me 模块 PRD

原因：

- OB 决定新用户如何进入主站。
- Home 决定关系记忆如何沉淀。
- Chat 决定日常互动和 Scene 邀请如何承接。
- Scene 决定共同经历如何产生。
- Me 决定用户资料、语言和账号管理。

## 15. 待替换链接

当前项目级 PRD 已放入模块链接表。

仍需补充或替换：

- OB 模块独立文档链接

如果后续为 OB 创建独立页面，只需要替换第 5 节模块总览中的 OB 链接。
