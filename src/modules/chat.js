import { createMemoryObject, persistMemoryCapsules } from "./home.js";
import { uiCopy } from "../ui/copy-library.js";
import { remoteSceneImages } from "../ui/image-library.js";

const STYLE_ID = "chat-module-styles";
const DEFAULT_FIRST_MESSAGE = "对了，刚刚忘了问你，你叫什么名字了。";
const SCENE_BACKGROUNDS = {
  coffee_shop: `linear-gradient(to top,rgba(9,9,9,.88),rgba(9,9,9,.28)),url('${remoteSceneImages.coffeeShop}')`,
  park: `linear-gradient(to top,rgba(9,9,9,.88),rgba(9,9,9,.24)),url('${remoteSceneImages.park}')`,
  convenience_store: `linear-gradient(to top,rgba(9,9,9,.88),rgba(9,9,9,.25)),url('${remoteSceneImages.convenienceStore}')`,
  practice_room: `linear-gradient(to top,rgba(9,9,9,.9),rgba(9,9,9,.28)),url('${remoteSceneImages.practiceRoom}')`,
  company: `linear-gradient(to top,rgba(9,9,9,.88),rgba(9,9,9,.24)),url('${remoteSceneImages.company}')`,
};
const SCENE_META = {
  coffee_shop: {
    placeName: "咖啡厅",
    voiceover: "窗边的光落在木质桌面上，咖啡机的蒸汽声轻轻散开。你们把声音放得很低，像怕惊动这个安静的下午。",
    opener: "这家店比我想的还安静。刚好，可以慢慢听你说话。",
    memoryTitle: "《靠窗座位的下午茶评审》",
  },
  park: {
    placeName: "公园",
    voiceover: "傍晚的风穿过树叶，长椅旁的光影慢慢移动。你们并排坐着，没有急着说话，城市的声音在远处变得很轻。",
    opener: "今天的风真的很舒服。这样坐着，感觉时间都慢下来了。",
    memoryTitle: "《初夏公园的并肩晚风》",
  },
  convenience_store: {
    placeName: "便利店",
    voiceover: "便利店的玻璃门映出暖黄色灯光，冰柜轻轻嗡鸣。你们站在货架之间，像把深夜切出了一小块只属于彼此的空间。",
    opener: "这种时间来便利店，好像连普通零食都会变得特别一点。",
    memoryTitle: "《深夜便利店的香蕉牛奶》",
  },
  practice_room: {
    placeName: "练习室",
    voiceover:
      "练习室的落地镜倒映着明晃晃的灯光，空气里有些许刚排练完的温热。音响被关掉了，四周很静，你走到角落坐下，他正偏头看着你，眼底带着一丝刚运动完的微光。",
    opener: "刚才那段新歌的编舞动作，还没有人看过哦，你是第一个看的人",
    memoryTitle: "《深夜练习室的独家听众》",
  },
  company: {
    placeName: "公司",
    voiceover: "电梯厅的灯光安静地亮着，玻璃窗外的城市像一片缓慢移动的星河。忙碌暂时停在门外，你们在这一刻终于见面。",
    opener: "你真的来了。刚才还觉得今天会一直忙到没有尽头。",
    memoryTitle: "《公司夜色里的短暂见面》",
  },
};

