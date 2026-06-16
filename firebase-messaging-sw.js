importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCEelyfihFeT6xXVYJNoY62sEhLkzvBiA8",
  authDomain: "floresceria-a1631.firebaseapp.com",
  projectId: "floresceria-a1631",
  storageBucket: "floresceria-a1631.firebasestorage.app",
  messagingSenderId: "572333214071",
  appId: "1:572333214071:web:749c83bc2bc6883fb63972"
});

const messaging = firebase.messaging();

// Notificação em background (app fechado)
messaging.onBackgroundMessage((payload) => {
  const { title, body, icon, data } = payload.notification || {};
  self.registration.showNotification(title || 'FlorescerIA', {
    body: body || 'Você tem uma nova mensagem.',
    icon: icon || '/icon-192.png',
    badge: '/icon-192.png',
    tag: data?.tag || 'floresceria',
    data: data || {},
    actions: [
      { action: 'abrir', title: 'Ver agora' },
      { action: 'fechar', title: 'Fechar' }
    ],
    vibrate: [200, 100, 200]
  });
});

// Click na notificação
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  if (e.action === 'fechar') return;
  const url = e.notification.data?.url || 'https://geracaofloresce.com.br';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const existing = list.find(c => c.url.includes('geracaofloresce.com.br'));
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});
