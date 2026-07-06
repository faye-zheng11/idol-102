# 

# OB 模块



> 本文可替换总 PRD 中的「OB 模块」章节。目标是让前端开发或 AI 在真实接口、飞书字段、内容字段尚未完全确定时，也能基于明确的业务语义、状态流转和页面规则先完成可运行实现。
> 
> 



## 0\. 开发实现说明

本模块以「业务语义和交互规则」为准，不强制最终代码字段名、接口名、数据库字段名或飞书字段名。

如果本文出现 `character_id`、`ob_progress`、`step_id` 等字段名，它们表示业务语义示例。开发可根据实际工程命名调整，但不得改变字段含义、页面流程和状态规则。

内容配置、飞书字段、Prompt 细节未最终确定时，前端可以先按本文「数据语义」定义 mock schema。联调前由产品、内容、前端、后端共同确认最终 schema。

AI 生成代码时优先遵循：

1. 页面结构

2. 用户流程顺序

3. 状态流转

4. 数据来源

5. 边界处理

6. 验收标准

若接口或字段未定，可自行定义 mock 数据结构，但不得改变本文标注为「不可变更」的业务规则。



## 1\. 模块目标

OB 是新用户首次进入 OPPAYA 后的强制线性引导。它负责完成三件事：

1. 让用户选择首位角色。

2. 通过「梦境后台小剧场」和「现实楼下偶遇」建立第一段共同经历。

3. 完成加好友、生成第一张拍立得、解锁 Home / Chat / Scene / Me。

OB 完成后，用户默认落地 Home tab，同时 Chat 收到首位角色的主动消息，形成「刚加好友，马上收到消息」的连续体验。

## 2\. 1\.0 范围

### 2\.1 必做

- 角色选择页

- 梦境后台小剧场，5 轮预设选项对话

- 梦境收束、ERROR 页、Reload 转场

- 现实楼下小剧场，3 个预设偶遇原因

- 楼下 5 轮实时文本对话

- 第 5 轮后角色提出加联系方式

- 用户点 `Okay` 后完成加好友

- 自动生成第一张拍立得

- OB 完成后解锁主站并落地 Home

- Chat 收到首位角色主动消息

- 冷启动或杀进程后的 OB 断点恢复

### 2\.2 1\.0 不做

- OB 内语音消息

- OB 内电话消息

- OB 内图片发送

- OB 梦境阶段实时 AI 生成

- OB 梦境阶段轮次级断点恢复

- OB 楼下阶段聊天记录持久保留

- 用户跳过 OB

- 用户重新选择首位角色

## 3\. 不确定项处理

|不确定项|当前处理规则|Owner|截止点|对前端影响|
|---|---|---|---|---|
|飞书角色表最终字段名|PRD 定义字段语义，开发可先自定义 mock 字段名|内容 \+ 后端|联调前|角色列表、角色图、展示顺序|
|梦境剧场配置字段名|PRD 定义 `scene / backstory / steps / closing` 语义，内容字段名可后续映射|内容 \+ 前端|内容导入前|剧场渲染|
|楼下小剧场内容字段名|PRD 定义地点、选项、扩写旁白、角色第一句语义|内容 \+ 后端|内容导入前|楼下场景|
|实时对话接口名|PRD 只定义输入上下文和输出消息语义|后端|联调前|前端可先 mock|
|加好友 / OB 完成接口名|PRD 只定义调用时机和成功后的数据动作|后端|联调前|前端可先 mock|
|拍立得总结生成方式|1\.0 允许异步生成，未完成时展示 loading 占位|后端 \+ AI|联调前|Home 卡片预览|

## 4\. 业务硬规则

以下规则不可由开发或 AI 自行改变：

1. OB 必须线性完成，用户不可跳过。

2. 角色选择 CTA 是不可逆点。点击后首位角色即被确认。

3. 未完成 OB 时，Home / Chat / Scene / Me 不可自由访问。

4. 梦境后台小剧场完全预设，不调用实时 AI。

5. 梦境后台小剧场任意轮次退出后，下次从剧场第 1 轮重新开始。

6. `theater_done` 状态恢复时必须直接落 ERROR 页，不回放梦境。

