import { uiCopy } from "../ui/copy-library.js";
import { sceneImages } from "../ui/image-library.js";

export const GeneralLifeScenes = {
  coffee_shop: {
    id: "coffee_shop",
    name: "Cafe",
    imageUrl: sceneImages.coffee_shop,
    description: "A quiet corner for soft conversations, warm lights, and the kind of small surprise that lingers.",
    defaultDraft: "The seats here are quiet. I suddenly wanted to have coffee with you. Want to come?",
    shortDraft: "Want to get coffee together?",
    events: [
      {
        label: "Try the pudding affogato",
        draft: "I heard this cafe's fresh pudding affogato is really good. I want to try it. Are you free later?",
      },
      {
        label: "Listen to a new album",
        draft: "I want to find a quiet window seat, listen to a new album with you, and let the breeze in for a while.",
      },
      {
        label: "Zone out on the terrace",
        draft: "I just finished something nearby. Want to grab strong iced Americanos and sit outside for a bit?",
      },
      {
        label: "Rate homemade brownies",
        draft: "I brought chocolate brownies I baked at home. I need someone to rate them over afternoon coffee.",
      },
    ],
  },
  park: {
    id: "park",
    name: "Park",
    imageUrl: sceneImages.park,
    description: "A gentle place for evening wind, slow walks, and moments that can unfold without rushing.",
    defaultDraft: "The weather feels especially nice today. If you are free, want to take a walk?",
    shortDraft: "Want to get some air?",
    events: [
      {
        label: "Ride a tandem bike",
        draft: "I heard the tandem bikes there are fun. Want to try one lap if you are free?",
      },
      {
        label: "Walk by the lake",
        draft: "The blossoms and falling leaves by the lake are supposed to be beautiful right now. Want to walk there together?",
      },
      {
        label: "Bench, breeze, music",
        draft: "I just bought new earbuds. Want to sit on a bench, listen to music, and feel the wind for a bit?",
      },
      {
        label: "Watch sunset on the grass",
        draft: "Someone said the sunset from the lawn will be beautiful tonight. Want to walk over together?",
      },
    ],
  },
  convenience_store: {
    id: "convenience_store",
    name: "Convenience Store",
    imageUrl: sceneImages.convenience_store,
    description: "A late-night stop for snacks, banana milk, and ordinary choices that start to feel intimate.",
    defaultDraft: "What are you doing? Want to go hunt for snacks at the convenience store?",
    shortDraft: "Want to grab convenience store snacks?",
    events: [
      {
        label: "Look for mint chocolate ice cream",
        draft: "I heard the hard-to-find mint chocolate ice cream was restocked. Want to try our luck?",
      },
      {
        label: "Snacks and banana milk",
        draft: "I suddenly got hungry. I want to raid the snack aisle and buy two banana milks. Want to come?",
      },
      {
        label: "Try for banana milk",
        draft: "I heard that hard-to-find banana milk got restocked. Want to try our luck? What are you doing now?",
      },
      {
        label: "Hot oden in cold weather",
        draft: "This weather is perfect for a steaming bowl of oden. Want to go to the convenience store together?",
      },
      {
        label: "Share convenience store ramen",
        draft: "I want hot convenience store ramen, but I need someone to help share the toppings. Want to go?",
      },
    ],
  },
  mall: {
    id: "mall",
    name: "Mall",
    imageUrl: sceneImages.mall,
    description: "A bright glass atrium for window shopping, small gifts, and finding reasons to walk one more floor together.",
    defaultDraft: "I happen to be near the mall. Want to walk around together?",
    shortDraft: "Want to go to the mall together?",
    events: [
      {
        label: "Pick a last-minute gift",
        draft: "I want to choose a small gift at the mall, but I suddenly cannot decide. Can you come help me look?",
      },
      {
        label: "See the city from the top floor",
        draft: "I heard the glass walkway on the top floor has a great night view. Want to go up and get some air?",
      },
      {
        label: "Try matching fragrance samples",
        draft: "I passed a fragrance shop and smelled something that feels like you. I want you to confirm it yourself. Want to come?",
      },
      {
        label: "Take a short dessert break",
        draft: "I am a little tired from walking today. I want to sit in a dessert shop for ten minutes. If you are nearby, join me?",
      },
    ],
  },
  apartment: {
    id: "apartment",
    name: "Apartment",
    imageUrl: sceneImages.apartment,
    description: "A warm residential block where ordinary lights, balconies, and late arrivals can feel unexpectedly close.",
    defaultDraft: "I am downstairs at the apartment. I wanted to see you for a moment.",
    shortDraft: "Can you come down for a minute?",
    events: [
      {
        label: "Bring a warm drink downstairs",
        draft: "I passed by your apartment and brought you a warm drink. I will not bother you long. Can you come down and take it?",
      },
      {
        label: "Watch city lights from the balcony",
        draft: "The city lights are especially pretty tonight. Can I stand with you by the balcony for a little while?",
      },
      {
        label: "Say goodnight at the door",
        draft: "I just wanted to say goodnight at the apartment entrance. Only for a minute.",
      },
      {
        label: "Wait for delivery together",
        draft: "My delivery is almost here. Want to wait downstairs together? I can share some with you.",
      },
    ],
  },
  practice_room: {
    id: "practice_room",
    name: "Practice Room",
    imageUrl: sceneImages.practice_room,
    description: "A private after-hours room where music, breath, and unfinished choreography stay close.",
    defaultDraft: "Did practice go okay today? Take a short break. Can I come sit with you for a while?",
    shortDraft: "Can I come sit with you for a while?",
    events: [
      {
        label: "Bring sports drinks",
        draft: "I bought sports drinks and cold water on the way. I want to bring them as your energy refill. Take a short break?",
      },
      {
        label: "Sneak a look at new choreography",
        draft: "Did practice go okay today? I want to sneak in and see how the new choreography is going. Can I come sit with you for a while?",
      },
      {
        label: "Be the first listener",
        draft: "I suddenly want to hear you hum without a mic, just your real voice. Can I be your first listener?",
      },
      {
        label: "Lie on the wooden floor",
        draft: "I am tired from being outside. Can I borrow a corner of your room, lie on the wooden floor, and stare at the ceiling for a bit?",
      },
    ],
  },
  company: {
    id: "company",
    name: "Company",
    imageUrl: sceneImages.company,
    description: "A glowing building full of schedules, glass reflections, and chances to meet between busy hours.",
    defaultDraft: "Are you at the company today? I suddenly wanted to see you.",
    shortDraft: "I suddenly wanted to see you.",
    events: [
      {
        label: "Bring warm cocoa",
        draft: "I brought you warm dark cocoa on the way. Thought it might help after such a full day. Are you at the company?",
      },
      {
        label: "Visit the rooftop garden",
        draft: "I heard the rooftop garden has a beautiful night view. I want to get some air there and clear my head. Are you at the company today?",
      },
      {
        label: "Get the last sandwich",
        draft: "I have been busy all day and I am starving. I suddenly wanted to see you. Can we use your staff card to grab the last sandwich?",
      },
      {
        label: "Stop by after an errand",
        draft: "I just finished something nearby and wanted to come see you. Are you at the company today?",
      },
    ],
  },
};

