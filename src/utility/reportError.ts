export const reportError = (error: unknown) => {
    if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error(error)
    }
}
