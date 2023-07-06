import { ClientRouter, RouteConfig } from './ClientRouter';
import { ConnectedDotsAnimation } from './ConnectedDotsAnimation';
import { DotShapeAnimation } from './DotShapeAnimation';
import './style.css';
import shapeGermany from './img/shapes/germany.svg';
import shapeEssen from './img/shapes/essen.svg';
import shapeBochum from './img/shapes/bochum.svg';
import shapeDortmund from './img/shapes/dortmund.svg';
import shapeDuesseldorf from './img/shapes/duesseldorf.svg';

const appEl = document.querySelector<HTMLDivElement>('#app');
if (!appEl) throw new Error('Base app element (#app) not found.');

const anim = new DotShapeAnimation(appEl);
anim.start();
anim.canvas.style.display = 'none';

const connectedDots = new ConnectedDotsAnimation(appEl);
connectedDots.start();
connectedDots.canvas.style.display = 'none';

const navigateDotShape = (shape: string) => () => {
  anim.canvas.style.display = 'block';
  anim.setImage(shape);
  return () => (anim.canvas.style.display = 'none');
};

const routerConfig: RouteConfig = {
  '/': () => {
    window.location.pathname = '/dot-shape';
  },
  '/connected-dots': () => {
    connectedDots.canvas.style.display = 'block';
    return () => (connectedDots.canvas.style.display = 'none');
  },
  '/dot-shape': navigateDotShape(shapeGermany),
  '/dot-shape/essen': navigateDotShape(shapeEssen),
  '/dot-shape/bochum': navigateDotShape(shapeBochum),
  '/dot-shape/dortmund': navigateDotShape(shapeDortmund),
  '/dot-shape/duesseldorf': navigateDotShape(shapeDuesseldorf),
};

new ClientRouter(appEl, routerConfig);
