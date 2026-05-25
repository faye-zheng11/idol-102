export class AppRouter {
  constructor({ store, screens, screenElementId, appScreens, bottomNavId = "bottomNav" }) {
    this.store = store;
    this.screens = screens;
    this.screenElementId = screenElementId;
    this.appScreens = appScreens;
    this.bottomNavId = bottomNavId;
    this.routes = new Map();
    this.currentRoute = null;
  }

  register(name, lifecycle = {}) {
    this.routes.set(name, lifecycle);
  }

  start(initialRoute) {
    this.navigate(initialRoute, { replace: true });
  }

  navigate(routeName, options = {}) {
    if (!this.routes.has(routeName)) {
      throw new Error(`Route "${routeName}" is not registered.`);
    }
    if (this.currentRoute === routeName && !options.force) return;

    const previousRoute = this.currentRoute;
    const previousLifecycle = previousRoute ? this.routes.get(previousRoute) : null;
    previousLifecycle?.onLeave?.(this.store.getState(), { from: previousRoute, to: routeName });

    this.currentRoute = routeName;
    this.mount(routeName);
    this.store.setState({ route: routeName });

    const nextLifecycle = this.routes.get(routeName);
    nextLifecycle?.render?.(this.store.getState(), { from: previousRoute, to: routeName });
    nextLifecycle?.onEnter?.(this.store.getState(), { from: previousRoute, to: routeName });
  }

  mount(activeRoute) {
    this.screens.forEach((name) => {
      document.getElementById(this.screenElementId[name])?.classList.toggle("active", name === activeRoute);
    });

    const bottomNav = document.getElementById(this.bottomNavId);
    bottomNav?.classList.toggle("hidden", !this.appScreens.has(activeRoute));
    bottomNav?.classList.remove("peek-hidden");

    document.querySelectorAll(`#${this.bottomNavId} button`).forEach((button) => {
      button.classList.toggle("active", button.dataset.nav === activeRoute);
    });
  }
}