export function createChatModule(deps = {}) {
  const doc = deps.document || document;
  const rootId = deps.rootId || "screen-chat";
  const getState = deps.getState || (() => window.AppStore?.state || {});
  const setState = deps.setState || ((patch) => Object.assign(window.AppStore?.state || {}, patch));
  const router = deps.router || window.AppRouter || {};
  let activeCharacterId = null;

  function onEnter() {
    injectStyles(doc);
    ensureInitialContacts();
    const pendingInvite = getState().pendingSceneInvite;
    if (pendingInvite?.characterId) {
      renderChatDetail(pendingInvite.characterId);
      return;
    }
    renderChatList();
  }

  function getRoot() {
    const root = doc.getElementById(rootId);
    if (!root) throw new Error(`[chat] Missing root element #${rootId}`);
    return root;
  }

  function renderChatList() {
    activeCharacterId = null;
    setDetailChrome(false);
    const contacts = getUnlockedContactList();
    const root = getRoot();
    root.innerHTML = `
      <div class="chat-module chat-list-view">
        <header class="chat-list-header">
          <span>Chat</span>
          <h2>${uiCopy.chat.title}</h2>
        </header>
        <section class="chat-contact-list">
          ${
            contacts.length
              ? contacts.map(renderContactRow).join("")
              : `<p class="chat-empty">${uiCopy.chat.empty}</p>`
          }
        </section>
      </div>
    `;

    root.querySelectorAll("[data-chat-contact]").forEach((row) => {
      row.addEventListener("click", () => openContact(row.dataset.chatContact));
    });
  }

  function renderChatDetail(characterId) {
    const contact = getContact(characterId);
    if (!contact) return renderChatList();
    activeCharacterId = characterId;
    markRead(characterId);

    const root = getRoot();
    const pendingInvite = getPendingInvite(characterId);
    const sceneBg = getState().activeSceneBackdrop;
    const sceneMeta = getSceneMeta(sceneBg?.placeId);
    const draftValue = pendingInvite?.draftText || "";
    setDetailChrome(true);
    root.innerHTML = `
      <div class="chat-module chat-detail-view ${sceneBg?.placeId ? "scene-immersive" : ""}" style="${sceneBg?.background ? `--chat-scene-bg:${sceneBg.background}` : ""}">
        ${sceneBg?.placeId ? renderSceneHeader(sceneMeta) : renderStandardHeader(contact)}
        <div class="chat-detail-messages" data-chat-stream>
          ${sceneBg?.placeId ? renderVoiceover(sceneMeta) : ""}
          ${getMessageStream(characterId).map(renderMessageBubble).join("")}
        </div>
        ${pendingInvite ? renderInviteComposer(pendingInvite) : ""}
        <form class="chat-detail-input" data-chat-form>
          <input autocomplete="off" placeholder="${escapeAttr(pendingInvite?.shortDraft || uiCopy.chat.inputPlaceholder)}" value="${escapeAttr(draftValue)}" />
          <button type="submit">发送</button>
        </form>
      </div>
    `;

    root.querySelector("[data-chat-back]")?.addEventListener("click", renderChatList);
    root.querySelector("[data-chat-scene]")?.addEventListener("click", () => navigate("scene"));
    root.querySelector("[data-chat-leave-scene]")?.addEventListener("click", () => openMemoryPolaroid(characterId));
    root.querySelector("[data-chat-form]").addEventListener("submit", handleSubmit);
    if (pendingInvite) {
      const input = root.querySelector("[data-chat-form] input");
      setTimeout(() => input?.focus(), 180);
    }
    scrollToBottom();
  }

  function openContact(characterId) {
    markRead(characterId);
    renderChatDetail(characterId);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const input = event.currentTarget.querySelector("input");
    const pendingInvite = getPendingInvite(activeCharacterId);
    const text = input.value.trim() || pendingInvite?.shortDraft || "";
    if (!text || !activeCharacterId) return;
    input.value = "";
    if (pendingInvite) {
      appendMessage(activeCharacterId, {
        role: "user",
        type: "scene_invite_bundle",
        text,
        placeId: pendingInvite.placeId,
        placeName: pendingInvite.placeName,
        eventName: pendingInvite.eventName,
        createdAt: new Date().toISOString(),
      });
      clearPendingInvite();
      renderChatDetail(activeCharacterId);
      simulateSceneAccept(activeCharacterId, pendingInvite);
      return;
    }

    appendMessage(activeCharacterId, {
      role: "user",
      text,
      createdAt: new Date().toISOString(),
    });
    renderChatDetail(activeCharacterId);
  }

  function unlockContact(characterId, name, extra = {}) {
    const state = getState();
    const unlockedContacts = normalizeContactMap(state.unlockedContacts, state.officialFriends);
    const current = unlockedContacts[characterId] || {};
    unlockedContacts[characterId] = {
      id: characterId,
      name,
      initial: extra.initial || current.initial || getInitial(name),
      image: extra.image || current.image || "",
      lastMsg: extra.lastMsg || current.lastMsg || DEFAULT_FIRST_MESSAGE,
      hasNewMsg: extra.hasNewMsg ?? current.hasNewMsg ?? true,
      ...extra,
    };

    const chatStreams = normalizeStreams(state.chatStreams || state.messagesByCharacter);
    if (!chatStreams[characterId]?.length) {
      chatStreams[characterId] = [
        {
          id: `${characterId}-first`,
          role: "idol",
          text: unlockedContacts[characterId].lastMsg,
          createdAt: new Date().toISOString(),
        },
      ];
    }

    setState({
      unlockedContacts,
      officialFriends: Object.values(unlockedContacts),
      chatStreams,
      messagesByCharacter: chatStreams,
    });
    return unlockedContacts[characterId];
  }

  function ensureInitialContacts() {
    const state = getState();
    const contacts = normalizeContactMap(state.unlockedContacts, state.officialFriends);
    if (Object.keys(contacts).length) {
      setState({ unlockedContacts: contacts, officialFriends: Object.values(contacts) });
      return;
    }

    const selected = state.selected || { id: "bang_chan", name: "Bang Chan", initial: "BC", image: "" };
    unlockContact(selected.id || "bang_chan", selected.name || "Bang Chan", {
      initial: selected.initial,
      image: selected.image,
      lastMsg: DEFAULT_FIRST_MESSAGE,
      hasNewMsg: true,
    });
  }

  function markRead(characterId) {
    const state = getState();
    const unlockedContacts = normalizeContactMap(state.unlockedContacts, state.officialFriends);
    if (!unlockedContacts[characterId]) return;
    unlockedContacts[characterId] = { ...unlockedContacts[characterId], hasNewMsg: false };
    setState({
      unlockedContacts,
      officialFriends: Object.values(unlockedContacts),
      chatUnread: Object.values(unlockedContacts).some((contact) => contact.hasNewMsg),
    });
  }

  function appendMessage(characterId, message) {
    const state = getState();
    const inScene = Boolean(state.activeSceneBackdrop?.placeId);
    const streamKey = inScene ? "sceneChatStreams" : "chatStreams";
    const fallbackStreams = inScene ? state.sceneChatStreams : state.chatStreams || state.messagesByCharacter;
    const chatStreams = normalizeStreams(fallbackStreams);
    const stream = chatStreams[characterId] || [];
    const nextMessage = {
      id: `msg-${Date.now()}`,
      ...message,
    };
    chatStreams[characterId] = [...stream, nextMessage];

    const unlockedContacts = normalizeContactMap(state.unlockedContacts, state.officialFriends);
    if (unlockedContacts[characterId]) {
      unlockedContacts[characterId] = {
        ...unlockedContacts[characterId],
        lastMsg: message.text,
        hasNewMsg: false,
      };
    }

    setState({
      [streamKey]: chatStreams,
      ...(inScene ? {} : { messagesByCharacter: chatStreams }),
      unlockedContacts,
      officialFriends: Object.values(unlockedContacts),
    });
  }

  function getPendingInvite(characterId) {
    const invite = getState().pendingSceneInvite;
    return invite?.characterId === characterId ? invite : null;
  }

  function clearPendingInvite() {
    setState({ pendingSceneInvite: null });
  }

  function simulateSceneAccept(characterId, invite) {
    setTimeout(() => {
      appendMessage(characterId, {
        role: "idol",
        text: "好呀，那我们一起过去吧，你等我一下",
        createdAt: new Date().toISOString(),
      });
      renderChatDetail(characterId);
      setTimeout(() => playSceneTransition(characterId, invite), 2000);
    }, 1250);
  }

  function playSceneTransition(characterId, invite) {
    const root = getRoot();
    root.insertAdjacentHTML("beforeend", renderSceneTransition(invite));
    setTimeout(() => {
      setState({
        activeSceneBackdrop: {
          placeId: invite.placeId,
          placeName: invite.placeName,
          eventName: invite.eventName,
          memorySeed: invite.memorySeed,
          background: SCENE_BACKGROUNDS[invite.placeId] || SCENE_BACKGROUNDS.company,
        },
        sceneChatStreams: {
          ...(getState().sceneChatStreams || {}),
          [characterId]: [],
        },
      });
      root.querySelector(".chat-scene-transition")?.classList.add("fade-out");
      setTimeout(() => {
        renderChatDetail(characterId);
        appendSceneOpener(characterId, invite.placeId);
      }, 520);
    }, 2500);
  }

  function appendSceneOpener(characterId, placeId) {
    const opener = getSceneMeta(placeId).opener;
    const stream = getMessageStream(characterId);
    if (stream.some((message) => message.type === "scene_opener" && message.placeId === placeId)) return;
    setTimeout(() => {
      appendMessage(characterId, {
        role: "idol",
        type: "scene_opener",
        placeId,
        text: opener,
        createdAt: new Date().toISOString(),
      });
      renderChatDetail(characterId);
    }, 1000);
  }

  function openMemoryPolaroid(characterId) {
    const scene = getState().activeSceneBackdrop;
    if (!scene?.placeId) return renderChatList();
    const meta = getSceneMeta(scene.placeId);
    getRoot().insertAdjacentHTML("beforeend", renderMemoryOverlay(meta, scene));
    getRoot().querySelector("[data-save-memory]").addEventListener("click", () => saveMemory(characterId, meta, scene));
  }

  function saveMemory(characterId, meta, scene) {
    const state = getState();
    const chatHistorySnap = normalizeStreams(state.sceneChatStreams)[characterId] || [];
    const code = scene.placeId === "practice_room" ? "CODE-03" : "CODE-01";
    const memory = createMemoryObject({
      characterId,
      placeId: scene.placeId,
      location: meta.placeName,
      title: meta.memoryTitle,
      imageUrl: getSceneImageUrl(scene.placeId),
      content: buildMemoryContent(scene.placeId, meta.placeName),
      chatHistorySnap,
      dayCount: 1,
      displayDate: "2026.05.18",
      code,
    });
    const unlockedStoryLines = {
      ...(state.unlockedStoryLines || {}),
      [characterId]: [...(state.unlockedStoryLines?.[characterId] || []), { ...memory, fresh: true }],
    };
    persistMemoryCapsules(unlockedStoryLines);
    setState({
      activeSceneBackdrop: null,
      unlockedStoryLines,
    });
    navigate("home");
  }

  function getUnlockedContactList() {
    const state = getState();
    return Object.values(normalizeContactMap(state.unlockedContacts, state.officialFriends));
  }

  function getContact(characterId) {
    const state = getState();
    return normalizeContactMap(state.unlockedContacts, state.officialFriends)[characterId];
  }

  function getMessageStream(characterId) {
    const state = getState();
    if (state.activeSceneBackdrop?.placeId) {
      const streams = normalizeStreams(state.sceneChatStreams);
      return streams[characterId] || [];
    }
    const streams = normalizeStreams(state.chatStreams || state.messagesByCharacter);
    const contact = getContact(characterId);
    if (streams[characterId]?.length) return streams[characterId];
    return [
      {
        id: `${characterId}-first`,
        role: "idol",
        text: contact?.lastMsg || DEFAULT_FIRST_MESSAGE,
      },
    ];
  }

  function navigate(route, options) {
    if (route !== "chat") setDetailChrome(false);
    if (typeof router.go === "function") router.go(route, options);
    else if (typeof router.navigate === "function") router.navigate(route, options);
  }

  function setDetailChrome(isDetail) {
    const nav = doc.getElementById("bottomNav");
    nav?.classList.toggle("hidden", isDetail);
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      const stream = getRoot().querySelector("[data-chat-stream]");
      if (stream) stream.scrollTop = stream.scrollHeight;
    });
  }

  return {
    name: "chat",
    route: "chat",
    renderChatList,
    renderChatDetail,
    renderList: renderChatList,
    renderThread: renderChatDetail,
    unlockContact,
    appendMessage,
    onEnter,
    onLeave() {
      setDetailChrome(false);
    },
  };
}