const STYLE_ID = "scene-module-styles";
const DEFAULT_CHARACTER_ID = "bang_chan";
const MAP_SCENE_IDS = ["company", "practice_room", "coffee_shop", "mall", "apartment", "park"];
const MAP_LABELS = {
  company: { x: 22, y: 8, w: 38, h: 26, sx: 63, sy: 16, delay: 0 },
  practice_room: { x: 54, y: 13, w: 40, h: 21, sx: 72, sy: 12, delay: 0.28 },
  coffee_shop: { x: 3, y: 35, w: 35, h: 22, sx: 70, sy: 13, delay: 0.56 },
  mall: { x: 47, y: 34, w: 49, h: 26, sx: 67, sy: 26, delay: 0.84 },
  apartment: { x: 4, y: 58, w: 35, h: 26, sx: 71, sy: 9, delay: 1.12 },
  park: { x: 52, y: 64, w: 43, h: 23, sx: 57, sy: 82, delay: 1.4 },
};

export function createSceneModule(deps = {}) {
  const doc = deps.document || document;
  const rootId = deps.rootId || "screen-scene";
  const getState = deps.getState || (() => window.AppStore?.state || {});
  const setState = deps.setState || ((patch) => Object.assign(window.AppStore?.state || {}, patch));
  const router = deps.router || window.AppRouter || {};
  const actions = deps.actions || window.App?.actions || {};
  let pendingInvite = null;

  function onEnter() {
    injectStyles(doc);
    renderSceneMain();
  }

  function getRoot() {
    const root = doc.getElementById(rootId);
    if (!root) throw new Error(`[scene] Missing root element #${rootId}`);
    return root;
  }

  function renderSceneMain() {
    const root = getRoot();
    root.innerHTML = `
      <div class="scene-city scene-main-view scene-map-view">
        <section class="scene-city-map" aria-label="City scene map">
          <img src="${escapeAttr(sceneImages.city_map)}" alt="City scene map" />
          ${MAP_SCENE_IDS.map((id) => renderSceneHotspot(GeneralLifeScenes[id], getActiveSceneSession(getState()))).join("")}
        </section>
      </div>
    `;

    root.querySelectorAll("[data-place-id]").forEach((hotspot) => {
      hotspot.addEventListener("click", () => handleMapPlaceClick(hotspot.dataset.placeId));
    });
  }

  function handleMapPlaceClick(placeId) {
    const activeScene = getActiveSceneSession(getState());
    if (!activeScene) {
      playWindowZoomTransition(placeId);
      return;
    }
    if (activeScene.placeId === placeId) {
      resumeActiveScene();
      return;
    }
    showLeaveConfirm(placeId, activeScene);
  }

  function playWindowZoomTransition(placeId) {
    const place = GeneralLifeScenes[placeId];
    if (!place) return;
    const root = getRoot();
    const layer = doc.createElement("div");
    layer.className = "scene-window-transition";
    layer.innerHTML = `
      <div class="scene-transition-window" style="--scene-img:url('${place.imageUrl}')">
        <img src="${escapeAttr(place.imageUrl)}" alt="${escapeAttr(place.name)}" />
        <em></em>
      </div>
      <i></i>
    `;
    root.appendChild(layer);
    setTimeout(() => layer.classList.add("zooming"), 20);
    setTimeout(() => {
      renderSceneDetail(placeId);
      layer.remove();
    }, 880);
  }

  function renderSceneDetail(placeId) {
    const place = GeneralLifeScenes[placeId];
    if (!place) return renderSceneMain();

    const root = getRoot();
    root.innerHTML = `
      <div class="scene-city scene-detail-view">
        <div class="scene-detail-hero" style="--place-img:url('${escapeAttr(place.imageUrl)}')">
          <button type="button" class="scene-back" data-scene-back aria-label="Back">‹</button>
        </div>
        <section class="scene-place-panel">
          <header class="scene-place-copy">
            <h2>${escapeHtml(place.name)}</h2>
            <p>${escapeHtml(place.description || place.defaultDraft)}</p>
          </header>
          <div class="scene-event-label">Select Event</div>
          <div class="scene-action-lines">
            ${place.events.map((event, index) => renderActionLine(place.id, event, index)).join("")}
          </div>
        </section>
      </div>
    `;

    root.querySelector("[data-scene-back]").addEventListener("click", playReturnTransition);
    root.querySelectorAll("[data-scene-invite]").forEach((button) => {
      button.addEventListener("click", () => {
        if (getActiveSceneSession(getState())) {
          showLeaveConfirm(button.dataset.placeId, getActiveSceneSession(getState()));
          return;
        }
        openContactSheet(button.dataset.placeId, Number(button.dataset.eventIndex));
      });
    });
  }

  function playReturnTransition() {
    const root = getRoot();
    const layer = doc.createElement("div");
    layer.className = "scene-return-transition";
    layer.innerHTML = "<i></i>";
    root.appendChild(layer);
    setTimeout(() => {
      renderSceneMain();
      layer.remove();
    }, 420);
  }

  function openContactSheet(placeId, eventIndex) {
    pendingInvite = { placeId, eventIndex };
    closeContactSheet();
    getRoot().insertAdjacentHTML("beforeend", renderContactSheet(getUnlockedContacts()));
    getRoot().querySelector("[data-scene-sheet-close]").addEventListener("click", closeContactSheet);
    getRoot().querySelectorAll("[data-scene-contact]").forEach((button) => {
      button.addEventListener("click", () => {
        sendDateInvite(button.dataset.sceneContact, pendingInvite.placeId, pendingInvite.eventIndex);
        closeContactSheet();
      });
    });
  }

  function sendDateInvite(characterId, placeId, eventIndex) {
    if (getActiveSceneSession(getState())) {
      showLeaveConfirm(placeId, getActiveSceneSession(getState()));
      return;
    }
    const place = GeneralLifeScenes[placeId];
    const event = getSceneEvent(place, eventIndex);
    const eventName = event.label;
    const draftText = event.draft || place.defaultDraft;

    setState({
      activeChatAgent: characterId,
      pendingSceneInvite: {
        inviteId: `invite-${Date.now()}`,
        characterId,
        placeId,
        placeName: place.name,
        eventName,
        eventDraft: draftText,
        defaultDraft: place.defaultDraft,
        shortDraft: place.shortDraft,
        draftText,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        memorySeed: {
          placeId,
          location: place.name,
          eventName,
          eventDraft: draftText,
        },
      },
    });

    actions.sendDateInvite?.(characterId, placeId, eventName);
    goChat(characterId);
  }

  function closeContactSheet() {
    getRoot().querySelector(".scene-contact-sheet-layer")?.remove();
  }

  function getUnlockedContacts() {
    const state = getState();
    const contacts = state.unlockedContacts || state.officialFriends || {};
    const list = Array.isArray(contacts) ? contacts : Object.values(contacts);
    return list.length ? list : [{ id: DEFAULT_CHARACTER_ID, name: "Bang Chan", initial: "BC" }];
  }

  function goChat(characterId) {
    if (typeof router.go === "function") {
      router.go("chat", { activeId: characterId });
    } else if (typeof router.navigate === "function") {
      router.navigate("chat", { activeId: characterId });
    }
  }

  function resumeActiveScene() {
    const scene = getActiveSceneSession(getState());
    if (!scene) return;
    setState({ activeChatAgent: scene.characterId, resumeActiveScene: true });
    goChat(scene.characterId);
  }

  function showLeaveConfirm(targetPlaceId, activeScene) {
    closeLeaveConfirm();
    getRoot().insertAdjacentHTML("beforeend", renderLeaveConfirm(activeScene));
    getRoot().querySelector("[data-scene-close-leave]").addEventListener("click", closeLeaveConfirm);
    getRoot().querySelector("[data-scene-confirm-leave]").addEventListener("click", () => {
      endActiveSceneFromMap(activeScene);
    });
    getRoot().querySelector("[data-scene-return-active]").addEventListener("click", () => {
      closeLeaveConfirm();
      resumeActiveScene();
    });
  }

  function closeLeaveConfirm() {
    getRoot().querySelector(".scene-leave-modal-layer")?.remove();
  }

  function endActiveSceneFromMap(activeScene) {
    const state = getState();
    const streams = state.chatStreams || state.messagesByCharacter || {};
    const characterId = activeScene.characterId;
    const nextStreams = {
      ...streams,
      [characterId]: [
        ...(streams[characterId] || []),
        {
          id: `scene-left-${Date.now()}`,
          role: "idol",
          text: "You left so suddenly without saying anything.",
          createdAt: new Date().toISOString(),
        },
      ],
    };
    const contacts = state.unlockedContacts || {};
    const nextContacts = { ...(Array.isArray(contacts) ? {} : contacts) };
    if (nextContacts[characterId]) {
      const last = nextStreams[characterId][nextStreams[characterId].length - 1];
      nextContacts[characterId] = {
        ...nextContacts[characterId],
        lastMsg: last.text,
        previewText: last.text,
        lastMessageType: "text",
        lastMessageAt: last.createdAt,
        unreadCount: 1,
        hasNewMsg: true,
      };
    }
    setState({
      activeSceneSession: null,
      activeSceneBackdrop: null,
      chatStreams: nextStreams,
      messagesByCharacter: nextStreams,
      unlockedContacts: nextContacts,
      officialFriends: Object.values(nextContacts),
      chatUnread: true,
    });
    closeLeaveConfirm();
    renderSceneMain();
  }

  return {
    name: "scene",
    route: "scene",
    places: GeneralLifeScenes,
    renderSceneMain,
    renderSceneDetail,
    renderMap: renderSceneMain,
    renderPlace: renderSceneDetail,
    sendDateInvite,
    onEnter,
    onLeave: closeContactSheet,
  };
}