7. 楼下小剧场任意时刻退出后，下次从楼下 Backstory \+ 3 选项起点重新开始。

8. 楼下小剧场只允许纯文本输入，不支持图片、语音、电话。

9. 楼下小剧场第 5 轮用户消息后必须进入收束，不允许继续自由聊天。

10. 点 `Okay` 加好友成功后，OB 才算完成。

11. OB 完成后默认落地 Home tab，不落地 Chat。

12. OB 完成后首位角色必须出现在 Chat 列表，并产生未读主动消息。

13. OB 完成后第一张拍立得必须挂到 Home 故事线第 1 个实卡位。

## 5\. 前端可自行定义

以下内容允许前端或 AI 在不改变业务规则的前提下自行实现：

- 组件拆分方式

- CSS class 命名

- 本地 mock 字段名

- 接口 hook 命名

- loading skeleton 细节

- 动效 easing 和时长细节

- 临时 mock 数据结构

- 本地路由路径

- 文案 i18n key 命名

## 6\. 状态定义

### 6\.1 OB 总状态

|状态语义|示例值|说明|主站入口|
|---|---|---|---|
|未完成|`in_progress`|用户尚未完成 OB，需按 `ob_progress` 恢复|锁定|
|已完成|`completed`|用户已加好友、生成首张拍立得、解锁主站|解锁|

### 6\.2 OB 进度状态

|进度语义|示例值|何时写入|恢复时落点|
|---|---|---|---|
|未开始|`not_started`|用户未确认角色|角色选择页|
|已确认角色|`character_selected`|点击 `STEP INTO HIS WORLD` 成功后|梦境剧场起点|
|梦境进行中|`theater_in_progress`|进入梦境剧场聊天界面后|梦境剧场起点|
|梦境结束 / 乱码态|`theater_done`|用户点唯一选项后，旁白和闪烁完成前后均可写入|ERROR 页|
|转场完成|`transition_done`|用户点 `[ OPEN YOUR EYES -> ]` 后|楼下小剧场起点|
|楼下进行中|`first_scene_in_progress`|进入楼下小剧场起点后|楼下小剧场起点|
|OB 完成|`completed`|点 `Okay` 加好友成功、OB 完成接口成功后|主界面 Home tab|

说明：

- 前端可以增加内部 UI 子状态，例如 `dream_intro`、`dream_round_3`、`first_scene_round_2`，但这些子状态不要求后端持久化。

- 后端只需要持久化能支持恢复规则的粗粒度 `ob_progress`。

- 梦境阶段和楼下阶段都不做轮次级持久恢复。

## 7\. 主流程

```mermaid
flowchart TD
  A["角色选择页"] -->|"点击 STEP INTO HIS WORLD"| B["写入 character_selected"]
  B --> C["梦境后台入场<br/>Backstory + Continue"]
  C --> D["梦境剧场<br/>5 轮预设选项"]
  D --> E["梦境收束<br/>话外音 + 角色被打断 + 唯一选项"]
  E -->|"点击 Okay. I will wait here for you."| F["画面变暗<br/>旁白 + 闪烁"]
  F --> G["写入 theater_done"]
  G --> H["ERROR 页"]
  H -->|"点击 Reload"| I["转场<br/>THEN + Hey careful + OPEN YOUR EYES"]
  I -->|"点击 OPEN YOUR EYES"| J["写入 transition_done"]
  J --> K["楼下小剧场起点<br/>Backstory + 3 个偶遇原因"]
  K -->|"选择原因"| L["话外音 2 + 角色第一句"]
  L --> M["写入 first_scene_in_progress"]
  M --> N["5 轮实时文本对话"]
  N --> O["角色收束<br/>回应 + 离开 + 加联系方式"]
  O -->|"点击 Okay"| P["加好友 + 生成首张拍立得 + OB completed"]
  P --> Q["落地 Home tab<br/>Chat 产生未读主动消息"]```

## 8\. 冷启动与断点恢复

