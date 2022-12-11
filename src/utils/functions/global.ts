export const isMissingAtLeastOneMandatoryField = (
    obj: { [key: string]: unknown },
    mandatoryFields: string[]
): boolean => {
    if (!obj && mandatoryFields.length) return true;

    const keys = Object.keys(obj);
    return keys.some(
        (key) =>
            mandatoryFields.includes(key) &&
            (obj[key] === null || obj[key] === undefined)
    );
};

export const isAppRunningOnMobile = (): boolean => {
    const pwaRenderModes = ['fullscreen', 'standalone', 'minimal-ui'];
    return pwaRenderModes.some(
        (pwaRenderMode) =>
            window.matchMedia('(display-mode: ' + pwaRenderMode + ')').matches
    );
};
