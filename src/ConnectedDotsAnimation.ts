import { BaseAnimation } from './BaseAnimation';
import { randrange } from './util/randrange';

const WIDTH = 400;
const HEIGHT = 400;
const RADIUS_MIN = 2.5;
const RADIUS_MAX = 6;
const V_MAX = 0.8;
const N_DOTS = 20;
const PI2 = 2 * Math.PI;
const C_TOP = [206, 254, 66];
const C_BOTTOM = [0, 194, 255];
const C_DELTA = C_BOTTOM.map((c, i) => c - C_TOP[i]);

export class ConnectedDotsAnimation extends BaseAnimation {
  canvas: HTMLCanvasElement;
  cx: CanvasRenderingContext2D;

  dots: Dot[] = [];

  constructor(container: HTMLElement) {
    super(container);
    const { canvas, cx } = this._initCanvas(container);
    this.canvas = canvas;
    this.cx = cx;
  }

  _initCanvas(container: HTMLElement) {
    const canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    container.appendChild(canvas);

    const cx = canvas.getContext('2d');
    if (!cx) throw new Error(`Can't get rendering context from canvas.`);
    return { canvas, cx };
  }

  start() {
    this.dots = [];
    for (let i = 0; i < N_DOTS; i++) {
      this.dots.push(
        new Dot(
          randrange(WIDTH),
          randrange(HEIGHT),
          randrange(-V_MAX, V_MAX),
          randrange(-V_MAX, V_MAX),
          randrange(RADIUS_MIN, RADIUS_MAX)
        )
      );
    }

    this.mainloop();
  }

  mainloop() {
    // using for-loop instead of foreach here as it's faster and this will be executed 30-60 times per second

    // update
    for (let i = 0; i < this.dots.length; i++) {
      this.dots[i].update();
    }

    // render
    // clear canvas
    this.cx.fillStyle = 'rgba(255,255,255,.8)';
    this.cx.fillRect(0, 0, WIDTH, HEIGHT);
    // setup painting
    for (let i = 0; i < this.dots.length; i++) {
      this.dots[i].render(this.cx);
    }

    // next frame
    window.requestAnimationFrame(this.mainloop.bind(this));
  }

  destroy() {
    console.log('destroy');
  }
}

class Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;

  constructor(x: number, y: number, vx: number, vy: number, radius: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.r = radius;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // bounce if out of bounds
    if (this.x < 0 || this.x > WIDTH) this.vx *= -1;
    if (this.y < 0 || this.y > HEIGHT) this.vy *= -1;
  }

  render(cx: CanvasRenderingContext2D) {
    const yRel = this.y / HEIGHT;
    const r = C_TOP[0] + C_DELTA[0] * yRel;
    const g = C_TOP[1] + C_DELTA[1] * yRel;
    const b = C_TOP[2] + C_DELTA[2] * yRel;
    cx.fillStyle = `rgb(${r},${g},${b})`;
    cx.beginPath();
    cx.arc(this.x, this.y, this.r, 0, PI2, false);
    cx.fill();
  }
}
