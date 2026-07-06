// 演示壳的业务说明数据源（骨架版）
// 说明卡内容来自 /docs 各模块业务 PRD 的精炼要点。
// PM 可持续维护本文件：改摘要卡 = 改 modules；加/改页面热区 = 改 hotspots。
// 完整 PRD 仍以 docs/*.md 为准，卡片底部“查看完整 PRD”会跳到对应文档。

// 本次版本信息（顶部“版本文档”下拉读取）
export const version = {
  name: "Idol 102 1.0",
  tag: "v1.0 · 演示骨架",
  updated: "2026-07-06",
  notes: [
    "主链路：登录 → OB 梦境 → 楼下偶遇加好友 → Home/Chat/Scene/Me 主站闭环。",
    "本演示壳左侧内嵌真实可操作原型，右侧随当前页面显示对应模块业务说明。",
    "开发最终参考物：根目录原型源码（index.html / app.js / src/）。",
  ],
  docs: [
    { label: "项目级总 PRD", href: "../docs/PROJECT_PRD_INDEX.md" },
    { label: "OB 模块 PRD", href: "../docs/OB_MODULE_PRD_BUSINESS.md" },
    { label: "Home 模块 PRD", href: "../docs/HOME_MODULE_PRD_BUSINESS.md" },
    { label: "Chat 模块 PRD", href: "../docs/CHAT_MODULE_PRD_BUSINESS.md" },
    { label: "Scene 模块 PRD", href: "../docs/SCENE_MODULE_PRD_BUSINESS.md" },
    { label: "Me 模块 PRD", href: "../docs/ME_MODULE_PRD_BUSINESS.md" },
    { label: "Login 模块 PRD", href: "../docs/LOGIN_MODULE_PRD_BUSINESS.md" },
    { label: "Trigger Scene PRD", href: "../docs/TRIGGER_SCENE_PRD_BUSINESS.md" },
  ],
};

// 原型页面 id（index.html 中 .screen 的 id）→ 模块 key
export const screenToModule = {
  "screen-splash": "login",
  "screen-select": "ob",
  "screen-dream-intro": "ob",
  "s-ob": "ob",
  "s-transition": "ob",
  "screen-real-scene": "ob",
  "screen-home": "home",
  "screen-chat": "chat",
  "screen-scene": "scene",
  "screen-me": "me",
};

// 模块摘要卡（右侧说明）
export const modules = {
  login: {
    name: "Login · 登录",
    accent: "#70e7ff",
    role: "用户进入 Idol 102 的第一道门。用 Google / Apple / Email 快速进入，登录后自动回到上次应到的位置。",
    keyRules: [
      "支持 Google / Apple / Email 三种登录方式。",
      "登录前可查看并点击 Terms 与 Privacy。",
      "登录状态有效时自动进入上次应到的位置（未完成 OB 则进 OB）。",
    ],
    boundaries: ["登录本身不决定角色如何称呼用户。", "不在此定义鉴权字段与接口。"],
    prd: "../docs/LOGIN_MODULE_PRD_BUSINESS.md",
  },
  ob: {
    name: "OB · 新用户引导",
    accent: "#ff8aae",
    role: "主站解锁前的强制关系建立流程：选首位角色 → 梦境后台小剧场 → 梦醒 → 楼下首次偶遇加好友 → 生成第一张拍立得 → 解锁主站。",
    keyRules: [
      "OB 未完成前，Home / Chat / Scene / Me 不开放。",
      "梦境为点选式对话，3–5 次点击走完；出错可 Reload。",
      "楼下偶遇 8–10 轮内收束到角色主动加联系方式。",
      "完成后默认落地 Home，Chat 出现首位角色首句。",
    ],
    boundaries: ["OB 不是教学流程，是第一段关系。", "偶遇前 5 轮不得主动索要联系方式。"],
    prd: "../docs/OB_MODULE_PRD_BUSINESS.md",
  },
  home: {
    name: "Home · 关系沉淀",
    accent: "#f6cf8b",
    role: "关系沉淀页，不是信息流。展示当前角色海报、昵称、相识天数、故事线日期卡；查看 Moment 拍立得与 Memory Replay。",
    keyRules: [
      "故事线只展示有 moment 的日期卡，不出现空白日期。",
      "Scene 完成后定位到对应日期卡并播放闪烁动效。",
      "拍立得编辑只影响展示层，不改角色记忆与原始聊天快照。",
    ],
    boundaries: ["清空 Chat 不影响 Home 拍立得。", "Home 不承载普通信息流。"],
    prd: "../docs/HOME_MODULE_PRD_BUSINESS.md",
  },
  chat: {
    name: "Chat · 关系延续入口",
    accent: "#b897ff",
    role: "关系延续主入口，不是普通 IM。日常文本/图片消息、角色语音、角色来电；Discover Members 添加角色；承接 Scene 邀请。",
    keyRules: [
      "用户不能主动发语音、不能主动打电话；语音/电话只由角色侧触发。",
      "Chat 是 Scene 邀请的承接入口（发起 / Trigger 都在此展示卡片）。",
      "清空聊天记录不影响好友关系、海报、拍立得、Scene 历史、角色设置。",
    ],
    boundaries: ["Chat Settings 改角色资料，不改用户资料。", "角色语音/电话声音始终为角色母语。"],
    prd: "../docs/CHAT_MODULE_PRD_BUSINESS.md",
  },
  scene: {
    name: "Scene · 共同经历系统",
    accent: "#70e7ff",
    role: "共同经历系统，不是普通地图。用户发起或被角色 Trigger 邀请，去某地点经历某事件，结束后生成拍立得沉淀到 Home。",
    keyRules: [
      "同一时间只能有 1 个 Active Scene。",
      "Active Scene 只锁当前角色普通 Chat，不锁其他角色 Chat。",
      "Scene 内不支持图片、语音、电话。",
      "每次 Scene 结束都必须生成拍立得。",
    ],
    boundaries: ["Scene 不产生共同经历就等于失败。", "Trigger 运行规则见 Trigger Scene PRD。"],
    prd: "../docs/SCENE_MODULE_PRD_BUSINESS.md",
  },
  me: {
    name: "Me · 用户资料与账号",
    accent: "#a99aa8",
    role: "用户自己的资料和账号管理页。管理头像、背景、昵称、UID、邮箱、Default Language、反馈、条款、登出、注销。",
    keyRules: [
      "Default Language 影响文本/字幕/App 文案语言，不影响角色语音与电话声音语言。",
      "Me 改头像后同步到 Chat 用户消息气泡旁头像。",
      "Me 昵称只影响 UI 展示，不决定角色如何称呼用户。",
    ],
    boundaries: ["Me 修改用户资料，不影响角色资料。", "注销为不可逆操作，需二次确认。"],
    prd: "../docs/ME_MODULE_PRD_BUSINESS.md",
  },
};

