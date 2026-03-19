import { telefunc } from 'telefunc';
import jwt from 'jsonwebtoken';
import type { IncomingMessage, ServerResponse } from 'http';

const JWT_SECRET = process.env.JWT_SECRET ?? 'change_this_secret';

export async function telefuncHandler(req: IncomingMessage, res: ServerResponse) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    let user = null;
    if (token) {
        try {
            user = jwt.verify(token, JWT_SECRET) as {
                id: number;
                username: string;
                isAdmin: boolean;
            };
        } catch {}
    }

    const bodyChunks: Buffer[] = [];
    for await (const chunk of req) bodyChunks.push(chunk);
    const body = Buffer.concat(bodyChunks).toString();

    const httpResponse = await telefunc({
        url: `http://localhost${req.url}`,
        method: req.method!,
        body,
        context: { user },
    });

    res.statusCode = httpResponse.statusCode;
    res.setHeader('content-type', httpResponse.contentType);
    res.end(httpResponse.body);
}
