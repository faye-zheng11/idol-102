import { createMemoryObject, persistMemoryCapsules } from "./home.js";
import { uiCopy } from "../ui/copy-library.js";
import { sceneImages } from "../ui/image-library.js";

const STYLE_ID = "chat-module-styles";
const DEFAULT_FIRST_MESSAGE = "Right, I forgot to ask earlier. What should I call you?";
const CHAT_ACTION_ICONS = {
  discover: "./assets/auth/add-friend.png",
};
const MESSAGE_PREVIEW = {
  text: "",
  voice: "[Voice Message]",
  call: "[Voice Call]",
  image: "[Photo]",
};
const MISS_YOU_TRIGGER_TEXT = "我想你了";
const MISS_YOU_TRIGGER_PLACE_ID = "mall";
const SCENE_BACKGROUNDS = {
  coffee_shop: `linear-gradient(to top,rgba(9,9,9,.72),rgba(9,9,9,.16)),url('${sceneImages.coffee_shop}')`,
  park: `linear-gradient(to top,rgba(9,9,9,.72),rgba(9,9,9,.14)),url('${sceneImages.park}')`,
  convenience_store: `linear-gradient(to top,rgba(9,9,9,.72),rgba(9,9,9,.15)),url('${sceneImages.convenience_store}')`,
  practice_room: `linear-gradient(to top,rgba(9,9,9,.74),rgba(9,9,9,.16)),url('${sceneImages.practice_room}')`,
  company: `linear-gradient(to top,rgba(9,9,9,.72),rgba(9,9,9,.14)),url('${sceneImages.company}')`,
  mall: `linear-gradient(to top,rgba(9,9,9,.72),rgba(9,9,9,.15)),url('${sceneImages.mall}')`,
  apartment: `linear-gradient(to top,rgba(9,9,9,.72),rgba(9,9,9,.15)),url('${sceneImages.apartment}')`,
};
const SCENE_META = {
  coffee_shop: {
    placeName: "Cafe",
    voiceover: "Light falls across the wooden table by the window, and steam from the espresso machine drifts softly through the room. You both keep your voices low, as if not to disturb the quiet afternoon.",
    opener: "This place is quieter than I expected. Good. I can actually listen to you slowly.",
    memoryTitle: "Window Seat Afternoon Review",
  },
  park: {
    placeName: "Park",
    voiceover: "Evening wind moves through the leaves, and the light beside the bench shifts slowly. You sit side by side without rushing to speak, while the city softens in the distance.",
    opener: "The wind feels really nice today. Sitting like this makes time slow down a little.",
    memoryTitle: "Side-by-Side Evening Wind",
  },
  convenience_store: {
    placeName: "Convenience Store",
    voiceover: "Warm yellow light reflects in the convenience store doors, and the drink fridge hums quietly. Between the shelves, the late night feels like a small space cut out just for the two of you.",
    opener: "Coming to a convenience store at this hour makes even ordinary snacks feel special.",
    memoryTitle: "Banana Milk After Midnight",
  },
  practice_room: {
    placeName: "Practice Room",
    voiceover:
      "The practice room mirrors reflect the bright overhead lights, and the air still holds the warmth of rehearsal. The speakers are off now. Everything is quiet as you sit in the corner and he turns to look at you, his eyes still bright from moving.",
    opener: "No one has seen that new choreography yet. You are the first.",
    memoryTitle: "First Listener in the Practice Room",
  },
  company: {
    placeName: "Company",
    voiceover: "The elevator hall glows quietly, and beyond the glass the city moves like a slow field of stars. For a moment, the busy day stays outside the door, and you finally meet.",
    opener: "You really came. A minute ago, I thought today would never end.",
    memoryTitle: "A Brief Meeting in the Company Lights",
  },
  mall: {
    placeName: "Mall",
    voiceover: "The mall's glass atrium reflects the night, and shop windows light up floor by floor. You ride the escalator upward, letting the crowd hide the hurry behind you.",
    opener: "It is livelier here at night than I expected. Should we start with the store you wanted to see?",
    memoryTitle: "Night Lights on the Glass Walkway",
  },
  apartment: {
    placeName: "Apartment",
    voiceover: "The streetlights below the apartment soften the tree shadows, and warm balcony lights glow one by one. You wait near the entrance, as if waiting for a small answer that belongs only to the night.",
    opener: "I came down. Were you really just passing by?",
    memoryTitle: "A Warm Drink Downstairs",
  },
};

