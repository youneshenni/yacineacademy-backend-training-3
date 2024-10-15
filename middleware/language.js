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
    res.cookie('language', req.language);
    next();
}

export function languageEndpoint(req, res) {
    res.cookie('language', req.body.language);
    res.status(201).send("Created");
}