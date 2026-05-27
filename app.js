import { AppRouter } from "./src/core/router.js";
import { createStore } from "./src/core/store.js";
import { createRealMeetModule } from "./src/modules/realMeet.js";
import { createSceneModule } from "./src/modules/scene.js";
import { createChatModule } from "./src/modules/chat.js";
import { buildFriendBreakIce, normalizeMemoryObject, persistMemoryCapsules } from "./src/modules/home.js";
import { characterImages } from "./src/ui/image-library.js";

const members = [
  {
    id: "bang_chan",
    name: "Bang Chan",
    kr: "방찬",
    initial: "BC",
    image: characterImages.bang_chan,
    hook: "他像是会照顾所有人，可如果有一天他把疲惫只留给你看，那就不一样了。",
  },
  {
    id: "lee_know",
    name: "Lee Know",
    kr: "리노",
    initial: "LK",
    image: characterImages.lee_know,
    hook: "他不常说软话，但会用很小的动作证明：他其实一直在意。",
  },
  {
    id: "changbin",
    name: "Changbin",
    kr: "창빈",
    initial: "CB",
    image: characterImages.changbin,
    hook: "舞台上攻击性很强，私下却会认真问你有没有吃饭，还记得你上次说过什么。",
  },
  {
    id: "hyunjin",
    name: "Hyunjin",
    kr: "현진",
    initial: "HJ",
    image: characterImages.hyunjin,
    hook: "他像一场漂亮又危险的雨，靠近时会让你怀疑自己是不是被特别看见了。",
  },
  {
    id: "han",
    name: "Han",
    kr: "한",
    initial: "H",
    image: characterImages.han,
    hook: "他可以把玩笑说得很快，也可以在突然安静下来时，只把真实留给你。",
  },
  {
    id: "felix",
    name: "Felix",
    kr: "필릭스",
    initial: "F",
    image: characterImages.felix,
    hook: "他的温柔不是营业感，是深夜灯灭以后，还会让人想相信世界没那么坏。",
  },
  {
    id: "seungmin",
    name: "Seungmin",
    kr: "승민",
    initial: "SM",
    image: characterImages.seungmin,
    hook: "他嘴上不饶人，但认真起来很稳；越熟，越会把关心藏在一句玩笑里。",
  },
  {
    id: "in",
    name: "I.N",
    kr: "아이엔",
    initial: "IN",
    image: characterImages.in,
    hook: "他看起来最年轻，却很清楚自己要什么；一旦信任，就会很直接地站到你这边。",
  },
];

const initialState = {
  route: "splash",
  currentUserProgress: {
    stage: "splash",
    selectedMemberId: members[0].id,
    completedDream: false,
    completedFirstScene: false,
  },
  activeChatAgent: members[0].id,
  addedCharacters: [],
  unaddedCharacters: members.slice(1),
  pendingFriendRequests: [],
  hasNotification: false,
  officialFriends: [],
  relationshipStages: {},
  unlockedStoryLines: {},
  unlockedScenes: ["jyp"],
  pageCache: {
    chat: { draft: "", scrollTop: 0 },
    "real-scene": { scrollTop: 0 },
    dream: { scrollTop: 0 },
  },
  selectedIndex: 0,
  selected: members[0],
  userId: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
  idolId: members[0].id,
  userPortrait: {
    basic: {},
    preferences: [],
    boundaries: [],
  },
  relationshipPortrait: {
    sharedMemories: [],
    openThreads: [],
    currentTone: "刚刚认识，真实世界的第一条线",
  },
  realHistory: [],
  dreamBranch: null,
  realBranch: null,
  realTurn: 0,
  chatStarted: false,
  chatBusy: false,
  chatUnread: false,
  posterAlt: false,
};

const store = createStore(initialState);
const state = store.getState();

const screens = ["splash", "select", "dream-intro", "dream", "wake", "real-scene", "home", "chat", "scene", "me"];
const screenElementId = {
  splash: "screen-splash",
  select: "screen-select",
  "dream-intro": "screen-dream-intro",
  dream: "s-ob",
  wake: "s-transition",
  "real-scene": "screen-real-scene",
  home: "screen-home",
  chat: "screen-chat",
  scene: "screen-scene",
  me: "screen-me",
};
const appScreens = new Set(["home", "chat", "scene", "me"]);
let router;
let realMeetModule;
let sceneModule;
let chatModule;

function $(id) {
  return document.getElementById(id);
}

function setAppState(patchOrUpdater) {
  store.setState(patchOrUpdater);
}

function selectMember(index) {
  const selected = members[index];
  state.selectedIndex = index;
  state.selected = selected;
  state.idolId = selected.id;
  setAppState({
    selectedIndex: index,
    selected,
    idolId: selected.id,
    activeChatAgent: selected.id,
    currentUserProgress: {
      ...state.currentUserProgress,
      selectedMemberId: selected.id,
    },
  });
}

function patchProgress(patch) {
  setAppState((current) => ({
    currentUserProgress: {
      ...current.currentUserProgress,
      ...patch,
    },
  }));
}

function patchPageCache(page, patch) {
  setAppState((current) => ({
    pageCache: {
      ...current.pageCache,
      [page]: {
        ...(current.pageCache[page] || {}),
        ...patch,
      },
    },
  }));
}

function show(screen, options) {
  router.navigate(screen, options);
}

function createPageController() {
  router = new AppRouter({ store, screens, screenElementId, appScreens });
  realMeetModule = createRealMeetModule({
    getState: () => state,
    setAppState,
    getElement: $,
    appendBubble,
    layoutChoiceChat,
    showToast,
    navigate: show,
  });
  sceneModule = createSceneModule({
    getState: () => state,
    setState: setAppState,
    router: { go: show, navigate: show },
  });
  chatModule = createChatModule({
    getState: () => state,
    setState: setAppState,
    router: { go: show, navigate: show },
  });

  screens.forEach((screen) => router.register(screen));

  router.register("dream", {
    onEnter: () => startDream(),
    onLeave: () => {
      patchPageCache("dream", { scrollTop: $("dreamMessages")?.scrollTop || 0 });
    },
  });

  router.register("wake", {
    onEnter: () => startTransitionStream(),
    onLeave: () => {
      if (transitionStreamTimer) clearTimeout(transitionStreamTimer);
    },
  });

  router.register("real-scene", {
    onEnter: () => startRealScene(),
    onLeave: () => {
      patchPageCache("real-scene", { scrollTop: $("realMessages")?.scrollTop || 0 });
    },
  });

  router.register("home", {
    render: () => renderHome(),
  });

  router.register("scene", {
    onEnter: () => sceneModule.onEnter(),
    onLeave: () => sceneModule.onLeave(),
  });

  router.register("chat", {
    render: () => {
      updateNavDots();
    },
    onEnter: () => chatModule.onEnter(),
    onLeave: () => chatModule.onLeave(),
  });

  router.register("me", {
    render: () => renderMe(),
  });
}