function renderSceneHotspot(place, activeScene = null) {
  const mapSpot = MAP_LABELS[place.id];
  const hasActiveHere = activeScene?.placeId === place.id;
  if (mapSpot) {
    return `
      <button
        type="button"
        class="scene-map-hotspot scene-map-hotspot-${place.id} ${hasActiveHere ? "has-active-scene" : ""}"
        data-place-id="${place.id}"
        aria-label="${escapeAttr(place.name)}"
        style="--x:${mapSpot.x}%;--y:${mapSpot.y}%;--w:${mapSpot.w}%;--h:${mapSpot.h}%;--sx:${mapSpot.sx}%;--sy:${mapSpot.sy}%;--delay:${mapSpot.delay || 0}s"
      >
        <span>${escapeHtml(place.name)}</span>
        ${hasActiveHere ? renderActiveSceneMarker(activeScene) : ""}
      </button>
    `;
  }

  return `
    <button type="button" class="scene-image-card" data-place-id="${place.id}" aria-label="${escapeAttr(place.name)}">
      <img src="${escapeAttr(place.imageUrl)}" alt="${escapeAttr(place.name)}" />
    </button>
  `;
}

function renderActiveSceneMarker(activeScene) {
  const image = activeScene.characterImage || "";
  const name = activeScene.characterName || "";
  return `
    <span class="scene-active-marker" aria-label="Scene in progress with ${escapeAttr(name)}">
      ${image ? `<img src="${escapeAttr(image)}" alt="${escapeAttr(name)}" />` : `<i>${escapeHtml(name.slice(0, 1) || "!")}</i>`}
      <b>!</b>
    </span>
  `;
}

