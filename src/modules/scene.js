import { uiCopy } from "../ui/copy-library.js";
import { sceneImages } from "../ui/image-library.js";

export const GeneralLifeScenes = {
  coffee_shop: {
    id: "coffee_shop",
    name: "咖啡厅",
    imageUrl: sceneImages.coffee_shop,
    description: "A quiet corner for soft conversations, warm lights, and the kind of small surprise that lingers.",
    defaultDraft: "这里的座位很安静，突然想和你喝杯咖啡了。来吗？",
    shortDraft: "要一起喝杯咖啡吗？",
    events: [
      {
        label: "尝尝冰淇淋布丁",
        draft: "我听说这家店刚出炉的冰淇淋布丁很好吃，想去尝尝，晚点有空吗？",
      },
      {
        label: "一起听新专辑",
        draft: "想找个安静靠窗的座位，和你一起听一下最近新出的专辑，吹吹风。",
      },
      {
        label: "露天座位放空",
        draft: "刚好在附近办完事，要不要去买杯浓缩冰美式，坐在露天座位放空一下？",
      },
      {
        label: "给布朗尼评分",
        draft: "我带了自己在家烤出来的巧克力布朗尼，想找个地方给你当下午茶评个分。",
      },
    ],
  },
  park: {
    id: "park",
    name: "公园",
    imageUrl: sceneImages.park,
    description: "A gentle place for evening wind, slow walks, and moments that can unfold without rushing.",
    defaultDraft: "今天天气特别舒服，如果你有空，要不要一起走走？",
    shortDraft: "要去吹吹风吗？",
    events: [
      {
        label: "骑双人自行车",
        draft: "听说那边的双人自行车挺好玩的，想去骑一圈，有空吗？",
      },
      {
        label: "散步看樱花落叶",
        draft: "沿湖的樱花/落叶刚好很好看，要不要一起去散散步？",
      },
      {
        label: "长椅吹风听歌",
        draft: "刚买了个新耳机，想去长椅上吹风听歌，要一起吗？",
      },
      {
        label: "去草坪看落日",
        draft: "听人说今天傍晚在草坪那能看到绝美的落日，想去散个步，一起吗？",
      },
    ],
  },
  convenience_store: {
    id: "convenience_store",
    name: "便利店",
    imageUrl: sceneImages.convenience_store,
    description: "A late-night stop for snacks, banana milk, and ordinary choices that start to feel intimate.",
    defaultDraft: "你在干嘛？要不要一起去便利店觅食？",
    shortDraft: "要一起去便利店觅食吗？",
    events: [
      {
        label: "碰运气买薄荷巧克冰",
        draft: "听说那款很难买的薄荷巧克力冰淇淋补货了，想去碰碰运气，要不要一起？",
      },
      {
        label: "买零食和香蕉牛奶",
        draft: "突然有点饿，想去扫荡一圈零食，顺便买两盒香蕉牛奶，一起去觅食吗？",
      },
      {
        label: "碰运气买香蕉牛奶",
        draft: "听说那款很难买的香蕉牛奶补货了，想去碰碰运气，你在干嘛？",
      },
      {
        label: "去吃热气有关东煮",
        draft: "今天这个天气太适合去吃一碗热气腾腾的关东煮了吧，要一起去便利店吗？",
      },
      {
        label: "一起分担便利店拉面",
        draft: "想要去吃一碗热气腾腾的便利店拉面，还缺个一起帮我分担配菜的人，去吗？",
      },
    ],
  },
  mall: {
    id: "mall",
    name: "商场",
    imageUrl: sceneImages.mall,
    description: "A bright glass atrium for window shopping, small gifts, and finding reasons to walk one more floor together.",
    defaultDraft: "我刚好在商场附近，要不要一起逛逛？",
    shortDraft: "要一起逛商场吗？",
    events: [
      {
        label: "挑一份临时礼物",
        draft: "我想在商场里挑一份小礼物，但选择困难症突然发作了，可以来帮我看看吗？",
      },
      {
        label: "去顶层看城市夜景",
        draft: "听说商场顶层的玻璃廊桥夜景很好看，要不要一起上去吹吹风？",
      },
      {
        label: "买同款香氛小样",
        draft: "路过香氛店闻到一个很适合你的味道，想让你本人来确认一下，要来吗？",
      },
      {
        label: "在甜品店短暂休息",
        draft: "今天走得有点累，想找家甜品店坐十分钟，如果你也在附近的话一起吧？",
      },
    ],
  },
  apartment: {
    id: "apartment",
    name: "公寓",
    imageUrl: sceneImages.apartment,
    description: "A warm residential block where ordinary lights, balconies, and late arrivals can feel unexpectedly close.",
    defaultDraft: "我到公寓楼下了，想见你一面。",
    shortDraft: "可以下来见一面吗？",
    events: [
      {
        label: "楼下递一杯热饮",
        draft: "我路过公寓楼下，给你带了杯热饮，不打扰太久，可以下来拿一下吗？",
      },
      {
        label: "阳台看城市灯光",
        draft: "今晚城市灯光特别漂亮，想和你在阳台边站一会儿，可以吗？",
      },
      {
        label: "门口交换晚安",
        draft: "只是想在公寓门口和你说一句晚安，见一小会儿就好。",
      },
      {
        label: "一起等外卖到达",
        draft: "我点的外卖好像快到了，要不要一起在楼下等，顺便分你一份？",
      },
    ],
  },
  practice_room: {
    id: "practice_room",
    name: "练习室",
    imageUrl: sceneImages.practice_room,
    description: "A private after-hours room where music, breath, and unfinished choreography stay close.",
    defaultDraft: "今天练得还顺利吗？稍微休息一下，我过去陪你坐会儿好不好？",
    shortDraft: "我过去陪你坐会儿好不好？",
    events: [
      {
        label: "送运动饮料能量补给",
        draft: "我顺路买了几瓶运动饮料和冰水，想送去工作室当你的“能量补给”，稍微休息一下吧？",
      },
      {
        label: "偷偷看新编舞排练",
        draft: "今天练得还顺利吗？想偷偷去看看你们今天新编舞排练得怎么样了，我过去陪你坐会儿好不好？",
      },
      {
        label: "当哼唱的第一位听众",
        draft: "突然很想听你不用麦克风、最原汁原味的哼唱，能去当你的第一个听众吗？",
      },
      {
        label: "躺木地板看天花板放空",
        draft: "在外面忙累了，想去你那借个角落，直接躺在木地板上看天花板放空一下，可以吗？",
      },
    ],
  },
  company: {
    id: "company",
    name: "公司",
    imageUrl: sceneImages.company,
    description: "A glowing building full of schedules, glass reflections, and chances to meet between busy hours.",
    defaultDraft: "今天在公司吗？突然就想见见你了。",
    shortDraft: "突然就想见见你了。",
    events: [
      {
        label: "送温热浓可可解压",
        draft: "我顺路给你带了一杯温热的浓可可，想送去给今天满负荷运转的你解压，在公司吗？",
      },
      {
        label: "去空中花园吹风看夜景",
        draft: "听人说公司高层的空中花园夜景很好看，好想去看看，去那吹吹风醒醒脑，今天在公司吗？",
      },
      {
        label: "用员工卡抢最后三明治",
        draft: "忙了一整天肚子饿扁了，突然就想见见你了，能用你的员工卡去餐厅抢最后的三明治吗？",
      },
      {
        label: "办完事顺路见个面",
        draft: "刚好在附近办完事，就想来找你见个面，今天在公司吗？",
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
        <section class="scene-city-map" aria-label="城市场景地图">
          <img src="${escapeAttr(sceneImages.city_map)}" alt="城市场景地图" />
          ${MAP_SCENE_IDS.map((id) => renderSceneHotspot(GeneralLifeScenes[id])).join("")}
        </section>
      </div>
    `;

    root.querySelectorAll("[data-place-id]").forEach((hotspot) => {
      hotspot.addEventListener("click", () => playWindowZoomTransition(hotspot.dataset.placeId));
    });
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
          <button type="button" class="scene-back" data-scene-back aria-label="返回">‹</button>
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
    const place = GeneralLifeScenes[placeId];
    const event = getSceneEvent(place, eventIndex);
    const eventName = event.label;
    const draftText = event.draft || place.defaultDraft;

    setState({
      activeChatAgent: characterId,
      pendingSceneInvite: {
        characterId,
        placeId,
        placeName: place.name,
        eventName,
        eventDraft: draftText,
        defaultDraft: place.defaultDraft,
        shortDraft: place.shortDraft,
        draftText,
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

function renderSceneHotspot(place) {
  const mapSpot = MAP_LABELS[place.id];
  if (mapSpot) {
    return `
      <button
        type="button"
        class="scene-map-hotspot scene-map-hotspot-${place.id}"
        data-place-id="${place.id}"
        aria-label="${escapeAttr(place.name)}"
        style="--x:${mapSpot.x}%;--y:${mapSpot.y}%;--w:${mapSpot.w}%;--h:${mapSpot.h}%;--sx:${mapSpot.sx}%;--sy:${mapSpot.sy}%;--delay:${mapSpot.delay || 0}s"
      >
        <span>${escapeHtml(place.name)}</span>
      </button>
    `;
  }

  return `
    <button type="button" class="scene-image-card" data-place-id="${place.id}" aria-label="${escapeAttr(place.name)}">
      <img src="${escapeAttr(place.imageUrl)}" alt="${escapeAttr(place.name)}" />
    </button>
  `;
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
    label: event?.label || "发起邀约",
    draft: event?.draft || event?.label || "",
  };
}

function renderContactSheet(contacts) {
  return `
    <div class="scene-contact-sheet-layer">
      <button type="button" class="scene-contact-scrim" data-scene-sheet-close aria-label="关闭"></button>
      <aside class="scene-contact-sheet">
        <div class="scene-contact-handle"></div>
        <span>${uiCopy.scene.inviteLabel}</span>
        <h3>选择角色</h3>
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
    @keyframes sceneSignBlink{0%,100%{opacity:.62;filter:brightness(.82);box-shadow:0 10px 28px rgba(0,0,0,.36),0 0 12px rgba(132,166,255,.16),inset 0 1px 0 rgba(255,255,255,.18)}45%,62%{opacity:1;filter:brightness(1.22);box-shadow:0 10px 28px rgba(0,0,0,.36),0 0 26px rgba(132,166,255,.55),0 0 12px rgba(255,245,213,.34),inset 0 1px 0 rgba(255,255,255,.34)}}@keyframes scenePinPulse{0%,100%{opacity:.56;box-shadow:0 0 0 4px rgba(120,164,255,.12),0 0 18px rgba(255,255,255,.42)}48%,62%{opacity:1;transform:translate(-50%,-50%) scale(1.18);box-shadow:0 0 0 8px rgba(120,164,255,.24),0 0 32px rgba(255,255,255,.86)}}@keyframes scenePanelIn{from{opacity:0;transform:scale(1.03)}to{opacity:1;transform:scale(1)}}@keyframes sceneReturn{from{opacity:1;transform:scale(1.02)}to{opacity:0;transform:scale(.96)}}
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