export function createChatModule(deps = {}) {
  const doc = deps.document || document;
  const rootId = deps.rootId || "screen-chat";
  const getState = deps.getState || (() => window.AppStore?.state || {});
  const setState = deps.setState || ((patch) => Object.assign(window.AppStore?.state || {}, patch));
  const router = deps.router || window.AppRouter || {};
  let activeCharacterId = null;
  let pendingSettingImageTarget = null;
  let pendingChatImage = null;
  let pendingChatDraft = "";
  let pendingChatDraftCharacterId = null;

  function onEnter() {
    injectStyles(doc);
    ensureInitialContacts();
    expirePendingInvites();
    const state = getState();
    if (state.resumeActiveScene && state.activeSceneSession?.characterId) {
      setState({ resumeActiveScene: false });
      renderSceneActiveView(state.activeSceneSession.characterId);
      return;
    }
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
          <div>
            <h2>${uiCopy.chat.title}</h2>
          </div>
          ${renderChatActionHub()}
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
    bindChatSettingsButtons(root);
    root.querySelector("[data-chat-discover]")?.addEventListener("click", renderDiscoverPage);
    syncActionDots();
  }

  function renderChatSettings(characterId) {
    const contact = getContact(characterId);
    if (!contact) return renderChatList();
    activeCharacterId = characterId;
    setDetailChrome(true);
    const root = getRoot();
    root.innerHTML = `
      <div class="chat-module chat-settings-view">
        <header class="chat-subpage-header">
          <button type="button" class="chat-back-btn" data-chat-back-list aria-label="Back">‹</button>
          <div>
            <h2>Chat Settings</h2>
          </div>
        </header>
        <section class="chat-settings-profile">
          ${renderAvatar(contact)}
          <strong>${escapeHtml(contact.name)}</strong>
        </section>
        <section class="chat-settings-list">
          <button type="button" data-change-nickname>Change Nickname<span>&gt;</span></button>
          <button type="button" data-character-image="avatar">Change Chat Avatar<span>&gt;</span></button>
          <button type="button" data-character-image="poster">Change Home Poster<span>&gt;</span></button>
          <button type="button" data-character-image="chat-bg">Change Chat Background<span>&gt;</span></button>
          <button type="button" class="danger" data-report-character>Report Character</button>
        </section>
        <input data-character-image-input type="file" accept="image/*" hidden />
      </div>
    `;
    root.querySelector("[data-chat-back-list]")?.addEventListener("click", renderChatList);
    root.querySelector("[data-change-nickname]")?.addEventListener("click", () => openNicknameModal(characterId));
    root.querySelectorAll("[data-character-image]").forEach((button) => {
      button.addEventListener("click", () => {
        pendingSettingImageTarget = { characterId, type: button.dataset.characterImage };
        root.querySelector("[data-character-image-input]")?.click();
      });
    });
    root.querySelector("[data-character-image-input]")?.addEventListener("change", handleCharacterImagePick);
    root.querySelector("[data-report-character]")?.addEventListener("click", () => openReportModal(characterId));
  }

  function openNicknameModal(characterId) {
    closeNicknameModal();
    const contact = getContact(characterId);
    if (!contact) return;
    getRoot().insertAdjacentHTML("beforeend", renderNicknameModal(characterId, contact.name));
    const input = getRoot().querySelector("[data-nickname-input]");
    getRoot().querySelectorAll("[data-nickname-cancel]").forEach((button) => button.addEventListener("click", closeNicknameModal));
    getRoot().querySelector("[data-nickname-save]")?.addEventListener("click", () => {
      const nickname = input?.value.trim() || contact.name;
      closeNicknameModal();
      updateCharacterCustomization(characterId, { nickname });
    });
    setTimeout(() => {
      input?.focus();
      input?.select();
    }, 80);
  }

  function closeNicknameModal() {
    getRoot().querySelector(".nickname-modal-layer")?.remove();
  }

  function bindChatSettingsButtons(scope = getRoot()) {
    scope.querySelectorAll("[data-chat-settings]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        renderChatSettings(button.dataset.chatSettings);
      });
    });
  }

  function renderDiscoverPage() {
    activeCharacterId = null;
    setDetailChrome(false);
    const members = getDiscoverMembers();
    const root = getRoot();
    root.innerHTML = `
      <div class="chat-module chat-discover-view">
        <header class="chat-subpage-header">
          <button type="button" class="chat-back-btn" data-chat-back-list aria-label="Back">‹</button>
          <div>
            <h2>Discover Members</h2>
          </div>
        </header>
        <section class="chat-member-grid">
          ${
            members.length
              ? members.map(renderDiscoverCard).join("")
              : `<p class="chat-empty">All available members have been added.</p>`
          }
        </section>
        <div class="chat-add-loading hidden" data-chat-add-loading>
          <i></i>
          <span>Adding friend...</span>
        </div>
      </div>
    `;

    root.querySelector("[data-chat-back-list]")?.addEventListener("click", renderChatList);
    root.querySelectorAll("[data-chat-add-member]").forEach((button) => {
      button.addEventListener("click", () => addDiscoveredMember(button.dataset.chatAddMember));
    });
  }

  function renderChatDetail(characterId) {
    const contact = getContact(characterId);
    if (!contact) return renderChatList();
    activeCharacterId = characterId;
    markRead(characterId);

    const root = getRoot();
    const pendingInvite = getPendingInvite(characterId);
    const activeScene = getActiveSceneSession(getState());
    const isActiveSceneChat = activeScene?.characterId === characterId;
    const isLockedByScene = Boolean(isActiveSceneChat);
    const draftValue = pendingInvite?.draftText || (pendingChatDraftCharacterId === characterId ? pendingChatDraft : "");
    const messageStream = getMessageStream(characterId, { includeActiveScene: false });
    const visibleMessageStream = isActiveSceneChat ? messageStream.filter((message) => !isSceneInviteFlowMessage(message)) : messageStream;
    const messageContext = {
      inviteStatusById: getInviteStatusById(messageStream),
      allowAvatarSettings: true,
    };
    setDetailChrome(true);
    root.innerHTML = `
      <div class="chat-module chat-detail-view ${contact.chatBackground ? "has-custom-bg" : ""} ${isLockedByScene ? "has-active-scene" : ""}" style="${contact.chatBackground ? `--chat-custom-bg:url('${escapeAttr(contact.chatBackground)}')` : ""}">
        ${renderStandardHeader(contact)}
        ${isActiveSceneChat ? `<div class="chat-active-scene-layer">${renderChatSceneEntry(activeScene)}</div>` : ""}
        <div class="chat-detail-messages ${isActiveSceneChat ? "has-floating-scene" : ""}" data-chat-stream>
          ${visibleMessageStream.map((message) => renderMessageBubble(message, contact, messageContext)).join("")}
          ${isActiveSceneChat ? renderSceneProgressNote(activeScene) : ""}
        </div>
        ${pendingInvite ? renderInviteComposer(pendingInvite) : ""}
        <form class="chat-detail-input chat-standard-input ${pendingChatImage?.characterId === characterId && !isLockedByScene ? "has-image-preview" : ""} ${isLockedByScene ? "is-locked" : ""}" data-chat-form>
          ${pendingChatImage?.characterId === characterId && !isLockedByScene ? renderChatImagePreview(pendingChatImage) : ""}
          <button class="chat-upload-btn" type="button" data-chat-image-pick aria-label="Upload image" ${isLockedByScene ? "disabled" : ""}><span aria-hidden="true"></span></button>
          <input data-chat-image-input type="file" accept="image/*" hidden ${isLockedByScene ? "disabled" : ""} />
          <input data-chat-text-input autocomplete="off" placeholder="${escapeAttr(isLockedByScene ? "Scene is in progress" : pendingInvite?.shortDraft || uiCopy.chat.inputPlaceholder)}" value="${escapeAttr(draftValue)}" ${isLockedByScene ? "disabled" : ""} />
          <button type="submit" aria-label="Send" ${isLockedByScene ? "disabled" : ""}><span aria-hidden="true"></span></button>
        </form>
      </div>
    `;

    root.querySelector("[data-chat-back]")?.addEventListener("click", renderChatList);
    root.querySelector("[data-chat-return-list]")?.addEventListener("click", renderChatList);
    root.querySelector("[data-chat-scene]")?.addEventListener("click", () => navigate("scene"));
    bindChatSettingsButtons(root);
    root.querySelector("[data-active-scene-return]")?.addEventListener("click", resumeActiveScene);
    root.querySelectorAll("[data-scene-go-now]").forEach((button) => {
      button.addEventListener("click", () => startSceneFromInvite(characterId, button.dataset.sceneGoNow));
    });
    root.querySelectorAll("[data-scene-trigger-accept]").forEach((button) => {
      button.addEventListener("click", () => acceptTriggerInvite(characterId, button.dataset.sceneTriggerAccept));
    });
    root.querySelectorAll("[data-scene-trigger-reject]").forEach((button) => {
      button.addEventListener("click", () => rejectTriggerInvite(characterId, button.dataset.sceneTriggerReject));
    });
    if (!isLockedByScene) root.querySelector("[data-chat-form]").addEventListener("submit", handleSubmit);
    if (!isLockedByScene) root.querySelector("[data-chat-image-pick]")?.addEventListener("click", () => root.querySelector("[data-chat-image-input]")?.click());
    if (!isLockedByScene) root.querySelector("[data-chat-image-input]")?.addEventListener("change", handleChatImagePick);
    if (!isLockedByScene) root.querySelector("[data-chat-image-remove]")?.addEventListener("click", clearPendingChatImage);
    if (!isLockedByScene) root.querySelector("[data-chat-paren]")?.addEventListener("click", insertParentheses);
    if (pendingInvite) {
      const input = root.querySelector("[data-chat-text-input]");
      setTimeout(() => input?.focus(), 180);
    }
    syncActionDots();
    scrollToBottom();
  }

  function openContact(characterId) {
    markRead(characterId);
    renderChatDetail(characterId);
  }

  function renderSceneActiveView(characterId) {
    const state = getState();
    const scene = getActiveSceneSession(state);
    const contact = getContact(characterId);
    if (!scene || scene.characterId !== characterId || !contact) return renderChatDetail(characterId);
    activeCharacterId = characterId;
    markRead(characterId);

    const root = getRoot();
    const meta = getSceneMeta(scene.placeId);
    const messageStream = getMessageStream(characterId, { includeActiveScene: true });
    const messageContext = {
      inviteStatusById: getInviteStatusById(messageStream),
      allowAvatarSettings: false,
    };
    setDetailChrome(true);
    root.innerHTML = `
      <div class="chat-module chat-detail-view scene-immersive" style="${scene.background ? `--chat-scene-bg:${scene.background}` : ""}">
        ${renderSceneActiveHeader(meta, scene)}
        <div class="chat-detail-messages" data-chat-stream>
          ${renderVoiceover(meta)}
          ${messageStream.map((message) => renderMessageBubble(message, contact, messageContext)).join("")}
        </div>
        <form class="chat-detail-input scene-chat-input" data-chat-form>
          <button class="chat-paren-btn" type="button" data-chat-paren aria-label="Insert aside">()</button>
          <input autocomplete="off" placeholder="Reply in scene..." />
          <button type="submit" aria-label="Send"><span aria-hidden="true"></span></button>
        </form>
      </div>
    `;

    root.querySelector("[data-chat-return-list]")?.addEventListener("click", renderChatList);
    root.querySelector("[data-chat-back]")?.addEventListener("click", renderChatList);
    root.querySelector("[data-chat-end-scene]")?.addEventListener("click", finishActiveScene);
    root.querySelector("[data-chat-form]")?.addEventListener("submit", handleSubmit);
    root.querySelector("[data-chat-paren]")?.addEventListener("click", insertParentheses);
    syncActionDots();
    scrollToBottom();
  }

  function handleSubmit(event) {
    event.preventDefault();
    const input = event.currentTarget.querySelector("[data-chat-text-input]") || event.currentTarget.querySelector("input:not([type='file'])");
    const pendingInvite = getPendingInvite(activeCharacterId);
    const text = input.value.trim() || pendingInvite?.shortDraft || "";
    const image = pendingChatImage?.characterId === activeCharacterId ? pendingChatImage : null;
    if ((!text && !image) || !activeCharacterId) return;
    input.value = "";
    pendingChatImage = null;
    pendingChatDraft = "";
    pendingChatDraftCharacterId = null;
    if (pendingInvite) {
      const inviteId = pendingInvite.inviteId || `invite-${Date.now()}`;
      const expiresAt = pendingInvite.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      appendMessage(activeCharacterId, {
        role: "user",
        type: "scene_invite_bundle",
        inviteId,
        inviteStatus: "pending_go",
        text,
        placeId: pendingInvite.placeId,
        placeName: pendingInvite.placeName,
        eventName: pendingInvite.eventName,
        expiresAt,
        createdAt: new Date().toISOString(),
      });
      appendMessage(activeCharacterId, {
        role: "user",
        text,
        createdAt: new Date().toISOString(),
      });
      clearPendingInvite();
      renderChatDetail(activeCharacterId);
      simulateSceneAccept(activeCharacterId, { ...pendingInvite, inviteId, expiresAt });
      return;
    }

    appendMessage(activeCharacterId, {
      role: "user",
      type: image ? "image" : "text",
      text,
      imageUrl: image?.url || "",
      imageName: image?.name || "",
      createdAt: new Date().toISOString(),
    });
    const activeScene = getActiveSceneSession(getState());
    if (activeScene?.characterId === activeCharacterId) {
      renderSceneActiveView(activeCharacterId);
      simulateActiveSceneReply(activeCharacterId, activeScene);
      return;
    }
    if (shouldTriggerSceneInvite(text)) {
      renderChatDetail(activeCharacterId);
      simulateMissYouTrigger(activeCharacterId);
      return;
    }
    renderChatDetail(activeCharacterId);
  }

  function handleChatImagePick(event) {
    pendingChatDraft = event.currentTarget.closest("[data-chat-form]")?.querySelector("[data-chat-text-input]")?.value || "";
    pendingChatDraftCharacterId = activeCharacterId;
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type?.startsWith("image/")) {
      showChatToast("Please choose an image");
      return;
    }
    if (pendingChatImage?.url) URL.revokeObjectURL(pendingChatImage.url);
    pendingChatImage = {
      characterId: activeCharacterId,
      url: URL.createObjectURL(file),
      name: file.name || "Selected image",
    };
    renderChatDetail(activeCharacterId);
  }

  function clearPendingChatImage() {
    pendingChatDraft = getRoot().querySelector("[data-chat-text-input]")?.value || pendingChatDraft;
    pendingChatDraftCharacterId = activeCharacterId;
    if (pendingChatImage?.url) URL.revokeObjectURL(pendingChatImage.url);
    pendingChatImage = null;
    renderChatDetail(activeCharacterId);
  }

  function shouldTriggerSceneInvite(text) {
    return text.replace(/\s+/g, "") === MISS_YOU_TRIGGER_TEXT;
  }

  function insertParentheses(event) {
    const form = event.currentTarget.closest("[data-chat-form]");
    const input = form?.querySelector("input");
    if (!input) return;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    input.value = `${input.value.slice(0, start)}()${input.value.slice(end)}`;
    const caret = start + 1;
    input.focus();
    input.setSelectionRange(caret, caret);
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
      lastMessageType: extra.lastMessageType || current.lastMessageType || "text",
      lastMessageAt: extra.lastMessageAt || current.lastMessageAt || new Date().toISOString(),
      unreadCount: Number(extra.unreadCount ?? current.unreadCount ?? (extra.hasNewMsg ?? current.hasNewMsg ? 1 : 0)),
      hasNewMsg: extra.hasNewMsg ?? current.hasNewMsg ?? true,
      ...extra,
    };

    const chatStreams = normalizeStreams(state.chatStreams || state.messagesByCharacter);
    if (!chatStreams[characterId]?.length) {
      chatStreams[characterId] = [
        {
          id: `${characterId}-first`,
          role: "idol",
          type: unlockedContacts[characterId].lastMessageType || "text",
          text: unlockedContacts[characterId].lastMsg,
          createdAt: unlockedContacts[characterId].lastMessageAt || new Date().toISOString(),
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
      lastMessageType: "text",
      lastMessageAt: new Date().toISOString(),
      unreadCount: 1,
      hasNewMsg: true,
    });
  }

  function getDiscoverMembers() {
    const state = getState();
    const unlockedIds = new Set([
      ...Object.keys(normalizeContactMap(state.unlockedContacts, state.officialFriends)),
      ...(state.addedCharacters || []).map((member) => member.id),
    ]);
    return (state.unaddedCharacters || []).filter((member) => !unlockedIds.has(member.id));
  }

  function expirePendingInvites() {
    const state = getState();
    const streams = normalizeStreams(state.chatStreams || state.messagesByCharacter);
    let changed = false;
    const now = Date.now();
    Object.entries(streams).forEach(([characterId, messages]) => {
      const nextMessages = [...messages];
      nextMessages.forEach((message) => {
        if (message.type !== "scene_invite_bundle" || message.inviteStatus !== "pending_go") return;
        if (!message.expiresAt || new Date(message.expiresAt).getTime() > now) return;
        message.inviteStatus = "expired";
        changed = true;
        nextMessages.push({
          id: `expired-${message.inviteId || Date.now()}`,
          role: "idol",
          text: `You said we were going to ${message.placeName}. Did you forget about me?`,
          createdAt: new Date().toISOString(),
        });
      });
      streams[characterId] = nextMessages;
    });
    if (!changed) return;
    setState({ chatStreams: streams, messagesByCharacter: streams });
  }

  function addDiscoveredMember(memberId) {
    const state = getState();
    const member = (state.unaddedCharacters || []).find((item) => item.id === memberId);
    if (!member) return;
    const loading = getRoot().querySelector("[data-chat-add-loading]");
    getRoot().querySelectorAll("[data-chat-add-member]").forEach((button) => {
      button.disabled = true;
    });
    loading?.classList.remove("hidden");

    setTimeout(() => {
      const firstMessage = DEFAULT_FIRST_MESSAGE;
      const createdAt = new Date().toISOString();
      const unlockedContacts = normalizeContactMap(state.unlockedContacts, state.officialFriends);
      unlockedContacts[member.id] = {
        id: member.id,
        name: member.name,
        initial: member.initial,
        image: member.image,
        lastMsg: firstMessage,
        previewText: firstMessage,
        lastMessageType: "text",
        lastMessageAt: createdAt,
        unreadCount: 1,
        hasNewMsg: true,
      };
      const chatStreams = normalizeStreams(state.chatStreams || state.messagesByCharacter);
      chatStreams[member.id] = [
        {
          id: `${member.id}-first`,
          role: "idol",
          type: "text",
          text: firstMessage,
          createdAt,
        },
      ];
      setState({
        addedCharacters: [...(state.addedCharacters || []), member],
        unaddedCharacters: (state.unaddedCharacters || []).filter((item) => item.id !== member.id),
        unlockedContacts,
        officialFriends: Object.values(unlockedContacts),
        chatStreams,
        messagesByCharacter: chatStreams,
        chatUnread: true,
      });
      showChatToast(`${member.name} has been added as a friend`);
      renderChatList();
    }, 3000);
  }

  function markRead(characterId) {
    const state = getState();
    const unlockedContacts = normalizeContactMap(state.unlockedContacts, state.officialFriends);
    if (!unlockedContacts[characterId]) return;
    unlockedContacts[characterId] = { ...unlockedContacts[characterId], hasNewMsg: false, unreadCount: 0 };
    setState({
      unlockedContacts,
      officialFriends: Object.values(unlockedContacts),
      chatUnread: Object.values(unlockedContacts).some((contact) => contact.hasNewMsg),
    });
  }

  function appendMessage(characterId, message) {
    const state = getState();
    const activeScene = getActiveSceneSession(state);
    const inScene = Boolean(activeScene?.placeId && activeScene.characterId === characterId);
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
      const messageKind = getMessageKind(message);
      unlockedContacts[characterId] = {
        ...unlockedContacts[characterId],
        lastMsg: message.text,
        previewText: getMessagePreview(message),
        lastMessageType: messageKind,
        lastMessageAt: message.createdAt || nextMessage.createdAt || new Date().toISOString(),
        hasNewMsg: false,
        unreadCount: 0,
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
        type: "scene_acceptance",
        inviteId: invite.inviteId,
        text: "Yeah, let's go together. Wait for me for a second.",
        placeId: invite.placeId,
        placeName: invite.placeName,
        eventName: invite.eventName,
        expiresAt: invite.expiresAt,
        createdAt: new Date().toISOString(),
      });
      renderChatDetail(characterId);
    }, 1250);
  }

  function simulateMissYouTrigger(characterId) {
    const state = getState();
    if (state.activeSceneSession) {
      appendMessage(characterId, {
        role: "idol",
        text: "I miss you too. I wanted to see you, but you are already in another Scene right now.",
        createdAt: new Date().toISOString(),
      });
      renderChatDetail(characterId);
      return;
    }

    const placeId = MISS_YOU_TRIGGER_PLACE_ID;
    const meta = getSceneMeta(placeId);
    const inviteId = `trigger-${Date.now()}`;
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000).toISOString();

    setTimeout(() => {
      appendMessage(characterId, {
        role: "idol",
        type: "voice",
        durationSeconds: 8,
        text: "I was just thinking about you too. If you mean it, come see me for a little while.",
        createdAt: new Date().toISOString(),
      });
      appendMessage(characterId, {
        role: "idol",
        type: "scene_invite_bundle",
        inviteMode: "trigger",
        inviteId,
        inviteStatus: "pending_go",
        text: "Come meet me now?",
        placeId,
        placeName: meta.placeName,
        eventName: "He wants to see you",
        expiresAt,
        createdAt: new Date().toISOString(),
      });
      renderChatDetail(characterId);
    }, 650);
  }

  function startSceneFromInvite(characterId, inviteId) {
    const state = getState();
    if (state.activeSceneSession) {
      showChatToast("You already have an active Scene.");
      return;
    }
    const messages = normalizeStreams(state.chatStreams || state.messagesByCharacter)[characterId] || [];
    const inviteMessage = messages.find((message) => message.inviteId === inviteId && message.type === "scene_invite_bundle");
    if (!inviteMessage || inviteMessage.inviteStatus === "expired") return;
    if (new Date(inviteMessage.expiresAt).getTime() <= Date.now()) {
      expirePendingInvites();
      renderChatDetail(characterId);
      return;
    }
    playSceneTransition(characterId, {
      inviteId,
      placeId: inviteMessage.placeId,
      placeName: inviteMessage.placeName,
      eventName: inviteMessage.eventName,
      memorySeed: {
        placeId: inviteMessage.placeId,
        location: inviteMessage.placeName,
        eventName: inviteMessage.eventName,
        eventDraft: inviteMessage.text,
      },
    });
  }

  function acceptTriggerInvite(characterId, inviteId) {
    startSceneFromInvite(characterId, inviteId);
  }

  function rejectTriggerInvite(characterId, inviteId) {
    const state = getState();
    const streams = normalizeStreams(state.chatStreams || state.messagesByCharacter);
    const messages = streams[characterId] || [];
    streams[characterId] = messages.map((message) =>
      message.inviteId === inviteId ? { ...message, inviteStatus: "rejected" } : message,
    );
    streams[characterId].push({
      id: `reject-${inviteId}`,
      role: "idol",
      text: "Okay. I will not push you. But I really did want to see you.",
      createdAt: new Date().toISOString(),
    });
    setState({ chatStreams: streams, messagesByCharacter: streams });
    renderChatDetail(characterId);
  }

  function playSceneTransition(characterId, invite, direction = "to") {
    const root = getRoot();
    root.insertAdjacentHTML("beforeend", renderSceneTransition(invite, direction));
    setTimeout(() => {
      if (direction === "back") {
        setState({ activeChatAgent: characterId, resumeActiveScene: false });
        root.querySelector(".chat-scene-transition")?.classList.add("fade-out");
        setTimeout(() => {
          renderChatDetail(characterId);
        }, 520);
        return;
      }
      const startedAt = new Date();
      const expiresAt = new Date(startedAt.getTime() + 24 * 60 * 60 * 1000);
      const contact = getContact(characterId);
      const streams = normalizeStreams(getState().chatStreams || getState().messagesByCharacter);
      streams[characterId] = (streams[characterId] || []).map((message) =>
        message.inviteId === invite.inviteId ? { ...message, inviteStatus: "active" } : message,
      );
      setState({
        pendingSceneInvite: null,
        activeSceneSession: {
          sessionId: `scene-${Date.now()}`,
          characterId,
          characterName: contact?.name || "Bang Chan",
          characterImage: contact?.image || "",
          placeId: invite.placeId,
          placeName: invite.placeName,
          eventName: invite.eventName,
          memorySeed: invite.memorySeed,
          background: SCENE_BACKGROUNDS[invite.placeId] || SCENE_BACKGROUNDS.company,
          startedAt: startedAt.toISOString(),
          expiresAt: expiresAt.toISOString(),
          messageCount: 0,
          stayCount: 0,
          expiryPending: false,
        },
        sceneChatStreams: {
          ...(getState().sceneChatStreams || {}),
          [characterId]: [],
        },
        chatStreams: streams,
        messagesByCharacter: streams,
      });
      root.querySelector(".chat-scene-transition")?.classList.add("fade-out");
      setTimeout(() => {
        renderSceneActiveView(characterId);
        appendSceneOpener(characterId, invite.placeId);
      }, 520);
    }, 2500);
  }

  function appendSceneOpener(characterId, placeId) {
    const opener = getSceneMeta(placeId).opener;
    const stream = getMessageStream(characterId, { includeActiveScene: true });
    if (stream.some((message) => message.type === "scene_opener" && message.placeId === placeId)) return;
    setTimeout(() => {
      appendMessage(characterId, {
        role: "idol",
        type: "scene_opener",
        placeId,
        text: opener,
        createdAt: new Date().toISOString(),
      });
      renderSceneActiveView(characterId);
    }, 1000);
  }

  function simulateActiveSceneReply(characterId, scene) {
    setTimeout(() => {
      const activeScene = getActiveSceneSession(getState());
      if (!activeScene || activeScene.sessionId !== scene.sessionId) return;
      appendMessage(characterId, {
        role: "idol",
        type: "scene_reply",
        placeId: scene.placeId,
        text: getSceneReply(scene.placeId),
        createdAt: new Date().toISOString(),
      });
      renderSceneActiveView(characterId);
    }, 900);
  }

  function openMemoryPolaroid(characterId) {
    const scene = getActiveSceneSession(getState());
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
      activeSceneSession: null,
      activeSceneBackdrop: null,
      unlockedStoryLines,
    });
    navigate("home");
  }

  function finishActiveScene() {
    const state = getState();
    const scene = getActiveSceneSession(state);
    if (!scene) return;
    const meta = getSceneMeta(scene.placeId);
    const characterId = scene.characterId;
    getRoot().querySelector(".chat-memory-overlay")?.remove();
    getRoot().insertAdjacentHTML("beforeend", renderMemoryOverlay(meta, scene));
    getRoot().querySelector("[data-save-memory]").addEventListener("click", () => saveMemory(characterId, meta, scene));
  }

  function saveSceneMemory(characterId, meta, scene) {
    const state = getState();
    const chatHistorySnap = normalizeStreams(state.sceneChatStreams)[characterId] || [];
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
      code: scene.placeId === "practice_room" ? "CODE-03" : "CODE-01",
    });
    const unlockedStoryLines = {
      ...(state.unlockedStoryLines || {}),
      [characterId]: [...(state.unlockedStoryLines?.[characterId] || []), { ...memory, fresh: true }],
    };
    persistMemoryCapsules(unlockedStoryLines);
    setState({
      activeSceneSession: null,
      activeSceneBackdrop: null,
      resumeActiveScene: false,
      unlockedStoryLines,
    });
  }

  function getUnlockedContactList() {
    const state = getState();
    return Object.values(normalizeContactMap(state.unlockedContacts, state.officialFriends)).map((contact) =>
      enrichContactForList(contact, state),
    );
  }

  function getContact(characterId) {
    const state = getState();
    const contact = normalizeContactMap(state.unlockedContacts, state.officialFriends)[characterId];
    return contact ? enrichContactForList(contact, state) : contact;
  }

  function getMessageStream(characterId, options = {}) {
    const state = getState();
    const activeScene = getActiveSceneSession(state);
    if (options.includeActiveScene && activeScene?.placeId && activeScene.characterId === characterId) {
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

  function resumeActiveScene() {
    const state = getState();
    const scene = getActiveSceneSession(state);
    if (!scene) return;
    setState({ activeChatAgent: scene.characterId, resumeActiveScene: true });
    renderSceneActiveView(scene.characterId);
  }

  function endActiveScene(reason = "ended") {
    const state = getState();
    const scene = getActiveSceneSession(state);
    if (!scene) return;
    const meta = getSceneMeta(scene.placeId);
    const characterId = scene.characterId;
    const chatHistorySnap = normalizeStreams(state.sceneChatStreams)[characterId] || [];
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
      code: scene.placeId === "practice_room" ? "CODE-03" : "CODE-01",
    });
    const unlockedStoryLines = {
      ...(state.unlockedStoryLines || {}),
      [characterId]: [...(state.unlockedStoryLines?.[characterId] || []), { ...memory, fresh: true }],
    };
    const streams = normalizeStreams(state.chatStreams || state.messagesByCharacter);
    streams[characterId] = [
      ...(streams[characterId] || []),
      {
        id: `scene-left-${Date.now()}`,
        role: "idol",
        text:
          reason === "user_left"
            ? "You left so suddenly without saying anything."
            : "I waited for you for a while. I hope you got back safely.",
        createdAt: new Date().toISOString(),
      },
    ];
    const unlockedContacts = normalizeContactMap(state.unlockedContacts, state.officialFriends);
    if (unlockedContacts[characterId]) {
      const last = streams[characterId][streams[characterId].length - 1];
      unlockedContacts[characterId] = {
        ...unlockedContacts[characterId],
        lastMsg: last.text,
        previewText: last.text,
        lastMessageType: "text",
        lastMessageAt: last.createdAt,
        unreadCount: 1,
        hasNewMsg: true,
      };
    }
    persistMemoryCapsules(unlockedStoryLines);
    setState({
      activeSceneSession: null,
      activeSceneBackdrop: null,
      unlockedStoryLines,
      chatStreams: streams,
      messagesByCharacter: streams,
      unlockedContacts,
      officialFriends: Object.values(unlockedContacts),
      chatUnread: true,
    });
    renderChatList();
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

  function updateCharacterCustomization(characterId, patch) {
    const state = getState();
    const activeScene = getActiveSceneSession(state);
    const contact = getContact(characterId) || {};
    const nextName = patch.nickname || contact.name;
    const nextImage = patch.avatar || contact.image;
    const unlockedContacts = normalizeContactMap(state.unlockedContacts, state.officialFriends);
    if (unlockedContacts[characterId]) {
      unlockedContacts[characterId] = {
        ...unlockedContacts[characterId],
        ...(patch.nickname ? { name: patch.nickname } : {}),
        ...(patch.avatar ? { image: patch.avatar, avatar: patch.avatar } : {}),
        ...(patch.posterImage ? { posterImage: patch.posterImage } : {}),
        ...(patch.chatBackground ? { chatBackground: patch.chatBackground } : {}),
      };
    }
    setState({
      characterCustomizations: {
        ...(state.characterCustomizations || {}),
        [characterId]: {
          ...(state.characterCustomizations?.[characterId] || {}),
          ...patch,
        },
      },
      unlockedContacts,
      officialFriends: Object.values(unlockedContacts),
      ...(activeScene?.characterId === characterId
        ? {
            activeSceneSession: {
              ...activeScene,
              characterName: nextName,
              characterImage: nextImage,
            },
          }
        : {}),
    });
    if (activeCharacterId === characterId) renderChatSettings(characterId);
    showChatToast("Updated");
  }

  function handleCharacterImagePick(event) {
    const file = event.target.files?.[0];
    if (!file || !pendingSettingImageTarget) return;
    const imageUrl = URL.createObjectURL(file);
    const { characterId, type } = pendingSettingImageTarget;
    const patch =
      type === "avatar"
        ? { avatar: imageUrl }
        : type === "poster"
          ? { posterImage: imageUrl }
          : { chatBackground: imageUrl };
    pendingSettingImageTarget = null;
    event.target.value = "";
    updateCharacterCustomization(characterId, patch);
  }

  function openReportModal(characterId) {
    closeReportModal();
    getRoot().insertAdjacentHTML("beforeend", renderReportModal(characterId));
    getRoot().querySelector("[data-report-cancel]")?.addEventListener("click", closeReportModal);
    getRoot().querySelector("[data-report-submit]")?.addEventListener("click", () => {
      closeReportModal();
      showChatToast("举报成功，平台将在24小时内审核处理");
    });
  }

  function closeReportModal() {
    getRoot().querySelector(".report-modal-layer")?.remove();
  }
}