function renderLeaveConfirm(activeScene) {
  return `
    <div class="scene-leave-modal-layer">
      <div class="scene-leave-scrim"></div>
      <article class="scene-leave-modal">
        <button type="button" class="scene-leave-close" data-scene-close-leave aria-label="Close">×</button>
        <h3>You are still at ${escapeHtml(activeScene.placeName)} with ${escapeHtml(activeScene.characterName)}</h3>
        <p>Leave this Scene now?</p>
        <div>
          <button type="button" data-scene-confirm-leave>Leave Scene</button>
          <button type="button" data-scene-return-active>Go Back</button>
        </div>
      </article>
    </div>
  `;
}

function getActiveSceneSession(state = {}) {
  return state.activeSceneSession || state.activeSceneBackdrop || null;
}

function renderActionLine(placeId, event, index) {
  const normalized = normalizeSceneEvent(event);
  return `
    <article class="scene-action-line">
      <div>
        <strong>${escapeHtml(normalized.label)}</strong>
      </div>
      <button type="button" data-scene-invite data-place-id="${placeId}" data-event-index="${index}">Invite</button>
    </article>
  `;
}

function getSceneEvent(place, index) {
  return normalizeSceneEvent(place?.events?.[Number(index)] || place?.events?.[0] || {});
}