```mermaid
flowchart TD
  A["App 冷启动 / 登录后路由"] --> B{"ob_status 是否 completed?"}
  B -->|"是"| H["主界面 Home tab"]
  B -->|"否"| C{"读取 ob_progress"}
  C -->|"not_started / 空"| P1["角色选择页"]
  C -->|"character_selected"| P2["梦境剧场起点"]
  C -->|"theater_in_progress"| P2
  C -->|"theater_done"| P3["ERROR 页"]
  C -->|"transition_done"| P4["楼下小剧场起点"]
  C -->|"first_scene_in_progress"| P4
  C -->|"completed"| H```

恢复规则：

- 如果 `ob_status = completed`，优先进入 Home，不再进入 OB。

- 如果 `ob_status != completed`，按 `ob_progress` 恢复。

- 如果 `ob_progress` 缺失或未知，兜底回角色选择页。

- 如果恢复到梦境剧场或楼下小剧场，均从该阶段起点开始，不恢复中间轮次。

## 9\. 数据语义

### 9\.1 角色数据

|字段语义|必填|类型|示例|来源|说明|
|---|---|---|---|---|---|
|角色唯一 ID|是|string|`felix`|飞书经后端同步|全局识别角色，不随昵称变化|
|角色展示名|是|string|`Felix`|飞书经后端同步|默认 UI 姓名|
|角色选择页立绘|是|image url|`.../felix.png`|飞书经后端同步|角色选择页全屏图|
|角色头像|是|image url|`.../felix.png`|飞书经后端同步|气泡头像和 Chat 列表头像|
|Home 默认海报|是|image url|`.../felix.png`|飞书经后端同步|OB 完成后 Home 使用|
|展示顺序|是|number|`6`|飞书经后端同步|角色选择页排序|
|角色介绍|是|string|`He looks after everyone...`|前端写死或内容配置|选择页信息卡展示|

最终字段名由开发和后端定义。前端 mock 时可使用示例字段名。

### 9\.2 梦境剧场配置

|字段语义|必填|类型|示例|来源|说明|
|---|---|---|---|---|---|
|剧场配置 ID|是|string|`ob_dream_backstage_v1`|内容配置|当前 OB 梦境剧场|
|场景名称|是|string|`Backstage · after concert`|内容配置|顶部展示|
|场景背景图|是|image url|`.../backstage.jpg`|内容配置|全程背景|
|入场 Backstory|是|string|`The show has just ended...`|内容配置|入场卡片|
|角色第一句|是|string 或 message array|`You are still here?`|内容配置|剧场开始|
|轮次列表|是|array|5 个 round|内容配置|每轮 3 个选项|
|收束话外音|是|string 或 message array|`...`|内容配置|第 5 轮后|
|被打断角色回复|是|message array|`...`|内容配置|多条角色气泡|
|唯一用户选项|是|string|`Okay. I will wait here for you.`|前端写死|进入乱码前的单选项|
|乱码旁白|是|string|`His silhouette breaks apart...`|前端写死|蒙层中流式展示|

轮次数据语义：

|字段语义|必填|类型|说明|
|---|---|---|---|
|轮次 ID|是|string|可用 `round_1` 到 `round_5`|
|选项列表|是|array|每轮固定 3 个选项|
|选项文案|是|string|用户点选后上屏为用户气泡|
|角色回复|是|message array|用户选择该选项后的预设回复，可 1 条或多条|

### 9\.3 楼下小剧场配置

|字段语义|必填|类型|示例|来源|说明|
|---|---|---|---|---|---|
|场景配置 ID|是|string|`ob_first_scene_company_v1`|内容配置|当前楼下小剧场|
|地点标题|是|string|`Outside His Company`|内容配置|顶部展示|
|场景背景图|是|image url|`.../company.jpg`|内容配置|全屏背景|
|Backstory / 话外音 1|是|string|`You are outside...`|内容配置|起点展示|
|偶遇原因选项|是|array|3 个 option|内容配置|用户选择后进入实时对话|
|收束台词规则|是|prompt constraint 或模板|三段式|后端 / Prompt|第 5 轮后生成或预设|

偶遇原因选项语义：

|字段语义|必填|类型|说明|
|---|---|---|---|
|选项 ID|是|string|识别本次偶遇原因|
|选项文案|是|string|底部 3 选项展示|
|事件副标题|是|string|例如 `RAIN AND THE UMBRELLA`|
|话外音 2|是|string|选择后展示的扩写旁白|
|角色第一句|是|string|话外音 2 后出现|
|对话上下文标签|否|string|传给后端对话编排层|

