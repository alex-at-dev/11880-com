import { BaseAnimation } from './BaseAnimation';
import { randrange } from './util/randrange';

const WIDTH = 400;
const HEIGHT = 400;
const RADIUS_MIN = 2.5;
const RADIUS_MAX = 5;
const V_MAX = 0.4;
const N_DOTS = 100;
const PI2 = 2 * Math.PI;
const COL_TOP = [206, 254, 66];
const COL_BOTTOM = [0, 194, 255];
const _COL_DELTA = COL_BOTTOM.map((c, i) => c - COL_TOP[i]);
const EDGE_MAX_LEN = 64;
const _EDGE_MAX_LEN_SQUARE = EDGE_MAX_LEN * EDGE_MAX_LEN; // used for distance calculation; With this we can save one Math.sqrt call per edge per frame (big win 🥳)
const EDGE_MAX_W = 1.2; // maximum edge width. Will get thinner the farther the dots are apart (= the longer the edge is)

export class ConnectedDotsAnimation extends BaseAnimation {
  canvas: HTMLCanvasElement;
  cx: CanvasRenderingContext2D;
  canvasGradient: CanvasGradient;

  dots: Dot[] = [];
  edges: Edge[] = [];

  constructor(container: HTMLElement) {
    super(container);
    const { canvas, cx, canvasGradient } = this._initCanvas(container);
    this.canvas = canvas;
    this.cx = cx;
    this.canvasGradient = canvasGradient;
  }

  _initCanvas(container: HTMLElement) {
    const canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    container.appendChild(canvas);

    const cx = canvas.getContext('2d');
    if (!cx) throw new Error(`Can't get rendering context from canvas.`);

    const canvasGradient = cx.createLinearGradient(0, 0, WIDTH, HEIGHT);
    canvasGradient.addColorStop(0, `rgb(${COL_TOP[0]},${COL_TOP[1]},${COL_TOP[2]})`);
    canvasGradient.addColorStop(1, `rgb(${COL_BOTTOM[0]},${COL_BOTTOM[1]},${COL_BOTTOM[2]})`);

    return { canvas, cx, canvasGradient };
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
    // using for-loop instead of foreach here as it's faster and this will be executed 30-60 times per second. (TODO maybe decreasing loop is faster (i = arr.length; i >= 0; i--))

    // -- update --
    for (let i = 0; i < this.dots.length; i++) {
      this.dots[i].update();
    }
    this.updateEdges();

    // -- render --
    // clear canvas
    this.cx.fillStyle = 'rgba(255,255,255,.9)';
    this.cx.fillRect(0, 0, WIDTH, HEIGHT);
    // paint entities
    for (let i = 0; i < this.dots.length; i++) {
      this.dots[i].render(this.cx);
    }
    this.renderEdges();

    // -- next frame --
    window.requestAnimationFrame(this.mainloop.bind(this));
  }

  updateEdges() {
    this.edges = [];
    for (let i = 0; i < this.dots.length; i++) {
      const d0 = this.dots[i];
      for (let j = 1; j < this.dots.length; j++) {
        const d1 = this.dots[j];
        const dx = d1.x - d0.x;
        const dy = d1.y - d0.y;
        const distance = dx * dx + dy * dy;
        if (distance > _EDGE_MAX_LEN_SQUARE) continue;
        const dTop = dx < 0 ? d0 : d1;
        const dBottom = dx < 0 ? d1 : d0;
        const color = `linear-gradient(to bottom, rgb(${dTop.color[0]},${dTop.color[1]},${dTop.color[2]}), rgba(${dBottom.color[0]},${dBottom.color[1]},${dBottom.color[2]}))`;
        const width = (1 - distance / _EDGE_MAX_LEN_SQUARE) * EDGE_MAX_W;
        this.edges.push({ x0: d0.x, y0: d0.y, x1: d1.x, y1: d1.y, color, width });
      }
    }
  }

  renderEdges() {
    this.cx.save();
    this.cx.strokeStyle = this.canvasGradient;

    for (let i = 0; i < this.edges.length; i++) {
      const edge = this.edges[i];
      this.cx.beginPath();
      this.cx.moveTo(edge.x0, edge.y0);
      this.cx.lineTo(edge.x1, edge.y1);
      this.cx.lineWidth = edge.width;
      this.cx.stroke();
    }
    this.cx.restore();
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
  color: [number, number, number];

  constructor(x: number, y: number, vx: number, vy: number, radius: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.r = radius;
    this.color = [0, 0, 0];
  }

  update() {
    // update position
    this.x += this.vx;
    this.y += this.vy;

    // bounce if out of bounds
    if (this.x < 0 || this.x > WIDTH) this.vx *= -1;
    if (this.y < 0 || this.y > HEIGHT) this.vy *= -1;

    // update color
    const yRel = this.y / HEIGHT;
    this.color[0] = COL_TOP[0] + _COL_DELTA[0] * yRel;
    this.color[1] = COL_TOP[1] + _COL_DELTA[1] * yRel;
    this.color[2] = COL_TOP[2] + _COL_DELTA[2] * yRel;
  }

  render(cx: CanvasRenderingContext2D) {
    cx.fillStyle = `rgb(${this.color[0]},${this.color[1]},${this.color[2]})`;
    cx.beginPath();
    cx.arc(this.x, this.y, this.r, 0, PI2, false);
    cx.fill();
  }
}

/**
 * Describes an edge (line) between two points.
 * This is an interface as it's more performant to handle edges data-first in the main-class
 * instead of giving them all their own logic which will lead to accessing dots multiple times and not in order.
 */
interface Edge {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  color: string;
  width: number;
}
