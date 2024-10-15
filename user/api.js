import express, { Router } from 'express';
import {
    readFileSync, existsSync, writeFileSync, appendFileSync,
    mkdirSync
} from 'fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Logger from '../util/log/winston.js';
import parseCsv from '../util/csvToJson.js';
import AutoIncrementer from '../util/autoincrement/autoincrement.js';
import jsonwebtoken from 'jsonwebtoken';

const __dirname = dirname(fileURLToPath(import.meta.url));

const usersRouter = Router();

usersRouter.post('', (req, res) => {
    if (!req.body.nom || !req.body.prenom || !req.body.email) {
        Logger.error(`Missing fields`);
        res.status(400).send('Missing fields');
        return;
    }
    if (!existsSync(__dirname + "/../data"))
        mkdirSync(__dirname + "/../data");
    if (!existsSync(__dirname + "/../data/data.csv"))
        writeFileSync(__dirname + "/../data/data.csv", "ID,Nom,Prénom,Email");
    const autoIncrementer = new AutoIncrementer("users");
    const newRowId = autoIncrementer.increment();
    const appendedLine = `\n${newRowId},${req.body.nom},${req.body.prenom},${req.body.email}`;
    appendFileSync(
        __dirname + "/../data/data.csv",
        appendedLine
    );
    res.status(201).send("Created");
})


usersRouter.get("", (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).send('Unauthorized');
        return;
    }
    try {
        const payload = jsonwebtoken.verify(token, 'secret');
        if (payload.username !== 'younes@gmail.com') {
            res.status(401).send('Unauthorized');
            return;
        }
    } catch (e) {
        res.status(401).send('Unauthorized');
        return;
    }


    if (!existsSync(__dirname + "/../data/data.csv"))
        writeFileSync(__dirname + "/../data/data.csv", "ID,Nom,Prénom,Email");
    const csvBuffer = readFileSync(__dirname + "/../data/data.csv");
    res.status(200).json(parseCsv(csvBuffer.toString()));
});
usersRouter.delete('/:id', (req, res) => {
    const id = req.params.id;
    const users = parseCsv(readFileSync(__dirname + "/../data/data.csv").toString());
    const filteredUsers = users.filter(user => user.ID !== id);
    writeFileSync(__dirname + "/../data/data.csv", "ID,Nom,Prénom,Email");
    filteredUsers.forEach(user => {
        appendFileSync(__dirname + "/../data/data.csv", `\n${user.ID},${user.Nom},${user.Prénom},${user.Email}`);
    });
    res.status(204).send('Deleted');
})

usersRouter.get('/:id', (req, res) => {
    const id = req.params.id;
    const users = parseCsv(readFileSync(__dirname + "/../data/data.csv").toString());
    const user = users.find(user => user.ID === id);
    res.status(200).json(user);
});

usersRouter.put('/:id', (req, res) => {
    const id = req.params.id;
    const users = parseCsv(readFileSync(__dirname + "/../data/data.csv").toString());
    const userIndex = users.findIndex(user => user.ID === id);
    if (userIndex === -1) {
        res.status(404).send('User not found');
        return;
    }
    users[userIndex] = {
        ID: id,
        Nom: req.body.nom,
        Prénom: req.body.prenom,
        Email: req.body.email
    };
    writeFileSync(__dirname + "/../data/data.csv", "ID,Nom,Prénom,Email");
    users.forEach(user => {
        appendFileSync(__dirname + "/../data/data.csv", `\n${user.ID},${user.Nom},${user.Prénom},${user.Email}`);
    });
    res.status(200).send("OK");
});
export default usersRouter;