// 可点击热区：按原型页面 id → 该页 UI 板块的选择器 + 说明
// selector 相对 iframe 内文档；PM 可继续补全其他页面（标 TODO 的为待补）。
export const hotspots = {
  "screen-splash": [
    { selector: ".splash-copy", title: "品牌与主张", desc: "OPPAYA 品牌区，传达“a different kind of closeness”的产品调性，登录前先建立情绪。" },
    { selector: ".login-card", title: "登录方式", desc: "Google / Apple / Email 三种快捷登录。登录前可查看 Terms 与 Privacy。" },
  ],
  "screen-select": [
    { selector: "#memberSlider", title: "首位角色轮播", desc: "用户在此选择第一个想靠近的角色，决定后续 OB 剧情主体。" },
    { selector: ".primary.fixed-bottom", title: "进入他的世界", desc: "确认首位角色，进入梦境 OB。" },
  ],
  "screen-home": [
    { selector: "#homePoster", title: "角色海报", desc: "当前角色海报，可在 Chat Settings 修改并同步到此处。" },
    { selector: "#posterName", title: "角色昵称", desc: "当前角色昵称，Chat Settings 改昵称后此处同步。" },
    { selector: "#posterTopDays", title: "相识天数", desc: "从首次相遇累计的天数，体现关系“被时间记录”。" },
    { selector: ".stage-capsule", title: "关系阶段", desc: "当前关系阶段标签（如 Stage 1: Familiar）。" },
    { selector: "#chronicleTimeline", title: "故事线", desc: "按日期聚合的故事线日期卡，只展示有 moment 的日期。" },
  ],
  "screen-chat": [
    { selector: ".chat-topbar", title: "会话头部", desc: "当前角色头像、昵称与关系模式；右上可切到 Scene。" },
    { selector: "#chatMessages", title: "消息流", desc: "长期聊天记录。角色可发文本/图片/语音，用户不能主动发语音或打电话。" },
    { selector: ".chat-input-row", title: "输入区", desc: "用户仅发送文本消息。语音与电话只由角色侧触发。" },
  ],
  "screen-scene": [
    { selector: ".scene-list article:first-child", title: "地点卡（已发生）", desc: "已经共同经历过的地点，点开可回看。" },
    { selector: ".scene-list article:nth-child(2)", title: "地点卡（待解锁）", desc: "尚未解锁的地点，随关系推进开放。" },
  ],
  "screen-me": [
    { selector: ".me-profile-card", title: "个人资料卡", desc: "头像、背景、昵称、UID、邮箱。改头像后同步到 Chat 气泡。" },
    { selector: ".me-function-list", title: "账号功能区", desc: "评分、反馈、隐私、条款、登出、注销。注销为不可逆操作。" },
  ],
  // TODO(PM): screen-dream-intro / s-ob / s-transition / screen-real-scene 的热区待补
};