function normalizeSceneEvent(event) {
  if (typeof event === "string") return { label: event, draft: event };
  return {
    label: event?.label || "Send Invite",
    draft: event?.draft || event?.label || "",
  };
}

function renderContactSheet(contacts) {
  return `
    <div class="scene-contact-sheet-layer">
      <button type="button" class="scene-contact-scrim" data-scene-sheet-close aria-label="Close"></button>
      <aside class="scene-contact-sheet">
        <div class="scene-contact-handle"></div>
        <span>${uiCopy.scene.inviteLabel}</span>
        <h3>Choose a Character</h3>
        <div class="scene-contact-picks">
          ${contacts.map(renderContactPick).join("")}
        </div>
      </aside>
    </div>
  `;
}

function renderContactPick(contact) {
  const id = contact.id || contact.characterId || DEFAULT_CHARACTER_ID;
  const name = contact.name || contact.displayName || "Bang Chan";
  const initial = contact.initial || name.slice(0, 2).toUpperCase();
  const image = contact.image || contact.avatar;
  return `
    <button type="button" class="scene-contact-pick" data-scene-contact="${escapeAttr(id)}">
      ${image ? `<img src="${escapeAttr(image)}" alt="${escapeAttr(name)}" />` : `<i>${escapeHtml(initial)}</i>`}
      <strong>${escapeHtml(name)}</strong>
    </button>
  `;
}

