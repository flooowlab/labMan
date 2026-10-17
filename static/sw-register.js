// Register the service worker for PWA offline support.
// Served as a static file from /public — allowed by CSP script-src 'self'.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