function renderContactRow(contact) {
  return `
    <article class="chat-contact-row" data-chat-contact="${escapeAttr(contact.id)}">
      ${renderAvatar(contact)}
      <div class="chat-contact-copy">
        <strong>${escapeHtml(contact.name)}</strong>
        <p>${escapeHtml(contact.lastMsg || DEFAULT_FIRST_MESSAGE)}</p>
      </div>
      ${contact.hasNewMsg ? `<i class="chat-unread-dot" aria-label="未读"></i>` : ""}
    </article>
  `;
}

function renderAvatar(contact) {
  if (contact.image || contact.avatar) {
    return `<img class="chat-module-avatar" src="${escapeAttr(contact.image || contact.avatar)}" alt="${escapeAttr(contact.name)}" />`;
  }
  return `<div class="chat-module-avatar">${escapeHtml(contact.initial || getInitial(contact.name))}</div>`;
}

function renderStandardHeader(contact) {
  return `
    <header class="chat-detail-topbar">
      <button type="button" class="chat-back-btn" data-chat-back aria-label="返回">‹</button>
      ${renderAvatar(contact)}
      <div class="chat-title-block">
        <strong>${escapeHtml(contact.name)}</strong>
        <span>${uiCopy.chat.remoteMode}</span>
      </div>
      <button type="button" class="chat-scene-btn" data-chat-scene>场景</button>
    </header>
  `;
}

