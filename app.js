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
    hook: "He looks after everyone. But if he ever lets you see the tired parts he hides from the world, something has changed.",
  },
  {
    id: "lee_know",
    name: "Lee Know",
    kr: "리노",
    initial: "LK",
    image: characterImages.lee_know,
    hook: "He does not say soft things often, but the smallest gestures make it clear: he has been paying attention.",
  },
  {
    id: "changbin",
    name: "Changbin",
    kr: "창빈",
    initial: "CB",
    image: characterImages.changbin,
    hook: "Sharp and fearless on stage, but offstage he asks if you have eaten and remembers what you said last time.",
  },
  {
    id: "hyunjin",
    name: "Hyunjin",
    kr: "현진",
    initial: "HJ",
    image: characterImages.hyunjin,
    hook: "He feels like beautiful, dangerous rain. Getting close makes you wonder if he is seeing you differently from everyone else.",
  },
  {
    id: "han",
    name: "Han",
    kr: "한",
    initial: "H",
    image: characterImages.han,
    hook: "He can turn everything into a joke, then go quiet and leave the honest part only with you.",
  },
  {
    id: "felix",
    name: "Felix",
    kr: "필릭스",
    initial: "F",
    image: characterImages.felix,
    hook: "His kindness does not feel rehearsed. It is the kind that makes the world feel less hard after midnight.",
  },
  {
    id: "seungmin",
    name: "Seungmin",
    kr: "승민",
    initial: "SM",
    image: characterImages.seungmin,
    hook: "He teases without mercy, but when it matters he is steady. The closer you get, the more care hides inside the joke.",
  },
  {
    id: "in",
    name: "I.N",
    kr: "아이엔",
    initial: "IN",
    image: characterImages.in,
    hook: "He may look the youngest, but he knows what he wants. Once he trusts you, he stands on your side without hesitation.",
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
    currentTone: "Just met, the first real-world thread",
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
  const previewMessage = "Right, I forgot to ask earlier. What should I call you?";
  const previewMessageAt = new Date();
  previewMessageAt.setHours(20, 0, 0, 0);

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
        lastMessageType: "text",
        lastMessageAt: previewMessageAt.toISOString(),
        unreadCount: 1,
        relationshipStage: "Stage 1: Familiar",
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
        previewText: previewMessage,
        lastMessageType: "text",
        lastMessageAt: previewMessageAt.toISOString(),
        unreadCount: 1,
      },
    },
    relationshipStages: {
      [previewMember.id]: "Stage 1: Familiar",
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
      [previewMember.id]: [{ id: "preview-first-message", role: "idol", type: "text", text: previewMessage, createdAt: previewMessageAt.toISOString() }],
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
    "The ringing in your ears has not faded. The roar of the arena still seems to tremble beyond the wall. You push open the half-closed door and find him alone in front of the mirror, still in his stage outfit, sweat slipping down the side of his neck.",
  opening: "...You found your way in after all. I knew a place like this would never stop you.",
  rounds: [
    {
      choices: [
        "Security outside was too easy. I said I was family and they let me in.",
        "I did not want to watch from the crowd anymore. It was too far away to see your eyes.",
        "(Walk over silently and place a hand on his shoulder.)",
      ],
      replies: [
        ["Family?", "(He lowers his head with a quiet laugh, tasting the word.)", "That is bold... but if it is you, I do not hate the title."],
        ["You could not see me?", "Funny. From the stage, I found you in the crowd right away.", "Come here. A little closer."],
        ["(His body stiffens for a second, then relaxes as his hand covers yours.)", "So direct? The version of me after a show can be dangerous."],
      ],
    },
    {
      choices: [
        "Which one is real, the you on stage or the you right now?",
        "If I come any closer, you might hear my heartbeat.",
        "Were you looking at me when you sang that love song?",
      ],
      replies: [
        ["They are both me.", "But the me right now is only for you. Whichever side you want to see, I can show you."],
        ["Your heartbeat?", "Mine was already losing control on stage.", "If you do not believe me, check for yourself."],
        ["Who else would I look at?", "Every line in those lyrics was something selfish I wanted to say to you."],
      ],
    },
    {
      choices: [
        "Anything? Even kissing you?",
        "I want the rest of this night to belong to me.",
        "(Brush his damp hair back.) I want to see you without the performance.",
      ],
      replies: [
        ["If you are brave enough.", "But I cannot promise you will walk out of this room safely after that."],
        ["Greedy.", "But I like that kind of greed... I was not planning to give the rest of tonight to anyone else."],
        ["(He closes his eyes, briefly letting himself enjoy your touch.)", "With you, I do not need to perform. Is this version of me more dangerous than the one on camera?"],
      ],
    },
    {
      choices: [
        "(Close your eyes and lean in slowly.)",
        "Have you practiced looking this tempting?",
        "Forget it. I am afraid I will get addicted.",
      ],
      replies: [
        ["(He lowers his head until his breath catches yours, his nose brushing lightly against you.)", "Is that enough? What I want is... much more than this."],
        ["Practice? Do I need practice for this?", "When I see you, every instinct I have tells me how to make you stay."],
        ["Then get addicted.", "I have already forgotten how to quit you."],
      ],
    },
    {
      choices: ["Then what are you still holding back?", "What if I do not let you leave?", "(Say nothing, just look at him from closer.)"],
      replies: [
        ["Since you said it... I will stop holding back.", "(His hand is just about to settle at the back of your neck.)"],
        ["Since you said it... I will stop holding back.", "(His hand is just about to settle at the back of your neck.)"],
        ["Since you said it... I will stop holding back.", "(His hand is just about to settle at the back of your neck.)"],
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
  const dissolveVoiceover = "His silhouette breaks apart in front of you. The empty room keeps only the last trace of warmth...";
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
  "Somewhere far away,",
  "a sound from the real world comes closer,",
  "and everything that just happened",
  "begins to feel like a dream...",
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
  const knockVoiceover = `(Suddenly, a staff member knocks urgently outside the door. "${idolName}! Stage countdown has started. The stylist is looking everywhere for you. Come out!")`;
  const idolFarewellLines = ["Tch. Perfect timing...", "Wait here for me.", "Do not go anywhere, okay?"];

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
            label: "Okay. I will wait here for you.",
            run: () => {
              appendBubble("dreamMessages", "user", "Okay. I will wait here for you.");
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
    coffee: "The cafe downstairs near the company is packed. When you look down at the order label, you realize the iced Americano in your hand may not be yours.",
    rain: "Rain suddenly comes pouring down. You have no umbrella, so you can only wait under the company awning for it to ease.",
    bookstore: "The corner bookstore is quiet. As you reach for the last copy of a book, another hand touches the spine at the same time.",
  }[branch];
  appendBubble("realMessages", "system", userSetup);
  $("realSceneSub").textContent =
    branch === "coffee" ? "Same Coffee" : branch === "rain" ? "Sudden Rain" : "Corner Bookstore";
  const idolLines = {
    coffee: ["Um... sorry, I think the cup in your hand might be mine? I ordered the one with an extra shot..."],
    rain: ["The rain is really heavy. If you do not mind, do you want to share the umbrella to the subway station?"],
    bookstore: ["You like this author too? I almost never meet someone here with the same taste."],
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
      <input id="realInput" autocomplete="off" placeholder="Reply to him..." />
      <button type="submit" aria-label="Send"><span aria-hidden="true"></span></button>
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
    if (state.realTurn === 1) return "Shh, it is okay. You do not need to apologize. This coffee might be too bitter now, though. If you do not mind, can I buy you a new one?";
    return "He glances at the cup in your hand and gives a small laugh. Next time, I will read the name before I take it.";
  }
  if (state.realBranch === "rain") {
    if (state.realTurn === 1) return "It is no trouble. It is on my way anyway. Besides, leaving you waiting in the rain for this long would not feel right.";
    return "He tilts the umbrella a little more toward you. Walk slowly. The ground is slippery.";
  }
  if (state.realTurn === 1) return "He lifts his brows, a little surprised. Looks like we not only have the same taste, you are thoughtful too. Since there is only one copy, you should take it first.";
  return "He nudges the book toward you. You take it first. I read pretty quickly.";
}

function forceRealityEnding() {
  const closingLine = {
    coffee: "I am really glad I ran into you today. Could we add each other? Maybe next time we can drink coffee that is not this bitter.",
    rain: "I am really glad I ran into you today. Could we add each other? When the rain eases, I want to make sure you get home safely.",
    bookstore: "I am really glad I ran into you today. Could we add each other? After you finish that book, maybe you can tell me which page you liked most.",
  }[state.realBranch];
  appendBubble("realMessages", "idol", "Ah, my assistant is calling me. I have to hurry upstairs and get back to practice. My break is over.");
  setTimeout(() => appendBubble("realMessages", "idol", "But..."), 700);
  setTimeout(() => appendBubble("realMessages", "idol", closingLine), 1400);
  setTimeout(() => askContact(), 2300);
}

function askContact() {
  setChoices("realChoices", [
    {
      label: "Okay.",
      run: () => {
        $("realChoices").innerHTML = "";
        appendBubble("realMessages", "user", "Okay.");
        appendBubble("realMessages", "system", `You have added ${state.selected.name}.`);
        state.chatUnread = true;
        state.relationshipPortrait.sharedMemories.push(buildFirstMemoryText());
        patchProgress({ completedFirstScene: true, stage: "chat" });
        setAppState({
          chatUnread: true,
          unlockedScenes: [...new Set([...state.unlockedScenes, state.realBranch || "jyp"])],
        });
        setTimeout(() => {
          showToast(`Added ${state.selected.name}`);
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
  setTimeout(() => appendChat("idol", "Right, I forgot to ask earlier. What should I call you?"), 500);
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
    state.userPortrait.basic.preferredName = lower.replace(/^my name is\s+/i, "").replace(/^call me\s+/i, "").trim() || lower;
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
  if (!name) return "Okay, I will remember that. I will call you that from now on.";
  if (/\btired\b|exhausted|worn out|rough day/i.test(message)) return `${name}, do not push yourself too hard today. I am still in the practice room, so I may reply slowly, but I will check my messages.`;
  return "Yeah, I am here. After I went upstairs, I kept thinking about how sudden that moment outside the company must have felt.";
}

function renderHome() {
  const activeCharacter = state.addedCharacters.find((member) => member.id === state.selected.id) || state.addedCharacters[0] || state.selected;
  state.selected = activeCharacter;
  $("posterName").textContent = state.selected.name;
  $("homePoster").style.backgroundImage = `url("${state.selected.image}")`;
  $("homePoster").classList.toggle("alt", state.posterAlt);
  renderMemorySlots();
  const name = state.userPortrait.basic.preferredName;
  $("posterTopDays").textContent = name ? `Day 1 since you met · Remembers ${name}` : "Day 1 since you met";
  $("posterStage").textContent = "Stage 1: Familiar";
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
              <em>${memory.location || "Untitled"}</em>
              <b>Day ${memory.dayCount || 1}</b>
            </button>
            <i class="chronicle-line"></i>
            <strong class="chronicle-date">${memory.displayDate || "2026.05.18"}</strong>
          </article>
        `
        : `
          <article class="chronicle-node chronicle-empty" style="--tilt:${index % 2 === 0 ? "-1.6deg" : "1.4deg"}">
            <button type="button" class="chronicle-polaroid empty-polaroid" aria-label="No memory yet">
              <span class="chronicle-photo" aria-hidden="true">?</span>
              <em>No memory yet</em>
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
    title: "Outside JYP",
    imageUrl: "https://i.pinimg.com/1200x/78/dd/ea/78ddead38013270722a9fbc132f490e0.jpg",
    initialImageUrl: "https://i.pinimg.com/1200x/78/dd/ea/78ddead38013270722a9fbc132f490e0.jpg",
    displayDate: "2026.05.18",
    dayCount: 1,
    location: "Outside JYP",
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
              <button type="button" data-action="memory-camera">Take Photo</button>
              <button type="button" data-action="memory-upload">Upload from Album</button>
              <button type="button" data-action="memory-reset-image">Restore Default Image</button>
              <input id="memoryImageInput" type="file" accept="image/*" capture="environment" hidden />
            </div>
            <button type="button" class="memory-primary" data-action="save-memory-edit">Save Changes</button>`
          : `<div class="memory-actions">
              <button type="button" data-action="memory-retrograde">Memory Replay</button>
              <button type="button" data-action="edit-memory">Edit Memory</button>
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
      <button type="button" data-action="exit-retrograde">‹ Exit Replay</button>
      <span>City Marker · ${escapeHtml(memory.location)}</span>
    </header>
    <p class="retrograde-voiceover">${escapeHtml(memory.content)}</p>
    <div class="retrograde-messages">
      ${memory.chatHistorySnap.length ? memory.chatHistorySnap.map(renderRetrogradeBubble).join("") : `<div class="bubble system">No chat snapshot was saved for this memory.</div>`}
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
    coffee: "That day at the cafe outside JYP, people crowded around the pickup counter. You accidentally took the same iced Americano. He lowered his voice to point it out, then asked to add you before his assistant hurried him away.",
    rain: "That day outside JYP, the rain suddenly came down hard. After practice, he stepped out with a clear umbrella, noticed you under the awning, and asked if you wanted to walk to the subway together.",
    bookstore: "That day at the corner bookstore near JYP, you both reached for the last copy of the same book. He smiled like he had found someone with the same taste, then left his contact before he went.",
  }[state.realBranch];
  return memory || "That day outside JYP, you truly spoke for the first time. He was the one who asked to add you.";
}

function updateNavDots() {
  $("chatDot")?.classList.toggle("hidden", !state.chatUnread);
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
  if (action === "request-member") {
    const memberId = event.target.dataset.memberId;
    const member = state.unaddedCharacters.find((item) => item.id === memberId);
    if (!member) return;
    setAppState({
      pendingFriendRequests: [...state.pendingFriendRequests, member],
      hasNotification: true,
    });
    event.target.textContent = "Pending...";
    event.target.classList.add("waiting");
    event.target.disabled = true;
    setTimeout(() => {
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
  if (event.target.closest("button:not(.poster-edge)") || event.target.closest(".notification-panel") || event.target.closest(".memory-overlay")) return;
  const now = Date.now();
  if (now - lastHomeTap < 320) {
    $("posterUi").classList.toggle("hidden");
    $("bottomNav").classList.toggle("peek-hidden");
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
