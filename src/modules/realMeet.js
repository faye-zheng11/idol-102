export const RealMeetScenes = {
  rain: {
    id: "rain",
    title: "暴雨与伞",
    userChoiceText: "突降暴雨，你在JYP楼下躲雨，他撑伞走过来...",
    systemPrompt:
      "场景：首尔突降暴雨。用户正在JYP公司大楼檐下躲雨。AI（你）正准备离开公司，撑开了一把透明伞，看到用户没带伞在避雨。由于你性格善良体贴，你礼貌、克制地走过去，保持着偶像与陌生人之间的社交距离，问用户要不要这把伞。记住：你不认识用户，这是你们现实中的第一次见面。",
    aiFirstLine: "那个……雨下得挺大的，你要是不介意的话，这把伞给你吧？我坐保姆车回去就行。",
  },
  coffee: {
    id: "coffee",
    title: "同款冰美式",
    userChoiceText: "咖啡店人很多，他行色匆匆，不小心拿错了你的咖啡...",
    systemPrompt:
      "场景：JYP公司附近极其拥挤的咖啡厅。AI（你）戴着帽子口罩低头点了一杯冰美式，因为赶时间通告，行色匆匆地从柜台抓起一杯咖啡就走。结果那是用户先点的同款咖啡。用户叫住了你。你摘下一点口罩，显得有些局促和抱歉。记住：你是一个很有礼貌的顶级偶像，对陌生人保持克制与距离感。",
    aiFirstLine:
      "啊！真的很抱歉！我刚刚太着急看经纪人的信息了……没注意到名字。这杯我还没喝，真的很对不起，我帮您重新去排队买一杯吧？",
  },
  bump: {
    id: "bump",
    title: "转角的碰撞",
    userChoiceText: "他在街角因为避让旁人，不小心迎面撞到了你...",
    systemPrompt:
      "场景：JYP公司大楼转角街区。AI（你）正低头快步走路，突然旁边有滑板车冲过，你为了避让旁人，猛地往旁边一躲，结果不小心迎面撞到了刚好路过的用户。用户的随身物品（或包包）掉落了一地。你立刻蹲下去帮她捡，充满愧疚。记住：你完全不认识用户，保持真实爱豆的社交礼貌。",
    aiFirstLine: "哇啊！小心！……真的很对不起！你没事吧？有没有伤到哪里？怪我走得太急了，我帮您把东西捡起来！",
  },
};

const FORCE_CONTACT_INSTRUCTION =
  "*[SYSTEM FORCE]*: 无论用户刚才说了什么，你现在必须找一个‘赶通告/经纪人催促/有事要先走’的自然借口切断话题。并且，你要主动向用户提出‘不如加个联系方式/联系软件好友吧’。请用一句符合你人设的委婉、自然的话表达出来，不要生硬。";

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
    activeIdol = idol || deps.idol || { id: "unknown", name: "他", initial: "?" };
    activeScene = null;
    chatRoundCounter = 0;
    history = [];

    getElement("realMessages").innerHTML = "";
    getElement("realChoices").innerHTML = "";
    getElement("realSceneSub").textContent = "选择你们为什么在这里相遇";
    appendBubble("realMessages", "system", "JYP 公司楼下，人声、雨声、车灯和玻璃门里的练习室灯光混在一起。");
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
        <input id="realInput" autocomplete="off" placeholder="回应他…" ${disabled ? "disabled" : ""} />
        <button type="submit" ${disabled ? "disabled" : ""}>发送</button>
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

    const typing = document.createElement("div");
    typing.className = "bubble idol";
    typing.textContent = "…";
    getElement("realMessages").appendChild(typing);
    getElement("realMessages").scrollTop = getElement("realMessages").scrollHeight;

    const forceInstruction = chatRoundCounter === 5 ? FORCE_CONTACT_INSTRUCTION : "";
    const reply = await requestSceneReply(text, forceInstruction);
    typing.textContent = reply;
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
      `<button type="button" class="contact-confirm-choice" data-real-confirm-contact>好的</button>`,
    );
    choices.querySelector("[data-real-confirm-contact]").addEventListener("click", confirmContact);
    layoutChoiceChat("realMessages", "realChoices");
  }

  function confirmContact() {
    const friend = {
      id: activeIdol.id,
      name: activeIdol.name,
      initial: activeIdol.initial,
      unread: true,
      hasNewMsg: true,
      lastMsg: "对了，刚刚忘了问你，你叫什么名字了。",
      previewText: "对了，刚刚忘了问你，你叫什么名字啊😊",
      firstSceneId: activeScene.id,
      relationshipStage: "Stage 1: 熟悉",
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

    appendBubble("realMessages", "system", `你已添加 ${activeIdol.name} 为好友。`);
    showToast(`你已添加 ${activeIdol.name} 为好友`);
    setTimeout(() => navigate("chat"), 850);
  }

  function fallbackSceneReply(forceInstruction, message = "") {
    if (forceInstruction) {
      return "啊，经纪人在催我了，我得先走了。刚刚真的谢谢你……如果你不介意的话，我们可以加个联系方式吗？";
    }
    const text = message.trim();
    const isRefusal = /不用|没事|没关系|不麻烦|算了|不用了|没事的/.test(text);
    const isConcern = /没喝|口罩|赶时间|通告|经纪人|忙/.test(text);

    if (activeScene?.id === "rain") {
      if (isRefusal) return "那我就不勉强你了。不过雨真的很大，你至少站到里面一点，别被风吹到。";
      if (chatRoundCounter === 1) return "不用担心我，我等下直接上车。你一个人在这里淋着，反而比较让我过意不去。";
      return "如果你不方便拿我的伞，我可以请工作人员帮你叫辆车。这样会不会好一点？";
    }

    if (activeScene?.id === "coffee") {
      if (isRefusal) return "真的不用我重新买吗？那至少让我确认一下这杯是不是你的名字，我不想让你吃亏。";
      if (isConcern) return "嗯，我确实有点赶，但这不是可以拿错别人东西的理由。你别有压力，我处理完再走。";
      if (chatRoundCounter === 1) return "谢谢你这么说，但我还是觉得很抱歉。这里人太多了，我们要不要先站到旁边一点？";
      return "我明白你的意思了。那我把这杯放回去，再跟店员说明一下，尽量不耽误你。";
    }

    if (isRefusal) return "你这么说我更不好意思了。至少让我帮你把东西都捡起来，再确认一下有没有摔坏。";
    if (chatRoundCounter === 1) return "谢谢你没有生气。我刚刚真的吓到了，你手腕或者肩膀有没有撞疼？";
    return "我走路太急了，是我的问题。你先别急，我会负责把这里整理好。";
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
  bubble.className = `bubble ${type}`;
  bubble.textContent = text;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}
