import { ClientRouter } from './ClientRouter';
import './style.css';

const appEl = document.querySelector<HTMLDivElement>('#app');
if (!appEl) throw new Error('Base app element (#app) not found.');

new ClientRouter(appEl);
