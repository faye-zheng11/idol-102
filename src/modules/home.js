const MEMORY_CACHE_KEY = "idol102.memoryCapsules.v1";

export function createHomeModule() {
  return {
    name: "home",
    route: "home",

    render() {},

    onEnter() {},

    onLeave() {},
  };
}

export function buildFriendBreakIce({ newCharacterName, viaCharacterName }) {
  return `I heard you got my contact from ${viaCharacterName}? Interesting.`;
}

export function createMemoryObject({
  characterId,
  placeId,
  location,
  title,
  imageUrl,
  content,
  chatHistorySnap = [],
  dayCount = 1,
  displayDate = "2026.05.18",
  code = "CODE-01",
}) {
  const safeLocation = location || "Unknown Place";
  const safeDate = displayDate || "2026.05.18";
  const initialImageUrl = imageUrl || "";
  return {
    memoryId: `memory-${characterId || "character"}-${placeId || "place"}-${Date.now()}`,
    characterId: characterId || "bang_chan",
    placeId: placeId || "unknown",
    displayDate: safeDate,
    location: safeLocation,
    dayCount: Number(dayCount) || 1,
    title: title || `A Memory at ${safeLocation}`,
    imageUrl: initialImageUrl,
    initialImageUrl,
    content: content || `On ${safeDate}, you saved this moment at ${safeLocation} into your shared memories.`,
    chatHistorySnap: cloneChatHistory(chatHistorySnap),
    code,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function normalizeMemoryObject(memory = {}) {
  const imageUrl = memory.imageUrl || extractUrlFromCssImage(memory.image) || "";
  const displayDate = memory.displayDate || memory.date || "2026.05.18";
  const location = memory.location || "Unknown Place";
  return {
    memoryId: memory.memoryId || memory.id || `memory-${Date.now()}`,
    characterId: memory.characterId || "bang_chan",
    placeId: memory.placeId || "unknown",
    displayDate,
    location,
    dayCount: Number(memory.dayCount) || dayCountFromLabel(memory.dayLabel) || 1,
    title: memory.title || `A Memory at ${location}`,
    imageUrl,
    initialImageUrl: memory.initialImageUrl || imageUrl,
    content:
      memory.content ||
      memory.summary ||
      `On ${displayDate}, you saved this moment at ${location} into your shared memories.`,
    chatHistorySnap: cloneChatHistory(memory.chatHistorySnap || []),
    code: memory.code || "CODE-01",
    fresh: Boolean(memory.fresh),
    createdAt: memory.createdAt || new Date().toISOString(),
    updatedAt: memory.updatedAt || memory.createdAt || new Date().toISOString(),
  };
}

export function persistMemoryCapsules(unlockedStoryLines = {}) {
  try {
    localStorage.setItem(MEMORY_CACHE_KEY, JSON.stringify(unlockedStoryLines));
  } catch {
    /* local cache is optional in embedded previews */
  }
}

export function readMemoryCapsules() {
  try {
    return JSON.parse(localStorage.getItem(MEMORY_CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

function cloneChatHistory(chatHistorySnap) {
  return (Array.isArray(chatHistorySnap) ? chatHistorySnap : []).map((message) => ({ ...message }));
}

function dayCountFromLabel(label = "") {
  const match = String(label).match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function extractUrlFromCssImage(value = "") {
  const match = String(value).match(/url\(["']?([^"')]+)["']?\)/);
  return match?.[1] || "";
}
