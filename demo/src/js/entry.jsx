import { createRoot } from 'react-dom/client';
import Index from './index';

import './../style/scss/global.scss';

const app = document.getElementById('mac-react-container');

//app entrypoint
if (app) {
  const root = createRoot(app);
  root.render(
    <div className="app-entry">
      <Index />
    </div>
  );
}
