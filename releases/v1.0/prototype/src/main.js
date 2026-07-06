import { initialAppState } from "./core/store.js";
import { createObModule } from "./modules/ob.js";
import { createRealMeetModule } from "./modules/realMeet.js";
import { createHomeModule } from "./modules/home.js";
import { createChatModule } from "./modules/chat.js";
import { createSceneModule } from "./modules/scene.js";
import { createMeModule } from "./modules/me.js";

export const appModules = {
  ob: createObModule(),
  realMeet: createRealMeetModule(),
  home: createHomeModule(),
  chat: createChatModule(),
  scene: createSceneModule(),
  me: createMeModule(),
};

export const appManifest = {
  initialState: initialAppState,
  modules: appModules,
};

window.__IDOL_102_APP__ = appManifest;

// Temporary bridge: keep the existing prototype behavior running while
// business logic is moved into the modules above.
await import("../app.js");