function renderSceneHeader(meta) {
  return `
    <header class="chat-scene-header">
      <button type="button" class="chat-leave-scene" data-chat-leave-scene>‹ 离开</button>
      <div class="chat-scene-coordinate">📍 城市坐标 · ${escapeHtml(meta.placeName)}</div>
    </header>
  `;
}

function renderVoiceover(meta) {
  return `<p class="chat-scene-voiceover">${escapeHtml(meta.voiceover)}</p>`;
}

function renderMessageBubble(message) {
  if (message.type === "scene_invite_bundle") {
    return `
      <div class="chat-scene-bundle bubble user">
        <div class="chat-location-card">
          <span>📍 城市坐标</span>
          <strong>${escapeHtml(message.placeName || "")}</strong>
          <p>${escapeHtml(message.eventName || "")}</p>
        </div>
        <p>${escapeHtml(message.text || "")}</p>
      </div>
    `;
  }
  const type = message.role === "user" ? "user" : "idol";
  return `<div class="bubble ${type}">${escapeHtml(message.text || message.content || "")}</div>`;
}

function renderInviteComposer(invite) {
  return `
    <div class="chat-location-pill">
      <span>📍 城市坐标 · ${escapeHtml(invite.placeName)}</span>
    </div>
  `;
}

function renderSceneTransition(invite) {
  return `
    <div class="chat-scene-transition">
      <div class="chat-transition-copy">
        <strong>正在前往 [ ${escapeHtml(invite.placeName)} ]</strong>
        <span>双向奔赴中...</span>
        <i></i>
      </div>
    </div>
  `;
}

