import Logger from '../util/log/winston.js'
import jsonwebtoken from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send('Unauthorized');
    }
    try {
        const payload = jsonwebtoken.verify(token, 'secret');
        return next();
    } catch (e) {
        switch(e.name) {
            case "TokenExpiredError": 
                res.clearCookie('token')
                return res.status(401).send('Token expired');
            case "JsonWebTokenError":
                res.clearCookie('token')
                return res.status(401).send("Invalid token");
            case "NotBeforeError":
                res.clearCookie('token')
                return res.status(401).send('Token is not valid yet');
            default:
                Logger.error(`
                    Unknown JWT error:
                        Token: ${token}
                        Error name: ${e.name},
                        Error object: ${e}
                    `);
                return res.status(500).send('Internal Server Error');
        }

    }
}