function renderShell(currentState) {
  if (currentState.route === "chat" && state.activeChatAgent) return;
  $("bottomNav")?.classList.toggle("hidden", !appScreens.has(currentState.route));
  document.querySelectorAll("#bottomNav button").forEach((button) => {
    button.classList.toggle("active", button.dataset.nav === currentState.route);
  });
  updateNavDots();
}

function shouldStartInAppPreview() {
  const params = new URLSearchParams(window.location.search);
  return params.get("preview") === "app" || params.get("mode") === "app";
}

function bootstrapAppPreview() {
  const previewMember = members.find((member) => member.id === "bang_chan") || members[0];
  const previewIndex = members.findIndex((member) => member.id === previewMember.id);
  const previewMessage = "对了，刚刚忘了问你，你叫什么名字啊😊";

  state.selectedIndex = previewIndex;
  state.selected = previewMember;
  state.idolId = previewMember.id;
  state.realBranch = "rain";
  state.chatStarted = false;
  state.chatUnread = true;
  state.relationshipPortrait.sharedMemories = [buildFirstMemoryText()];

  setAppState({
    route: "home",
    selectedIndex: previewIndex,
    selected: previewMember,
    idolId: previewMember.id,
    activeChatAgent: previewMember.id,
    chatUnread: true,
    officialFriends: [
      {
        id: previewMember.id,
        name: previewMember.name,
        initial: previewMember.initial,
        image: previewMember.image,
        unread: true,
        hasNewMsg: true,
        lastMsg: previewMessage,
        previewText: previewMessage,
        relationshipStage: "Stage 1: 熟悉",
      },
    ],
    addedCharacters: [previewMember],
    unaddedCharacters: members.filter((member) => member.id !== previewMember.id),
    pendingFriendRequests: [],
    hasNotification: false,
    unlockedContacts: {
      [previewMember.id]: {
        id: previewMember.id,
        name: previewMember.name,
        initial: previewMember.initial,
        image: previewMember.image,
        hasNewMsg: true,
        lastMsg: previewMessage,
      },
    },
    relationshipStages: {
      [previewMember.id]: "Stage 1: 熟悉",
    },
    unlockedScenes: ["jyp", "rain", "coffee_shop", "park", "convenience_store", "practice_room"],
    unlockedStoryLines: {
      [previewMember.id]: ["jyp_first_meet"],
    },
    currentUserProgress: {
      ...state.currentUserProgress,
      stage: "home",
      phase: "main-app",
      selectedMemberId: previewMember.id,
      completedDream: true,
      completedFirstScene: true,
    },
    chatStreams: {
      [previewMember.id]: [{ id: "preview-first-message", role: "idol", text: previewMessage, createdAt: new Date().toISOString() }],
    },
  });
}

function showToast(text) {
  const toast = $("toast");
  toast.textContent = text;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 1800);
}

let memberSliderIndex = 1;
let memberSliderBusy = false;

function memberSlideHtml(member) {
  return `
    <article class="member-slide">
      <img src="${member.image}" alt="${member.name}" />
      <div class="member-info">
        <h3>${member.name}</h3>
        <p>${member.hook}</p>
      </div>
    </article>
  `;
}

function renderMembers() {
  const loopSlides = [members[members.length - 1], ...members, members[0]];
  $("memberSlider").innerHTML = loopSlides.map((member) => memberSlideHtml(member)).join("");
  $("memberDots").innerHTML = members
    .map((_, index) => `<button class="${index === state.selectedIndex ? "active" : ""}" data-dot="${index}"></button>`)
    .join("");
  memberSliderIndex = state.selectedIndex + 1;
  setMemberSliderPosition(memberSliderIndex, false);
  updateMemberDots();
}

function setMemberSliderPosition(index, animate = true) {
  const slider = $("memberSlider");
  if (!slider) return;
  slider.style.transition = animate ? "transform .35s ease" : "none";
  slider.style.transform = `translateX(-${index * 100}%)`;
  if (!animate) {
    slider.offsetHeight;
    slider.style.transition = "transform .35s ease";
  }
}

function memberIndexFromSlider(sliderIndex = memberSliderIndex) {
  if (sliderIndex === 0) return members.length - 1;
  if (sliderIndex === members.length + 1) return 0;
  return sliderIndex - 1;
}

function syncMemberFromSliderIndex() {
  const realIndex = memberIndexFromSlider();
  selectMember(realIndex);
  updateMemberDots();
}

function updateMemberDots() {
  document.querySelectorAll("#memberDots [data-dot]").forEach((dot) => {
    dot.classList.toggle("active", Number(dot.dataset.dot) === state.selectedIndex);
  });
}

function onMemberSliderTransitionEnd(event) {
  if (event.target !== $("memberSlider") || event.propertyName !== "transform") return;

  if (memberSliderIndex === 0) {
    memberSliderIndex = members.length;
    setMemberSliderPosition(memberSliderIndex, false);
  } else if (memberSliderIndex === members.length + 1) {
    memberSliderIndex = 1;
    setMemberSliderPosition(memberSliderIndex, false);
  }

  memberSliderBusy = false;
  syncMemberFromSliderIndex();
}

function pickMember(delta) {
  if (memberSliderBusy) return;
  memberSliderBusy = true;
  memberSliderIndex += delta;
  setMemberSliderPosition(memberSliderIndex, true);
  syncMemberFromSliderIndex();
}

function initMemberSlider() {
  const slider = $("memberSlider");
  if (!slider || slider.dataset.loopReady === "1") return;
  slider.dataset.loopReady = "1";
  slider.addEventListener("transitionend", onMemberSliderTransitionEnd);
}

function appendBubble(containerId, type, text) {
  const bubble = document.createElement(type === "idol" ? "div" : "div");
  bubble.className = type === "idol" ? "bubble-row idol-row" : `bubble ${type}`;
  if (type === "idol") {
    const avatar = document.createElement("img");
    avatar.className = "bubble-avatar";
    avatar.src = state.selected?.image || "";
    avatar.alt = state.selected?.name || "idol";
    const content = document.createElement("div");
    content.className = "bubble idol";
    content.textContent = text;
    bubble.append(avatar, content);
    $(containerId).appendChild(bubble);
    $(containerId).scrollTop = $(containerId).scrollHeight;
    return;
  }
  bubble.textContent = text;
  $(containerId).appendChild(bubble);
  $(containerId).scrollTop = $(containerId).scrollHeight;
}

function createIdolBubble(text = "") {
  const row = document.createElement("div");
  row.className = "bubble-row idol-row";
  const avatar = document.createElement("img");
  avatar.className = "bubble-avatar";
  avatar.src = state.selected?.image || "";
  avatar.alt = state.selected?.name || "idol";
  const content = document.createElement("div");
  content.className = "bubble idol";
  content.textContent = text;
  row.append(avatar, content);
  return row;
}