### 9\.4 OB 运行态

|字段语义|必填|类型|说明|
|---|---|---|---|
|用户 ID|是|string|当前登录用户|
|OB 总状态|是|enum|是否 completed|
|OB 进度|是|enum|见 6\.2|
|已选角色 ID|否|string|点击 CTA 后必须存在|
|楼下选项 ID|否|string|用户选择偶遇原因后存在，可用于上下文|
|楼下实时对话轮次|否|number|前端内部可维护，不要求恢复|

## 10\. 页面规格

### 10\.1 角色选择页

页面目标：让用户选择首位角色，并进入不可逆 OB 流程。

页面结构：

|区域|内容|
|---|---|
|背景|当前居中角色全屏立绘|
|顶部|Hero 标题 `Unlock the story meant only for you.`|
|左右切换|半透明圆形箭头 `‹` / `›`|
|底部信息卡|角色名 \+ 角色介绍|
|Dots|当前角色位置|
|底部 CTA|`STEP INTO HIS WORLD`|

交互规则：

- 点击左右箭头或左右滑动切换角色。

- 切换到头后无限循环。

- Dots 与当前角色同步。

- 点击 CTA 后立即确认当前角色，写入 `character_selected`。

- CTA 点击后不可返回选择页，不提供 back。

- 未点击 CTA 就退出，下次仍回选择页。

状态：

|状态|展示|
|---|---|
|loading|角色图和信息卡 skeleton|
|normal|正常轮播|
|error|获取角色列表失败时展示错误提示和重试|
|confirming|CTA loading，箭头和滑动禁用|

验收标准：

- 首次进入 OB 展示角色选择页。

- 左右切换能无限循环。

- 点击 CTA 后再次冷启动不回角色选择页。

- 未点击 CTA 退出后再次进入仍在角色选择页。

### 10\.2 梦境入场页

页面目标：展示后台梦境 Backstory，点击后进入预设剧场。

页面结构：

|区域|内容|
|---|---|
|背景|后台化妆间场景图|
|中部卡片|Backstory|
|底部按钮|`CONTINUE`|

交互规则：

- 点击 `CONTINUE` 进入梦境剧场聊天界面。

- 从 `character_selected` 或 `theater_in_progress` 恢复时，均落到本阶段起点。

状态：

|状态|展示|
|---|---|
|loading|背景和文本加载 skeleton|
|normal|Backstory \+ Continue|
|error|配置加载失败时展示重试|

### 10\.3 梦境剧场聊天页

页面目标：完成 5 轮预设选项对话。

页面结构：

|区域|内容|
|---|---|
|背景|后台化妆间场景图，全程不变|
|顶部|Scene name \+ 角色名|
|消息流|Backstory 卡、角色气泡、用户气泡|
|底部|当前轮 3 个选项|

交互规则：

- 进入后展示 Backstory 卡和角色第一句。

- 每轮底部展示 3 个选项。

- 用户点击选项后，该选项变成用户气泡上屏。

- 选项区隐藏，角色出现 `···` 动效约 1\.5s。

- 动效结束后展示该选项对应的角色预设回复。

- 回复展示完后进入下一轮。

- 共 5 轮。第 5 轮角色回复后进入梦境收束。

- 梦境阶段不调用实时 AI。

- 用户不点击选项则不推进。

状态：

|状态|展示|
|---|---|
|waiting\_choice|显示 3 个选项|
|selected|用户气泡已上屏，选项禁用|
|idol\_typing|角色 `···`|
|idol\_replying|展示预设回复|
|closing|进入梦境收束|

验收标准：

- 每轮必须只有 3 个选项。

- 用户点击后选项文案必须作为用户气泡上屏。

- 角色回复必须来自预设配置。

- 任意轮次杀进程后恢复到梦境入场页或剧场起点，不恢复到中间轮。

### 10\.4 梦境收束

页面目标：将梦境打断，进入 ERROR 页。

流程：

1. 第 5 轮角色回复后，展示居中灰色斜体话外音。

2. 展示角色被打断的多条回复。

3. 底部只展示一个用户选项：`Okay. I will wait here for you.`

