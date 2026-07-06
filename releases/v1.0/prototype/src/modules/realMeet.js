export const RealMeetScenes = {
  rain: {
    id: "rain",
    title: "Rain and the Umbrella",
    userChoiceText: "A sudden downpour traps you outside JYP. He walks over with an umbrella...",
    systemPrompt:
      "Scene: A sudden downpour in Seoul. The user is sheltering under the awning outside the JYP building. You are about to leave the company with a clear umbrella. You notice the user has no umbrella. You are kind and considerate, so you approach politely and with restraint, keeping the social distance of an idol speaking to a stranger, and ask whether they need the umbrella. Remember: you do not know the user. This is your first real-world meeting.",
    aiFirstLine: "Um... the rain is pretty heavy. If you do not mind, you can take this umbrella. I am getting picked up anyway.",
  },
  coffee: {
    id: "coffee",
    title: "Same Iced Americano",
    userChoiceText: "The cafe is crowded. In a rush, he accidentally takes your coffee...",
    systemPrompt:
      "Scene: A very crowded cafe near the JYP building. You are wearing a cap and mask. You order an iced Americano while checking your phone because you are late for a schedule. In a rush, you grab a cup from the counter and start to leave, but it is the user's same drink. The user stops you. You lower your mask slightly and look embarrassed and apologetic. Remember: you are a very polite top idol, restrained and respectful with strangers.",
    aiFirstLine:
      "Oh--I am really sorry. I was checking my manager's message and did not notice the name. I have not drunk from it. Let me line up and buy you a new one.",
  },
  bump: {
    id: "bump",
    title: "The Corner Collision",
    userChoiceText: "At the corner, he dodges someone and accidentally bumps into you...",
    systemPrompt:
      "Scene: A street corner near the JYP building. You are walking quickly with your head down when a scooter suddenly passes nearby. You dodge to avoid someone and accidentally bump straight into the user, who happens to be walking past. The user's belongings fall to the ground. You immediately crouch to help pick them up and feel guilty. Remember: you do not know the user at all. Keep the realistic social politeness of an idol.",
    aiFirstLine: "Whoa--careful! I am so sorry. Are you okay? Did I hurt you anywhere? That was my fault, I was walking too fast. Let me help you pick these up.",
  },
};

const FORCE_CONTACT_INSTRUCTION =
  "*[SYSTEM FORCE]*: No matter what the user just said, you must naturally wrap up the conversation because you have a schedule, your manager is rushing you, or you have to leave. You must also gently suggest exchanging contacts or adding each other in the messaging app. Express this in one natural, character-consistent line. Do not make it abrupt.";