const choiceMessagePairs = {
  dreamChoices: "dreamMessages",
  realChoices: "realMessages",
};

function setChoices(containerId, choices) {
  const container = $(containerId);
  container.innerHTML = choices.map((choice, index) => `<button data-choice="${index}">${choice.label}</button>`).join("");
  container.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => choices[Number(button.dataset.choice)].run());
  });
  const messagesId = choiceMessagePairs[containerId];
  if (messagesId) layoutChoiceChat(messagesId, containerId);
}

const illusionConfig = {
  intro:
    "耳鸣声还没褪去，万人体育场的欢呼似乎还在墙壁外震动。你推开那扇虚掩的门，他正独自坐在镜子前，舞台装还没换下，汗水顺着脖颈没入领口。",
  opening: "……你还是找进来了。我就知道，这种地方拦不住你。",
  rounds: [
    {
      choices: [
        "外面的保安太笨了，我说是你家属就放行了。",
        "不想在台下看你了，离得太远，看不清你的眼睛。",
        "(沉默地走过去，把手搭在他的肩膀上)",
      ],
      replies: [
        ["家属？", "(他低头轻笑，玩味着这个词)", "胆子真大……不过，如果是你的话，这个身份我倒是不讨厌。"],
        ["看不清吗？", "明明刚才在台上，我一眼就看到你在哪了。", "过来，再靠近一点。"],
        ["(他身体微微僵了一下，随即放松，反手覆在你的手背上)", "这么主动？舞台后的我，可是很危险的。"],
      ],
    },
    {
      choices: [
        "舞台上的你，和现在的你，哪一个是真的？",
        "再靠近的话，我怕你会听到我的心跳声。",
        "刚才那首情歌，你是看着我唱的吗？",
      ],
      replies: [
        ["都是我。", "但只有现在的我，是只属于你一个人的。你想看哪一面，我都可以给你。"],
        ["心跳声？", "那种东西，我刚才在台上就已经跳得快要疯掉了。", "不信的话，你摸摸看？"],
        ["除了你，我还能看谁呢？", "歌词里写的每一个字，其实都是我想对你说的私心。"],
      ],
    },
    {
      choices: [
        "真的什么都可以吗？包括吻你？",
        "我想让你把这个晚上的时间都给我。",
        "(拨弄他汗湿的发丝) 我想看你卸下伪装的样子。",
      ],
      replies: [
        ["如果你敢的话。", "不过，我可不保证吻了之后，你还能安全地走出这扇门。"],
        ["贪心的小猫。", "但我喜欢这种贪心……今晚剩下的时间，本来就没打算留给别人。"],
        ["(他闭上眼，像是在短暂享受你的触碰)", "只有在你面前，我才不需要任何伪装。现在的我，是不是比镜头前更让你心动？"],
      ],
    },
    {
      choices: [
        "(闭上眼，慢慢向他靠近)",
        "你这种引诱别人的样子，练习过很多次了吗？",
        "算了，我怕我上瘾。",
      ],
      replies: [
        ["(他低头捕捉你的气息，鼻尖轻轻蹭过你的)", "这样就满足了吗？我想要的……可比这多得多。"],
        ["练习？这种事还需要练习吗？", "看到你的时候，所有的本能都在教我怎么让你留下来。"],
        ["上瘾也没关系。", "反正，我也已经戒不掉你了。"],
      ],
    },
    {
      choices: ["那你现在还克制什么？", "如果我不让你走呢？", "(没有说话，只是更近地看着他)"],
      replies: [
        ["既然你提到了……那我就不再克制了。", "(他的手刚要扶住你的后颈)"],
        ["既然你提到了……那我就不再克制了。", "(他的手刚要扶住你的后颈)"],
        ["既然你提到了……那我就不再克制了。", "(他的手刚要扶住你的后颈)"],
      ],
      final: true,
    },
  ],
};

let illusionRound = 0;
let dreamReloadReady = false;
let transitionStreamTimer = null;
const dreamAudio = { ctx: null, gain: null, source: null };

function startDreamAmbience() {
  stopDreamAmbience();
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      data[i] = (Math.random() * 2 - 1) * 0.22;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 520;
    filter.Q.value = 0.45;
    const gain = ctx.createGain();
    gain.gain.value = 0.055;
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
    dreamAudio.ctx = ctx;
    dreamAudio.gain = gain;
    dreamAudio.source = noise;
    if (ctx.state === "suspended") ctx.resume();
  } catch {
    /* ambience optional */
  }
}

function fadeDreamAmbience(durationMs = 2600) {
  if (!dreamAudio.gain || !dreamAudio.ctx) return;
  const gain = dreamAudio.gain.gain;
  const now = dreamAudio.ctx.currentTime;
  gain.cancelScheduledValues(now);
  gain.setValueAtTime(gain.value, now);
  gain.linearRampToValueAtTime(0, now + durationMs / 1000);
}

function stopDreamAmbience() {
  try {
    dreamAudio.source?.stop();
    dreamAudio.ctx?.close();
  } catch {
    /* ignore */
  }
  dreamAudio.ctx = null;
  dreamAudio.gain = null;
  dreamAudio.source = null;
}

function appendVoiceover(containerId, text) {
  appendBubble(containerId, "voiceover", text);
}

function appendTypewriterVoiceover(containerId, text, done) {
  const bubble = document.createElement("div");
  bubble.className = "bubble voiceover typewriter";
  $(containerId).appendChild(bubble);
  scrollChatToEnd(containerId);
  typewriterLine(bubble, text, () => {
    bubble.classList.remove("typewriter");
    done?.();
  });
}

function pulseDreamGlitch(times = 2) {
  const screen = $("s-ob");
  if (!screen) return;
  let count = 0;
  const pulse = () => {
    screen.classList.add("glitch-flash");
    setTimeout(() => {
      screen.classList.remove("glitch-flash");
      count += 1;
      if (count < times) setTimeout(pulse, 220);
    }, 200);
  };
  pulse();
}

function pulseDreamGlitchFor(durationMs = 3000, done) {
  const screen = $("s-ob");
  if (!screen) {
    done?.();
    return;
  }
  const startedAt = Date.now();
  const pulse = () => {
    screen.classList.add("glitch-flash");
    setTimeout(() => {
      screen.classList.remove("glitch-flash");
      if (Date.now() - startedAt < durationMs) {
        setTimeout(pulse, 220);
        return;
      }
      done?.();
    }, 200);
  };
  pulse();
}

function resetDreamScreenState() {
  const screen = $("s-ob");
  if (!screen) return;
  screen.classList.remove("dream-darkened", "dream-error-active", "dream-exiting", "glitching", "glitch-flash");
  $("dreamDimVeil")?.classList.remove("active");
  $("dreamSceneBg")?.classList.remove("dream-bloom");
  const overlay = $("dreamErrorOverlay");
  overlay?.classList.add("hidden");
  overlay?.classList.remove("fading-out", "typing");
  const errorText = overlay?.querySelector(".dream-error-text");
  if (errorText) errorText.textContent = "[ ERROR: STORY DISTURBED - CONNECTION INTERRUPTED ]";
  dreamReloadReady = false;
}

