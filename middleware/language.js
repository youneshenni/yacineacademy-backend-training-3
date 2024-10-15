export function languageMiddleware(req, res, next) {
    if (req.cookies.language) {
        req.language = req.cookies.language;
    } else {
        const lang = req.headers['accept-language'];
        if (lang) {
            const [language] = lang.split(',');
            req.language = language;
        }
        else req.language = 'en';
    }
    res.cookie('language', req.language, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    });
    next();
}

export function languageEndpoint(req, res) {
    res.cookie('language', req.body.language, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    });
    res.status(201).send("Created");
}