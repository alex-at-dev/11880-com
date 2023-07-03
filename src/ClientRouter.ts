import { BaseAnimation } from './BaseAnimation';
import { ConnectedDotsAnimation } from './ConnectedDotsAnimation';

export class ClientRouter {
  container: HTMLElement;
  currentAnimation: BaseAnimation | null = null;

  constructor(container: HTMLElement) {
    this.container = container;

    // add click listener to all anchor elements
    document
      .querySelectorAll('a')
      .forEach((el) => el.addEventListener('click', this.handleAnchorClick));

    // initial navigation
    window.addEventListener('load', () => this.navigate(location.pathname, true));
  }

  handleAnchorClick(ev: MouseEvent) {
    ev.preventDefault();
    const target = ev.target as HTMLAnchorElement;
    this.navigate(target.href);
  }

  navigate(url: string, force = false) {
    if (!force && location.pathname === url) return;
    history.pushState({}, '', url);

    if (this.currentAnimation) this.currentAnimation.destroy();
    switch (url) {
      case '/connected-dots':
        this._initAnim(ConnectedDotsAnimation);
        break;
      default:
        this.currentAnimation = null;
        this.container.innerText = `No animation for route "${url}" found.`;
        break;
    }
  }

  _initAnim(Cls: typeof BaseAnimation) {
    this.currentAnimation = new Cls(this.container);
    this.currentAnimation.start();
  }
}