function renderMemoryOverlay(meta, scene) {
  const body =
    scene.placeId === "practice_room"
      ? "那晚在关掉音响的练习室里，<br />你陪他并排坐在落了灰的木地板上，<br />听完了整首还未公开的 Demo。<br />空气很静，但你们的心跳声很近。"
      : "那天你们把忙碌放在身后，<br />在城市一角慢慢停下来。<br />风、灯光和一句临时邀约，<br />都变成了只属于你们的记忆。";
  const code = scene.placeId === "practice_room" ? "CODE-03" : "CODE-01";
  return `
    <div class="chat-memory-overlay">
      <article class="chat-polaroid">
        <div class="chat-polaroid-photo" style="--memory-bg:${SCENE_BACKGROUNDS[scene.placeId] || SCENE_BACKGROUNDS.company}"></div>
        <div class="chat-polaroid-copy">
          <h3>${escapeHtml(meta.memoryTitle)}</h3>
          <p>${body}</p>
          <span>📅 2026.05.18 · 📍 ${escapeHtml(meta.placeName)} ${code}</span>
        </div>
        <button type="button" data-save-memory>收藏这段记忆</button>
      </article>
    </div>
  `;
}

function getSceneMeta(placeId) {
  return SCENE_META[placeId] || SCENE_META.practice_room;
}