function showDreamErrorOverlay() {
  const screen = $("s-ob");
  screen?.classList.add("dream-error-active");
  const overlay = $("dreamErrorOverlay");
  overlay?.classList.remove("hidden", "typing");
  const errorText = overlay?.querySelector(".dream-error-text");
  if (errorText) errorText.textContent = "[ ERROR: STORY DISTURBED - CONNECTION INTERRUPTED ]";
  dreamReloadReady = true;
}

function playDreamCollapse() {
  const dissolveVoiceover = "他的身影碎裂在眼前，空荡的房间只剩下余温……";
  const screen = $("s-ob");
  const overlay = $("dreamErrorOverlay");
  const errorText = overlay?.querySelector(".dream-error-text");

  $("dreamChoices").innerHTML = "";
  layoutChoiceChat("dreamMessages", "dreamChoices");
  screen?.classList.add("dream-darkened", "dream-error-active");
  $("dreamDimVeil")?.classList.add("active");
  overlay?.classList.remove("hidden", "fading-out");
  overlay?.classList.add("typing");
  if (!errorText) return;

  errorText.textContent = "";
  typewriterLineWithDuration(errorText, dissolveVoiceover, 2000, () => {
    fadeDreamAmbience(1100);
    setTimeout(() => {
      pulseDreamGlitch(3);
      setTimeout(() => {
        overlay?.classList.remove("typing");
        errorText.textContent = "[ ERROR: STORY DISTURBED - CONNECTION INTERRUPTED ]";
        dreamReloadReady = true;
      }, 1460);
    }, 450);
  });
}

function onDreamReload() {
  if (!dreamReloadReady) return;
  dreamReloadReady = false;

  const screen = $("s-ob");
  const overlay = $("dreamErrorOverlay");
  overlay?.classList.add("fading-out");
  screen?.classList.add("dream-exiting");

  setTimeout(() => {
    stopDreamAmbience();
    resetDreamScreenState();
    patchProgress({ completedDream: true, stage: "wake" });
    show("wake");
  }, 700);
}

const transitionLines = [
  "隐约间，",
  "现实世界的某种声音由远及近，",
  "刚才的一切，",
  "就像是一场梦一样……",
];

function typewriterLine(el, text, done) {
  let index = 0;
  const tick = () => {
    el.textContent = text.slice(0, index);
    index += 1;
    if (index <= text.length) {
      transitionStreamTimer = setTimeout(tick, 42);
      return;
    }
    done?.();
  };
  tick();
}

function typewriterLineWithDuration(el, text, durationMs, done) {
  let index = 0;
  const interval = Math.max(28, Math.round(durationMs / Math.max(text.length, 1)));
  const tick = () => {
    el.textContent = text.slice(0, index);
    index += 1;
    if (index <= text.length) {
      transitionStreamTimer = setTimeout(tick, interval);
      return;
    }
    done?.();
  };
  tick();
}

function startTransitionStream() {
  const stream = $("transitionStream");
  const tap = document.querySelector("#s-transition .transition-tap");
  if (!stream) return;

  if (transitionStreamTimer) clearTimeout(transitionStreamTimer);
  stream.innerHTML = "";
  tap?.classList.add("hidden");

  let lineIndex = 0;
  const showNext = () => {
    if (lineIndex >= transitionLines.length) {
      tap?.classList.remove("hidden");
      return;
    }
    const line = document.createElement("p");
    line.className = "transition-line";
    stream.appendChild(line);
    typewriterLine(line, transitionLines[lineIndex], () => {
      lineIndex += 1;
      transitionStreamTimer = setTimeout(showNext, 420);
    });
  };

  showNext();
}

function enterRealityWithWhiteFlash() {
  const flash = $("whiteWakeTransition");
  flash?.classList.remove("hidden", "reveal-out");
  flash?.classList.add("flash-in");
  patchProgress({ stage: "real-scene" });

  setTimeout(() => {
    show("real-scene");
    flash?.classList.remove("flash-in");
    flash?.classList.add("reveal-out");
  }, 680);

  setTimeout(() => {
    flash?.classList.add("hidden");
    flash?.classList.remove("reveal-out");
  }, 2300);
}

function playDreamFinale() {
  const idolName = state.selected.name;
  const knockVoiceover = `（突然，门外响起了工作人员急促的敲门声：“${idolName}！舞台倒计时了，造型师在到处找你，快出来！”）`;
  const idolFarewellLines = ["啧，真是煞风景……", "在这等我", "哪也不许去，知道吗？"];

  $("dreamChoices").innerHTML = "";
  layoutChoiceChat("dreamMessages", "dreamChoices");

  appendTypewriterVoiceover("dreamMessages", knockVoiceover, () => {
    const typing = createIdolBubble("…");
    $("dreamMessages").appendChild(typing);
    scrollChatToEnd("dreamMessages");

    setTimeout(() => {
      typing.remove();
      idolFarewellLines.forEach((line, index) => {
        setTimeout(() => {
          appendBubble("dreamMessages", "idol", line);
          scrollChatToEnd("dreamMessages");
        }, 560 * index);
      });

      setTimeout(() => {
        setChoices("dreamChoices", [
          {
            label: "好，我在这里等你回来。",
            run: () => {
              appendBubble("dreamMessages", "user", "好，我在这里等你回来。");
              setTimeout(() => playDreamCollapse(), 520);
            },
          },
        ]);
      }, 560 * idolFarewellLines.length + 700);
    }, 2000);
  });
}

function startDream() {
  resetDreamScreenState();
  $("dreamMemberName").textContent = state.selected.name;
  $("dreamMessages").innerHTML = "";
  $("dreamChoices").innerHTML = "";
  illusionRound = 0;
  startDreamAmbience();
  appendBubble("dreamMessages", "system", illusionConfig.intro);
  setTimeout(() => appendBubble("dreamMessages", "idol", illusionConfig.opening), 1000);
  setTimeout(() => renderIllusionChoices(), 1800);
}

function scrollChatToEnd(containerId) {
  const container = $(containerId);
  if (!container) return;
  requestAnimationFrame(() => {
    container.scrollTop = container.scrollHeight;
  });
}

function layoutChoiceChat(messagesId, choicesId) {
  const messages = $(messagesId);
  const choices = $(choicesId);
  if (!messages || !choices) return;

  const screen = messages.closest(".dream-chat-screen, .real-scene-screen");
  screen?.classList.toggle("has-choices", choices.children.length > 0);
  scrollChatToEnd(messagesId);
}

function renderIllusionChoices() {
  const round = illusionConfig.rounds[illusionRound];
  setChoices(
    "dreamChoices",
    round.choices.map((choice, index) => ({
      label: choice,
      run: () => handleIllusionChoice(index),
    })),
  );
}

