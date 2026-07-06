export function createStore(initialState) {
  const state = structuredClone(initialState);
  const listeners = new Set();

  function notify() {
    listeners.forEach((listener) => listener(state));
  }

  return {
    getState() {
      return state;
    },

    setState(patchOrUpdater) {
      const patch = typeof patchOrUpdater === "function" ? patchOrUpdater(state) : patchOrUpdater;
      if (!patch || typeof patch !== "object") return state;
      Object.assign(state, patch);
      notify();
      return state;
    },

    update(updater) {
      const nextState = updater(structuredClone(state));
      if (!nextState || nextState === state) return state;
      Object.keys(state).forEach((key) => delete state[key]);
      Object.assign(state, nextState);
      notify();
      return state;
    },

    subscribe(listener) {
      listeners.add(listener);
      listener(state);
      return () => listeners.delete(listener);
    },
  };
}

export const initialAppState = {
  activeObAgent: null,
  addedCharacters: [],
  unaddedCharacters: [],
  pendingFriendRequests: [],
  hasNotification: false,
  unlockedContacts: {},
  officialFriends: [],
  chatStreams: {},
  messagesByCharacter: {},
  relationshipStages: {},
  unlockedStoryLines: {},
  unlockedScenes: [],
  currentUserProgress: {
    phase: "ob",
    route: "splash",
  },
};