function renderContactRow(contact) {
  const unreadCount = Number(contact.unreadCount || 0);
  const activeScene = contact.activeScene;
    const preview = activeScene ? "[Scene--进行中]" : contact.previewText || getMessagePreview(contact);
    return `
    <article class="chat-contact-row" data-chat-contact="${escapeAttr(contact.id)}">
      ${renderAvatar(contact, { settingsButton: true })}
      <div class="chat-contact-copy">
        <strong>${escapeHtml(contact.name)}</strong>
        <p class="${activeScene ? "chat-scene-preview" : ""}">${escapeHtml(preview)}</p>
      </div>
      <div class="chat-contact-meta">
        <time datetime="${escapeAttr(contact.lastMessageAt || "")}">${escapeHtml(formatMessageDate(contact.lastMessageAt))}</time>
        ${unreadCount > 0 ? `<span class="chat-unread-count" aria-label="${unreadCount} unread messages">${unreadCount > 99 ? "99+" : unreadCount}</span>` : ""}
      </div>
    </article>
  `;
}

function renderDiscoverCard(member) {
  return `
    <article class="chat-member-card">
      <img src="${escapeAttr(member.image || "")}" alt="${escapeAttr(member.name)}" />
      <div class="chat-member-copy">
        <strong>${escapeHtml(member.name)}</strong>
        <p>${escapeHtml(member.hook || "A new connection is waiting to begin.")}</p>
      </div>
      <button type="button" data-chat-add-member="${escapeAttr(member.id)}">Add Friend</button>
    </article>
  `;
}

