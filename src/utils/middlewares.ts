import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/login' || req.path === '/register') {
        return next();
    }

    const token: string | undefined = req.headers['authorization'];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err: jwt.VerifyErrors | null, user: string | jwt.JwtPayload | undefined) => {
        if (err || !user) {
            return res.sendStatus(403);
        }
        req.body.user = user;
        next();
    });
};

export default authenticateToken;