function handleIllusionChoice(index) {
  const round = illusionConfig.rounds[illusionRound];
  $("dreamChoices").innerHTML = "";
  layoutChoiceChat("dreamMessages", "dreamChoices");
  appendBubble("dreamMessages", "user", round.choices[index]);
  const replies = round.replies[index];
  replies.forEach((line, replyIndex) => {
    setTimeout(() => appendBubble("dreamMessages", "idol", line), 650 * (replyIndex + 1));
  });
  const delay = 650 * replies.length + 550;
  if (round.final) {
    setTimeout(() => playDreamFinale(), delay);
    return;
  }
  illusionRound += 1;
  setTimeout(() => {
    scrollChatToEnd("dreamMessages");
    renderIllusionChoices();
  }, delay);
}

function startRealScene() {
  realMeetModule.start({ idol: state.selected });
}

function realOpening(branch) {
  state.realBranch = branch;
  $("realChoices").innerHTML = "";
  const userSetup = {
    coffee: "公司楼下的咖啡厅人很多。你低头看订单时，才发现手里的冰美式好像不是你的。",
    rain: "雨突然砸下来。你没带伞，只能站在公司屋檐下等它小一点。",
    bookstore: "街角书店很安静。你伸手去拿最后一本书时，另一只手也刚好碰到书脊。",
  }[branch];
  appendBubble("realMessages", "system", userSetup);
  $("realSceneSub").textContent =
    branch === "coffee" ? "同款咖啡" : branch === "rain" ? "突降暴雨" : "街角书店";
  const idolLines = {
    coffee: ["那个……不好意思，你手里那杯好像是我的？我点的是加浓缩的……"],
    rain: ["雨下得很大呢。如果不介意的话，要一起打伞走到地铁站吗？"],
    bookstore: ["你也喜欢这位作家的书吗？很少见到能在这里遇到同好。"],
  }[branch];
  idolLines.forEach((line, index) => {
    setTimeout(() => {
      appendBubble("realMessages", "idol", line);
      state.realHistory.push({ role: "idol", content: line });
    }, 700 * (index + 1));
  });
  setTimeout(() => showRealInput(), 1800);
}

function showRealInput() {
  $("realChoices").innerHTML = `
    <form id="realForm" class="scene-free-input">
      <input id="realInput" autocomplete="off" placeholder="回应他…" />
      <button type="submit" aria-label="发送"><span aria-hidden="true"></span></button>
    </form>
  `;
  $("realForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("realInput");
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    realReply(text);
  });
  layoutChoiceChat("realMessages", "realChoices");
  setTimeout(() => $("realInput")?.focus(), 80);
}

async function realReply(text) {
  appendBubble("realMessages", "user", text);
  state.realHistory.push({ role: "user", content: text });
  state.realTurn += 1;

  if (state.realTurn >= 5) {
    $("realChoices").innerHTML = "";
    layoutChoiceChat("realMessages", "realChoices");
    setTimeout(() => forceRealityEnding(), 700);
    return;
  }

  const typing = createIdolBubble("…");
  $("realMessages").appendChild(typing);
  $("realMessages").scrollTop = $("realMessages").scrollHeight;

  try {
    const response = await fetch("/api/scene", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        branch: state.realBranch,
        idol: state.selected,
        history: state.realHistory,
        turn: state.realTurn,
      }),
    });
    const data = await response.json();
    const reply = data.reply || fallbackSceneReply();
    typing.querySelector(".bubble")?.replaceChildren(document.createTextNode(reply));
    state.realHistory.push({ role: "idol", content: reply });
  } catch {
    const reply = fallbackSceneReply();
    typing.textContent = reply;
    state.realHistory.push({ role: "idol", content: reply });
  }
}

function fallbackSceneReply() {
  if (state.realBranch === "coffee") {
    if (state.realTurn === 1) return "嘘——没关系的，不用道歉。不过这杯咖啡现在可能太苦了。你不介意的话，我重新请你喝一杯？";
    return "他看了一眼你手里的杯子，笑得很轻。下次我会看清楚名字再拿。";
  }
  if (state.realBranch === "rain") {
    if (state.realTurn === 1) return "不麻烦，顺路而已。而且，让你在雨里等这么久，也不太合适。";
    return "他把伞往你这边偏了一点。走慢一点，地上有点滑。";
  }
  if (state.realTurn === 1) return "他有些惊喜地挑了挑眉。看来我们不仅品味一致，你还很细心。既然只有一本了，那就先让给你吧。";
  return "他把那本书往你这边推了推。你先拿吧，我看书很快的。";
}

function forceRealityEnding() {
  const closingLine = {
    coffee: "真的好幸运今天能遇见你。我们能加个联系方式吗？也许下次可以一起喝不苦的咖啡。",
    rain: "真的好幸运今天能遇见你。我们能加个联系方式吗？等雨小一点，我想确认你到家了。",
    bookstore: "真的好幸运今天能遇见你。我们能加个联系方式吗？那本书看完以后，也许可以告诉我你最喜欢哪一页。",
  }[state.realBranch];
  appendBubble("realMessages", "idol", "啊，助理在催我了。我得赶紧上去继续练习，今天的休息时间结束了。");
  setTimeout(() => appendBubble("realMessages", "idol", "不过……"), 700);
  setTimeout(() => appendBubble("realMessages", "idol", closingLine), 1400);
  setTimeout(() => askContact(), 2300);
}

function askContact() {
  setChoices("realChoices", [
    {
      label: "好。",
      run: () => {
        $("realChoices").innerHTML = "";
        appendBubble("realMessages", "user", "好。");
        appendBubble("realMessages", "system", `你已经添加了 ${state.selected.name}。`);
        state.chatUnread = true;
        state.relationshipPortrait.sharedMemories.push(buildFirstMemoryText());
        patchProgress({ completedFirstScene: true, stage: "chat" });
        setAppState({
          chatUnread: true,
          unlockedScenes: [...new Set([...state.unlockedScenes, state.realBranch || "jyp"])],
        });
        setTimeout(() => {
          showToast(`已添加 ${state.selected.name}`);
          show("chat");
        }, 1400);
      },
    },
  ]);
}

function startChatIfNeeded() {
  $("chatName").textContent = state.selected.name;
  $("chatAvatar").textContent = state.selected.initial;
  if (state.chatStarted) return;
  state.chatStarted = true;
  setAppState({ chatStarted: true, chatUnread: false });
  $("chatMessages").innerHTML = "";
  setTimeout(() => appendChat("idol", "对了，刚刚忘了问你叫什么了。"), 500);
}