function renderAvatar(contact, options = {}) {
  const avatar = contact.image || contact.avatar
    ? `<img class="chat-module-avatar" src="${escapeAttr(contact.image || contact.avatar)}" alt="${escapeAttr(contact.name)}" />`
    : `<div class="chat-module-avatar">${escapeHtml(contact.initial || getInitial(contact.name))}</div>`;
  if (!options.settingsButton || !contact.id) return avatar;
  return `
    <button type="button" class="chat-avatar-settings" data-chat-settings="${escapeAttr(contact.id)}" aria-label="Chat settings for ${escapeAttr(contact.name)}">
      ${avatar}
    </button>
  `;
}

function renderMessageAvatar(contact, context = {}) {
  return renderAvatar({ ...(contact || {}), name: contact?.name || "idol" }, { settingsButton: context.allowAvatarSettings !== false });
}

function renderStandardHeader(contact) {
  return `
    <header class="chat-detail-topbar">
      <button type="button" class="chat-back-btn" data-chat-back aria-label="Back">‹</button>
      ${renderAvatar(contact, { settingsButton: true })}
      <div class="chat-title-block">
        <strong>${escapeHtml(contact.name)}</strong>
        <span>${uiCopy.chat.remoteMode}</span>
      </div>
      <button type="button" class="chat-scene-btn" data-chat-scene>Scene</button>
    </header>
  `;
}

function renderSceneActiveHeader(meta, scene = {}) {
  return `
    <header class="chat-scene-header">
      <div class="chat-scene-actions">
        <button type="button" class="chat-scene-back" data-chat-return-list aria-label="Back to Chat">‹ <span>Back to Chat</span></button>
        <button type="button" class="chat-scene-finish" data-chat-end-scene aria-label="Finish Scene"><span>Finish</span> ×</button>
      </div>
      <strong>${escapeHtml(meta.placeName || scene.placeName || "")}</strong>
      <span>${escapeHtml(scene.eventName || "")}</span>
    </header>
  `;
}

function renderChatSceneEntry(scene = {}) {
  return `
    <button type="button" class="chat-active-scene-card" data-active-scene-return>
      ${scene.characterImage ? `<img src="${escapeAttr(scene.characterImage)}" alt="${escapeAttr(scene.characterName)}" />` : ""}
      <span>Scene--进行中</span>
      <strong>${escapeHtml(scene.placeName)} · ${escapeHtml(scene.eventName)}</strong>
    </button>
  `;
}

function renderSceneProgressNote(scene = {}) {
  return `<p class="chat-scene-progress-note">你已前往 ${escapeHtml(scene.placeName || "Scene")} 地点，故事发展中。</p>`;
}

function renderChatActionHub() {
  return `
    <div class="chat-action-hub" aria-label="Chat shortcuts">
      <button class="chat-action-button chat-discover-button" type="button" data-chat-discover aria-label="Discover members">
        <img src="${CHAT_ACTION_ICONS.discover}" alt="" aria-hidden="true" />
        <i id="discoverDot" class="notif-dot hidden"></i>
      </button>
    </div>
  `;
}

function syncActionDots() {
  document.querySelectorAll("#discoverDot").forEach((dot) => dot.classList.toggle("hidden", true));
}

function renderVoiceover(meta) {
  return `<p class="chat-scene-voiceover">${escapeHtml(meta.voiceover)}</p>`;
}

function renderMessageBubble(message, contact, context = {}) {
  if (message.type === "scene_invite_bundle") {
    const background = SCENE_BACKGROUNDS[message.placeId] || SCENE_BACKGROUNDS.company;
    const isTrigger = message.inviteMode === "trigger";
    return `
      <div class="chat-scene-bundle ${message.inviteStatus === "active" ? "is-active" : ""} ${message.inviteStatus === "expired" ? "is-expired" : ""}" style="--invite-bg:${background}">
        <div class="chat-location-card">
          <span>${escapeHtml(message.placeName || "")}</span>
          <strong>${escapeHtml(message.eventName || "")}</strong>
          ${
            message.inviteStatus === "expired"
              ? `<em>The invite expired. Maybe next time.</em>`
              : message.inviteStatus === "active"
                ? `<em>Scene started</em>`
                : message.inviteStatus === "rejected"
                  ? `<em>Invite declined</em>`
                  : isTrigger
                    ? `<div class="invite-actions"><button type="button" data-scene-trigger-accept="${escapeAttr(message.inviteId)}">Accept</button><button type="button" data-scene-trigger-reject="${escapeAttr(message.inviteId)}">Decline</button></div>`
                    : ""
          }
        </div>
      </div>
    `;
  }
  if (message.type === "scene_acceptance") {
    return renderSceneAcceptanceBubble(message, contact, context);
  }
  if (getMessageKind(message) === "image") return renderImageMessageBubble(message, contact, context);
  if (getMessageKind(message) === "voice") return renderVoiceMessageBubble(message, contact, context);
  if (getMessageKind(message) === "call") return renderCallMessageBubble(message, contact, context);
  const type = message.role === "user" ? "user" : "idol";
  if (type === "idol") return renderIdolBubble(message.text || message.content || "", contact, context);
  return `<div class="bubble ${type}">${renderMessageText(message.text || message.content || "")}</div>`;
}

function renderSceneAcceptanceBubble(message, contact, context = {}) {
  const expired = message.expiresAt && new Date(message.expiresAt).getTime() <= Date.now();
  const inviteStatus = context.inviteStatusById?.[message.inviteId];
  const canGoNow = !expired && (!inviteStatus || inviteStatus === "pending_go");
  return `
    <div class="bubble-row idol-row">
      ${renderMessageAvatar(contact, context)}
      <div class="bubble idol scene-acceptance">
        <p>${escapeHtml(message.text || "")}</p>
        ${expired ? `<em>The invite expired. Maybe next time.</em>` : ""}
      </div>
    </div>
    ${canGoNow ? `<button type="button" class="scene-go-now-button" data-scene-go-now="${escapeAttr(message.inviteId)}">Go Now</button>` : ""}
  `;
}

function renderIdolBubble(text, contact, context = {}) {
  return `
    <div class="bubble-row idol-row">
      ${renderMessageAvatar(contact, context)}
      <div class="bubble idol">${escapeHtml(text)}</div>
    </div>
  `;
}

function renderImageMessageBubble(message, contact, context = {}) {
  const type = message.role === "user" ? "user" : "idol";
  const caption = message.text || message.content || "";
  const imageUrl = message.imageUrl || message.image || "";
  const bubble = `
    <div class="bubble ${type} image-message">
      ${imageUrl ? `<img src="${escapeAttr(imageUrl)}" alt="${escapeAttr(message.imageName || "Chat image")}" />` : ""}
      ${caption ? `<p>${renderMessageText(caption)}</p>` : ""}
    </div>
  `;
  if (type === "user") return bubble;
  return `
    <div class="bubble-row idol-row">
      ${renderMessageAvatar(contact, context)}
      ${bubble}
    </div>
  `;
}