function injectStyles(doc) {
  doc.getElementById(STYLE_ID)?.remove();
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .scene-city{position:absolute;inset:0;padding:0;background:radial-gradient(circle at 74% 14%,rgba(148,184,255,.14),transparent 28%),radial-gradient(circle at 18% 76%,rgba(201,169,110,.1),transparent 28%),linear-gradient(180deg,#10141b 0%,#0d1015 58%,#07090c 100%);color:var(--text);overflow:hidden}
    .scene-main-view:before{content:"";position:absolute;z-index:6;inset:0;background:linear-gradient(30deg,rgba(255,255,255,.026) 1px,transparent 1px),linear-gradient(150deg,rgba(255,255,255,.02) 1px,transparent 1px);background-size:58px 58px,58px 58px;opacity:.36;pointer-events:none}
    .scene-map-view{background:#101823}.scene-city-map{position:absolute;z-index:4;inset:0;overflow:hidden;background:#0f1722}.scene-city-map:after{content:"";position:absolute;inset:0;background:linear-gradient(to bottom,rgba(5,7,12,.12),transparent 18%,transparent 74%,rgba(5,7,12,.48)),radial-gradient(circle at 50% 38%,transparent 46%,rgba(0,0,0,.12));pointer-events:none}.scene-city-map img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;filter:saturate(1.08) contrast(1.03)}
    .scene-map-hotspot{position:absolute;z-index:8;left:var(--x);top:var(--y);width:var(--w);height:var(--h);padding:0;border:1px solid rgba(255,255,255,0);border-radius:8px;background:rgba(255,255,255,0);color:#fff;transition:background .18s ease,border-color .18s ease,box-shadow .18s ease,transform .18s ease;-webkit-tap-highlight-color:transparent}.scene-map-hotspot:before{content:"";position:absolute;left:var(--sx);top:var(--sy);width:11px;height:11px;border-radius:50%;background:#fff5d5;border:2px solid rgba(120,164,255,.92);box-shadow:0 0 0 5px rgba(120,164,255,.18),0 0 26px rgba(255,255,255,.62);transform:translate(-50%,-50%);opacity:.78;animation:scenePinPulse 1.8s ease-in-out infinite;animation-delay:var(--delay);transition:opacity .18s ease,transform .18s ease}.scene-map-hotspot span{position:absolute;left:var(--sx);top:var(--sy);display:block;min-width:48px;padding:6px 9px;border:1px solid rgba(255,255,255,.48);border-radius:6px;background:rgba(13,19,32,.76);box-shadow:0 10px 28px rgba(0,0,0,.36),0 0 20px rgba(132,166,255,.3),inset 0 1px 0 rgba(255,255,255,.24);backdrop-filter:blur(8px);color:#fff;font-size:14px;font-weight:900;line-height:1;text-align:center;text-shadow:0 0 12px rgba(119,158,255,.78),0 2px 8px rgba(0,0,0,.48);white-space:nowrap;transform:translate(-50%,calc(-100% - 9px));pointer-events:none;animation:sceneSignBlink 1.8s ease-in-out infinite;animation-delay:var(--delay)}.scene-map-hotspot span:after{content:"";position:absolute;left:50%;bottom:-6px;width:10px;height:10px;background:rgba(13,19,32,.76);border-right:1px solid rgba(255,255,255,.32);border-bottom:1px solid rgba(255,255,255,.32);transform:translateX(-50%) rotate(45deg)}
    .scene-map-hotspot .scene-active-marker{position:absolute;z-index:9;left:calc(var(--sx) + 34px);top:var(--sy);display:flex;align-items:center;gap:4px;min-width:0;padding:0;border:0;border-radius:0;background:transparent;box-shadow:none;backdrop-filter:none;color:inherit;font-size:inherit;font-weight:inherit;line-height:1;text-align:left;text-shadow:none;white-space:nowrap;transform:translateY(calc(-100% - 9px));animation:none;pointer-events:none}.scene-map-hotspot .scene-active-marker:after{display:none}.scene-map-hotspot .scene-active-marker img,.scene-map-hotspot .scene-active-marker i{width:26px;height:26px;border-radius:50%;object-fit:cover;display:grid;place-items:center;border:2px solid #ffd6e5;background:rgba(255,138,174,.22);color:#fff;font-style:normal;font-size:11px;font-weight:900;box-shadow:0 0 0 4px rgba(255,138,174,.2),0 0 18px rgba(255,138,174,.58)}.scene-map-hotspot .scene-active-marker b{width:18px;height:18px;display:grid;place-items:center;border-radius:50%;background:#ffd6e5;color:#25101a;font-size:14px;font-weight:1000;line-height:1;box-shadow:0 0 18px rgba(255,138,174,.82);animation:sceneAlertBlink .78s ease-in-out infinite}.scene-map-hotspot.has-active-scene:before{background:#ffd6e5;border-color:#ff8aae;box-shadow:0 0 0 7px rgba(255,138,174,.2),0 0 34px rgba(255,138,174,.72)}
    .scene-map-hotspot:active{transform:scale(.985);background:rgba(132,166,255,.08);border-color:rgba(255,255,255,.18);box-shadow:inset 0 0 28px rgba(255,255,255,.08)}.scene-map-hotspot:active:before{opacity:1;transform:translate(-50%,-50%) scale(1.14)}
    .scene-window-grid{position:absolute;z-index:4;left:0;right:0;top:132px;height:526px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:243px;gap:10px 6px;padding:0 10px;overflow-y:auto;overflow-x:hidden;scrollbar-width:none;mask-image:linear-gradient(to bottom,#000 0,#000 95%,rgba(0,0,0,.24) 100%)}.scene-window-grid::-webkit-scrollbar{display:none}
    .scene-map-fog{position:absolute;z-index:1;border-radius:50%;filter:blur(24px);pointer-events:none}.scene-map-fog-one{right:8%;top:8%;width:230px;height:108px;background:rgba(190,200,210,.12)}.scene-map-fog-two{left:10%;bottom:18%;width:220px;height:96px;background:rgba(201,169,110,.08)}
    .scene-image-card{position:relative;z-index:3;display:block;width:100%;height:100%;padding:0;border:1px solid rgba(255,255,255,.1);border-radius:16px;background:#0b0d10;overflow:hidden;box-shadow:0 24px 52px rgba(0,0,0,.48),inset 0 1px 0 rgba(255,255,255,.12);transition:transform .26s ease,filter .26s ease,border-color .26s ease;-webkit-tap-highlight-color:transparent}.scene-image-card:active{transform:translateY(4px) scale(.985);filter:brightness(.94);border-color:rgba(201,169,110,.42)}
    .scene-image-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;filter:saturate(1.03) contrast(1.02)}.scene-image-card:after{content:"";position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.02),transparent 62%,rgba(0,0,0,.08));pointer-events:none}
    .scene-window-transition,.scene-return-transition{position:absolute;z-index:90;inset:0;display:grid;place-items:center;pointer-events:none;overflow:hidden;background:rgba(4,6,8,.05)}.scene-window-transition:after,.scene-return-transition:after{content:"";position:absolute;inset:0;background:rgba(255,248,232,0);transition:background .48s ease .32s}.scene-window-transition.zooming:after{background:rgba(255,248,232,.78)}
    .scene-transition-window{position:relative;width:46%;height:28%;border-radius:20px;box-shadow:0 32px 90px rgba(0,0,0,.52);overflow:visible;transform:scale(1);transition:transform .78s cubic-bezier(.18,.86,.22,1),filter .78s ease,opacity .78s ease}.scene-window-transition.zooming .scene-transition-window{transform:scale(4.25);filter:blur(1.4px) saturate(1.08);opacity:.98}.scene-transition-window img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:20px}.scene-transition-window:before{content:"";position:absolute;z-index:2;inset:0;border-radius:20px;background:linear-gradient(90deg,rgba(255,255,255,.2),rgba(255,255,255,.04));transform-origin:left center;transition:transform .52s cubic-bezier(.2,.78,.2,1),opacity .42s ease}.scene-window-transition.zooming .scene-transition-window:before{transform:perspective(520px) rotateY(-72deg) translateZ(38px);opacity:.5}.scene-transition-window em{position:absolute;z-index:3;inset:0;border-radius:20px;background:linear-gradient(90deg,rgba(255,255,255,.16),rgba(255,255,255,0));transform-origin:left center;transition:transform .52s cubic-bezier(.2,.78,.2,1),opacity .42s ease}.scene-window-transition.zooming .scene-transition-window em{transform:perspective(520px) rotateY(-74deg) translateZ(42px);opacity:.42}.scene-window-transition>i,.scene-return-transition>i{position:absolute;z-index:5;width:24px;height:24px;border-radius:50%;background:rgba(255,255,255,.9);filter:blur(13px);transform:scale(0);transition:transform .48s ease .34s,opacity .48s ease .34s;opacity:.92}.scene-window-transition.zooming>i{transform:scale(24);opacity:0}.scene-return-transition{background:rgba(255,248,232,.45);animation:sceneReturn .42s ease forwards}
    .scene-detail-view{padding:0;background:#07080d;animation:scenePanelIn .34s ease}.scene-detail-hero{position:absolute;inset:0 0 auto;height:318px;background-image:linear-gradient(to bottom,rgba(5,6,10,.1),rgba(5,6,10,.1) 48%,rgba(5,6,10,.62)),var(--place-img);background-size:cover;background-position:center;overflow:hidden}.scene-detail-hero:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 72% 18%,rgba(255,138,174,.13),transparent 28%);pointer-events:none}.scene-back{position:absolute;z-index:4;left:24px;top:64px;width:44px;height:44px;border-radius:50%;background:rgba(12,13,21,.44);border:1px solid rgba(255,255,255,.18);color:#fff9ff;font-size:28px;line-height:1;backdrop-filter:blur(16px);box-shadow:0 12px 32px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.12)}
    .scene-place-panel{position:absolute;z-index:5;left:18px;right:18px;top:248px;bottom:88px;display:flex;flex-direction:column;padding:22px 18px 18px;border:1px solid rgba(255,255,255,.16);border-radius:26px;background:linear-gradient(145deg,rgba(255,255,255,.13),rgba(255,138,174,.045)),rgba(16,17,25,.72);box-shadow:0 26px 80px rgba(0,0,0,.5),0 0 26px rgba(255,138,174,.12),inset 0 1px 0 rgba(255,255,255,.16);backdrop-filter:blur(24px) saturate(1.08)}.scene-place-copy h2{font-family:var(--font-serif);font-size:34px;font-weight:500;line-height:1.08;color:#fff9ff;text-shadow:0 12px 34px rgba(0,0,0,.38)}.scene-place-copy p{max-width:300px;margin-top:12px;color:rgba(255,249,255,.72);font-size:13px;line-height:1.55}.scene-event-label{margin-top:22px;color:rgba(255,249,255,.86);font-size:12px;font-weight:900;letter-spacing:.02em}
    .scene-action-lines{position:relative;z-index:3;display:flex;flex-direction:column;gap:10px;min-height:0;overflow-y:auto;margin-top:12px;padding-bottom:8px;scrollbar-width:none}.scene-action-lines::-webkit-scrollbar{display:none}.scene-action-line{display:grid;grid-template-columns:1fr auto;align-items:center;gap:14px;min-height:62px;padding:10px 12px 10px 14px;border:1px solid rgba(255,255,255,.13);border-radius:18px;background:rgba(255,255,255,.055);box-shadow:inset 0 1px 0 rgba(255,255,255,.08)}.scene-action-line strong{display:block;color:#fff9ff;font-size:16px;font-weight:750;line-height:1.22}.scene-action-line button{min-width:68px;border:1px solid rgba(255,255,255,.2);border-radius:999px;background:rgba(255,255,255,.06);color:#fff9ff;font-size:12px;font-weight:850;padding:10px 14px;backdrop-filter:blur(12px)}
    .scene-contact-sheet-layer{position:absolute;z-index:150;inset:0;display:flex;align-items:flex-end;padding-bottom:112px}.scene-contact-scrim{position:absolute;inset:0;background:rgba(0,0,0,.52);backdrop-filter:blur(7px)}.scene-contact-sheet{position:relative;width:100%;max-height:286px;padding:10px 18px 18px;border-radius:26px;background:linear-gradient(145deg,rgba(255,255,255,.12),rgba(255,255,255,.045)),rgba(18,19,23,.9);border:1px solid rgba(255,255,255,.14);box-shadow:0 -24px 80px rgba(0,0,0,.48),inset 0 1px 0 rgba(255,255,255,.14);backdrop-filter:blur(24px)}.scene-contact-handle{width:42px;height:4px;border-radius:4px;background:rgba(255,255,255,.22);margin:0 auto 16px}.scene-contact-sheet span{font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:rgba(201,169,110,.72)}.scene-contact-sheet h3{margin-top:5px;font-size:18px;font-weight:600}.scene-contact-picks{display:flex;gap:10px;overflow-x:auto;margin-top:16px;padding-bottom:4px;scrollbar-width:none}.scene-contact-picks::-webkit-scrollbar{display:none}.scene-contact-pick{min-width:118px;min-height:118px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;padding:14px 10px;border:1px solid rgba(255,255,255,.12);border-radius:18px;background:rgba(255,255,255,.07);color:var(--cream)}.scene-contact-pick img,.scene-contact-pick i{width:54px;height:54px;border-radius:50%;object-fit:cover;background:rgba(201,169,110,.14);border:1px solid rgba(201,169,110,.36);display:grid;place-items:center;color:var(--gold);font-style:normal;font-size:12px;font-weight:800}.scene-contact-pick strong{font-size:12px;line-height:1.2;white-space:nowrap}
    .scene-leave-modal-layer{position:absolute;z-index:180;inset:0;display:grid;place-items:center;padding:18px}.scene-leave-scrim{position:absolute;inset:0;background:rgba(0,0,0,.58);backdrop-filter:blur(8px)}.scene-leave-modal{position:relative;width:100%;padding:20px;border:1px solid rgba(255,255,255,.16);border-radius:20px;background:linear-gradient(145deg,rgba(255,255,255,.14),rgba(255,138,174,.055)),rgba(18,19,25,.92);box-shadow:0 28px 90px rgba(0,0,0,.54),inset 0 1px 0 rgba(255,255,255,.14);color:#fff9ff}.scene-leave-close{position:absolute;right:12px;top:12px;width:32px;height:32px;min-height:0!important;display:grid;place-items:center;border:1px solid rgba(255,255,255,.16)!important;border-radius:50%!important;background:rgba(255,255,255,.08)!important;color:#fff9ff!important;font-size:22px!important;font-weight:500!important;line-height:1!important}.scene-leave-modal h3{padding-right:34px;font-size:18px;line-height:1.3}.scene-leave-modal p{margin-top:9px;color:rgba(255,249,255,.68);font-size:13px}.scene-leave-modal div{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}.scene-leave-modal div button{min-height:42px;border-radius:14px;font-size:13px;font-weight:850}.scene-leave-modal div button:first-child{background:linear-gradient(135deg,#ffd6e5,#ff8aae 60%,#c25b84);color:#25101a}.scene-leave-modal div button:last-child{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.08);color:#fff9ff}
    @keyframes sceneSignBlink{0%,100%{opacity:.62;filter:brightness(.82);box-shadow:0 10px 28px rgba(0,0,0,.36),0 0 12px rgba(132,166,255,.16),inset 0 1px 0 rgba(255,255,255,.18)}45%,62%{opacity:1;filter:brightness(1.22);box-shadow:0 10px 28px rgba(0,0,0,.36),0 0 26px rgba(132,166,255,.55),0 0 12px rgba(255,245,213,.34),inset 0 1px 0 rgba(255,255,255,.34)}}@keyframes scenePinPulse{0%,100%{opacity:.56;box-shadow:0 0 0 4px rgba(120,164,255,.12),0 0 18px rgba(255,255,255,.42)}48%,62%{opacity:1;transform:translate(-50%,-50%) scale(1.18);box-shadow:0 0 0 8px rgba(120,164,255,.24),0 0 32px rgba(255,255,255,.86)}}@keyframes sceneAlertBlink{0%,100%{opacity:.28;transform:scale(.82)}45%,62%{opacity:1;transform:scale(1.12)}}@keyframes scenePanelIn{from{opacity:0;transform:scale(1.03)}to{opacity:1;transform:scale(1)}}@keyframes sceneReturn{from{opacity:1;transform:scale(1.02)}to{opacity:0;transform:scale(.96)}}
  `;
  doc.head.appendChild(style);
}

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
