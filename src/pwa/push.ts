import {
    getPushPublicKey,
    getPushSubscriptionStatus,
    registerPushSubscription,
    removePushSubscription,
} from '../service/network/adminPush.ts'

export type PushAvailability = 'available' | 'denied' | 'install-required' | 'unsupported'

type NavigatorWithStandalone = Navigator & { standalone?: boolean }

export class PushSetupError extends Error {
    constructor(public readonly reason: 'denied' | 'invalid-subscription') {
        super(reason)
    }
}

export const registerOperationalServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register('/sw.js')
    }
}

export const getPushAvailability = (): PushAvailability => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
        return 'unsupported'
    }

    const isAppleMobile = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as NavigatorWithStandalone).standalone === true
    if (isAppleMobile && !isStandalone) return 'install-required'
    if (Notification.permission === 'denied') return 'denied'
    return 'available'
}

export const getCurrentSubscription = async () => {
    if (getPushAvailability() !== 'available') return null
    const registration = await navigator.serviceWorker.ready
    return registration.pushManager.getSubscription()
}

export const isOperationalPushEnabled = async () => {
    const subscription = await getCurrentSubscription()
    if (subscription === null) return false
    const response = await getPushSubscriptionStatus(subscription.endpoint)
    return response.data.enabled
}

export const enableOperationalPush = async () => {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') throw new PushSetupError('denied')

    const registration = await navigator.serviceWorker.ready
    const existing = await registration.pushManager.getSubscription()
    const subscription = existing ?? (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: decodeBase64Url((await getPushPublicKey()).data.publicKey),
    }))
    const serialized = subscription.toJSON()
    if (!serialized.endpoint || !serialized.keys?.p256dh || !serialized.keys.auth) {
        throw new PushSetupError('invalid-subscription')
    }

    await registerPushSubscription({
        endpoint: serialized.endpoint,
        keys: {
            p256dh: serialized.keys.p256dh,
            auth: serialized.keys.auth,
        },
    })
}

export const disableOperationalPush = async () => {
    const subscription = await getCurrentSubscription()
    if (subscription === null) return
    await removePushSubscription(subscription.endpoint)
    await subscription.unsubscribe()
}

const decodeBase64Url = (value: string) => {
    const padding = '='.repeat((4 - value.length % 4) % 4)
    const base64 = (value + padding).replace(/-/g, '+').replace(/_/g, '/')
    const decoded = window.atob(base64)
    return Uint8Array.from(decoded, (character) => character.charCodeAt(0))
}