4. 用户点击该选项后，该文案作为用户气泡上屏。

5. 约 1s 后画面整体变暗。

6. 蒙层上流式展示旁白：`His silhouette breaks apart in front of you. The empty room keeps only the last trace of warmth...`

7. 旁白结束后，屏幕闪烁 3 次。

8. 写入 `theater_done`。

9. 进入 ERROR 页。

交互规则：

- 唯一选项出现后，用户不点则不推进。

- 变暗、旁白、闪烁期间不允许用户输入或返回。

- `theater_done` 后恢复必须落 ERROR 页。

### 10\.5 ERROR 页

页面目标：用梦境异常感衔接现实转场。

页面结构：

|区域|内容|
|---|---|
|背景|深色全屏，可叠加变暗的剧场画面|
|主文案|`[ ERROR: STORY DISTURBED - CONNECTION INTERRUPTED ]`|
|按钮|`[ Reload ]`|

交互规则：

- 点击 `[ Reload ]` 进入转场衔接。

- 不点击则常驻，无自动超时。

- 杀进程后仍恢复到 ERROR 页。

数据来源：

- 文案前端写死。

- 动效前端写死。

### 10\.6 转场衔接页

页面目标：从梦境切换到现实楼下小剧场。

展示顺序：

1. 金色小字 `THEN`

2. 大标题 `-- Hey, careful!`

3. 居中灰字流式文案：`SOMEWHERE FAR AWAY, A SOUND FROM THE REAL WORLD COMES CLOSER, AND EVERYTHING THAT JUST HAPPENED BEGINS TO FEEL LIKE A DREAM...`

4. 按钮 `[ OPEN YOUR EYES -> ]`

交互规则：

- 按区域顺序出现。

- `[ OPEN YOUR EYES -> ]` 在区域 2 完成后出现。

- 点击按钮后写入 `transition_done`。

- 进入楼下小剧场起点。

- 转场页杀进程后，下次恢复到楼下小剧场起点。

### 10\.7 楼下小剧场起点

页面目标：展示现实场景 Backstory，并让用户选择偶遇原因。

页面结构：

|区域|内容|
|---|---|
|背景|Outside His Company 场景图|
|顶部|`Scene` 标签 \+ 地点标题 `Outside His Company`|
|中部|Backstory / 话外音 1 卡片|
|底部|3 个偶遇原因选项|

交互规则：

- 用户点击 1 个偶遇原因。

- 被选原因对应的事件副标题展示到顶部。

- 展示该原因对应的话外音 2。

- 展示角色第一句。

- 角色第一句后，底部输入框激活。

- 写入 `first_scene_in_progress`。

状态：

|状态|展示|
|---|---|
|intro|Backstory \+ 3 选项|
|option\_selected|话外音 2|
|idol\_first\_reply|角色第一句|
|free\_chat|文本输入框激活|

恢复规则：

- `transition_done` 和 `first_scene_in_progress` 都恢复到此起点。

- 不恢复已选的偶遇原因或已聊内容。

### 10\.8 楼下实时对话

页面目标：模拟真实初遇，完成 5 轮文本对话。

对话能力实现方式：

- 本阶段复用主 Chat 对话管线。

- 前端只需要传入本阶段上下文和用户消息。

- 后端或 Prompt 负责让角色回复符合初遇设定。

必须注入的产品约束：

|约束|说明|
|---|---|
|场景|首次偶遇|
|地点|Outside His Company|
|关系|角色不认识用户，用户认识角色|
|情感边界|角色不可表达爱意，不可像老熟人|
|功能限制|禁用语音、电话、图片|
|回复目标|自然、克制、真实初遇|

交互规则：

- 底部仅纯文本输入框。

- 用户发送后输入框禁用。

- 角色气泡显示 `···`。

- 后端返回后展示完整角色回复，输入框重新激活。

- 用户 1 条消息 \+ 角色 1 次回复 = 1 轮。

- 满 5 轮后不再展示输入框，进入收束。

AI / Prompt 说明：

- PRD 不要求前端理解完整 Prompt。

- 产品约束以本节为准。

- 如果 Prompt 输出违反约束，例如角色表达爱意、主动打电话、当作老朋友，视为后端或 Prompt bug。

