import './style.css';
import './components/header.css';
import './components/components.css';
import './pages/pages.css';

import { mountLayout } from './pages/page-layout.js';
import { render, init } from './pages/Privacy.js';

document.getElementById('page-mount').innerHTML = render();
mountLayout();
init();
