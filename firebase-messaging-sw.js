importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:"AIzaSyCEelyfihFeT6xXVYJNoY62sEhLkzvBiA8",
  authDomain:"floresceria-a1631.firebaseapp.com",
  projectId:"floresceria-a1631",
  storageBucket:"floresceria-a1631.firebasestorage.app",
  messagingSenderId:"572333214071",
  appId:"1:572333214071:web:749c83bc2bc6883fb63972"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || 'FlorescerIA', {
    body: body || '',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'floresceria',
    data: { url: payload.data?.url || 'https://geracaofloresce.com.br' },
    vibrate: [200, 100, 200]
  });
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || 'https://geracaofloresce.com.br';
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list => {
    const w = list.find(c => c.url.includes('geracaofloresce.com.br'));
    return w ? w.focus() : clients.openWindow(url);
  }));
});
