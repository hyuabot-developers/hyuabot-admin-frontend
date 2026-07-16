self.addEventListener('push', (event) => {
    let payload = {}
    try {
        payload = event.data?.json() ?? {}
    } catch {
        payload = { body: event.data?.text() }
    }

    event.waitUntil(self.registration.showNotification(payload.title ?? '휴아봇 운영 알림', {
        body: payload.body ?? '새로운 운영 상태를 확인해주세요.',
        icon: '/images/hanyangCharacter.png',
        badge: '/images/hanyangCharacter.png',
        tag: payload.tag ?? 'hyuabot-operations',
        renotify: true,
        data: { url: payload.url ?? '/dashboard' },
    }))
})

self.addEventListener('notificationclick', (event) => {
    event.notification.close()
    const targetUrl = new URL(event.notification.data?.url ?? '/dashboard', self.location.origin).href
    event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
        const client = clients.find((candidate) => candidate.url.startsWith(self.location.origin))
        if (client) {
            client.navigate(targetUrl)
            return client.focus()
        }
        return self.clients.openWindow(targetUrl)
    }))
})