function buildMemoryContent(placeId, placeName) {
  if (placeId === "practice_room") {
    return "那晚在关掉音响的练习室里，你陪他并排坐在落了灰的木地板上，听完了整首还未公开的 Demo。空气很静，但你们的心跳声很近。";
  }
  return `那天你们把忙碌放在身后，在${placeName}慢慢停下来。风、灯光和一句临时邀约，都变成了只属于你们的记忆。`;
}

function getSceneImageUrl(placeId) {
  return {
    coffee_shop: remoteSceneImages.coffeeShop,
    park: remoteSceneImages.park,
    convenience_store: remoteSceneImages.convenienceStore,
    practice_room: remoteSceneImages.practiceRoom,
    company: remoteSceneImages.company,
  }[placeId] || "";
}

function normalizeContactMap(unlockedContacts, officialFriends = []) {
  if (unlockedContacts && !Array.isArray(unlockedContacts)) {
    return Object.fromEntries(
      Object.entries(unlockedContacts).map(([id, contact]) => [
        id,
        normalizeContact({ id, ...contact }),
      ]),
    );
  }

  const source = Array.isArray(unlockedContacts) && unlockedContacts.length ? unlockedContacts : officialFriends;
  return Object.fromEntries((source || []).map((contact) => [contact.id || contact.characterId, normalizeContact(contact)]));
}

function normalizeContact(contact) {
  const name = contact.name || contact.displayName || "Bang Chan";
  return {
    id: contact.id || contact.characterId || "bang_chan",
    name,
    initial: contact.initial || getInitial(name),
    image: contact.image || contact.avatar || "",
    lastMsg: contact.lastMsg || contact.previewText || DEFAULT_FIRST_MESSAGE,
    hasNewMsg: contact.hasNewMsg ?? contact.unread ?? true,
  };
}

function normalizeStreams(streams = {}) {
  return Object.fromEntries(
    Object.entries(streams || {}).map(([id, messages]) => [
      id,
      Array.isArray(messages) ? messages : [],
    ]),
  );
}

