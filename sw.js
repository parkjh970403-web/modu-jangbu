// 모두의장부 오프라인 캐시. 새 버전을 올리면 VERSION만 바꾸면 된다.
const VERSION = 'mj-v2';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // 수수료 요율 파일은 항상 새로 받는다 (실패하면 캐시)
  if (url.pathname.endsWith('/rates.json')) {
    e.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }
  // 앱 화면: 네트워크 먼저(업데이트 반영), 끊기면 캐시
  if (req.mode === 'navigate' || (url.origin === location.origin && CORE.some(p => url.pathname.endsWith(p.replace('./', '/'))))) {
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res; }).catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
    return;
  }
  // 글꼴 등: 캐시 먼저
  if (url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com')) {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res; })));
  }
});
