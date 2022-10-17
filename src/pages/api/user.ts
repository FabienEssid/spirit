import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    if (request.method === 'GET') {
        response.status(200).json(request);
    }

    response.status(200).json(request);
}