异常规则：

|场景|处理|
|---|---|
|用户发送中|输入框和发送按钮禁用|
|AI 返回失败或超时|展示 retry icon 或 Toast，允许用户重试当前消息|
|用户杀进程|下次回楼下小剧场起点，已聊内容不保留|
|网络断开|Toast，保留输入内容|

### 10\.9 楼下收束 \+ 加好友

触发条件：

- 用户发送第 5 条消息。

- 角色完成第 5 次回复。

收束气泡规则：

角色必须用一条或多条气泡完成三段式：

1. 回应用户刚才的话。

2. 找理由离开。

3. 提出加联系方式。

示例：

```Plain Text
Ah, my manager is calling me. I should go.
Thank you for just now...
If you don't mind, could we add each other?
```

交互规则：

- 收束气泡出现后，底部输入框消失。

- 底部替换为单个按钮 `Okay`。

- 用户点击 `Okay` 后：

    - 按钮 loading，防重复点击。

    - 调加好友 / 建立关系接口。

    - 成功后 Toast：`Added {character_name} as friend`。

    - 继续执行 OB 完成动作。

失败处理：

|场景|处理|
|---|---|
|加好友接口失败|Toast：`Failed to add friend. Please try again.`，保留 `Okay` 按钮|
|重复点击 Okay|只允许发起一次请求|
|已经加过该角色|后端应幂等成功，前端继续 OB 完成流程|

## 11\. OB 完成动作

用户点 `Okay` 且加好友成功后，执行以下动作。

### 11\.1 后台数据动作

|动作|归属|说明|
|---|---|---|
|建立好友关系|后端|首位角色成为已添加角色|
|写入 `ob_status = completed`|后端|解锁主站|
|写入 `ob_progress = completed`|后端|防止再次进入 OB|
|生成第一张拍立得|后端 / AI|Outside His Company，挂 Home 第 1 张实卡|
|保存 Scene 聊天快照|后端|用于 Memory Replay，只读|
|生成或排队生成拍立得总结|后端 / AI|未完成时 Home 预览展示 loading|
|插入首位角色主动消息|后端|Chat 列表产生未读|

### 11\.2 用户视觉动作

1. Toast：`Added {character_name} as friend`

2. 进入 Home tab。

3. 底部导航 Home 高亮。

4. Home 展示当前角色海报。

5. Home 故事线第 1 张为 OB 首张拍立得。

6. Chat tab 显示未读红点。

### 11\.3 首位角色主动消息

OB 完成后，Chat 中首位角色发送以下未读消息：

```Plain Text
I realized we never properly introduced ourselves.
I'm {character_name}.
Do you mind telling me your name?
```

说明：

- 这组消息是 OB 完成后的系统插入消息，不由前端生成最终内容。

- 前端 mock 时可以本地插入。

- 真实环境由后端创建消息，前端拉取 Chat 列表和消息流。

## 12\. 前端建议页面枚举

前端可按以下 screen key 组织，但不强制：

|Screen key|页面|
|---|---|
|`ob_character_select`|角色选择|
|`ob_dream_intro`|梦境入场|
|`ob_dream_chat`|梦境剧场|
|`ob_dream_error`|ERROR 页|
|`ob_transition`|Reload 后转场|
|`ob_first_scene_intro`|楼下 Backstory \+ 3 选项|
|`ob_first_scene_chat`|楼下实时对话|
|`ob_complete`|完成动作，可不单独成页|

## 13\. 前端 mock 数据建议

以下只是 mock 示例，不代表最终字段名。

```TypeScript
type ObCharacter = {
  id: string;
  displayName: string;
  selectImageUrl: string;
  avatarUrl: string;
  homePosterUrl: string;
  sortOrder: number;
  intro: string;
};

type DreamRoundOption = {
  id: string;
  text: string;
  idolReplies: string[];
};

type DreamRound = {
  id: string;
  options: DreamRoundOption[];
};

type DreamTheaterConfig = {
  id: string;
  sceneName: string;
  backgroundUrl: string;
  backstory: string;
  firstIdolMessage: string;
  rounds: DreamRound[];
  closingVoiceover: string[];
  interruptedIdolReplies: string[];
  finalUserChoice: string;
  glitchVoiceover: string;
};

type FirstSceneOption = {
  id: string;
  text: string;
  eventSubtitle: string;
  expandedVoiceover: string;
  firstIdolMessage: string;
};

type FirstSceneConfig = {
  id: string;
  locationName: string;
  backgroundUrl: string;
  backstory: string;
  options: FirstSceneOption[];
};
```