function appendChat(type, text) {
  const bubble = document.createElement("div");
  if (type === "user") {
    bubble.className = "bubble user";
    bubble.textContent = text;
  } else {
    bubble.className = "bubble-row idol-row";
    const avatar = document.createElement("img");
    avatar.className = "bubble-avatar";
    avatar.src = state.selected?.image || "";
    avatar.alt = state.selected?.name || "idol";
    const content = document.createElement("div");
    content.className = "bubble idol";
    content.textContent = text;
    bubble.append(avatar, content);
  }
  $("chatMessages").appendChild(bubble);
  $("chatMessages").scrollTop = $("chatMessages").scrollHeight;
}

async function sendChatMessage(message) {
  if (state.chatBusy) return;
  setAppState({ chatBusy: true });
  appendChat("user", message);
  $("chatInput").value = "";
  patchPageCache("chat", { draft: "" });

  const lower = message.trim();
  if (!state.userPortrait.basic.preferredName && lower.length <= 16) {
    state.userPortrait.basic.preferredName = lower.replace(/^我叫/, "").replace(/^叫我/, "").trim() || lower;
    renderMe();
  }

  const typing = document.createElement("div");
  typing.className = "bubble idol";
  typing.textContent = "…";
  $("chatMessages").appendChild(typing);
  $("chatMessages").scrollTop = $("chatMessages").scrollHeight;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        idol: state.selected,
        userPortrait: state.userPortrait,
        relationshipPortrait: state.relationshipPortrait,
      }),
    });
    const data = await response.json();
    typing.textContent = data.reply || fallbackReply(message);
    if (data.portraitPatch?.preferredName && !state.userPortrait.basic.preferredName) {
      state.userPortrait.basic.preferredName = data.portraitPatch.preferredName;
    }
    if (Array.isArray(data.portraitPatch?.l1Facts)) {
      for (const fact of data.portraitPatch.l1Facts) {
        if (!state.userPortrait.preferences.includes(fact)) state.userPortrait.preferences.push(fact);
      }
    }
  } catch {
    typing.textContent = fallbackReply(message);
  } finally {
    renderHome();
    renderMe();
    setAppState({ chatBusy: false });
  }
}

function fallbackReply(message) {
  const name = state.userPortrait.basic.preferredName;
  if (!name) return "好，我记住了。那我以后就这样叫你。";
  if (message.includes("累")) return `${name}，那今天先别硬撑了。我还在练习室，可能回得慢一点，但我会看消息。`;
  return "嗯，我在。刚才上楼以后还在想，公司楼下那会儿是不是有点突然。";
}

function renderHome() {
  const activeCharacter = state.addedCharacters.find((member) => member.id === state.selected.id) || state.addedCharacters[0] || state.selected;
  state.selected = activeCharacter;
  $("posterName").textContent = state.selected.name;
  $("homePoster").style.backgroundImage = `url("${state.selected.image}")`;
  $("homePoster").classList.toggle("alt", state.posterAlt);
  renderMemorySlots();
  const name = state.userPortrait.basic.preferredName;
  $("posterTopDays").textContent = name ? `相识第 1 天 · 记得 ${name}` : "相识第 1 天";
  $("posterStage").textContent = "Stage 1: 熟悉";
  renderDrawerMembers();
  updateNavDots();
}

function renderMemorySlots() {
  const memories = getMemoryTimeline().filter(isValidMemory);
  const timeline = $("chronicleTimeline");
  if (!timeline) return;
  const slots = Array.from({ length: 5 }, (_, index) => memories[index] || null);
  timeline.innerHTML = slots
    .map((memory, index) =>
      memory
        ? `
          <article class="chronicle-node ${memory.fresh ? "revealed" : ""}" style="--tilt:${index % 2 === 0 ? "-2.2deg" : "1.8deg"}">
            <button type="button" class="chronicle-polaroid" data-action="open-memory" data-memory-id="${memory.memoryId}">
              <span class="chronicle-photo" style="background-image:url('${memory.imageUrl}')"></span>
              <em>📍 ${memory.location || "未命名"}</em>
              <b>第 ${memory.dayCount || 1} 天</b>
            </button>
            <i class="chronicle-line"></i>
            <strong class="chronicle-date">${memory.displayDate || "2026.05.18"}</strong>
          </article>
        `
        : `
          <article class="chronicle-node chronicle-empty" style="--tilt:${index % 2 === 0 ? "-1.6deg" : "1.4deg"}">
            <button type="button" class="chronicle-polaroid empty-polaroid" aria-label="故事还没发生">
              <span class="chronicle-photo" aria-hidden="true">?</span>
              <em>故事还没发生</em>
              <b>---</b>
            </button>
            <i class="chronicle-line"></i>
            <strong class="chronicle-date">---</strong>
          </article>
        `,
    )
    .join("");
  const active = memories.find((memory) => memory.fresh) || memories[memories.length - 1];
  if (active) hydrateMemoryOverlay(active);
}

function getMemoryTimeline() {
  const isInitialCharacter = state.selected.id === state.addedCharacters[0]?.id;
  if (!isInitialCharacter) {
    return (state.unlockedStoryLines?.[state.selected.id] || []).map(normalizeMemoryObject).filter(isValidMemory).slice(0, 5);
  }
  const firstMeet = {
    memoryId: "jyp-first-meet",
    characterId: state.selected.id,
    placeId: "company",
    title: "JYP 楼下",
    imageUrl: "https://i.pinimg.com/1200x/78/dd/ea/78ddead38013270722a9fbc132f490e0.jpg",
    initialImageUrl: "https://i.pinimg.com/1200x/78/dd/ea/78ddead38013270722a9fbc132f490e0.jpg",
    displayDate: "2026.05.18",
    dayCount: 1,
    location: "JYP 楼下",
    content: buildFirstMemoryText(),
    chatHistorySnap: [],
    code: "CODE-00",
  };
  const stories = (state.unlockedStoryLines?.[state.selected.id] || []).map(normalizeMemoryObject).filter(isValidMemory);
  return [normalizeMemoryObject(firstMeet), ...stories].slice(0, 5);
}

function isValidMemory(memory) {
  return Boolean(memory && memory.memoryId && memory.imageUrl && memory.location && memory.displayDate);
}

function switchAddedCharacter(delta) {
  if (!state.addedCharacters.length) return;
  const currentIndex = Math.max(0, state.addedCharacters.findIndex((member) => member.id === state.selected.id));
  const nextIndex = (currentIndex + delta + state.addedCharacters.length) % state.addedCharacters.length;
  const next = state.addedCharacters[nextIndex];
  setAppState({
    selected: next,
    selectedIndex: members.findIndex((member) => member.id === next.id),
    idolId: next.id,
    activeChatAgent: next.id,
  });
  renderHome();
}

function hydrateMemoryOverlay(memory) {
  const normalized = normalizeMemoryObject(memory);
  const overlay = $("memoryOverlay");
  overlay.dataset.memoryId = normalized.memoryId;
  overlay.classList.remove("editing");
  overlay.innerHTML = renderMemoryDetail(normalized);
}

