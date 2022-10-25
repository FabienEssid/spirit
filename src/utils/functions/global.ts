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
