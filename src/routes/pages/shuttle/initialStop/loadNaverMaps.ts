const SCRIPT_ID = 'naver-maps-javascript-sdk'

let loadPromise: Promise<void> | null = null

const isNaverMapsReady = () =>
    typeof naver !== 'undefined' && typeof naver.maps?.Map === 'function'

export const loadNaverMaps = (clientId: string) => {
    if (isNaverMapsReady()) return Promise.resolve()
    if (clientId.length === 0) {
        return Promise.reject(new Error('NAVER Maps client ID is not configured.'))
    }
    if (loadPromise !== null) return loadPromise

    loadPromise = new Promise<void>((resolve, reject) => {
        const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
        const script = existingScript ?? document.createElement('script')

        const handleLoad = () => {
            if (isNaverMapsReady()) {
                resolve()
                return
            }
            script.remove()
            loadPromise = null
            reject(new Error('NAVER Maps SDK loaded without the maps namespace.'))
        }
        const handleError = () => {
            script.remove()
            loadPromise = null
            reject(new Error('Failed to load the NAVER Maps SDK.'))
        }

        script.addEventListener('load', handleLoad, { once: true })
        script.addEventListener('error', handleError, { once: true })

        if (existingScript === null) {
            script.id = SCRIPT_ID
            script.async = true
            script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(clientId)}`
            document.head.append(script)
        }
    })

    return loadPromise
}
