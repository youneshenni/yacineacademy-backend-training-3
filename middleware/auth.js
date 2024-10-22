import Logger from '../util/log/winston.js'
import jsonwebtoken from 'jsonwebtoken';
import parseCsv from '../util/csvToJson.js';
import { readFileSync } from 'fs'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export default function authMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send('Unauthorized');
    }
    try {
        const payload = jsonwebtoken.verify(token, process.env.JWT_ACCESS_SECRET);
        return next();
    } catch (e) {
        if (e.name === "TokenExpiredError") {
            const refreshToken = req.cookies.refresh;
            if (!refreshToken) {
                res.clearCookie('refresh')
                res.clearCookie('token')
                return res.status(401).send("Unauthorized");
            }
            try {
                const tokenData = jsonwebtoken.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                const users = parseCsv(readFileSync(__dirname + "/../data/users.csv").toString());
                const user = users.find(user => user.ID === tokenData.id);
                const newAccessToken = jsonwebtoken.sign({
                    id: user.ID,
                    username: user.username,
                    email: user.email
                }, process.env.JWT_ACCESS_SECRET, {
                    expiresIn: process.env.JWT_ACCESS_EXPIRATION
                })
                const newRefreshToken = jsonwebtoken.sign({
                    id: user.ID,
                }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION });

                res.cookie('token', newAccessToken);
                res.cookie('refresh', newRefreshToken);
                next();
            } catch (e) {
                console.error(e);
                res.clearCookie('refresh')
                res.clearCookie('token')
                return res.status(401).send("Unauthorized")
            }
        }
        switch (e.name) {
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