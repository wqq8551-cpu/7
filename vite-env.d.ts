// /// <reference types="vite/client" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Allow any element name (fixes 'div', 'header', 'button' etc. not existing errors)
      [elemName: string]: any;
    }
  }
}

export {}