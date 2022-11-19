import { MediaMimeType } from '@prisma/client';

import { DATABASE_MIME_TYPES_ENUM, MIME_TYPES } from '../constants/media';

export const getDatabaseMimeTypeEnumFromMimeType = (
    type: string
): MediaMimeType => {
    const mimeType = Object.keys(DATABASE_MIME_TYPES_ENUM).find(
        (key) => key === type
    );

    if (!mimeType) {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types says that if a type is unknown, application/octet-stream is the default value to return
        return DATABASE_MIME_TYPES_ENUM[
            'application/octet-stream'
        ] as MediaMimeType;
    }

    return DATABASE_MIME_TYPES_ENUM[mimeType] as MediaMimeType;
};

export const getMimeTypeFromDatabaseMimeTypeEnum = (type: string) => {
    const mimeType = Object.keys(MIME_TYPES).find((key) => key === type);

    if (!mimeType) {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types says that if a type is unknown, application/octet-stream is the default value to return
        return MIME_TYPES.APPLICATION_OCTET_STREAM;
    }

    return MIME_TYPES[mimeType];
};
