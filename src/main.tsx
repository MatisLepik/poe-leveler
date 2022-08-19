import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.scss';

// Needed by @use-it/event-listener
if ('global' in window === false) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).global = window;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
