import { Router } from 'express';
import ensureFileExists from '../util/files/ensureFile.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import AutoIncrementer from '../util/autoincrement/autoincrement.js';
import { appendFileSync, readFileSync } from 'fs';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import parseCsv from '../util/csvToJson.js';
import jsonwebtoken from 'jsonwebtoken';

const authRouter = Router();

const __dirname = dirname(fileURLToPath(import.meta.url));

authRouter.post('/register', (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.confirm_password || !req.body.username) {
        res.status(400).send('Missing fields');
        return;
    }
    if (req.body.password !== req.body.confirm_password) {
        res.status(400).send('Passwords do not match');
        return;
    }

    if (ensureFileExists(`${__dirname}/../data/users.csv`, 'ID,username,email,password')) {
        const autoIncrementer = new AutoIncrementer("users");
        const newRowId = autoIncrementer.increment();
        const salt = genSaltSync(10);
        const hash = hashSync(req.body.password, salt);
        const appendedLine = `\n${newRowId},${req.body.username},${req.body.email},${hash}`;
        appendFileSync(
            __dirname + "/../data/users.csv",
            appendedLine
        );
        res.status(201).send("Created");
    } else {
        res.status(500).send('Error creating user');
    }

});

authRouter.post('/login', (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).send('Missing fields');
        return;
    }
    const users = parseCsv(readFileSync(__dirname + "/../data/users.csv").toString());
    const user = users.find(user => user.username === req.body.username);
    if (!user) {
        res.status(404).send('User not found');
        return;
    }
    if (compareSync(req.body.password, user.password)) {
        const token = jsonwebtoken.sign({
            id: user.id,
            username: user.username,
            email: user.email
        }, 'secret', {
            expiresIn: '1h'
        });

        res.cookie('token', token, {
            httpOnly: true
        });

        res.status(200).send('Logged in');
    } else {
        res.status(401).send('Unauthorized');
    }

});


export default authRouter;