function renderVoiceMessageBubble(message, contact, context = {}) {
  const type = message.role === "user" ? "user" : "idol";
  const duration = Number(message.durationSeconds || message.duration || 6);
  const caption = message.text || message.content || "";
  const bubble = `
    <div class="bubble ${type} media-bubble voice-message">
      <div class="voice-main">
        <span class="voice-bars" aria-hidden="true">${Array.from({ length: 14 }, (_, index) => `<i style="--h:${voiceBarHeight(index)}%"></i>`).join("")}</span>
        <span class="voice-duration">${duration}s</span>
        <button type="button" class="voice-play" aria-label="Play voice message"><span></span></button>
      </div>
      ${caption ? `<p>${escapeHtml(caption)}</p>` : ""}
    </div>
  `;
  if (type === "user") return bubble;
  return `
    <div class="bubble-row idol-row">
      ${renderMessageAvatar(contact, context)}
      ${bubble}
    </div>
  `;
}

function renderCallMessageBubble(message, contact, context = {}) {
  const type = message.role === "user" ? "user" : "idol";
  const status = message.callStatus || message.status || "ended";
  if (status === "incoming") return renderIncomingCallCard(message, contact);
  const duration = Number(message.durationSeconds || message.duration || 24);
  const title = status === "missed" ? "Missed call" : "Call ended";
  const bubble = `
    <div class="bubble ${type} media-bubble call-message">
      <span class="call-icon" aria-hidden="true"></span>
      <strong>${escapeHtml(title)}</strong>
      <span class="call-duration">${duration}s</span>
    </div>
  `;
  if (type === "user") return bubble;
  return `
    <div class="bubble-row idol-row">
      ${renderMessageAvatar(contact, context)}
      ${bubble}
    </div>
  `;
}

function renderIncomingCallCard(message, contact) {
  const name = contact?.name || message.name || "Chat";
  const image = contact?.image || contact?.avatar || "";
  return `
    <section class="incoming-call-card" style="${image ? `--caller-img:url('${escapeAttr(image)}')` : ""}">
      <div class="incoming-call-backdrop" aria-hidden="true"></div>
      ${image ? `<img class="incoming-call-avatar" src="${escapeAttr(image)}" alt="${escapeAttr(name)}" />` : `<div class="incoming-call-avatar incoming-call-initial">${escapeHtml(getInitial(name))}</div>`}
      <strong>${escapeHtml(name)}</strong>
      <p>${escapeHtml(message.text || `Ring... ${name} is calling~`)}</p>
      <div class="incoming-call-actions">
        <button type="button" class="call-action decline" aria-label="Decline call"><span></span></button>
        <button type="button" class="call-action accept" aria-label="Accept call"><span></span></button>
      </div>
      <small>This content is generated by AI</small>
    </section>
  `;
}

function renderMessageText(text) {
  const raw = String(text ?? "");
  let html = "";
  let index = 0;
  const pattern = /\(([^)]*)\)/g;
  for (const match of raw.matchAll(pattern)) {
    html += escapeHtml(raw.slice(index, match.index));
    html += `<em class="aside-text">(${escapeHtml(match[1])})</em>`;
    index = match.index + match[0].length;
  }
  html += escapeHtml(raw.slice(index));
  return html;
}

function renderInviteComposer(invite) {
  return `
    <div class="chat-location-pill">
      <span>City Marker · ${escapeHtml(invite.placeName)}</span>
    </div>
  `;
}

function renderChatImagePreview(image) {
  return `
    <div class="chat-image-preview" data-chat-image-preview>
      <img src="${escapeAttr(image.url)}" alt="${escapeAttr(image.name || "Selected image")}" />
      <button type="button" data-chat-image-remove aria-label="Remove image">×</button>
    </div>
  `;
}

function renderNicknameModal(characterId, currentName) {
  return `
    <div class="nickname-modal-layer">
      <button type="button" class="nickname-modal-scrim" data-nickname-cancel aria-label="Close nickname editor"></button>
      <article class="nickname-modal" role="dialog" aria-modal="true" aria-labelledby="nicknameModalTitle">
        <h3 id="nicknameModalTitle">Change Nickname</h3>
        <input data-nickname-input value="${escapeAttr(currentName)}" maxlength="24" aria-label="Character nickname" />
        <div class="nickname-actions">
          <button type="button" data-nickname-save data-character-id="${escapeAttr(characterId)}">Confirm</button>
          <button type="button" data-nickname-cancel>Cancel</button>
        </div>
      </article>
    </div>
  `;
}

function renderReportModal(characterId) {
  const reasons = ["政治敏感", "色情低俗", "言语辱骂", "虚假误导", "其他问题"];
  return `
    <div class="report-modal-layer">
      <button type="button" class="report-modal-scrim" data-report-cancel aria-label="Close report"></button>
      <article class="report-modal">
        <h3>Report Character</h3>
        <p>请选择举报原因</p>
        <div class="report-reasons">
          ${reasons.map((reason, index) => `
            <label>
              <input type="radio" name="report-${escapeAttr(characterId)}" value="${escapeAttr(reason)}" ${index === 0 ? "checked" : ""} />
              <span>${escapeHtml(reason)}</span>
            </label>
          `).join("")}
        </div>
        <div class="report-actions">
          <button type="button" data-report-submit>Submit</button>
          <button type="button" data-report-cancel>Cancel</button>
        </div>
      </article>
    </div>
  `;
}

function getActiveSceneSession(state = {}) {
  return state.activeSceneSession || state.activeSceneBackdrop || null;
}

function renderSceneTransition(invite, direction = "to") {
  return `
    <div class="chat-scene-transition">
      <div class="chat-transition-copy">
        <strong>${direction === "back" ? "Returning to" : "Heading to"} [ ${escapeHtml(invite.placeName)} ]</strong>
        <span>Meeting halfway...</span>
        <i></i>
      </div>
    </div>
  `;
}

