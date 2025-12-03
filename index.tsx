import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Application failed to mount:", error);
  // 可选：在屏幕上显示 JS 错误
  rootElement.innerHTML = `
    <div style="height:100%; display:flex; align-items:center; justify-content:center; color:red; flex-direction:column; background:#000;">
      <h2 style="font-family:serif; color:#FFD700">System Error</h2>
      <pre style="color:#aaa; font-size:12px; margin-top:20px;">${error instanceof Error ? error.message : String(error)}</pre>
    </div>
  `;
}
