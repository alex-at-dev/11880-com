export class BaseAnimation {
  container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  start() {
    throw new Error('Not implemented');
  }

  destroy() {
    throw new Error('Not implemented');
  }
}