function renderMemoryDetail(memory, editing = false) {
  return `
    <article class="memory-polaroid ${editing ? "is-editing" : ""}" data-memory-card>
      <div class="memory-photo" id="memoryPhoto" style="background-image:url('${escapeAttr(memory.imageUrl)}')"></div>
      <div class="memory-copy">
        <h3 class="memory-title" ${editing ? 'contenteditable="true"' : ""}>${escapeHtml(memory.title)}</h3>
        <div class="polaroid-text-zone" ${editing ? 'contenteditable="true"' : ""}>${escapeHtml(memory.content)}</div>
        <span class="memory-meta">
          <b>${escapeHtml(memory.displayDate)}</b>
          <i>📍 ${escapeHtml(memory.location)} ${escapeHtml(memory.code || "CODE-01")}</i>
        </span>
      </div>
      ${
        editing
          ? `<div class="memory-image-tools">
              <button type="button" data-action="memory-camera">拍照</button>
              <button type="button" data-action="memory-upload">从相册上传</button>
              <button type="button" data-action="memory-reset-image">恢复默认图像</button>
              <input id="memoryImageInput" type="file" accept="image/*" capture="environment" hidden />
            </div>
            <button type="button" class="memory-primary" data-action="save-memory-edit">保存编辑</button>`
          : `<div class="memory-actions">
              <button type="button" data-action="memory-retrograde">⏳ 时光回溯</button>
              <button type="button" data-action="edit-memory">✏️ 编辑记忆</button>
            </div>`
      }
    </article>
  `;
}

function getMemoryById(memoryId) {
  return getMemoryTimeline().find((memory) => memory.memoryId === memoryId);
}

function updateMemory(memoryId, updater) {
  const unlockedStoryLines = { ...(state.unlockedStoryLines || {}) };
  const characterId = state.selected.id;
  const list = [...(unlockedStoryLines[characterId] || [])];
  const index = list.findIndex((item) => normalizeMemoryObject(item).memoryId === memoryId);
  if (index < 0) return;
  list[index] = { ...updater(normalizeMemoryObject(list[index])), updatedAt: new Date().toISOString() };
  unlockedStoryLines[characterId] = list;
  persistMemoryCapsules(unlockedStoryLines);
  setAppState({ unlockedStoryLines });
  renderMemorySlots();
}

function saveMemoryEdit() {
  const overlay = $("memoryOverlay");
  const memoryId = overlay.dataset.memoryId;
  const card = overlay.querySelector("[data-memory-card]");
  const title = card?.querySelector(".memory-title")?.textContent.trim();
  const content = card?.querySelector(".polaroid-text-zone")?.textContent.trim();
  const imageUrl = card?.dataset.pendingImageUrl || getMemoryById(memoryId)?.imageUrl;
  updateMemory(memoryId, (memory) => ({
    ...memory,
    title: title || memory.title,
    content: content || memory.content,
    imageUrl: imageUrl || memory.imageUrl,
  }));
  const next = getMemoryById(memoryId);
  if (next) hydrateMemoryOverlay(next);
}

function resetMemoryImage() {
  const memory = getMemoryById($("memoryOverlay").dataset.memoryId);
  const card = $("memoryOverlay").querySelector("[data-memory-card]");
  if (!memory || !card) return;
  card.dataset.pendingImageUrl = memory.initialImageUrl;
  card.querySelector(".memory-photo").style.backgroundImage = `url('${memory.initialImageUrl}')`;
}

function startMemoryRetrograde() {
  const memory = getMemoryById($("memoryOverlay").dataset.memoryId);
  if (!memory) return;
  const layer = document.createElement("div");
  layer.className = "memory-transition-canvas";
  layer.innerHTML = "<i></i><i></i><i></i>";
  $("screen-home").appendChild(layer);
  setTimeout(() => {
    renderRetrogradeReview(memory);
    layer.remove();
  }, 1200);
}

function renderRetrogradeReview(memory) {
  const view = document.createElement("section");
  view.id = "retrogradeReview";
  view.className = "retrograde-review";
  view.style.setProperty("--review-bg", `url('${memory.imageUrl}')`);
  view.innerHTML = `
    <header class="retrograde-header">
      <button type="button" data-action="exit-retrograde">‹ 退出回顾</button>
      <span>📍 城市坐标 · ${escapeHtml(memory.location)}</span>
    </header>
    <p class="retrograde-voiceover">${escapeHtml(memory.content)}</p>
    <div class="retrograde-messages">
      ${memory.chatHistorySnap.length ? memory.chatHistorySnap.map(renderRetrogradeBubble).join("") : `<div class="bubble system">这段记忆没有可回溯的聊天快照。</div>`}
    </div>
  `;
  $("screen-home").appendChild(view);
}

function renderRetrogradeBubble(message) {
  const role = message.role === "user" ? "user" : message.role === "system" ? "system" : "idol";
  const text = message.text || message.eventName || message.placeName || "";
  if (!text) return "";
  return `<div class="bubble ${role}">${escapeHtml(text)}</div>`;
}

function exitRetrogradeReview() {
  $("retrogradeReview")?.remove();
}

document.addEventListener("change", (event) => {
  if (event.target.id !== "memoryImageInput") return;
  const file = event.target.files?.[0];
  const card = $("memoryOverlay").querySelector("[data-memory-card]");
  if (!file || !card) return;
  const imageUrl = URL.createObjectURL(file);
  card.dataset.pendingImageUrl = imageUrl;
  card.querySelector(".memory-photo").style.backgroundImage = `url('${imageUrl}')`;
});

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function buildFirstMemoryText() {
  const memory = {
    coffee: "那天在 JYP 楼下的咖啡厅，人群挤在取餐台前。你们不小心拿错了冰美式，他压低声音提醒你，又在被助理催走前主动加了你的聊天方式。",
    rain: "那天在 JYP 楼下，雨突然变得很大。他练习结束后撑着一把透明伞，从屋檐下看见你，问你要不要一起走到地铁站。",
    bookstore: "那天在 JYP 附近的街角书店，你们同时伸手去拿最后一本书。他像遇到同好一样笑了一下，临走前主动留下了联系方式。",
  }[state.realBranch];
  return memory || "那天在 JYP 楼下，你们第一次真正说上话。他主动添加了你的聊天方式。";
}

function updateNavDots() {
  $("chatDot")?.classList.toggle("hidden", !state.chatUnread);
  $("notifyDot")?.classList.toggle("hidden", !state.hasNotification);
}

function renderDrawerMembers() {
  const drawer = $("drawerMembers");
  if (!drawer) return;
  const pendingIds = new Set(state.pendingFriendRequests.map((request) => request.id));
  drawer.innerHTML = state.unaddedCharacters
    .map(
      (member) => `
        <div class="drawer-member">
          <img src="${member.image}" alt="${member.name}" />
          <div>
            <strong>${member.name}</strong>
            <button data-action="request-member" data-member-id="${member.id}" class="${pendingIds.has(member.id) ? "waiting" : ""}" ${pendingIds.has(member.id) ? "disabled" : ""}>
              ${pendingIds.has(member.id) ? "等待中..." : "添加"}
            </button>
          </div>
        </div>
      `,
    )
    .join("");
}