function getInitial(name = "") {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function injectStyles(doc) {
  if (doc.getElementById(STYLE_ID)) return;
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .chat-module{height:100%;display:flex;flex-direction:column;background:radial-gradient(circle at 50% 0,rgba(148,184,255,.08),transparent 34%),var(--black);color:var(--text)}
    .chat-list-view{padding:54px 18px 88px}
    .chat-list-header span{font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--gold2)}
    .chat-list-header h2{margin-top:7px;font-family:var(--font-kr);font-weight:400;font-size:28px;line-height:1.2}
    .chat-contact-list{display:flex;flex-direction:column;gap:10px;margin-top:20px}
    .chat-contact-row{display:grid;grid-template-columns:48px 1fr auto;gap:12px;align-items:center;padding:13px;border:1px solid rgba(255,255,255,.12);border-radius:var(--radius-lg);background:linear-gradient(145deg,rgba(255,255,255,.1),rgba(255,255,255,.035)),rgba(20,22,27,.76);box-shadow:0 14px 40px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.12);backdrop-filter:blur(18px)}
    .chat-module-avatar{width:48px;height:48px;border-radius:50%;object-fit:cover;background:linear-gradient(145deg,rgba(201,169,110,.2),rgba(255,255,255,.06));border:1px solid rgba(201,169,110,.42);display:grid;place-items:center;color:var(--gold);font-size:13px;font-weight:800}
    .chat-contact-copy{min-width:0}.chat-contact-copy strong{display:block;font-size:15px}.chat-contact-copy p{margin-top:5px;color:var(--soft);font-size:12px;line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .chat-unread-dot{width:9px;height:9px;border-radius:50%;background:#ff3b4f;box-shadow:0 0 12px rgba(255,59,79,.85)}
    .chat-empty{color:var(--soft);font-size:13px;margin-top:24px}
    .chat-detail-view{position:relative;min-height:0;background:var(--black);overflow:hidden}.chat-detail-view.scene-immersive:before{content:"";position:absolute;inset:-12px;background-image:var(--chat-scene-bg);background-size:cover;background-position:center;filter:blur(3px) saturate(.95);opacity:.84}.chat-detail-view.scene-immersive:after{content:"";position:absolute;inset:0;background:linear-gradient(to bottom,rgba(9,9,9,.34),rgba(9,9,9,.64));pointer-events:none}
    .chat-detail-topbar{position:relative;z-index:2;flex-shrink:0;padding:54px 16px 12px;display:grid;grid-template-columns:34px 38px 1fr auto;gap:10px;align-items:center;border-bottom:1px solid rgba(255,255,255,.12);background:rgba(8,9,11,.42);backdrop-filter:blur(16px)}
    .chat-back-btn{width:34px;height:34px;border-radius:14px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:var(--gold);font-size:24px;line-height:1}
    .chat-detail-topbar .chat-module-avatar{width:38px;height:38px;font-size:12px}
    .chat-title-block{min-width:0}.chat-title-block strong{display:block;font-size:15px}.chat-title-block span{display:block;color:var(--muted);font-size:11px;margin-top:2px}
    .chat-scene-btn{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.13);color:var(--cream);border-radius:14px;padding:8px 10px;font-size:12px}
    .chat-scene-header{position:relative;z-index:2;flex-shrink:0;padding:54px 16px 10px;display:flex;flex-direction:column;gap:12px;align-items:flex-start}
    .chat-leave-scene{padding:8px 12px;border-radius:999px;background:rgba(10,10,9,.36);border:1px solid rgba(255,255,255,.14);color:rgba(247,241,232,.86);backdrop-filter:blur(14px);font-size:12px}
    .chat-scene-coordinate{max-width:100%;padding:10px 14px;border-radius:999px;background:rgba(247,241,232,.12);border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(18px);box-shadow:0 12px 34px rgba(0,0,0,.22);color:rgba(247,241,232,.9);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .chat-detail-messages{position:relative;z-index:2;flex:1;min-height:0;overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding:14px 18px 16px;scrollbar-width:none}.chat-detail-messages::-webkit-scrollbar{display:none}
    .chat-scene-voiceover{align-self:center;max-width:88%;margin:4px auto 8px;color:rgba(247,241,232,.68);font-family:var(--font-kr);font-size:12px;font-style:italic;font-weight:300;line-height:1.75;text-align:center;text-shadow:0 0 14px rgba(255,255,255,.18);animation:fadeUp .4s ease}
    .scene-immersive .bubble.user{background:rgba(10,10,9,.48);color:rgba(247,241,232,.94);border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(16px);box-shadow:0 12px 34px rgba(0,0,0,.24)}
    .scene-immersive .bubble.idol{background:rgba(247,241,232,.68);color:#15120e;border:1px solid rgba(255,255,255,.36);backdrop-filter:blur(18px);box-shadow:0 12px 34px rgba(0,0,0,.2)}
    .chat-location-pill{position:relative;z-index:2;margin:0 16px 8px;padding:10px 13px;border:1px solid rgba(255,255,255,.16);border-radius:18px;background:rgba(247,241,232,.1);backdrop-filter:blur(18px);box-shadow:0 12px 34px rgba(0,0,0,.24);color:rgba(247,241,232,.78);font-size:12px;line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .chat-detail-input{position:relative;z-index:2;flex-shrink:0;display:flex;gap:9px;padding:10px 16px 34px;border-top:1px solid rgba(255,255,255,.12);background:rgba(9,9,9,.36);backdrop-filter:blur(14px)}
    .chat-detail-input input{flex:1;min-width:0;border-radius:22px;padding:11px 15px;outline:none}
    .chat-detail-input input:focus{border-color:var(--gold)}
    .chat-detail-input button{min-width:54px;border-radius:22px;background:linear-gradient(135deg,#ead7ad,#c9a96e);color:#11100d;font-weight:800;box-shadow:0 12px 30px rgba(201,169,110,.22),inset 0 1px 0 rgba(255,255,255,.34)}
    .chat-scene-bundle{padding:0;overflow:hidden;background:rgba(201,169,110,.92)!important;color:#19140d!important}.chat-scene-bundle>p{padding:10px 14px 13px;font-size:14px;line-height:1.5}
    .chat-location-card{padding:13px 14px;border-bottom:.5px solid rgba(0,0,0,.14);background:linear-gradient(135deg,rgba(255,255,255,.36),rgba(255,255,255,.08))}
    .chat-location-card span{display:block;font-size:10px;letter-spacing:.12em;text-transform:uppercase;opacity:.72}.chat-location-card strong{display:block;margin-top:5px;font-size:16px}.chat-location-card p{margin-top:4px;font-size:12px;line-height:1.4;opacity:.78}
    .chat-scene-transition{position:absolute;z-index:60;inset:0;display:grid;place-items:center;background:rgba(8,8,7,.68);backdrop-filter:blur(18px);transition:opacity .5s ease}
    .chat-scene-transition.fade-out{opacity:0}.chat-transition-copy{text-align:center;color:var(--cream)}.chat-transition-copy strong{display:block;color:var(--gold);font-family:var(--font-kr);font-size:20px;font-weight:300;text-shadow:0 0 22px rgba(201,169,110,.36);animation:transitionBreath 1.4s ease-in-out infinite}.chat-transition-copy span{display:block;margin-top:12px;color:rgba(247,241,232,.76);font-size:13px;letter-spacing:.12em}.chat-transition-copy i{display:block;width:34px;height:34px;margin:28px auto 0;border-radius:50%;border:1px solid rgba(201,169,110,.2);border-top-color:rgba(201,169,110,.82);animation:transitionSpin 1s linear infinite}
    @keyframes transitionBreath{50%{opacity:.62;text-shadow:0 0 34px rgba(201,169,110,.68)}}@keyframes transitionSpin{to{transform:rotate(360deg)}}
    .chat-memory-overlay{position:absolute;z-index:80;inset:0;display:grid;place-items:center;background:rgba(5,5,5,.68);backdrop-filter:blur(14px);animation:fadeUp .28s ease}
    .chat-polaroid{width:282px;padding:12px 12px 18px;background:#f5efe3;color:#221b14;border-radius:8px;box-shadow:0 28px 90px rgba(0,0,0,.62);transform:rotate(-1.4deg);animation:polaroidPop .38s cubic-bezier(.2,1.25,.3,1)}
    .chat-polaroid-photo{height:224px;border-radius:4px;background-image:var(--memory-bg);background-size:cover;background-position:center;margin-bottom:14px}
    .chat-polaroid-copy h3{font-family:var(--font-kr);font-size:17px;font-weight:500}.chat-polaroid-copy p{margin-top:8px;font-size:12px;line-height:1.65;color:#514638}.chat-polaroid-copy span{display:block;margin-top:10px;font-size:10px;color:#7a6c5a}
    .chat-polaroid button{width:100%;margin-top:14px;padding:12px;border-radius:999px;background:#221b14;color:#f5efe3;font-weight:700;box-shadow:0 0 20px rgba(201,169,110,.34)}
    @keyframes polaroidPop{from{opacity:0;transform:translateY(18px) scale(.92) rotate(-4deg)}to{opacity:1;transform:translateY(0) scale(1) rotate(-1.4deg)}}
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