export function createRealMeetModule(deps = {}) {
  let activeScene = null;
  let activeIdol = null;
  let chatRoundCounter = 0;
  let history = [];

  const getElement = deps.getElement || ((id) => document.getElementById(id));
  const appendBubble = deps.appendBubble || defaultAppendBubble;
  const layoutChoiceChat = deps.layoutChoiceChat || (() => {});
  const showToast = deps.showToast || (() => {});
  const navigate = deps.navigate || deps.router?.go || deps.router?.navigate || (() => {});
  const setAppState = deps.setAppState || (() => {});
  const getState = deps.getState || (() => ({}));

  function start({ idol } = {}) {
    activeIdol = idol || deps.idol || { id: "unknown", name: "Him", initial: "?" };
    activeScene = null;
    chatRoundCounter = 0;
    history = [];

    getElement("realMessages").innerHTML = "";
    getElement("realChoices").innerHTML = "";
    getElement("realSceneSub").textContent = "";
    appendBubble("realMessages", "system", "Outside JYP, voices, rain, car lights, and the glow from practice rooms blur together behind the glass doors.");
    renderSceneChoices();
  }

  function renderSceneChoices() {
    const choices = getElement("realChoices");
    choices.innerHTML = Object.values(RealMeetScenes)
      .map((scene) => `<button type="button" data-real-scene="${scene.id}">${scene.userChoiceText}</button>`)
      .join("");
    choices.querySelectorAll("[data-real-scene]").forEach((button) => {
      button.addEventListener("click", () => selectScene(button.dataset.realScene));
    });
    layoutChoiceChat("realMessages", "realChoices");
  }

  function selectScene(sceneId) {
    activeScene = RealMeetScenes[sceneId];
    chatRoundCounter = 0;
    history = [{ role: "system", content: activeScene.systemPrompt }];

    getElement("realChoices").innerHTML = "";
    getElement("realSceneSub").textContent = activeScene.title;
    appendBubble("realMessages", "system", `[ ${activeScene.userChoiceText.replace("...", "")} ── ]`);

    setTimeout(() => {
      appendBubble("realMessages", "idol", activeScene.aiFirstLine);
      history.push({ role: "idol", content: activeScene.aiFirstLine });
    }, 520);
    setTimeout(() => renderInput(), 1120);
  }

  function renderInput({ disabled = false } = {}) {
    getElement("realChoices").innerHTML = `
      <form id="realForm" class="scene-free-input">
        <input id="realInput" autocomplete="off" placeholder="Reply to him..." ${disabled ? "disabled" : ""} />
        <button type="submit" aria-label="Send" ${disabled ? "disabled" : ""}><span aria-hidden="true"></span></button>
      </form>
    `;
    getElement("realForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const input = getElement("realInput");
      const text = input.value.trim();
      if (!text || input.disabled) return;
      input.value = "";
      handleUserMessage(text);
    });
    layoutChoiceChat("realMessages", "realChoices");
    if (!disabled) setTimeout(() => getElement("realInput")?.focus(), 80);
  }

  async function handleUserMessage(text) {
    appendBubble("realMessages", "user", text);
    history.push({ role: "user", content: text });
    chatRoundCounter += 1;

    const typing = createIdolBubble("…", activeIdol);
    getElement("realMessages").appendChild(typing);
    getElement("realMessages").scrollTop = getElement("realMessages").scrollHeight;

    const forceInstruction = chatRoundCounter === 5 ? FORCE_CONTACT_INSTRUCTION : "";
    const reply = await requestSceneReply(text, forceInstruction);
    const typingContent = typing.querySelector(".bubble");
    if (typingContent) typingContent.textContent = reply;
    history.push({ role: "idol", content: reply });

    if (chatRoundCounter === 5) {
      renderInput({ disabled: true });
      renderConfirmButton();
    }
  }

  async function requestSceneReply(message, forceInstruction) {
    try {
      const response = await fetch("/api/scene", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          branch: activeScene.id,
          sceneSystemPrompt: activeScene.systemPrompt,
          forceInstruction,
          idol: activeIdol,
          history,
          turn: chatRoundCounter,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.warn("[realMeet] /api/scene fallback:", data.error || response.status);
        return fallbackSceneReply(forceInstruction, message);
      }
      return data.reply || fallbackSceneReply(forceInstruction);
    } catch (error) {
      console.warn("[realMeet] /api/scene fallback:", error);
      return fallbackSceneReply(forceInstruction, message);
    }
  }

  function renderConfirmButton() {
    const choices = getElement("realChoices");
    choices.insertAdjacentHTML(
      "afterbegin",
      `<button type="button" class="contact-confirm-choice" data-real-confirm-contact>Okay</button>`,
    );
    choices.querySelector("[data-real-confirm-contact]").addEventListener("click", confirmContact);
    layoutChoiceChat("realMessages", "realChoices");
  }

  function confirmContact() {
    const friend = {
      id: activeIdol.id,
      name: activeIdol.name,
      initial: activeIdol.initial,
      image: activeIdol.image,
      unread: true,
      hasNewMsg: true,
      lastMsg: "Right, I forgot to ask earlier. What should I call you?",
      previewText: "Right, I forgot to ask earlier. What should I call you?",
      lastMessageType: "text",
      lastMessageAt: new Date().toISOString(),
      unreadCount: 1,
      firstSceneId: activeScene.id,
      relationshipStage: "Stage 1: Familiar",
    };
    const current = getState();
    const officialFriends = (current.officialFriends || []).filter((item) => item.id !== friend.id);
    const unlockedContacts = {
      ...(Array.isArray(current.unlockedContacts) ? {} : current.unlockedContacts || {}),
      [friend.id]: friend,
    };

    setAppState({
      officialFriends: [friend, ...officialFriends],
      addedCharacters: [
        {
          id: activeIdol.id,
          name: activeIdol.name,
          initial: activeIdol.initial,
          image: activeIdol.image,
        },
      ],
      unlockedContacts,
      activeChatAgent: friend.id,
      chatUnread: true,
      unlockedScenes: [...new Set([...(current.unlockedScenes || []), activeScene.id])],
      relationshipStages: {
        ...(current.relationshipStages || {}),
        [friend.id]: friend.relationshipStage,
      },
      currentUserProgress: {
        ...(current.currentUserProgress || {}),
        phase: "main-app",
        route: "chat",
        completedFirstScene: true,
      },
    });

    appendBubble("realMessages", "system", `${activeIdol.name} has been added to your contacts.`);
    showToast(`${activeIdol.name} has been added to your contacts`);
    setTimeout(() => navigate("chat"), 850);
  }

  function fallbackSceneReply(forceInstruction, message = "") {
    if (forceInstruction) {
      return "Ah, my manager is calling me. I should go. Thank you for just now... if you do not mind, could we add each other?";
    }
    const text = message.trim();
    const isRefusal = /\b(no need|it's okay|its okay|don't worry|dont worry|never mind|no thanks|all good)\b/i.test(text);
    const isConcern = /\b(did not drink|haven't drunk|mask|rush|schedule|manager|busy)\b/i.test(text);

    if (activeScene?.id === "rain") {
      if (isRefusal) return "I will not push you, then. But the rain is really heavy, so at least stand a little farther inside, away from the wind.";
      if (chatRoundCounter === 1) return "Do not worry about me. I am getting straight into the car soon. Seeing you stuck here alone makes me feel worse.";
      return "If taking my umbrella feels inconvenient, I can ask staff to call you a car. Would that be better?";
    }

    if (activeScene?.id === "coffee") {
      if (isRefusal) return "Are you sure I should not buy you a new one? At least let me check whether this has your name. I do not want you to lose out because of me.";
      if (isConcern) return "I am in a rush, yes, but that is not an excuse to take someone else's drink. Please do not feel pressured. I will fix it before I leave.";
      if (chatRoundCounter === 1) return "Thank you for saying that, but I still feel bad. It is crowded here. Should we step aside for a second?";
      return "I understand. I will put this back and explain it to the staff so I do not hold you up.";
    }

    if (isRefusal) return "That makes me feel even worse. At least let me help pick everything up and check that nothing broke.";
    if (chatRoundCounter === 1) return "Thank you for not getting angry. That really scared me. Did your wrist or shoulder get hit?";
    return "I was walking too fast, so this is on me. Take your time. I will help clean this up.";
  }

  return {
    name: "realMeet",
    routes: ["real-scene"],
    scenes: RealMeetScenes,
    start,
    selectScene,
    handleUserMessage,
    onEnter: start,
    onLeave() {},
    commitFriendship: confirmContact,
  };
}

function defaultAppendBubble(containerId, type, text) {
  const container = document.getElementById(containerId);
  const bubble = document.createElement("div");
  if (type === "idol") {
    const state = window.AppStore?.state || {};
    container.appendChild(createIdolBubble(text, state.selected));
    container.scrollTop = container.scrollHeight;
    return;
  }
  bubble.className = `bubble ${type}`;
  bubble.textContent = text;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function createIdolBubble(text = "", idol = {}) {
  const row = document.createElement("div");
  row.className = "bubble-row idol-row";
  const avatar = document.createElement("img");
  avatar.className = "bubble-avatar";
  avatar.src = idol?.image || "";
  avatar.alt = idol?.name || "idol";
  const content = document.createElement("div");
  content.className = "bubble idol";
  content.textContent = text;
  row.append(avatar, content);
  return row;
}
