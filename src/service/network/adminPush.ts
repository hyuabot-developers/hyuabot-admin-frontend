import client from './client.ts'

export type PushSubscriptionPayload = {
    endpoint: string,
    keys: {
        p256dh: string,
        auth: string,
    },
}

export const getPushPublicKey = async () =>
    client.get<{ publicKey: string }>('/api/v1/user/push/public-key')

export const getPushSubscriptionStatus = async (endpoint: string) =>
    client.get<{ enabled: boolean }>('/api/v1/user/push/status', { params: { endpoint } })

export const registerPushSubscription = async (subscription: PushSubscriptionPayload) =>
    client.post('/api/v1/user/push/subscription', subscription)

export const removePushSubscription = async (endpoint: string) =>
    client.delete('/api/v1/user/push/subscription', { data: { endpoint } })
