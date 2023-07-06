export type RouteConfig = Record<
  string,
  (navigate: typeof ClientRouter.prototype.navigate) => (() => void) | void
>;

export class ClientRouter {
  container: HTMLElement;
  routeConfig: RouteConfig;
  destroyCurrentRoute: (() => void) | null = null;

  constructor(container: HTMLElement, routeConfig: RouteConfig) {
    this.container = container;
    this.routeConfig = routeConfig;

    // add click listener to all anchor elements
    document
      .querySelectorAll('a')
      .forEach((el) => el.addEventListener('click', this.handleAnchorClick.bind(this)));

    // initial navigation
    window.addEventListener('load', () => this.navigate(location.pathname, true));
  }

  handleAnchorClick(ev: MouseEvent) {
    ev.preventDefault();
    const target = ev.target as HTMLAnchorElement;

    document.querySelectorAll('a').forEach((el) => el.classList.remove('active'));
    target.classList.add('active');

    this.navigate(target.href);
  }

  navigate(url: string, force = false) {
    const urlData = new URL(url, location.href);
    if (!force && location.href === urlData.href) return;
    history.pushState({}, '', url);

    if (this.destroyCurrentRoute) this.destroyCurrentRoute();
    const currConfig = this.routeConfig[urlData.pathname];
    if (!currConfig) this.container.innerText = `No route found for "${urlData.href}".`;
    const destroy = currConfig(this.navigate.bind(this));
    this.destroyCurrentRoute = destroy ?? null;
  }
}