function renderMemoryOverlay(meta, scene) {
  const body =
    scene.placeId === "practice_room"
      ? "That night in the quiet practice room,<br />you sat beside him on the dusty wooden floor<br />and listened to the entire unreleased demo.<br />The air was still, but your heartbeats felt close."
      : "That day, you left the busy world behind<br />and slowed down in one corner of the city.<br />The wind, the lights, and one sudden invitation<br />became a memory that belonged only to you.";
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
        <button type="button" data-save-memory>Collect Memory</button>
      </article>
    </div>
  `;
}

function showChatToast(text) {
  const viewport = document.getElementById("phoneViewport") || document.body;
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast hidden";
    viewport.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 1800);
}

function getSceneMeta(placeId) {
  return SCENE_META[placeId] || SCENE_META.practice_room;
}

function buildMemoryContent(placeId, placeName) {
  if (placeId === "practice_room") {
    return "That night in the quiet practice room, you sat beside him on the dusty wooden floor and listened to the entire unreleased demo. The air was still, but your heartbeats felt close.";
  }
  return `That day, you left the busy world behind and slowed down at ${placeName}. The wind, the lights, and one sudden invitation became a memory that belonged only to you.`;
}

function getSceneReply(placeId) {
  return {
    coffee_shop: "Then let's stay a little longer. I like hearing you talk when the room is this quiet.",
    park: "One lap sounds good. If you get tired, we can slow down and pretend it was part of the plan.",
    convenience_store: "Pick whatever you want. Late-night snacks taste better when someone else is choosing too.",
    practice_room: "Do not laugh if I miss a step. Actually, maybe laugh. It would make this feel less serious.",
    company: "I only have a few minutes, but I wanted to spend them with you.",
    mall: "Let's start there. If we get lost, we can call it part of the date.",
    apartment: "You really came all this way. Stay for a little bit before you go back.",
  }[placeId] || "I am listening. Tell me what you want to do next.";
}

function enrichContactForList(contact, state = {}) {
  const custom = state.characterCustomizations?.[contact.id] || {};
  const stream = normalizeStreams(state.chatStreams || state.messagesByCharacter)[contact.id] || [];
  const lastMessage = stream[stream.length - 1];
  const kind = getMessageKind(lastMessage || contact);
  const createdAt = lastMessage?.createdAt || contact.lastMessageAt || contact.updatedAt || contact.createdAt || new Date().toISOString();
  const activeScene = getActiveSceneSession(state);
  const activeSceneForContact = activeScene?.characterId === contact.id ? activeScene : null;
  return {
    ...contact,
    name: custom.nickname || contact.name,
    image: custom.avatar || contact.image || contact.avatar || "",
    posterImage: custom.posterImage || custom.avatar || contact.posterImage || contact.image || contact.avatar || "",
    chatBackground: custom.chatBackground || contact.chatBackground || "",
    lastMsg: lastMessage?.text || lastMessage?.content || contact.lastMsg || contact.previewText || DEFAULT_FIRST_MESSAGE,
    previewText: activeSceneForContact ? "[Scene--进行中]" : getMessagePreview(lastMessage || contact),
    lastMessageType: kind,
    lastMessageAt: createdAt,
    unreadCount: Number(contact.unreadCount || (contact.hasNewMsg ? 1 : 0)),
    activeScene: activeSceneForContact,
  };
}

function getMessageKind(message = {}) {
  const raw = String(message.kind || message.messageType || message.type || message.lastMessageType || "text").toLowerCase();
  if (raw.includes("voice") || raw === "audio") return "voice";
  if (raw.includes("call") || raw === "phone") return "call";
  if (raw.includes("image") || raw.includes("photo")) return "image";
  return "text";
}

function getMessagePreview(message = {}) {
  const kind = getMessageKind(message);
  if (kind === "voice") return MESSAGE_PREVIEW.voice;
  if (kind === "call") return MESSAGE_PREVIEW.call;
  if (kind === "image") return message.text || message.content ? `${MESSAGE_PREVIEW.image} ${message.text || message.content}` : MESSAGE_PREVIEW.image;
  return message.previewText || message.lastMsg || message.text || message.content || DEFAULT_FIRST_MESSAGE;
}

function getInviteStatusById(messages = []) {
  return messages.reduce((statuses, message) => {
    if (message.type === "scene_invite_bundle" && message.inviteId) {
      statuses[message.inviteId] = message.inviteStatus || "pending_go";
    }
    return statuses;
  }, {});
}

function isSceneInviteFlowMessage(message = {}) {
  return message.type === "scene_invite_bundle" || message.type === "scene_acceptance";
}

function formatMessageDate(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMessageDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((startOfToday - startOfMessageDay) / 86400000);
  if (diffDays <= 0) {
    return new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
  }
  if (diffDays === 1) return "Yesterday";
  if (date.getFullYear() === now.getFullYear()) {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
  }
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(date);
}

function voiceBarHeight(index) {
  return [42, 68, 36, 82, 56, 74, 48, 88, 64, 78, 46, 70, 52, 84][index % 14];
}

function getSceneImageUrl(placeId) {
  return {
    coffee_shop: sceneImages.coffee_shop,
    park: sceneImages.park,
    convenience_store: sceneImages.convenience_store,
    practice_room: sceneImages.practice_room,
    company: sceneImages.company,
    mall: sceneImages.mall,
    apartment: sceneImages.apartment,
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
    previewText: contact.previewText || contact.lastMsg || DEFAULT_FIRST_MESSAGE,
    lastMessageType: contact.lastMessageType || contact.messageType || "text",
    lastMessageAt: contact.lastMessageAt || contact.updatedAt || contact.createdAt || new Date().toISOString(),
    unreadCount: Number(contact.unreadCount ?? contact.unreadMessages ?? (contact.hasNewMsg ?? contact.unread ? 1 : 0)),
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
    .chat-list-view{padding:calc(var(--status-h) + 12px) 18px 88px}
    .chat-list-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}
    .chat-list-header>div{min-width:0}
    .chat-list-header span{font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--gold2)}
    .chat-list-header h2{margin-top:0;font-family:var(--font-kr);font-weight:400;font-size:28px;line-height:1.2}
    .chat-action-hub{display:flex;align-items:center;gap:10px;flex:0 0 auto}.chat-action-button{position:relative;width:42px;height:42px;display:grid;place-items:center;padding:0;border:1px solid rgba(255,255,255,.24);border-radius:50%;background:linear-gradient(145deg,rgba(255,255,255,.18),rgba(255,138,174,.075)),rgba(38,31,43,.58);box-shadow:0 12px 32px rgba(0,0,0,.26),0 0 18px rgba(255,138,174,.12),inset 0 1px 0 rgba(255,255,255,.24);backdrop-filter:blur(16px);transition:transform .18s ease,background .18s ease,border-color .18s ease}.chat-action-button:active{transform:scale(.94);background:rgba(255,138,174,.2);border-color:rgba(255,255,255,.42)}.chat-action-button img{width:22px;height:22px;object-fit:contain;display:block;filter:drop-shadow(0 2px 8px rgba(0,0,0,.38))}.chat-discover-button img{width:23px;height:23px}.chat-action-button .notif-dot{right:1px;top:1px}
    .chat-contact-list{display:flex;flex-direction:column;gap:10px;margin-top:20px}
    .chat-discover-view{padding:calc(var(--status-h) + 12px) 18px 88px;position:relative;overflow:hidden}.chat-subpage-header{display:flex;align-items:center;gap:12px}.chat-subpage-header .chat-back-btn{flex:0 0 38px;width:38px;height:38px}.chat-subpage-header h2{font-family:var(--font-body);font-weight:800;font-size:22px;line-height:1.14}.chat-member-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:20px;padding-bottom:20px;overflow-y:auto;scrollbar-width:none}.chat-member-grid::-webkit-scrollbar{display:none}.chat-member-card{min-width:0;min-height:238px;display:grid;grid-template-rows:102px auto 38px;gap:10px;padding:10px;border:1px solid rgba(255,255,255,.14);border-radius:16px;background:linear-gradient(145deg,rgba(255,255,255,.11),rgba(255,138,174,.045)),rgba(17,20,29,.76);box-shadow:0 16px 44px rgba(0,0,0,.32),inset 0 1px 0 rgba(255,255,255,.13);backdrop-filter:blur(18px)}.chat-member-card img{width:100%;height:102px;border-radius:12px;object-fit:cover;object-position:center 18%;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.08)}.chat-member-copy{min-width:0}.chat-member-copy strong{display:block;font-size:15px;line-height:1.15}.chat-member-copy p{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;margin-top:6px;color:rgba(247,241,232,.66);font-size:11px;line-height:1.34}.chat-member-card button{align-self:end;width:100%;height:38px;border-radius:12px;background:linear-gradient(135deg,rgba(255,214,229,.96),rgba(255,138,174,.92) 58%,rgba(194,91,132,.95));color:#25101a;font-size:12px;font-weight:850;box-shadow:0 12px 28px rgba(255,138,174,.22)}.chat-member-card button:disabled{opacity:.48}.chat-add-loading{position:absolute;z-index:30;inset:0;display:grid;place-items:center;align-content:center;gap:14px;background:rgba(8,7,13,.62);backdrop-filter:blur(16px);color:#fff9ff;font-weight:800}.chat-add-loading.hidden{display:none}.chat-add-loading i{width:42px;height:42px;border-radius:50%;border:3px solid rgba(255,138,174,.22);border-top-color:#ff8aae;animation:chatSpin .8s linear infinite}.chat-add-loading span{font-size:13px;color:rgba(255,249,255,.82)}@keyframes chatSpin{to{transform:rotate(360deg)}}
    .chat-settings-view{position:relative;padding:calc(var(--status-h) + 12px) 18px 88px;background:linear-gradient(180deg,#10131b,#08070d 66%);overflow-y:auto}.chat-settings-profile{display:grid;justify-items:center;gap:10px;margin:22px 0 18px}.chat-settings-profile .chat-module-avatar{width:72px;height:72px;font-size:16px}.chat-settings-profile strong{font-size:21px}.chat-settings-list{display:grid;gap:10px}.chat-settings-list button{min-height:58px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 14px;border:1px solid rgba(255,255,255,.12);border-radius:16px;background:rgba(255,255,255,.065);color:#fff9ff;text-align:left}.chat-settings-list button span{color:rgba(255,249,255,.42)}.chat-settings-list button.danger{justify-content:center;margin-top:10px;color:#ff8aae;border-color:rgba(255,138,174,.28);background:rgba(255,138,174,.08)}
    .nickname-modal-layer,.report-modal-layer{position:absolute;z-index:90;inset:0;display:grid;place-items:center;padding:18px}.nickname-modal-scrim,.report-modal-scrim{position:absolute;inset:0;border:0;background:rgba(0,0,0,.58);backdrop-filter:blur(10px)}.nickname-modal,.report-modal{position:relative;width:min(100%,318px);padding:20px;border:1px solid rgba(255,255,255,.16);border-radius:20px;background:rgba(18,19,25,.94);box-shadow:0 28px 90px rgba(0,0,0,.58);color:#fff9ff}.nickname-modal h3,.report-modal h3{font-size:20px}.nickname-modal input{width:100%;height:46px;margin-top:16px;padding:0 13px;border:1px solid rgba(255,255,255,.14);border-radius:14px;background:rgba(255,255,255,.07);color:#fff9ff;font-size:16px;font-weight:800;outline:none}.nickname-modal input:focus{border-color:rgba(255,138,174,.6)}.report-modal p{margin-top:6px;color:rgba(255,249,255,.62);font-size:13px}.report-reasons{display:grid;gap:8px;margin-top:16px}.report-reasons label{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.06);font-size:13px}.nickname-actions,.report-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:16px}.nickname-actions button,.report-actions button{height:42px;border-radius:14px;font-size:13px;font-weight:850}.nickname-actions button:first-child,.report-actions button:first-child{background:linear-gradient(135deg,#ffd6e5,#ff8aae 58%,#c25b84);color:#25101a}.nickname-actions button:last-child,.report-actions button:last-child{background:rgba(255,255,255,.08);color:#fff9ff}
    .chat-contact-row{display:grid;grid-template-columns:54px minmax(0,1fr) auto;gap:13px;align-items:center;min-height:82px;padding:13px 14px;border:1px solid rgba(255,255,255,.12);border-radius:var(--radius-lg);background:linear-gradient(145deg,rgba(255,255,255,.1),rgba(255,255,255,.035)),rgba(20,22,27,.76);box-shadow:0 14px 40px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.12);backdrop-filter:blur(18px)}.chat-avatar-settings{width:54px;height:54px;display:grid;place-items:center;border-radius:50%;padding:0;background:transparent;box-shadow:none}.chat-detail-topbar .chat-avatar-settings{width:38px;height:38px}.bubble-row .chat-avatar-settings{width:30px;height:30px;flex:0 0 30px}
    .chat-module-avatar{width:54px;height:54px;border-radius:50%;object-fit:cover;background:linear-gradient(145deg,rgba(201,169,110,.2),rgba(255,255,255,.06));border:1px solid rgba(201,169,110,.42);display:grid;place-items:center;color:var(--gold);font-size:13px;font-weight:800}
    .chat-contact-copy{min-width:0;align-self:center}.chat-contact-copy strong{display:block;font-size:17px;line-height:1.15;letter-spacing:0}.chat-contact-copy p{margin-top:7px;color:var(--soft);font-size:13px;line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.chat-contact-copy p.chat-scene-preview{color:#ffd6e5;font-weight:850}
    .chat-contact-meta{align-self:stretch;display:flex;flex-direction:column;align-items:flex-end;justify-content:flex-start;gap:9px;min-width:56px;padding-top:3px}.chat-contact-meta time{color:rgba(247,241,232,.58);font-size:11px;font-weight:700;line-height:1;white-space:nowrap}.chat-unread-count{min-width:20px;height:20px;display:grid;place-items:center;padding:0 6px;border-radius:999px;background:linear-gradient(135deg,#ff9ab9,#ff6f9e);color:#fff;font-size:11px;font-weight:850;line-height:1;box-shadow:0 0 16px rgba(255,111,158,.48)}
    .chat-empty{color:var(--soft);font-size:13px;margin-top:24px}
    .chat-detail-view{position:relative;min-height:0;background:var(--black);overflow:hidden}.chat-detail-view.has-custom-bg:before{content:"";position:absolute;inset:0;background-image:linear-gradient(to bottom,rgba(8,7,13,.72),rgba(8,7,13,.48)),var(--chat-custom-bg);background-size:cover;background-position:center;filter:saturate(.9) contrast(1.02);opacity:.9}.chat-detail-view.scene-immersive:before{content:"";position:absolute;inset:0;background-image:var(--chat-scene-bg);background-size:cover;background-position:center;filter:saturate(.98) contrast(1.02);opacity:1}.chat-detail-view.scene-immersive:after,.chat-detail-view.has-custom-bg:after{content:"";position:absolute;inset:0;background:linear-gradient(to bottom,rgba(8,12,18,.7) 0,rgba(8,12,18,.28) 112px,rgba(9,9,9,.2) 220px,rgba(9,9,9,.54));pointer-events:none}
    .chat-detail-topbar{position:relative;z-index:2;flex-shrink:0;padding:calc(var(--status-h) + 16px) 16px 12px;display:grid;grid-template-columns:34px 38px minmax(0,1fr) auto;gap:10px;align-items:center;border-bottom:1px solid rgba(255,255,255,.12);background:rgba(8,9,11,.42);backdrop-filter:blur(16px)}
    .chat-back-btn{width:34px;height:34px;border-radius:14px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:var(--gold);font-size:24px;line-height:1}
    .chat-detail-topbar .chat-module-avatar{width:38px;height:38px;font-size:12px}
    .chat-title-block{min-width:0}.chat-title-block strong{display:block;font-size:15px}.chat-title-block span{display:block;color:var(--muted);font-size:11px;margin-top:2px}
    .chat-scene-btn{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.13);color:var(--cream);border-radius:14px;padding:8px 10px;font-size:12px;white-space:nowrap}
    .chat-scene-header{position:relative;z-index:2;flex-shrink:0;padding:calc(var(--status-h) + 12px) 18px 12px;display:flex;flex-direction:column;gap:6px;border-bottom:1px solid rgba(255,255,255,.12);background:rgba(8,7,13,.58);backdrop-filter:blur(16px)}
    .chat-scene-actions{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px}.chat-scene-back,.chat-scene-finish{min-height:34px;display:inline-flex;align-items:center;gap:6px;border:1px solid rgba(255,138,174,.2);border-radius:999px;background:rgba(255,138,174,.1);color:#ffd6e5;font-size:12px;font-weight:850}.chat-scene-back{padding:0 12px 0 10px}.chat-scene-back{font-size:22px;line-height:1}.chat-scene-back span{font-size:12px;line-height:1}.chat-scene-finish{padding:0 11px}.chat-scene-finish span{font-size:12px}
    .chat-scene-header>strong{color:#fff9ff;font-size:22px;font-weight:900;line-height:1.08}.chat-scene-header>span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#f6cf8b;font-size:11px;font-weight:900;letter-spacing:.16em;text-transform:uppercase}
    .chat-detail-messages{position:relative;z-index:2;flex:1;min-height:0;overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding:14px 18px 16px;scrollbar-width:none}.chat-detail-messages.has-floating-scene{padding-top:104px}.chat-detail-messages::-webkit-scrollbar{display:none}
    .chat-detail-messages .bubble-row{max-width:86%;display:flex;align-items:flex-end;gap:8px;animation:bubble .25s ease}.chat-detail-messages .idol-row{align-self:flex-start}.chat-detail-messages .bubble-row .chat-module-avatar{width:30px;height:30px;flex:0 0 30px;border-color:rgba(255,138,174,.44)}.chat-detail-messages .bubble-row .bubble{max-width:calc(100% - 38px);animation:none}
    .image-message{max-width:min(72%,236px);padding:6px;border-radius:18px;overflow:hidden;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.13);box-shadow:0 14px 34px rgba(0,0,0,.22)}.image-message.user{align-self:flex-end;background:linear-gradient(145deg,rgba(255,214,229,.24),rgba(255,138,174,.12)),rgba(255,255,255,.08);border-color:rgba(255,138,174,.28)}.image-message img{display:block;width:100%;max-height:260px;object-fit:cover;border-radius:14px;background:rgba(255,255,255,.08)}.image-message p{margin:8px 7px 5px;color:inherit;font-size:15px;line-height:1.35;overflow-wrap:anywhere}
    .media-bubble{min-width:188px;padding:12px 13px}.voice-main{display:grid;grid-template-columns:1fr auto 30px;align-items:center;gap:10px}.voice-bars{display:flex;align-items:center;gap:4px;height:32px;color:#a06cff}.voice-bars i{display:block;width:3px;height:calc(var(--h)*.28px);min-height:10px;border-radius:999px;background:currentColor}.voice-duration{font-size:15px;font-weight:700;color:rgba(43,37,48,.82)}.voice-play{width:30px;height:30px;display:grid;place-items:center;border-radius:50%;background:rgba(160,108,255,.12);color:#a06cff}.voice-play span{display:block;width:0;height:0;border-top:6px solid transparent;border-bottom:6px solid transparent;border-left:9px solid currentColor;margin-left:2px}.voice-message p{margin-top:8px;color:inherit;font-size:16px;line-height:1.35}.call-message{display:flex;align-items:center;gap:12px;min-width:220px}.call-message strong{font-size:20px;font-weight:650;color:inherit}.call-duration,.call-live{margin-left:auto;display:inline-flex;align-items:center;gap:6px;padding:8px 11px;border-radius:999px;background:rgba(160,108,255,.24);color:#fff;font-size:15px;font-weight:700}.call-icon{position:relative;width:34px;height:34px;border-radius:50%;background:rgba(160,108,255,.22)}.call-icon:before{content:"";position:absolute;left:10px;top:9px;width:16px;height:16px;border:5px solid #a06cff;border-top-color:transparent;border-right-color:transparent;border-radius:50%;transform:rotate(-38deg)}.call-icon:after{content:"";position:absolute;right:1px;top:0;width:10px;height:3px;border-radius:3px;background:#a06cff;transform:rotate(45deg);box-shadow:0 0 0 0 #a06cff}
    .incoming-call-card{position:relative;align-self:center;width:min(100%,300px);min-height:520px;display:flex;flex-direction:column;align-items:center;overflow:hidden;padding:92px 22px 24px;border-radius:8px;background:#343434;color:#fff;text-align:center;box-shadow:0 28px 90px rgba(0,0,0,.5)}.incoming-call-backdrop{position:absolute;inset:0;background-image:var(--caller-img);background-size:cover;background-position:center;filter:blur(18px) saturate(.82);opacity:.54;transform:scale(1.12)}.incoming-call-card:after{content:"";position:absolute;inset:0;background:linear-gradient(to bottom,rgba(80,80,80,.4),rgba(12,12,12,.68));pointer-events:none}.incoming-call-avatar,.incoming-call-initial{position:relative;z-index:1;width:92px;height:92px;border-radius:50%;object-fit:cover;background:rgba(255,255,255,.16);display:grid;place-items:center;border:2px solid rgba(255,255,255,.86);font-size:22px;font-weight:850}.incoming-call-card strong{position:relative;z-index:1;margin-top:12px;font-size:19px}.incoming-call-card p{position:relative;z-index:1;margin:auto 0 0;max-width:220px;font-size:15px;line-height:1.45;color:rgba(255,255,255,.88)}.incoming-call-actions{position:relative;z-index:1;display:flex;justify-content:space-between;width:210px;margin-top:120px}.call-action{width:64px;height:64px;border-radius:50%;display:grid;place-items:center}.call-action span{position:relative;width:26px;height:26px}.call-action span:before{content:"";position:absolute;left:4px;top:5px;width:17px;height:17px;border:6px solid #fff;border-top-color:transparent;border-right-color:transparent;border-radius:50%;transform:rotate(-38deg)}.call-action.decline{background:#f12128}.call-action.decline span:after{content:"";position:absolute;right:-3px;top:0;width:12px;height:3px;border-radius:3px;background:#fff;transform:rotate(45deg)}.call-action.accept{background:#31d35c}.call-action.accept span:after{content:"";position:absolute;right:-2px;top:0;width:10px;height:10px;border-top:3px solid #fff;border-right:3px solid #fff;transform:rotate(18deg)}.incoming-call-card small{position:relative;z-index:1;margin-top:auto;color:rgba(255,255,255,.72);font-size:11px}
    .chat-active-scene-layer{position:absolute;z-index:5;left:16px;right:16px;top:calc(var(--status-h) + 82px);pointer-events:none}.chat-active-scene-layer:before{content:"";position:absolute;left:0;right:0;top:-12px;height:80px;background:linear-gradient(to bottom,rgba(8,7,13,.86),rgba(8,7,13,.72) 28%,rgba(8,7,13,0));pointer-events:none}.chat-active-scene-layer:after{content:"";position:absolute;left:0;right:0;top:100%;height:24px;background:linear-gradient(to bottom,rgba(8,7,13,.44),rgba(8,7,13,0));pointer-events:none}.chat-active-scene-card{position:relative;pointer-events:auto;width:100%;display:grid;grid-template-columns:34px minmax(0,1fr);gap:10px;align-items:center;padding:10px 12px;border:1px solid rgba(255,138,174,.24);border-radius:14px;background:linear-gradient(145deg,rgba(255,138,174,.14),rgba(255,255,255,.055)),rgba(18,18,25,.82);box-shadow:0 12px 34px rgba(0,0,0,.32),0 0 18px rgba(255,138,174,.12);color:#fff9ff;text-align:left;backdrop-filter:blur(16px)}.chat-active-scene-card img{grid-row:1/3;width:34px;height:34px;border-radius:50%;object-fit:cover;border:1px solid rgba(255,255,255,.28)}.chat-active-scene-card span{min-width:0;color:#ffd6e5;font-size:12px;font-weight:900;line-height:1.1}.chat-active-scene-card strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:rgba(255,249,255,.72);font-size:11px;font-weight:800}.chat-scene-progress-note{align-self:center;max-width:86%;color:rgba(255,249,255,.56);font-size:12px;font-style:italic;line-height:1.5;text-align:center}
    .chat-scene-voiceover{align-self:center;max-width:88%;margin:4px auto 8px;color:rgba(247,241,232,.68);font-family:var(--font-kr);font-size:12px;font-style:italic;font-weight:300;line-height:1.75;text-align:center;text-shadow:0 0 14px rgba(255,255,255,.18);animation:fadeUp .4s ease}
    .scene-immersive .bubble.user{background:rgba(10,10,9,.48);color:rgba(247,241,232,.94);border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(16px);box-shadow:0 12px 34px rgba(0,0,0,.24)}
    .scene-immersive .bubble.idol{background:rgba(247,241,232,.68);color:#15120e;border:1px solid rgba(255,255,255,.36);backdrop-filter:blur(18px);box-shadow:0 12px 34px rgba(0,0,0,.2)}
    .chat-location-pill{position:relative;z-index:2;margin:0 16px 8px;padding:10px 13px;border:1px solid rgba(255,255,255,.16);border-radius:18px;background:rgba(247,241,232,.1);backdrop-filter:blur(18px);box-shadow:0 12px 34px rgba(0,0,0,.24);color:rgba(247,241,232,.78);font-size:12px;line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .chat-detail-input{position:relative;z-index:2;flex-shrink:0;display:flex;gap:9px;padding:10px 16px 34px;border-top:1px solid rgba(255,255,255,.12);background:rgba(9,9,9,.36);backdrop-filter:blur(14px)}
    .chat-standard-input{align-items:center}.chat-standard-input.has-image-preview{padding-top:70px}
    .chat-detail-input input{flex:1;min-width:0;border-radius:22px;padding:11px 15px;outline:none}
    .chat-detail-input.is-locked input,.chat-detail-input.is-locked button{opacity:.48;cursor:not-allowed}.chat-detail-input.is-locked input{color:rgba(255,249,255,.62)}
    .chat-detail-input input:focus{border-color:var(--gold)}
    .chat-detail-input button[type="submit"]{min-width:52px;width:52px;height:52px;display:grid;place-items:center;border-radius:18px;background:linear-gradient(135deg,#ffd6e5 0%,#ff8aae 54%,#c25b84 100%);color:#fff;font-weight:800;box-shadow:0 16px 42px rgba(255,138,174,.28),0 0 24px rgba(255,138,174,.2),inset 0 1px 0 rgba(255,255,255,.52)}.chat-detail-input button[type="submit"] span{width:20px;height:20px;display:block;background:#fff;clip-path:polygon(7% 45%,92% 6%,64% 94%,48% 59%)}
    .chat-upload-btn{flex:0 0 42px;width:42px;height:42px;display:grid;place-items:center;border-radius:16px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.07);color:rgba(255,249,255,.86);box-shadow:inset 0 1px 0 rgba(255,255,255,.1)}.chat-upload-btn:active{transform:scale(.96);border-color:rgba(255,138,174,.42);background:rgba(255,138,174,.13)}.chat-upload-btn span{position:relative;width:21px;height:18px;display:block;border:2px solid currentColor;border-radius:5px}.chat-upload-btn span:before{content:"";position:absolute;left:4px;top:4px;width:4px;height:4px;border-radius:50%;background:currentColor}.chat-upload-btn span:after{content:"";position:absolute;left:3px;right:3px;bottom:3px;height:8px;background:currentColor;clip-path:polygon(0 100%,36% 42%,52% 64%,72% 24%,100% 100%)}
    .chat-image-preview{position:absolute;left:16px;top:8px;width:58px;height:58px;border-radius:14px;border:1px solid rgba(255,255,255,.2);background:rgba(17,20,29,.86);box-shadow:0 12px 28px rgba(0,0,0,.32),0 0 18px rgba(255,138,174,.14);backdrop-filter:blur(12px)}.chat-image-preview img{width:100%;height:100%;display:block;border-radius:13px;object-fit:cover}.chat-image-preview button{position:absolute;right:-8px;top:-8px;width:22px;height:22px;min-width:0;display:grid;place-items:center;padding:0;border-radius:50%;border:1px solid rgba(255,255,255,.42);background:rgba(18,19,25,.94);color:#fff;font-size:17px;line-height:1;box-shadow:0 6px 16px rgba(0,0,0,.36)}
    .chat-paren-btn{flex:0 0 42px;width:42px;height:42px;align-self:center;border-radius:16px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.08);color:rgba(255,249,255,.86);font-size:13px;font-weight:800;box-shadow:inset 0 1px 0 rgba(255,255,255,.1)}
    .scene-chat-input{align-items:center}.scene-chat-input input{height:52px}.bubble .aside-text{font-size:.92em;font-style:italic;color:rgba(255,249,255,.62)}
    .chat-scene-bundle{position:relative;align-self:center;width:min(88%,330px);min-height:188px;overflow:hidden;border:1px solid rgba(255,255,255,.2);border-radius:18px;background-image:linear-gradient(120deg,rgba(8,7,13,.88),rgba(8,7,13,.48) 48%,rgba(255,138,174,.08)),var(--invite-bg);background-size:cover;background-position:center;box-shadow:0 20px 54px rgba(0,0,0,.42),0 0 30px rgba(255,138,174,.18),inset 0 1px 0 rgba(255,255,255,.2);backdrop-filter:blur(10px)}.chat-scene-bundle:before{content:"";position:absolute;left:0;top:0;bottom:0;width:7px;background:linear-gradient(to bottom,#ffd6e5,#ff8aae,#f6cf8b);box-shadow:0 0 20px rgba(255,138,174,.58)}.chat-scene-bundle:after{content:"SCENE PASS";position:absolute;right:14px;top:14px;color:rgba(255,249,255,.36);font-size:10px;font-weight:900;letter-spacing:.18em}
    .chat-location-card{position:relative;height:100%;min-height:188px;display:flex;flex-direction:column;justify-content:flex-end;gap:10px;padding:18px 20px 20px 26px;background:radial-gradient(circle at 82% 18%,rgba(255,214,229,.18),transparent 28%),linear-gradient(to top,rgba(8,7,13,.84),rgba(8,7,13,.36) 62%,rgba(255,255,255,.02))}
    .chat-location-card span{order:1;display:inline-flex;align-items:center;gap:7px;width:max-content;max-width:86%;padding:6px 9px;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(255,255,255,.1);color:rgba(255,249,255,.92);font-size:12px;font-weight:850;line-height:1.2;text-shadow:0 2px 12px rgba(0,0,0,.62);backdrop-filter:blur(12px)}.chat-location-card span:before{content:"";width:8px;height:8px;border:2px solid currentColor;border-radius:50%;box-shadow:0 0 0 3px rgba(255,255,255,.08),0 0 14px rgba(255,138,174,.36)}.chat-location-card strong{order:2;display:block;max-width:95%;font-family:var(--font-serif);font-size:31px;font-weight:500;line-height:1.03;color:#fff9ff;text-shadow:0 3px 20px rgba(0,0,0,.75),0 0 20px rgba(255,138,174,.26)}
    .chat-location-card em{order:3;display:block;color:rgba(255,249,255,.74);font-size:12px;font-style:normal}.invite-actions{order:3;display:flex;gap:8px;margin-top:4px}.invite-actions button{border-radius:999px;padding:9px 12px;background:rgba(255,214,229,.92);color:#25101a;font-size:12px;font-weight:850}.invite-actions button:last-child{background:rgba(255,255,255,.14);color:#fff9ff}.scene-acceptance p{margin:0}.scene-acceptance em{display:block;color:rgba(255,249,255,.62);font-style:normal;font-size:12px}.scene-go-now-button{display:block;margin:10px auto 0;padding:10px 18px;border-radius:999px;background:linear-gradient(135deg,#ffd6e5,#ffb5ce);color:#25101a;font-size:12px;font-weight:900;box-shadow:0 10px 26px rgba(255,138,174,.22)}
    .chat-scene-transition{position:absolute;z-index:60;inset:0;display:grid;place-items:center;background:rgba(8,8,7,.68);backdrop-filter:blur(18px);transition:opacity .5s ease}
    .chat-scene-transition.fade-out{opacity:0}.chat-transition-copy{text-align:center;color:var(--cream)}.chat-transition-copy strong{display:block;color:var(--gold);font-family:var(--font-kr);font-size:20px;font-weight:300;text-shadow:0 0 22px rgba(201,169,110,.36);animation:transitionBreath 1.4s ease-in-out infinite}.chat-transition-copy span{display:block;margin-top:12px;color:rgba(247,241,232,.76);font-size:13px;letter-spacing:.12em}.chat-transition-copy i{display:block;width:34px;height:34px;margin:28px auto 0;border-radius:50%;border:1px solid rgba(201,169,110,.2);border-top-color:rgba(201,169,110,.82);animation:transitionSpin 1s linear infinite}
    @keyframes transitionBreath{50%{opacity:.62;text-shadow:0 0 34px rgba(201,169,110,.68)}}@keyframes transitionSpin{to{transform:rotate(360deg)}}
    .chat-memory-overlay{position:absolute;z-index:80;inset:0;display:grid;place-items:center;background:rgba(5,5,5,.68);backdrop-filter:blur(14px);animation:fadeUp .28s ease}.chat-memory-overlay.is-capturing{background:radial-gradient(circle at 50% 42%,rgba(255,245,226,.18),rgba(5,5,8,.74) 62%);animation:memoryCaptureOverlay .95s ease both}.capture-polaroid{pointer-events:none;animation:memoryCaptureCard .95s cubic-bezier(.2,.9,.28,1) both}
    .chat-polaroid{width:282px;padding:12px 12px 18px;background:#f5efe3;color:#221b14;border-radius:8px;box-shadow:0 28px 90px rgba(0,0,0,.62);transform:rotate(-1.4deg);animation:polaroidPop .38s cubic-bezier(.2,1.25,.3,1)}
    .chat-polaroid-photo{height:224px;border-radius:4px;background-image:var(--memory-bg);background-size:cover;background-position:center;margin-bottom:14px}
    .chat-polaroid-copy h3{font-family:var(--font-kr);font-size:17px;font-weight:500}.chat-polaroid-copy p{margin-top:8px;font-size:12px;line-height:1.65;color:#514638}.chat-polaroid-copy span{display:block;margin-top:10px;font-size:10px;color:#7a6c5a}
    .chat-polaroid button{width:100%;min-height:44px;margin-top:14px;padding:12px;border-radius:999px;background:#221b14;color:#f5efe3;font-size:13px;font-weight:850;box-shadow:0 0 20px rgba(201,169,110,.34)}
    @keyframes polaroidPop{from{opacity:0;transform:translateY(18px) scale(.92) rotate(-4deg)}to{opacity:1;transform:translateY(0) scale(1) rotate(-1.4deg)}}@keyframes memoryCaptureOverlay{0%{opacity:0}18%,72%{opacity:1}100%{opacity:0}}@keyframes memoryCaptureCard{0%{opacity:0;transform:translateY(22px) scale(.86) rotate(-6deg)}34%{opacity:1;transform:translateY(0) scale(1) rotate(-1.4deg)}100%{opacity:0;transform:translateY(130px) scale(.46) rotate(5deg)}}
    .chat-module{background:radial-gradient(circle at 78% 4%,rgba(112,231,255,.08),transparent 28%),linear-gradient(180deg,#10131b,#08070d 66%);color:var(--text)}
    .chat-list-header span{color:var(--color-gold)}
    .chat-list-header h2{font-family:var(--font-body);font-weight:800;font-size:30px}
    .chat-contact-row{border-color:rgba(255,255,255,.15);border-radius:var(--radius-lg);background:linear-gradient(145deg,rgba(255,255,255,.1),rgba(255,138,174,.045)),rgba(17,20,29,.74);box-shadow:0 18px 52px rgba(0,0,0,.36),inset 0 1px 0 rgba(255,255,255,.14)}
    .chat-module-avatar{background:rgba(255,138,174,.16);border-color:rgba(255,138,174,.5);color:#ffd6e5;box-shadow:0 0 18px rgba(255,138,174,.14)}
    .chat-detail-view{background:linear-gradient(180deg,#10131b,#08070d 66%)}
    .chat-detail-view.scene-immersive:after{background:linear-gradient(to bottom,rgba(8,12,18,.7) 0,rgba(8,7,13,.3) 112px,rgba(8,7,13,.18) 220px,rgba(8,7,13,.56))}
    .chat-detail-topbar,.chat-detail-input{background:rgba(8,7,13,.58);border-color:rgba(255,255,255,.12)}
    .chat-back-btn,.chat-scene-btn{border-color:rgba(255,138,174,.2);background:rgba(255,138,174,.1);color:#ffd6e5}
    .chat-location-pill{border-color:rgba(255,138,174,.2);background:rgba(255,138,174,.11);color:rgba(255,249,255,.86);box-shadow:0 12px 34px rgba(0,0,0,.24),0 0 18px rgba(255,138,174,.12)}
    .chat-detail-input input{background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.14)}
    .chat-detail-input input:focus{border-color:rgba(255,138,174,.62)}
    .chat-detail-input button{background:linear-gradient(135deg,#ffd6e5 0%,#ff8aae 54%,#c25b84 100%);color:#25101a;box-shadow:0 16px 42px rgba(255,138,174,.28),0 0 24px rgba(255,138,174,.2),inset 0 1px 0 rgba(255,255,255,.52)}
    .chat-detail-input .chat-upload-btn{background:rgba(255,255,255,.07);color:rgba(255,249,255,.86);box-shadow:inset 0 1px 0 rgba(255,255,255,.1)}
    .chat-detail-input .chat-paren-btn{background:rgba(255,255,255,.08);color:rgba(255,249,255,.86);box-shadow:inset 0 1px 0 rgba(255,255,255,.1)}
    .chat-detail-input button[type="submit"]{color:#fff}.chat-detail-input button[type="submit"] span{background:#fff}
    .scene-immersive .bubble.user{background:rgba(12,13,21,.56);color:rgba(255,249,255,.94);border-color:rgba(255,138,174,.24)}
    .scene-immersive .bubble.idol{background:rgba(255,246,236,.78);color:#21131a;border-color:rgba(255,255,255,.42)}
    .chat-scene-bundle{background-image:linear-gradient(to top,rgba(8,7,13,.86),rgba(8,7,13,.22) 58%,rgba(255,255,255,.04)),var(--invite-bg);color:#fff9ff}
    .chat-scene-transition{background:radial-gradient(circle at 50% 42%,rgba(255,138,174,.18),rgba(8,7,13,.74));}
    .chat-transition-copy strong{color:#ffd6e5;text-shadow:0 0 28px rgba(255,138,174,.5)}
    .chat-transition-copy i{border-color:rgba(255,138,174,.2);border-top-color:rgba(255,138,174,.9)}
    .chat-memory-overlay{background:radial-gradient(circle at 50% 38%,rgba(255,138,174,.18),rgba(5,5,8,.76) 62%)}
    .chat-polaroid{background:#fff5ea;border-radius:8px;box-shadow:0 28px 90px rgba(0,0,0,.62),0 0 24px rgba(255,138,174,.14)}
    .chat-polaroid button{background:linear-gradient(135deg,#ffd6e5,#ff8aae 60%,#c25b84);color:#25101a;box-shadow:0 0 22px rgba(255,138,174,.26)}
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