## 14\. 接口语义

接口名可由后端定义，PRD 只定义调用语义。

|接口语义|调用时机|请求至少包含|成功后前端动作|
|---|---|---|---|
|获取 OB 状态|登录后 / 冷启动|token|按 `ob_status` 和 `ob_progress` 路由|
|更新 OB 进度|进入关键节点时|用户 ID、目标进度、已选角色 ID 可选|本地同步状态|
|获取角色列表|角色选择页|token|渲染角色选择页|
|获取 OB 内容配置|进入 OB 阶段前|角色 ID、配置版本可选|渲染梦境 / 楼下内容|
|OB 楼下对话回复|用户发送楼下文本|角色 ID、用户文本、楼下上下文、轮次|展示角色回复|
|加好友|用户点 `Okay`|角色 ID、来源 `ob`|继续 OB 完成|
|完成 OB|加好友成功后|用户 ID、角色 ID、首个 Scene 摘要信息|进入 Home|
|获取 Home 首张拍立得|Home 拉取|角色 ID|展示故事线|

幂等要求：

- 更新 OB 进度应允许重复写入同一状态。

- 加好友应允许重复请求同一角色，已添加时返回成功。

- 完成 OB 应允许重复调用，已完成时返回 completed。

## 16\. 验收清单

### 16\.1 角色选择

- 首次登录且 OB 未完成时进入角色选择页。

- 角色图、姓名、介绍、dots、CTA 正常展示。

- 左右箭头和滑动能无限循环切换角色。

- 点击 CTA 后角色被确认，不允许返回重新选。

- CTA 请求中不可重复点击。

### 16\.2 梦境剧场

- 梦境阶段不调用实时 AI。

- 入场页点击 `CONTINUE` 后进入剧场聊天。

- 每轮展示 3 个选项。

- 点击选项后选项文案变成用户气泡。

- 角色回复来自预设配置。

- 第 5 轮结束后出现梦境收束。

- 任意轮杀进程后恢复到梦境阶段起点。

### 16\.3 ERROR 与转场

- 点击唯一选项后画面变暗、旁白、闪烁、进入 ERROR。

- ERROR 页不自动消失。

- `theater_done` 状态冷启动直接恢复 ERROR 页。

- 点击 Reload 后进入转场。

- 点击 `[ OPEN YOUR EYES -> ]` 后进入楼下小剧场起点。

### 16\.4 楼下小剧场

- 楼下起点展示 Backstory 和 3 个偶遇原因。

- 点击原因后展示事件副标题、话外音 2、角色第一句。

- 角色第一句后输入框激活。

- OB 楼下不支持图片、语音、电话。

- 用户发送后输入框锁定，角色回复后恢复。

- 满 5 轮后进入收束。

- 楼下任意时刻杀进程后恢复到楼下起点，已聊内容不保留。

### 16\.5 OB 完成

- 第 5 轮收束后输入框被 `Okay` 按钮替换。

- 点击 `Okay` 后调用加好友。

- 加好友成功后 Toast 正确。

- OB 状态变为 completed。

- 默认落地 Home tab。

- Home 出现首位角色和第一张拍立得。

- Chat tab 出现未读红点。

- Chat 列表出现首位角色主动消息。

## 17\. 与其他模块的依赖

|依赖模块|OB 需要什么|
|---|---|
|Login|登录后根据 `ob_status` 和 `ob_progress` 路由|
|Chat|楼下实时对话复用 Chat 文本管线，但禁用图片、语音、电话|
|Home|OB 完成后展示首张拍立得和首位角色海报|
|Memory|首张拍立得和 Scene 快照进入 Memory / Replay 体系|
|Me|OB 未完成前不可访问|
|Scene|楼下小剧场视觉上复用 Scene Visual Novel 规则，但不是普通 Scene 入口|