function renderNotificationPanel() {
  const existing = $("notificationPanel");
  if (existing) {
    existing.remove();
    return;
  }
  const request = state.pendingFriendRequests[0];
  const panel = document.createElement("aside");
  panel.id = "notificationPanel";
  panel.className = "notification-panel";
  panel.innerHTML = request
    ? `<button type="button" data-action="approve-friend" data-member-id="${request.id}">${request.name} 通过了你的好友申请。</button>`
    : `<p>暂无通知</p>`;
  $("phoneViewport").appendChild(panel);
}

function approveFriend(memberId) {
  const member = state.pendingFriendRequests.find((item) => item.id === memberId);
  if (!member) return;
  const viaName = state.addedCharacters[0]?.name || state.selected.name;
  const breakIce = buildFriendBreakIce({ newCharacterName: member.name, viaCharacterName: viaName });
  const nextAdded = [...state.addedCharacters, member];
  const nextUnadded = state.unaddedCharacters.filter((item) => item.id !== memberId);
  const nextPending = state.pendingFriendRequests.filter((item) => item.id !== memberId);
  const unlockedContacts = {
    ...(Array.isArray(state.unlockedContacts) ? {} : state.unlockedContacts || {}),
    [member.id]: {
      id: member.id,
      name: member.name,
      initial: member.initial,
      image: member.image,
      lastMsg: breakIce,
      hasNewMsg: true,
    },
  };
  const chatStreams = {
    ...(state.chatStreams || {}),
    [member.id]: [
      {
        id: `${member.id}-break-ice`,
        role: "idol",
        text: breakIce,
        createdAt: new Date().toISOString(),
      },
    ],
  };
  setAppState({
    addedCharacters: nextAdded,
    unaddedCharacters: nextUnadded,
    pendingFriendRequests: nextPending,
    hasNotification: nextPending.length > 0,
    unlockedContacts,
    officialFriends: Object.values(unlockedContacts),
    chatStreams,
    messagesByCharacter: chatStreams,
    chatUnread: true,
  });
  $("notificationPanel")?.remove();
  renderHome();
  if (state.route === "chat") chatModule.onEnter();
}

function renderMe() {
  const name = state.userPortrait.basic.preferredName || "You";
  $("visibleUserName").textContent = name;
  $("meAvatar").src = state.userPortrait.basic.avatar || state.selected.image;
  $("meUid").textContent = `UID: ${String(state.userId || "").slice(0, 8).toUpperCase() || "--"}`;
  $("meEmail").textContent = state.userPortrait.basic.email || "user@example.com";
}

document.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  const nav = event.target.closest("[data-nav]")?.dataset.nav;
  if (nav) show(nav);
  if (!action) return;
  if (action === "dream-reload") onDreamReload();
  if (action === "start") {
    patchProgress({ stage: "select" });
    show("select");
  }
  if (action === "prev-member") pickMember(-1);
  if (action === "next-member") pickMember(1);
  if (action === "select-member") {
    selectMember(state.selectedIndex);
    patchProgress({ stage: "dream-intro" });
    show("dream-intro");
  }
  if (action === "enter-dream") {
    patchProgress({ stage: "dream" });
    show("dream");
  }
  if (action === "enter-real") {
    enterRealityWithWhiteFlash();
  }
  if (action === "toggle-discover") $("discoverDrawer").classList.toggle("open");
  if (action === "toggle-notifications") renderNotificationPanel();
  if (action === "request-member") {
    const memberId = event.target.dataset.memberId;
    const member = state.unaddedCharacters.find((item) => item.id === memberId);
    if (!member) return;
    setAppState({
      pendingFriendRequests: [...state.pendingFriendRequests, member],
      hasNotification: true,
    });
    event.target.textContent = "等待中...";
    event.target.classList.add("waiting");
    event.target.disabled = true;
    setTimeout(() => {
      $("discoverDrawer")?.classList.remove("open");
      updateNavDots();
    }, 500);
  }
  if (action === "approve-friend") approveFriend(event.target.dataset.memberId);
  if (action === "open-memory") {
    const trigger = event.target.closest("[data-memory-id]");
    const memory = getMemoryById(trigger?.dataset.memoryId);
    if (memory) hydrateMemoryOverlay(memory);
    $("memoryOverlay").classList.remove("hidden");
  }
  if (action === "close-memory") $("memoryOverlay").classList.add("hidden");
  if (action === "edit-memory") {
    const memory = getMemoryById($("memoryOverlay").dataset.memoryId);
    if (memory) $("memoryOverlay").innerHTML = renderMemoryDetail(memory, true);
  }
  if (action === "save-memory-edit") saveMemoryEdit();
  if (action === "memory-upload" || action === "memory-camera") $("memoryImageInput")?.click();
  if (action === "memory-reset-image") resetMemoryImage();
  if (action === "memory-retrograde") startMemoryRetrograde();
  if (action === "exit-retrograde") exitRetrogradeReview();
  if (action === "poster-prev" || action === "poster-next") {
    switchAddedCharacter(action === "poster-prev" ? -1 : 1);
  }
});

let lastHomeTap = 0;
let homeSwipeStartX = null;
$("screen-home").addEventListener("click", (event) => {
  if (event.target.closest("button:not(.poster-edge)") || event.target.closest(".discover-drawer") || event.target.closest(".notification-panel") || event.target.closest(".memory-overlay")) return;
  const now = Date.now();
  if (now - lastHomeTap < 320) {
    $("posterUi").classList.toggle("hidden");
    $("bottomNav").classList.toggle("peek-hidden");
    $("discoverDrawer")?.classList.remove("open");
  }
  lastHomeTap = now;
});

$("screen-home").addEventListener("touchstart", (event) => {
  homeSwipeStartX = event.touches[0]?.clientX ?? null;
});

$("screen-home").addEventListener("touchend", (event) => {
  if (homeSwipeStartX == null) return;
  const endX = event.changedTouches[0]?.clientX ?? homeSwipeStartX;
  const delta = endX - homeSwipeStartX;
  homeSwipeStartX = null;
  if (Math.abs(delta) > 48) switchAddedCharacter(delta > 0 ? -1 : 1);
});

$("chatForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = $("chatInput").value.trim();
  if (message) sendChatMessage(message);
});

$("chatInput")?.addEventListener("input", (event) => {
  patchPageCache("chat", { draft: event.target.value });
});

createPageController();
store.subscribe(renderShell);
renderMembers();
initMemberSlider();
if (shouldStartInAppPreview()) {
  bootstrapAppPreview();
  router.start("home");
} else {
  router.start("splash");
}
